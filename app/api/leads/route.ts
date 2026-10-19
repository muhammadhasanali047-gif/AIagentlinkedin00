import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/backend/firebase/admin";
import { verifyAuthToken } from "@/backend/auth/verifySession";
import { CreateLeadSchema } from "@/backend/schemas/leads";
import { logActivity } from "@/backend/services/auditLogger";
import { scoreLeadWithGemini } from "@/backend/services/gemini/leadScorer";
import { heyreachClient } from "@/backend/services/heyreach/client";

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuthToken(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limitParam = parseInt(searchParams.get("limit") || "100", 10);

    let query: FirebaseFirestore.Query = adminDb.collection("leads");

    if (user) {
      query = query.where("userId", "in", [user.uid, "demo_system"]);
    }

    if (status && status !== "all") {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.orderBy("createdAt", "desc").limit(limitParam).get();
    const leads = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, count: leads.length, leads });
  } catch (err: unknown) {
    console.error("GET /api/leads error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve leads from database" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuthToken(req);
    const body = await req.json();

    // Validate body using Zod schema
    const parseResult = CreateLeadSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: parseResult.error.format(),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const userId = user?.uid || "demo_system";

    // 1. Check for Duplicate LinkedIn URL in Firestore
    const dupSnapshot = await adminDb
      .collection("leads")
      .where("linkedinUrl", "==", data.linkedinUrl)
      .limit(1)
      .get();

    const isDuplicate = !dupSnapshot.empty;

    // 2. Cross-check Suppression List
    const supDomainSnapshot = await adminDb
      .collection("suppressionList")
      .where("value", "==", data.company.toLowerCase())
      .limit(1)
      .get();

    const isSuppressed = !supDomainSnapshot.empty;

    // 3. Automatically Qualify & Draft Connection Note with Gemini AI
    let aiScore = 85;
    let explanation = `Prospect in ${data.industry || "Technology"} evaluated for outreach.`;
    let connectionNote = `Hi ${data.name.split(" ")[0]}, noticed your work at ${data.company}. Would love to connect and follow your updates!`;
    let followUpNote = `Hi ${data.name.split(" ")[0]}, following up on my previous note. Would love to share insights on engineering and growth.`;

    try {
      const evalResult = await scoreLeadWithGemini({
        name: data.name,
        title: data.title,
        company: data.company,
        companySize: data.companySize,
        industry: data.industry,
        location: data.location,
        icpSettings: {
          targetJobTitles: ["Founder", "Co-Founder", "CEO", "CTO", "Director", "Manager", "Developer", "Engineer", "Owner", "Consultant"],
          targetIndustries: [data.industry || "Technology"],
          companySizes: ["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees"],
          minScoreThreshold: 50,
          requireHumanApproval: false,
          prohibitedKeywords: [],
          qualificationPromptRule: "Craft a personalized, natural connection note strictly under 280 characters.",
        },
      });

      aiScore = evalResult.score;
      explanation = evalResult.explanation;
      if (evalResult.connectionNoteDraft) connectionNote = evalResult.connectionNoteDraft;
      if (evalResult.followUpDraft) followUpNote = evalResult.followUpDraft;
    } catch (e: any) {
      console.warn("Auto Gemini scoring note in POST /api/leads:", e?.message);
    }

    // 4. Automatically Enroll into Active HeyReach Campaign!
    let enrolledInHeyReach = false;
    let activeCampaignId: number | null = null;
    let activeCampaignName: string | null = null;

    if (!isSuppressed && data.linkedinUrl && data.linkedinUrl.startsWith("http")) {
      try {
        const campaignsResult = await heyreachClient.getAllCampaigns(0, 10);
        const activeCampaign =
          campaignsResult.items?.find((c) => c.status === "IN_PROGRESS" || c.status === "active") ||
          campaignsResult.items?.[0] ||
          null;

        const accountsResult = await heyreachClient.getAllLinkedInAccounts(0, 5);
        const sender = accountsResult.items?.[0] || null;

        if (activeCampaign) {
          activeCampaignId = activeCampaign.id;
          activeCampaignName = activeCampaign.name;
          const [firstName, ...rest] = data.name.split(" ");
          const dispatchRes = await heyreachClient.addLeadsToCampaign(
            activeCampaign.id,
            [
              {
                firstName,
                lastName: rest.join(" ") || "Lead",
                profileUrl: data.linkedinUrl,
                companyName: data.company,
                position: data.title,
                location: data.location,
                customUserFields: [
                  { name: "connection_note", value: connectionNote },
                  { name: "follow_up_note", value: followUpNote },
                ],
              },
            ],
            sender?.id
          );
          enrolledInHeyReach = dispatchRes.success;
        }
      } catch (err: any) {
        console.warn("Auto-enroll in HeyReach failed:", err?.message);
      }
    }

    const newLeadDoc = {
      ...data,
      userId,
      status: isSuppressed
        ? "suppressed"
        : enrolledInHeyReach
        ? "in_campaign"
        : "new",
      aiScore,
      aiScoreExplanation: explanation,
      connectionNoteDraft: connectionNote,
      followUpDraft: followUpNote,
      source: "manual",
      isDuplicate,
      suppressed: isSuppressed,
      enrolledInHeyReach,
      heyreachCampaignId: activeCampaignId,
      heyreachCampaignName: activeCampaignName,
      lastActivityAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection("leads").add(newLeadDoc);

    // Write audit log
    await logActivity({
      category: enrolledInHeyReach ? "heyreach_sync" : "ai_qualification",
      severity: enrolledInHeyReach ? "success" : "info",
      title: enrolledInHeyReach ? "Prospect Added & Enrolled in HeyReach" : "Lead Created in Database",
      description: enrolledInHeyReach
        ? `Lead '${data.name}' was evaluated with Gemini AI (Score: ${aiScore}) and automatically enrolled into HeyReach Campaign #${activeCampaignId} (${activeCampaignName}).`
        : `Lead '${data.name}' (${data.company}) saved to Firestore. Duplicate: ${isDuplicate}, Suppressed: ${isSuppressed}.`,
      entityId: docRef.id,
      userId,
    });

    return NextResponse.json(
      {
        success: true,
        enrolledInHeyReach,
        activeCampaignName,
        message: enrolledInHeyReach
          ? `✓ '${data.name}' was scored (${aiScore}/100) and automatically enrolled into HeyReach Campaign!`
          : `Lead '${data.name}' saved to database.`,
        lead: {
          id: docRef.id,
          ...newLeadDoc,
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("POST /api/leads error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: "Failed to store and enroll lead in database" },
      { status: 500 }
    );
  }
}
