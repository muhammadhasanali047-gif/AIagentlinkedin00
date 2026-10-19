import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/backend/firebase/admin";
import { verifyAuthToken } from "@/backend/auth/verifySession";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = parseInt(searchParams.get("limit") || "50", 10);
    const severity = searchParams.get("severity");

    let query: FirebaseFirestore.Query = adminDb.collection("activityLogs");

    if (severity && severity !== "all") {
      query = query.where("severity", "==", severity);
    }

    const snapshot = await query.orderBy("timestamp", "desc").limit(limitParam).get();
    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, count: logs.length, logs });
  } catch (err: unknown) {
    console.error("GET /api/activity error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve activity logs" },
      { status: 500 }
    );
  }
}
