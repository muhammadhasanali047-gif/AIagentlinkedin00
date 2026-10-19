import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/backend/firebase/admin";
import { verifyAuthToken } from "@/backend/auth/verifySession";
import { CreateSuppressionSchema } from "@/backend/schemas/suppression";
import { logActivity } from "@/backend/services/auditLogger";

export async function GET(req: NextRequest) {
  try {
    const snapshot = await adminDb
      .collection("suppressionList")
      .orderBy("addedAt", "desc")
      .get();

    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, count: list.length, suppressionList: list });
  } catch (err: unknown) {
    console.error("GET /api/suppression error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch suppression list" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuthToken(req);
    const body = await req.json();

    const parseResult = CreateSuppressionSchema.safeParse(body);
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

    const { type, value, reason } = parseResult.data;
    const addedBy = user?.email || "Hassan (Admin)";

    const newDoc = {
      type,
      value: value.toLowerCase().trim(),
      reason,
      addedBy,
      addedAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection("suppressionList").add(newDoc);

    // Update any matching leads in database to suppressed
    if (type === "domain" || type === "company") {
      const matchingLeads = await adminDb
        .collection("leads")
        .where("company", "==", value)
        .get();

      const batch = adminDb.batch();
      matchingLeads.docs.forEach((d) => {
        batch.update(d.ref, { suppressed: true, status: "suppressed" });
      });
      if (!matchingLeads.empty) {
        await batch.commit();
      }
    }

    await logActivity({
      category: "safety_block",
      severity: "error",
      title: "Suppression Entry Enforced",
      description: `Blocked '${value}' (${type}) in database. Reason: ${reason}.`,
      entityId: docRef.id,
      userId: user?.uid,
    });

    return NextResponse.json(
      {
        success: true,
        entry: {
          id: docRef.id,
          ...newDoc,
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("POST /api/suppression error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: "Failed to create suppression entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await verifyAuthToken(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing suppression entry ID" },
        { status: 400 }
      );
    }

    const docRef = adminDb.collection("suppressionList").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: "Suppression entry not found" },
        { status: 404 }
      );
    }

    await docRef.delete();

    await logActivity({
      category: "safety_block",
      severity: "warning",
      title: "Suppression Entry Removed",
      description: `Removed exclusion entry for '${doc.data()?.value}'.`,
      entityId: id,
      userId: user?.uid,
    });

    return NextResponse.json({
      success: true,
      message: `Suppression entry ${id} removed.`,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: "Failed to remove suppression entry" },
      { status: 500 }
    );
  }
}
