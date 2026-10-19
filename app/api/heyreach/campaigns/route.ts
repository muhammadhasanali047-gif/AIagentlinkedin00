import { NextRequest, NextResponse } from "next/server";
import { heyreachClient } from "@/backend/services/heyreach/client";
import { verifyAuthToken } from "@/backend/auth/verifySession";

export async function GET(req: NextRequest) {
  try {
    await verifyAuthToken(req);

    const { searchParams } = new URL(req.url);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const result = await heyreachClient.getAllCampaigns(offset, limit);

    return NextResponse.json({
      success: true,
      totalCount: result.totalCount,
      campaigns: result.items,
    });
  } catch (err: unknown) {
    console.error("GET /api/heyreach/campaigns error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch campaigns from HeyReach" },
      { status: 500 }
    );
  }
}
