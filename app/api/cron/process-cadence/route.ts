import { NextRequest, NextResponse } from "next/server";
import { processFollowUpCadence } from "@/backend/services/scheduler/followUpWorker";

export async function GET(req: NextRequest) {
  try {
    const results = await processFollowUpCadence();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (err: unknown) {
    console.error("GET /api/cron/process-cadence error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: "Failed to process cadence" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
