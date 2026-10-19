import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/backend/firebase/admin";
import { classifyReplyWithGemini } from "@/backend/services/gemini/replyClassifier";
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

      // Classify with Gemini AI
      const aiClassification = await classifyReplyWithGemini({
        leadName,
        leadTitle,
        leadCompany,
        incomingText: incomingText || "Thank you for reaching out.",
        threadHistory: [],
      });

      // Save inbound reply into Firestore 'replies' collection
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
        responseStatus: "pending_review",
        unread: true,
        receivedAt: new Date().toISOString(),
        threadHistory: [
          {
            id: `msg-${Date.now()}`,
            sender: "prospect",
            senderName: leadName,
            text: incomingText,
            timestamp: new Date().toISOString(),
          },
        ],
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
        title: "Inbound HeyReach Reply Processed",
        description: `Reply from ${leadName} (${leadCompany}) classified as '${aiClassification.classification}' (${aiClassification.confidence}% confidence).`,
        entityId: replyRef.id,
      });

      return NextResponse.json({
        success: true,
        replyId: replyRef.id,
        classification: aiClassification.classification,
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
