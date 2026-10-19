import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/backend/firebase/admin";
import { verifyAuthToken } from "@/backend/auth/verifySession";
import { UpdateLeadSchema } from "@/backend/schemas/leads";
import { logActivity } from "@/backend/services/auditLogger";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doc = await adminDb.collection("leads").doc(id).get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      lead: { id: doc.id, ...doc.data() },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch lead" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await verifyAuthToken(req);
    const body = await req.json();

    const parseResult = UpdateLeadSchema.safeParse(body);
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

    const updates = {
      ...parseResult.data,
      lastActivityAt: new Date().toISOString(),
    };

    const docRef = adminDb.collection("leads").doc(id);
    const existing = await docRef.get();

    if (!existing.exists) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    await docRef.update(updates);

    await logActivity({
      category: "ai_qualification",
      severity: "info",
      title: "Lead Updated",
      description: `Lead '${existing.data()?.name || id}' updated in Firestore.`,
      entityId: id,
      userId: user?.uid,
    });

    return NextResponse.json({
      success: true,
      lead: { id, ...existing.data(), ...updates },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: "Failed to update lead" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await verifyAuthToken(req);

    const docRef = adminDb.collection("leads").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    const leadName = doc.data()?.name || id;
    await docRef.delete();

    await logActivity({
      category: "ai_qualification",
      severity: "warning",
      title: "Lead Deleted",
      description: `Lead '${leadName}' removed from pipeline database.`,
      entityId: id,
      userId: user?.uid,
    });

    return NextResponse.json({
      success: true,
      message: `Lead ${id} successfully deleted.`,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}
