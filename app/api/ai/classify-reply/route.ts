import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/backend/firebase/admin";
import { verifyAuthToken } from "@/backend/auth/verifySession";
import { classifyReplyWithGemini } from "@/backend/services/gemini/replyClassifier";
import { logActivity } from "@/backend/services/auditLogger";

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuthToken(req);
    const body = await req.json();

    const { replyId, leadName, leadTitle, leadCompany, incomingText, threadHistory } = body;

    if (!incomingText) {
      return NextResponse.json(
        { success: false, error: "Incoming message text is required." },
        { status: 400 }
      );
    }

    // Call Gemini AI Classification Service
    const aiResult = await classifyReplyWithGemini({
      leadName: leadName || "Prospect",
      leadTitle: leadTitle || "Professional",
      leadCompany: leadCompany || "Company",
      incomingText,
      threadHistory: threadHistory || [],
    });

    // Auto-Safety Enforcement: If prospect requested opt-out / not interested
    if (aiResult.actionRequired === "suppress_contact" && leadCompany) {
      const cleanCompany = leadCompany.toLowerCase().trim();
      const existing = await adminDb
        .collection("suppressionList")
        .where("value", "==", cleanCompany)
        .limit(1)
        .get();

      if (existing.empty) {
        await adminDb.collection("suppressionList").add({
          type: "company",
          value: cleanCompany,
          reason: `Auto-Suppression: Prospect '${leadName}' declined outreach via reply.`,
          addedBy: "Gemini AI Intent Guard",
          addedAt: new Date().toISOString(),
        });
      }
    }

    // Record audit log
    await logActivity({
      category: "reply_ingested",
      severity: aiResult.classification === "not_interested" ? "warning" : "success",
      title: "Gemini Inbound Reply Classified",
      description: `Reply from ${leadName} (${leadCompany}) classified as '${aiResult.classification}' with ${aiResult.confidence}% confidence.`,
      entityId: replyId || undefined,
      userId: user?.uid,
    });

    return NextResponse.json({
      success: true,
      replyId,
      result: aiResult,
    });
  } catch (err: unknown) {
    console.error("POST /api/ai/classify-reply error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: "Failed to classify reply with Gemini AI" },
      { status: 500 }
    );
  }
}
