import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/backend/firebase/admin";
import {
  INITIAL_LEADS,
  INITIAL_CAMPAIGNS,
  INITIAL_SUPPRESSION_LIST,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_ICP_SETTINGS,
} from "@/frontend/mock/demoData";
import { logActivity } from "@/backend/services/auditLogger";

export async function POST(req: NextRequest) {
  try {
    const leadsSnap = await adminDb.collection("leads").limit(1).get();
    let seededCount = 0;

    // 1. Seed Leads if empty
    if (leadsSnap.empty) {
      const batch = adminDb.batch();
      INITIAL_LEADS.forEach((lead) => {
        const docRef = adminDb.collection("leads").doc(lead.id);
        batch.set(docRef, { ...lead, userId: "system_seed" });
        seededCount++;
      });
      await batch.commit();
    }

    // 2. Seed Campaigns if empty
    const campaignsSnap = await adminDb.collection("campaigns").limit(1).get();
    if (campaignsSnap.empty) {
      const batch = adminDb.batch();
      INITIAL_CAMPAIGNS.forEach((camp) => {
        const docRef = adminDb.collection("campaigns").doc(camp.id);
        batch.set(docRef, { ...camp, userId: "system_seed" });
      });
      await batch.commit();
    }

    // 3. Seed Suppression List if empty
    const supSnap = await adminDb.collection("suppressionList").limit(1).get();
    if (supSnap.empty) {
      const batch = adminDb.batch();
      INITIAL_SUPPRESSION_LIST.forEach((sup) => {
        const docRef = adminDb.collection("suppressionList").doc(sup.id);
        batch.set(docRef, sup);
      });
      await batch.commit();
    }

    // 4. Seed ICP Settings if empty
    const settingsRef = adminDb.collection("integrationSettings").doc("icp_rules");
    const settingsDoc = await settingsRef.get();
    if (!settingsDoc.exists) {
      await settingsRef.set({
        ...INITIAL_ICP_SETTINGS,
        updatedAt: new Date().toISOString(),
      });
    }

    await logActivity({
      category: "system",
      severity: "success",
      title: "Firestore Database Seed Initialized",
      description: "Initialized Firestore collections (leads, campaigns, suppressionList, integrationSettings).",
    });

    return NextResponse.json({
      success: true,
      message: "Firestore collections verified and seeded successfully.",
      seededCount,
    });
  } catch (err: unknown) {
    console.error("POST /api/database/seed error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: "Failed to seed Firestore database: " + (err as Error)?.message },
      { status: 500 }
    );
  }
}
