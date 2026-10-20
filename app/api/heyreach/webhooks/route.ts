import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/backend/firebase/admin";
import { classifyReplyWithGemini } from "@/backend/services/gemini/replyClassifier";
import { heyreachClient } from "@/backend/services/heyreach/client";
import { logActivity } from "@/backend/services/auditLogger";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON payload" }, { status: 400 });
    }

    const eventType = payload.eventType || payload.event || payload.type || "UNKNOWN";
    const eventId = payload.id || payload.eventId || `evt-${Date.now()}`;

    // Idempotency: Check if we've already processed this event
    const idempotencyRef = adminDb.collection("webhookEvents").doc(String(eventId));
    const existingEvt = await idempotencyRef.get();
    if (existingEvt.exists) {
      return NextResponse.json({ success: true, message: "Event already processed (idempotent)." });
    }

    // Save event marker
    await idempotencyRef.set({
      receivedAt: new Date().toISOString(),
      eventType,
      payloadSummary: {
        campaignId: payload.campaignId || payload.campaign_id,
        leadName: payload.lead?.firstName ? `${payload.lead.firstName} ${payload.lead.lastName}` : payload.leadName,
      },
    });

    // Handle Reply Events
    if (
      eventType === "EVERY_MESSAGE_REPLY_RECEIVED" ||
      eventType === "MESSAGE_REPLY_RECEIVED" ||
      eventType.includes("REPLY")
    ) {
      const leadData = payload.lead || payload.prospect || {};
      const leadName = leadData.firstName
        ? `${leadData.firstName} ${leadData.lastName || ""}`.trim()
        : payload.leadName || "LinkedIn Lead";
      const leadCompany = leadData.companyName || payload.companyName || "Company";
      const leadTitle = leadData.position || payload.position || "Professional";
      const incomingText = payload.messageText || payload.text || payload.content || "";
      const profileUrl = leadData.profileUrl || payload.profileUrl || "";

      // Fetch current settings to check Mode B (Autonomous Inbound Auto-Chat)
      let autoReplyEnabled = true; // Default Mode B: Active
      try {
        const settingsDoc = await adminDb.collection("integrationSettings").doc("icp").get();
        if (settingsDoc.exists && settingsDoc.data()?.autoReplyEnabled === false) {
          autoReplyEnabled = false;
        }
      } catch (err: any) {
        console.warn("Could not fetch icp settings for webhook, defaulting autoReplyEnabled=true:", err?.message);
      }

      // Classify with Gemini AI
      const aiClassification = await classifyReplyWithGemini({
        leadName,
        leadTitle,
        leadCompany,
        incomingText: incomingText || "Thank you for reaching out.",
        threadHistory: [],
      });

      const conversationId = payload.conversationId || payload.conversation_id || payload.chatId || payload.threadId;
      const senderAccountId = payload.senderId || payload.accountId || payload.linkedInAccountId;

      let isAutoReplied = false;
      let autoReplyDispatchError: string | null = null;

      // Mode B: If positive intent (meeting, question, interested) & autoReply is active
      const isPositiveIntent = ["meeting_request", "question", "interested"].includes(aiClassification.classification);
      if (autoReplyEnabled && isPositiveIntent && conversationId) {
        try {
          const dispatchRes = await heyreachClient.sendMessage(
            String(conversationId),
            aiClassification.suggestedResponse,
            senderAccountId ? Number(senderAccountId) : undefined
          );
          if (dispatchRes.success) {
            isAutoReplied = true;
          } else {
            autoReplyDispatchError = dispatchRes.message;
          }
        } catch (err: any) {
          autoReplyDispatchError = err?.message;
          console.error("Auto-reply dispatch exception:", err?.message);
        }
      }

      // Save inbound reply into Firestore 'replies' collection
      const threadHistory = [
        {
          id: `msg-${Date.now()}`,
          sender: "prospect",
          senderName: leadName,
          text: incomingText,
          timestamp: new Date().toISOString(),
        },
      ];

      if (isAutoReplied) {
        threadHistory.push({
          id: `msg-agent-${Date.now()}`,
          sender: "agent",
          senderName: "Autonomous Gemini AI (Mode B)",
          text: aiClassification.suggestedResponse,
          timestamp: new Date().toISOString(),
        });
      }

      const replyRef = await adminDb.collection("replies").add({
        leadName,
        leadTitle,
        leadCompany,
        profileUrl,
        lastMessageSnippet: incomingText,
        classification: aiClassification.classification,
        classificationConfidence: aiClassification.confidence,
        classificationReason: aiClassification.reason,
        aiSuggestedResponse: aiClassification.suggestedResponse,
        responseStatus: isAutoReplied ? "auto_replied" : "pending_review",
        autoReplied: isAutoReplied,
        autoRepliedAt: isAutoReplied ? new Date().toISOString() : null,
        unread: !isAutoReplied,
        receivedAt: new Date().toISOString(),
        threadHistory,
      });

      // Follow-up Safety Guard: Cancel any pending follow-ups for this lead
      const followUpsSnap = await adminDb
        .collection("followUpTasks")
        .where("leadName", "==", leadName)
        .where("status", "==", "scheduled")
        .get();

      if (!followUpsSnap.empty) {
        const batch = adminDb.batch();
        followUpsSnap.docs.forEach((doc) => {
          batch.update(doc.ref, {
            status: "cancelled_replied",
            cancellationReason: `Cancelled automatically: Prospect replied with '${aiClassification.classification}' intent.`,
            cancelledAt: new Date().toISOString(),
          });
        });
        await batch.commit();
      }

      // Opt-out Safety: If not interested or asking to unsubscribe, auto-suppress contact
      if (aiClassification.actionRequired === "suppress_contact") {
        const suppressionValue = (profileUrl || leadCompany).toLowerCase().trim();
        if (suppressionValue) {
          await adminDb.collection("suppressionList").add({
            type: profileUrl ? "linkedin_url" : "company",
            value: suppressionValue,
            reason: `Auto-Suppression: Prospect '${leadName}' declined via inbound reply.`,
            addedBy: "Gemini AI Safety Guard",
            addedAt: new Date().toISOString(),
          });
        }
      }

      // Record Activity Log
      await logActivity({
        category: "reply_ingested",
        severity: aiClassification.classification === "not_interested" ? "warning" : "success",
        title: isAutoReplied
          ? `Mode B: Autonomous AI Replied to ${leadName}`
          : "Inbound HeyReach Reply Processed",
        description: isAutoReplied
          ? `Gemini understood '${leadName}' intent as '${aiClassification.classification}' and automatically sent contextual response via LinkedIn.`
          : `Reply from ${leadName} (${leadCompany}) classified as '${aiClassification.classification}' (${aiClassification.confidence}% confidence).`,
        entityId: replyRef.id,
      });

      return NextResponse.json({
        success: true,
        replyId: replyRef.id,
        classification: aiClassification.classification,
        autoReplied: isAutoReplied,
        autoReplyError: autoReplyDispatchError,
      });
    }

    // Handle Connection Request Accepted
    if (eventType === "CONNECTION_REQUEST_ACCEPTED") {
      const leadName = payload.lead?.firstName
        ? `${payload.lead.firstName} ${payload.lead.lastName || ""}`.trim()
        : "Lead";

      await logActivity({
        category: "heyreach_sync",
        severity: "success",
        title: "Connection Request Accepted",
        description: `${leadName} accepted the LinkedIn connection invite.`,
        entityId: payload.campaignId?.toString(),
      });

      return NextResponse.json({ success: true, event: "CONNECTION_ACCEPTED" });
    }

    // Default response for other HeyReach events
    return NextResponse.json({
      success: true,
      received: eventType,
      message: "Event logged successfully.",
    });
  } catch (err: unknown) {
    console.error("POST /api/heyreach/webhooks error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: "Internal webhook processing error" },
      { status: 500 }
    );
  }
}
