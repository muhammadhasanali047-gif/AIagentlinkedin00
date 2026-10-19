import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/backend/firebase/admin";
import { verifyAuthToken } from "@/backend/auth/verifySession";
import { scoreLeadWithGemini } from "@/backend/services/gemini/leadScorer";
import { INITIAL_ICP_SETTINGS } from "@/frontend/mock/demoData";
import { logActivity } from "@/backend/services/auditLogger";

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuthToken(req);
    const body = await req.json();

    const { leadId, name, title, company, companySize, industry, location } = body;

    if (!name || !title || !company) {
      return NextResponse.json(
        { success: false, error: "Prospect Name, Job Title, and Company are required." },
        { status: 400 }
      );
    }

    // Fetch active ICP settings from Firestore (or fallback to defaults)
    let icpSettings = INITIAL_ICP_SETTINGS;
    try {
      const icpDoc = await adminDb.collection("integrationSettings").doc("icp_rules").get();
      if (icpDoc.exists) {
        icpSettings = { ...INITIAL_ICP_SETTINGS, ...icpDoc.data() };
      }
    } catch {
      // Use defaults
    }

    // Execute Gemini AI Qualification
    const aiResult = await scoreLeadWithGemini({
      name,
      title,
      company,
      companySize,
      industry,
      location,
      icpSettings,
    });

    // If leadId was provided, update the lead document in Firestore
    if (leadId) {
      const leadRef = adminDb.collection("leads").doc(leadId);
      const leadDoc = await leadRef.get();

      if (leadDoc.exists) {
        await leadRef.update({
          aiScore: aiResult.score,
          aiScoreExplanation: aiResult.explanation,
          connectionNoteDraft: aiResult.connectionNoteDraft,
          followUpDraft: aiResult.followUpDraft,
          status: aiResult.passedThreshold ? "qualified" : "unqualified",
          lastActivityAt: new Date().toISOString(),
        });
      }
    }

    // Write audit log
    await logActivity({
      category: "ai_qualification",
      severity: aiResult.passedThreshold ? "success" : "info",
      title: "Gemini Lead Qualification Processed",
      description: `Prospect '${name}' (${title} at ${company}) scored ${aiResult.score}/100. Status: ${
        aiResult.passedThreshold ? "Qualified" : "Unqualified"
      }.`,
      entityId: leadId || undefined,
      userId: user?.uid,
    });

    return NextResponse.json({
      success: true,
      leadId,
      result: aiResult,
    });
  } catch (err: unknown) {
    console.error("POST /api/ai/qualify-lead error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: "Failed to qualify lead with Gemini AI" },
      { status: 500 }
    );
  }
}
