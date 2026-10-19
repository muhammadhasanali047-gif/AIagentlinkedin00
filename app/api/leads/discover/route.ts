import { NextRequest, NextResponse } from "next/server";
import { discoverTargetLeads } from "@/backend/services/leadDiscovery";
import { scoreLeadWithGemini } from "@/backend/services/gemini/leadScorer";
import { heyreachClient } from "@/backend/services/heyreach/client";
import { adminDb } from "@/backend/firebase/admin";
import { logActivity } from "@/backend/services/auditLogger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const category = body.category || "B2B Software & AI";
    const targetJobTitles = body.targetJobTitles || ["Founder", "CEO", "Managing Director", "Owner"];
    const location = body.location || "United States";
    const count = Number(body.count) || 3;
    const autoDispatch = Boolean(body.autoDispatch ?? true);

    // 1. Run category-specific discovery
    const discovered = await discoverTargetLeads({
      category,
      targetJobTitles,
      location,
      count,
    });

    if (!discovered.length) {
      return NextResponse.json({
        success: false,
        error: "No new unique leads discovered for this criteria (all may already exist).",
        leads: [],
      });
    }

    // 2. Fetch active HeyReach campaign
    const campaignsResult = await heyreachClient.getAllCampaigns(0, 10);
    const activeCampaign =
      campaignsResult.items?.find((c) => c.status === "IN_PROGRESS" || c.status === "active") ||
      campaignsResult.items?.[0] ||
      null;

    const accountsResult = await heyreachClient.getAllLinkedInAccounts(0, 5);
    const sender = accountsResult.items?.[0] || null;

    // 3. If autoDispatch is true, qualify and dispatch them
    const processedLeads: any[] = [];
    const leadsToDispatch: any[] = [];

    for (const item of discovered) {
      // Find the document in Firestore
      const snap = await adminDb
        .collection("leads")
        .where("linkedinUrl", "==", item.linkedinUrl)
        .limit(1)
        .get();

      const doc = snap.docs[0];

      // Qualify with Gemini AI specifically tailored to this category
      const evalResult = await scoreLeadWithGemini({
        name: item.name,
        title: item.title,
        company: item.company,
        companySize: item.companySize,
        industry: item.industry,
        location: item.location,
        icpSettings: {
          targetJobTitles,
          targetIndustries: [category],
          companySizes: ["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees"],
          minScoreThreshold: 70,
          requireHumanApproval: false,
          prohibitedKeywords: ["Intern", "Student", "Junior"],
          qualificationPromptRule: `Strictly evaluate if prospect is a decision-maker in ${category}. Personalize the connection note to reference their business in ${category}.`,
        },
      });

      if (doc) {
        await doc.ref.update({
          aiScore: evalResult.score,
          aiScoreExplanation: evalResult.explanation,
          connectionNoteDraft: evalResult.connectionNoteDraft,
          followUpDraft: evalResult.followUpDraft,
          status: evalResult.passedThreshold ? "in_campaign" : "unqualified",
          evaluatedAt: new Date().toISOString(),
        });
      }

      processedLeads.push({
        ...item,
        score: evalResult.score,
        explanation: evalResult.explanation,
        draft: evalResult.connectionNoteDraft,
        passed: evalResult.passedThreshold,
      });

      if (autoDispatch && evalResult.passedThreshold && activeCampaign && doc) {
        const [firstName, ...rest] = item.name.split(" ");
        leadsToDispatch.push({
          firstName,
          lastName: rest.join(" ") || "Lead",
          profileUrl: item.linkedinUrl,
          companyName: item.company,
          position: item.title,
          location: item.location,
          customUserFields: [
            { name: "connection_note", value: evalResult.connectionNoteDraft },
            { name: "follow_up_note", value: evalResult.followUpDraft },
          ],
        });
      }
    }

    // 4. Enroll into HeyReach
    let dispatchedCount = 0;
    if (leadsToDispatch.length > 0 && activeCampaign) {
      const dispatchResult = await heyreachClient.addLeadsToCampaign(
        activeCampaign.id,
        leadsToDispatch,
        sender?.id
      );
      if (dispatchResult.success) {
        dispatchedCount = dispatchResult.enrolledCount;
      }
    }

    await logActivity({
      category: "ai_qualification",
      severity: "success",
      title: `Category Leads Sourced & Dispatched: ${category}`,
      description: `Discovered ${discovered.length} leads in '${category}'. Dispatched ${dispatchedCount} to HeyReach Campaign #${activeCampaign?.id || "N/A"}.`,
    });

    return NextResponse.json({
      success: true,
      category,
      discoveredCount: discovered.length,
      dispatchedCount,
      activeCampaign: activeCampaign?.name || "Active HeyReach Campaign",
      leads: processedLeads,
      message: `Successfully sourced ${discovered.length} leads in '${category}'! Scored with Gemini AI & queued in HeyReach.`,
    });
  } catch (err: any) {
    console.error("POST /api/leads/discover error:", err?.message);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to discover category leads" },
      { status: 500 }
    );
  }
}
