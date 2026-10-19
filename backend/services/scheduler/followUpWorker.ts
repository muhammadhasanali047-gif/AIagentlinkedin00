// ==========================================
// Follow-Up & Cadence Automation Worker
// Strictly follows LinkedIn safety protocols:
// - Auto-cancels follow-ups upon prospect reply
// - Auto-cancels follow-ups upon opt-out or suppression
// - Auto-cancels follow-ups upon campaign pause/stop
// - Never contacts suppressed leads
// ==========================================

import { adminDb } from "../../firebase/admin";
import { logActivity } from "../auditLogger";

export interface ProcessCadenceResult {
  processedCount: number;
  cancelledRepliedCount: number;
  cancelledOptoutCount: number;
  cancelledCampaignStopCount: number;
  dispatchedCount: number;
  queuedForApprovalCount: number;
}

export async function processFollowUpCadence(): Promise<ProcessCadenceResult> {
  const result: ProcessCadenceResult = {
    processedCount: 0,
    cancelledRepliedCount: 0,
    cancelledOptoutCount: 0,
    cancelledCampaignStopCount: 0,
    dispatchedCount: 0,
    queuedForApprovalCount: 0,
  };

  const now = new Date();

  // 1. Fetch all scheduled follow-up tasks
  const scheduledTasksSnap = await adminDb
    .collection("followUpTasks")
    .where("status", "==", "scheduled")
    .get();

  if (scheduledTasksSnap.empty) {
    return result;
  }

  // 2. Fetch suppression list to verify contacts against blocklist
  const suppressionSnap = await adminDb.collection("suppressionList").get();
  const suppressedValues = new Set(
    suppressionSnap.docs.map((d) => (d.data().value || "").toLowerCase().trim())
  );

  // 3. Fetch active campaigns list to check for paused/stopped campaigns
  const campaignsSnap = await adminDb.collection("campaigns").get();
  const campaignStatusMap = new Map<string, string>();
  campaignsSnap.docs.forEach((doc) => {
    const data = doc.data();
    campaignStatusMap.set(data.name || doc.id, data.status || "active");
  });

  // 4. Fetch all replies to verify if any prospect has already replied
  const repliesSnap = await adminDb.collection("replies").get();
  const repliedLeadNames = new Set(
    repliesSnap.docs.map((d) => (d.data().leadName || "").toLowerCase().trim())
  );

  const batch = adminDb.batch();
  let hasBatchWrites = false;

  for (const doc of scheduledTasksSnap.docs) {
    result.processedCount++;
    const task = doc.data();
    const leadNameLower = (task.leadName || "").toLowerCase().trim();
    const leadCompanyLower = (task.leadCompany || "").toLowerCase().trim();
    const scheduledTime = new Date(task.scheduledFor || 0);

    // Safety Rule 1: Check if prospect already replied
    if (repliedLeadNames.has(leadNameLower)) {
      batch.update(doc.ref, {
        status: "cancelled_replied",
        cancellationReason: `Auto-Safety: Prospect '${task.leadName}' has already replied in inbox. Follow-up sequence halted.`,
        cancelledAt: now.toISOString(),
      });
      result.cancelledRepliedCount++;
      hasBatchWrites = true;

      await logActivity({
        category: "safety_block",
        severity: "info",
        title: "Follow-Up Auto-Cancelled (Replied)",
        description: `Follow-up sequence for ${task.leadName} terminated because prospect replied.`,
        entityId: doc.id,
      });
      continue;
    }

    // Safety Rule 2: Check if prospect or company is suppressed
    if (
      suppressedValues.has(leadNameLower) ||
      (leadCompanyLower && suppressedValues.has(leadCompanyLower))
    ) {
      batch.update(doc.ref, {
        status: "cancelled_optout",
        cancellationReason: `Auto-Safety: Contact or company is registered on the suppression list.`,
        cancelledAt: now.toISOString(),
      });
      result.cancelledOptoutCount++;
      hasBatchWrites = true;

      await logActivity({
        category: "safety_block",
        severity: "warning",
        title: "Follow-Up Auto-Cancelled (Suppressed)",
        description: `Follow-up for ${task.leadName} (${task.leadCompany}) aborted due to suppression list match.`,
        entityId: doc.id,
      });
      continue;
    }

    // Safety Rule 3: Check if parent campaign is paused or stopped
    const campStatus = campaignStatusMap.get(task.campaignName);
    if (campStatus === "paused" || campStatus === "completed") {
      batch.update(doc.ref, {
        status: "cancelled_campaign_stop",
        cancellationReason: `Auto-Safety: Campaign '${task.campaignName}' is ${campStatus}.`,
        cancelledAt: now.toISOString(),
      });
      result.cancelledCampaignStopCount++;
      hasBatchWrites = true;
      continue;
    }

    // Check if task is due for execution
    if (scheduledTime <= now) {
      // Route through Human-in-the-Loop Approval Queue
      await adminDb.collection("approvals").add({
        leadId: task.leadId || doc.id,
        leadName: task.leadName,
        leadCompany: task.leadCompany,
        campaignName: task.campaignName,
        stepType: "follow_up",
        messageDraft: task.messageDraft || "Hi, following up on our previous conversation.",
        status: "pending",
        scheduledTime: task.scheduledFor,
        createdAt: now.toISOString(),
      });

      batch.update(doc.ref, {
        status: "queued_for_approval",
        queuedAt: now.toISOString(),
      });
      result.queuedForApprovalCount++;
      hasBatchWrites = true;

      await logActivity({
        category: "human_approval",
        severity: "info",
        title: "Follow-Up Routed to Human Approval Queue",
        description: `Due follow-up for ${task.leadName} placed in operator review queue for dispatch confirmation.`,
        entityId: doc.id,
      });
    }
  }

  if (hasBatchWrites) {
    await batch.commit();
  }

  return result;
}
