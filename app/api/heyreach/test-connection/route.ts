import { NextRequest, NextResponse } from "next/server";
import { heyreachClient } from "@/backend/services/heyreach/client";
import { logActivity } from "@/backend/services/auditLogger";
import { adminDb } from "@/backend/firebase/admin";
import { verifyAuthToken } from "@/backend/auth/verifySession";

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuthToken(req);

    const verification = await heyreachClient.verifyConnection();

    if (!verification.ok) {
      await logActivity({
        category: "heyreach_sync",
        severity: "error",
        title: "HeyReach Connection Verification Failed",
        description: verification.message,
        userId: user?.uid,
      });

      return NextResponse.json({
        success: false,
        statusCode: verification.statusCode,
        latencyMs: verification.latencyMs,
        message: verification.message,
      });
    }

    // Fetch accounts and campaigns summary in parallel
    const [accounts, campaigns] = await Promise.all([
      heyreachClient.getAllLinkedInAccounts(0, 10),
      heyreachClient.getAllCampaigns(0, 10),
    ]);

    // Persist status in Firestore integrationSettings
    await adminDb.collection("integrationSettings").doc("heyreach").set(
      {
        isConnected: true,
        lastVerifiedAt: new Date().toISOString(),
        verifiedBy: user?.email || "system",
        latencyMs: verification.latencyMs,
        linkedInAccountsCount: accounts.totalCount,
        campaignsCount: campaigns.totalCount,
      },
      { merge: true }
    );

    // Record audit log
    await logActivity({
      category: "heyreach_sync",
      severity: "success",
      title: "HeyReach API Connection Verified",
      description: `Authenticated via CheckApiKey (${verification.latencyMs}ms). Connected Accounts: ${accounts.totalCount}, Campaigns: ${campaigns.totalCount}.`,
      userId: user?.uid,
    });

    return NextResponse.json({
      success: true,
      latencyMs: verification.latencyMs,
      message: "HeyReach API credentials verified successfully. Active plan endpoints accessible.",
      stats: {
        linkedInAccountsCount: accounts.totalCount,
        campaignsCount: campaigns.totalCount,
      },
    });
  } catch (err: unknown) {
    console.error("GET /api/heyreach/test-connection error:", (err as Error)?.message);
    return NextResponse.json(
      {
        success: false,
        message: `Failed to test HeyReach connection: ${(err as Error)?.message || "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
