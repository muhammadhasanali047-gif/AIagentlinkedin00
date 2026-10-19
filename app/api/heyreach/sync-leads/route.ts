import { NextRequest, NextResponse } from "next/server";
import { heyreachClient, HeyReachLeadInput } from "@/backend/services/heyreach/client";
import { adminDb } from "@/backend/firebase/admin";
import { logActivity } from "@/backend/services/auditLogger";
import { verifyAuthToken } from "@/backend/auth/verifySession";

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuthToken(req);
    const body = await req.json();

    const { campaignId, leadIds, linkedInAccountId } = body;

    if (!campaignId || !leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "campaignId and an array of leadIds are required." },
        { status: 400 }
      );
    }

    // Retrieve leads from Firestore
    const candidateLeads: HeyReachLeadInput[] = [];
    for (const leadId of leadIds) {
      const snap = await adminDb.collection("leads").doc(leadId).get();
      if (!snap.exists) continue;

      const data = snap.data();
      if (!data) continue;

      const [firstName, ...rest] = (data.name || "Prospect").split(" ");
      const lastName = rest.join(" ") || "Lead";

      candidateLeads.push({
        firstName,
        lastName,
        profileUrl: data.linkedinUrl || "",
        companyName: data.company,
        position: data.title,
        location: data.location,
        customUserFields: [
          { name: "connection_note", value: data.connectionNoteDraft || "" },
          { name: "follow_up_note", value: data.followUpDraft || "" },
        ],
      });
    }

    if (candidateLeads.length === 0) {
      return NextResponse.json(
        { success: false, error: "No matching leads found for provided IDs." },
        { status: 404 }
      );
    }

    // Call HeyReach client with built-in suppression guard
    const syncResult = await heyreachClient.addLeadsToCampaign(
      parseInt(campaignId.toString(), 10),
      candidateLeads,
      linkedInAccountId ? parseInt(linkedInAccountId.toString(), 10) : undefined
    );

    // Update status in Firestore for enrolled leads
    if (syncResult.success) {
      const batch = adminDb.batch();
      for (const leadId of leadIds) {
        const ref = adminDb.collection("leads").doc(leadId);
        batch.update(ref, {
          status: "in_campaign",
          campaignId: campaignId.toString(),
          enrolledAt: new Date().toISOString(),
        });
      }
      await batch.commit();
    }

    // Log activity
    await logActivity({
      category: "heyreach_sync",
      severity: syncResult.success ? "success" : "warning",
      title: "HeyReach Campaign Enrollment",
      description: syncResult.message,
      entityId: campaignId.toString(),
      userId: user?.uid,
    });

    return NextResponse.json({
      success: syncResult.success,
      enrolledCount: syncResult.enrolledCount,
      suppressedCount: syncResult.suppressedCount,
      message: syncResult.message,
    });
  } catch (err: unknown) {
    console.error("POST /api/heyreach/sync-leads error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: "Failed to enroll leads into HeyReach" },
      { status: 500 }
    );
  }
}
