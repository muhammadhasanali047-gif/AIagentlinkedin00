import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/backend/firebase/admin";
import { scoreLeadWithGemini } from "@/backend/services/gemini/leadScorer";
import { heyreachClient, HeyReachLeadInput } from "@/backend/services/heyreach/client";
import { logActivity } from "@/backend/services/auditLogger";
import { discoverTargetLeads } from "@/backend/services/leadDiscovery";
import { processFollowUpCadence } from "@/backend/services/scheduler/followUpWorker";

export async function POST(req: NextRequest) {
  try {
    // 1. Fetch current ICP settings from Firestore (or fallback defaults)
    const settingsDoc = await adminDb.collection("integrationSettings").doc("icp").get();
    const icpSettings = settingsDoc.exists
      ? settingsDoc.data()
      : {
          targetJobTitles: ["Founder", "Co-Founder", "CEO", "CTO", "VP of Engineering", "Head of AI"],
          targetIndustries: ["Software", "Technology", "FinTech", "AI", "SaaS"],
          companySizes: ["11-50 employees", "51-200 employees", "201-500 employees"],
          minScoreThreshold: 70,
          requireHumanApproval: false,
          autonomousModeEnabled: true,
          autoDiscoveryEnabled: true,
          prohibitedKeywords: ["Intern", "Student", "Junior"],
          qualificationPromptRule: "Prioritize technical decision makers and founders with budget authority.",
        };

    // 2. Fetch all leads that have status 'new'
    let leadsSnap = await adminDb.collection("leads").where("status", "==", "new").limit(10).get();

    let autoDiscoveredCount = 0;

    // 2B. If no pending leads, trigger AUTONOMOUS LEAD DISCOVERY!
    if (leadsSnap.empty) {
      console.log("No pending 'new' leads found. Running Autonomous Lead Discovery...");
      const newlyDiscovered = await discoverTargetLeads(3);
      autoDiscoveredCount = newlyDiscovered.length;

      // Re-fetch newly created leads
      leadsSnap = await adminDb.collection("leads").where("status", "==", "new").limit(10).get();
    }

    if (leadsSnap.empty) {
      return NextResponse.json({
        success: true,
        message: "No pending new leads found, and discovery queue is currently satisfied.",
        processedCount: 0,
        qualifiedCount: 0,
        dispatchedCount: 0,
        autoDiscoveredCount: 0,
      });
    }

    // 3. Fetch active HeyReach campaigns and sender account
    const [campaignsResult, accountsResult] = await Promise.all([
      heyreachClient.getAllCampaigns(0, 10),
      heyreachClient.getAllLinkedInAccounts(0, 5),
    ]);

    // Priority: Select active campaign 664640 (AI Outreach Campaign) or first active
    const activeHeyReachCampaign =
      campaignsResult.items?.find((c) => c.status === "IN_PROGRESS" || c.status === "active") ||
      campaignsResult.items?.[0] ||
      null;

    const senderAccount = accountsResult.items?.[0] || null;

    let processedCount = 0;
    let qualifiedCount = 0;
    let dispatchedCount = 0;

    const leadsToDispatch: { leadId: string; heyreachLead: HeyReachLeadInput }[] = [];

    // 4. Process each lead through Gemini AI
    for (const doc of leadsSnap.docs) {
      processedCount++;
      const lead = doc.data();

      // Qualify and draft connection note with Gemini
      const evalResult = await scoreLeadWithGemini({
        name: lead.name || "Prospect",
        title: lead.title || "Professional",
        company: lead.company || "Independent",
        companySize: lead.companySize || "Unknown",
        industry: lead.industry || "Technology",
        location: lead.location || "Remote",
        icpSettings: icpSettings as any,
      });

      const passed = evalResult.passedThreshold;
      if (passed) {
        qualifiedCount++;
      }

      // Update lead with AI results
      await doc.ref.update({
        aiScore: evalResult.score,
        aiScoreExplanation: evalResult.explanation,
        connectionNoteDraft: evalResult.connectionNoteDraft,
        followUpDraft: evalResult.followUpDraft,
        status: passed ? (icpSettings?.requireHumanApproval ? "qualified" : "in_campaign") : "unqualified",
        evaluatedAt: new Date().toISOString(),
      });

      // If passed and Autopilot is enabled (no human approval required)
      if (passed && !icpSettings?.requireHumanApproval && activeHeyReachCampaign) {
        const [firstName, ...rest] = (lead.name || "Prospect").split(" ");
        const lastName = rest.join(" ") || "Lead";

        leadsToDispatch.push({
          leadId: doc.id,
          heyreachLead: {
            firstName,
            lastName,
            profileUrl: lead.linkedinUrl || "",
            companyName: lead.company,
            position: lead.title,
            location: lead.location,
            customUserFields: [
              { name: "connection_note", value: evalResult.connectionNoteDraft },
              { name: "follow_up_note", value: evalResult.followUpDraft },
            ],
          },
        });
      } else if (passed && icpSettings?.requireHumanApproval) {
        // Route to approval queue
        await adminDb.collection("approvals").add({
          leadId: doc.id,
          leadName: lead.name,
          leadCompany: lead.company,
          campaignName: activeHeyReachCampaign?.name || "AI Inbound Outbound",
          stepType: "connection_note",
          draftText: evalResult.connectionNoteDraft,
          aiRationale: evalResult.explanation,
          status: "pending",
          createdAt: new Date().toISOString(),
        });
      }
    }

    // 5. If we have leads to dispatch and an active HeyReach campaign
    if (leadsToDispatch.length > 0 && activeHeyReachCampaign) {
      const dispatchResult = await heyreachClient.addLeadsToCampaign(
        activeHeyReachCampaign.id,
        leadsToDispatch.map((l) => l.heyreachLead),
        senderAccount?.id
      );

      if (dispatchResult.success) {
        dispatchedCount = dispatchResult.enrolledCount;
      }

      await logActivity({
        category: "heyreach_sync",
        severity: "success",
        title: "Autonomous Outreach Dispatched",
        description: `Autonomous agent enrolled ${dispatchedCount} qualified leads into HeyReach Campaign #${activeHeyReachCampaign.id} (${activeHeyReachCampaign.name}).`,
      });
    }

    // 6. Run cadence check in background (cancels follow-ups if prospect replied)
    await processFollowUpCadence().catch((e) => console.warn("Cadence auto-check note:", e?.message));

    await logActivity({
      category: "ai_qualification",
      severity: "info",
      title: "Autonomous AI Agent Cycle Complete",
      description: `Discovered: ${autoDiscoveredCount}. Evaluated: ${processedCount}. Qualified: ${qualifiedCount}. Dispatched to HeyReach: ${dispatchedCount}.`,
    });

    return NextResponse.json({
      success: true,
      autoDiscoveredCount,
      processedCount,
      qualifiedCount,
      dispatchedCount,
      activeCampaignFound: !!activeHeyReachCampaign,
      activeCampaignName: activeHeyReachCampaign?.name || null,
      message: `Autonomous cycle complete: Discovered ${autoDiscoveredCount} new leads, evaluated ${processedCount}, qualified ${qualifiedCount}, dispatched ${dispatchedCount} to HeyReach!`,
    });
  } catch (err: unknown) {
    console.error("POST /api/autopilot/run error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: "Failed to run autonomous outreach pipeline" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}

