import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/backend/firebase/admin";
import { verifyAuthToken } from "@/backend/auth/verifySession";
import { CreateCampaignSchema } from "@/backend/schemas/campaigns";
import { logActivity } from "@/backend/services/auditLogger";

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuthToken(req);
    let query: FirebaseFirestore.Query = adminDb.collection("campaigns");

    if (user) {
      query = query.where("userId", "in", [user.uid, "demo_system"]);
    }

    const snapshot = await query.orderBy("createdAt", "desc").get();
    const campaigns = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, count: campaigns.length, campaigns });
  } catch (err: unknown) {
    console.error("GET /api/campaigns error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuthToken(req);
    const body = await req.json();

    const parseResult = CreateCampaignSchema.safeParse(body);
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

    const newCampaignDoc = {
      ...data,
      userId,
      totalLeads: 0,
      sentCount: 0,
      acceptedCount: 0,
      repliedCount: 0,
      positiveReplies: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection("campaigns").add(newCampaignDoc);

    await logActivity({
      category: "campaign_update",
      severity: "info",
      title: "Campaign Created in Database",
      description: `Created campaign '${data.name}' with ${data.steps.length} sequence steps and daily limit of ${data.dailyLimit}.`,
      entityId: docRef.id,
      userId,
    });

    return NextResponse.json(
      {
        success: true,
        campaign: {
          id: docRef.id,
          ...newCampaignDoc,
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("POST /api/campaigns error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
