import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/backend/firebase/admin";
import { verifyAuthToken } from "@/backend/auth/verifySession";
import { UpdateCampaignSchema } from "@/backend/schemas/campaigns";
import { logActivity } from "@/backend/services/auditLogger";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await verifyAuthToken(req);
    const body = await req.json();

    const parseResult = UpdateCampaignSchema.safeParse(body);
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

    const docRef = adminDb.collection("campaigns").doc(id);
    const existing = await docRef.get();

    if (!existing.exists) {
      return NextResponse.json(
        { success: false, error: "Campaign not found" },
        { status: 404 }
      );
    }

    const updates = {
      ...parseResult.data,
      updatedAt: new Date().toISOString(),
    };

    await docRef.update(updates);

    await logActivity({
      category: "campaign_update",
      severity: "info",
      title: "Campaign Status Updated",
      description: `Campaign '${existing.data()?.name || id}' updated: ${JSON.stringify(parseResult.data)}`,
      entityId: id,
      userId: user?.uid,
    });

    return NextResponse.json({
      success: true,
      campaign: { id, ...existing.data(), ...updates },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: "Failed to update campaign" },
      { status: 500 }
    );
  }
}
