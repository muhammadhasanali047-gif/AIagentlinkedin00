// ==========================================
// Immutable Security & Activity Audit Logger
// Records all system actions, approvals, and safety blocks
// ==========================================

import { adminDb } from "../firebase/admin";
import { ActivityLog } from "@/frontend/types";

export interface LogActivityParams {
  category: ActivityLog["category"];
  severity: ActivityLog["severity"];
  title: string;
  description: string;
  entityId?: string;
  userId?: string;
}

export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    const logDoc = {
      timestamp: new Date().toISOString(),
      category: params.category,
      severity: params.severity,
      title: params.title,
      description: params.description,
      entityId: params.entityId || null,
      userId: params.userId || "system",
      createdAt: new Date().toISOString(),
    };

    await adminDb.collection("activityLogs").add(logDoc);
  } catch (err: unknown) {
    // Audit logging failure should be noted on console but must not crash the caller
    console.error("Failed to write activity log to Firestore:", (err as Error)?.message);
  }
}
