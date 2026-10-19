import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/backend/firebase/admin";
import { logActivity } from "@/backend/services/auditLogger";
import { verifyAuthToken } from "@/backend/auth/verifySession";

export async function GET(req: NextRequest) {
  try {
    await verifyAuthToken(req);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query: FirebaseFirestore.Query = adminDb.collection("followUpTasks");
    if (status && status !== "all") {
      query = query.where("status", "==", status);
    }

    const snap = await query.get();
    const tasks = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, count: tasks.length, tasks });
  } catch (err: unknown) {
    console.error("GET /api/followups error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch follow-up tasks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuthToken(req);
    const body = await req.json();

    const { leadId, leadName, leadCompany, campaignName, stepNumber, scheduledFor, messageDraft } =
      body;

    if (!leadName || !scheduledFor) {
      return NextResponse.json(
        { success: false, error: "leadName and scheduledFor timestamp are required." },
        { status: 400 }
      );
    }

    const taskRef = await adminDb.collection("followUpTasks").add({
      leadId: leadId || "",
      leadName,
      leadCompany: leadCompany || "",
      campaignName: campaignName || "Outreach Campaign",
      stepNumber: stepNumber || 2,
      scheduledFor,
      status: "scheduled",
      messageDraft: messageDraft || "",
      createdAt: new Date().toISOString(),
      createdBy: user?.email || "system",
    });

    await logActivity({
      category: "heyreach_sync",
      severity: "info",
      title: "Follow-Up Task Scheduled",
      description: `Follow-up #${stepNumber || 2} scheduled for ${leadName} on ${scheduledFor}.`,
      entityId: taskRef.id,
      userId: user?.uid,
    });

    return NextResponse.json({ success: true, taskId: taskRef.id });
  } catch (err: unknown) {
    console.error("POST /api/followups error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: "Failed to schedule follow-up task" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await verifyAuthToken(req);
    const body = await req.json();

    const { id, action, reason } = body;

    if (!id || !action) {
      return NextResponse.json(
        { success: false, error: "id and action (complete | cancel) are required." },
        { status: 400 }
      );
    }

    const docRef = adminDb.collection("followUpTasks").doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    const taskData = snap.data();

    if (action === "complete") {
      await docRef.update({
        status: "completed",
        completedAt: new Date().toISOString(),
      });

      await logActivity({
        category: "heyreach_sync",
        severity: "success",
        title: "Follow-Up Task Completed",
        description: `Follow-up dispatched for ${taskData?.leadName}.`,
        entityId: id,
        userId: user?.uid,
      });

      return NextResponse.json({ success: true, message: "Task marked as completed." });
    }

    if (action === "cancel") {
      await docRef.update({
        status: "cancelled_replied",
        cancellationReason: reason || "Manual operator cancellation.",
        cancelledAt: new Date().toISOString(),
      });

      await logActivity({
        category: "safety_block",
        severity: "warning",
        title: "Follow-Up Task Cancelled",
        description: `Follow-up for ${taskData?.leadName} cancelled: ${reason || "Manual cancellation"}`,
        entityId: id,
        userId: user?.uid,
      });

      return NextResponse.json({ success: true, message: "Task cancelled successfully." });
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (err: unknown) {
    console.error("PATCH /api/followups error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: "Failed to update follow-up task" },
      { status: 500 }
    );
  }
}
