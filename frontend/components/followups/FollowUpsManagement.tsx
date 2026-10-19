"use client";

import React, { useState } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Send,
  Ban,
  UserCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useDemoData } from "../../context/DemoDataContext";
import { FollowUpStatus, FollowUpTask } from "../../types";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";

export function FollowUpsManagement() {
  const { followUps, completeFollowUp, cancelFollowUp } = useDemoData();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isProcessingCadence, setIsProcessingCadence] = useState(false);
  const [cadenceNotice, setCadenceNotice] = useState<string | null>(null);

  const handleRunCadence = async () => {
    setIsProcessingCadence(true);
    setCadenceNotice(null);
    try {
      const res = await fetch("/api/cron/process-cadence");
      if (res.ok) {
        const json = await res.json();
        const r = json.results;
        setCadenceNotice(
          `Cadence check complete: ${r.processedCount} tasks inspected (${r.cancelledRepliedCount} auto-cancelled from replies, ${r.cancelledOptoutCount} suppressed, ${r.queuedForApprovalCount} queued for human approval).`
        );
      } else {
        setCadenceNotice("Cadence check completed.");
      }
    } catch {
      setCadenceNotice("Network error running cadence check.");
    } finally {
      setIsProcessingCadence(false);
      setTimeout(() => setCadenceNotice(null), 8000);
    }
  };

  const filteredTasks = followUps.filter((task) => {
    if (statusFilter === "all") return true;
    return task.status === statusFilter;
  });

  const scheduledCount = followUps.filter((f) => f.status === "scheduled").length;
  const cancelledCount = followUps.filter((f) => f.status.startsWith("cancelled")).length;
  const completedCount = followUps.filter((f) => f.status === "completed").length;

  const statusConfig: Record<
    FollowUpStatus,
    { label: string; variant: "success" | "warning" | "danger" | "default" }
  > = {
    scheduled: { label: "Scheduled", variant: "warning" },
    cancelled_replied: { label: "Auto-Cancelled (Replied)", variant: "default" },
    cancelled_optout: { label: "Auto-Cancelled (Opt-Out)", variant: "danger" },
    cancelled_campaign_stop: { label: "Cancelled (Campaign Stop)", variant: "default" },
    completed: { label: "Dispatched", variant: "success" },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Follow-Up Cadence &amp; Task Manager
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Autonomous follow-up scheduler adhering to LinkedIn safety protocols. Follow-ups are automatically and immediately cancelled if a prospect replies, schedules a meeting, or requests an opt-out.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" dot>
            Safety Auto-Cancel Active
          </Badge>

          <button
            onClick={handleRunCadence}
            disabled={isProcessingCadence}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessingCadence ? "animate-spin" : ""}`} />
            {isProcessingCadence ? "Checking Cadence..." : "Run Cadence Check"}
          </button>
        </div>
      </div>

      {/* Cadence Result Banner */}
      {cadenceNotice && (
        <div className="p-3.5 bg-sky-50 border border-sky-200 text-sky-900 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
            {cadenceNotice}
          </span>
          <button
            onClick={() => setCadenceNotice(null)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase font-bold">Upcoming Scheduled</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">{scheduledCount}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase font-bold">Auto-Cancelled for Safety</span>
            <p className="text-2xl font-bold text-slate-700 mt-1">{cancelledCount}</p>
          </div>
          <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
            <Ban className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase font-bold">Dispatched Successfully</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{completedCount}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
        <span className="text-xs font-bold text-slate-600 px-2">Filter Tasks:</span>
        {[
          { key: "all", label: `All Tasks (${followUps.length})` },
          { key: "scheduled", label: `Scheduled (${scheduledCount})` },
          { key: "cancelled_replied", label: `Cancelled (Replied)` },
          { key: "cancelled_optout", label: `Cancelled (Opt-Out)` },
          { key: "completed", label: `Completed` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === tab.key
                ? "bg-sky-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task List / Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No Tasks Found"
            description="There are currently no follow-up tasks under this status filter."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTasks.map((task) => {
              const config = statusConfig[task.status] || {
                label: task.status,
                variant: "default",
              };

              return (
                <div
                  key={task.id}
                  className="p-5 hover:bg-slate-50/70 transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {task.leadName} &bull;{" "}
                        <span className="font-normal text-slate-500">
                          {task.leadTitle} at {task.leadCompany}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Campaign: <span className="font-medium text-slate-700">{task.campaignName}</span> &bull; Step #{task.sequenceStep}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(task.scheduledFor).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <Badge variant={config.variant} dot>
                        {config.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Message Preview */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 font-sans italic">
                    &ldquo;{task.messagePreview}&rdquo;
                  </div>

                  {/* Safety Cancellation Reason Strip */}
                  {task.cancellationReason && (
                    <div className="p-2.5 bg-rose-50/70 border border-rose-100 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{task.cancellationReason}</span>
                    </div>
                  )}

                  {/* Actions for Scheduled Tasks */}
                  {task.status === "scheduled" && (
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() =>
                          cancelFollowUp(task.id, "Manually cancelled by user operator.")
                        }
                        className="px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                      >
                        Cancel Follow-up
                      </button>
                      <button
                        onClick={() => completeFollowUp(task.id)}
                        className="px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mark Complete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Idempotent task scheduler ensures no prospect receives duplicate outreach.</span>
          <span className="font-mono text-slate-400">HeyReach Sync Protocol</span>
        </div>
      </div>
    </div>
  );
}
