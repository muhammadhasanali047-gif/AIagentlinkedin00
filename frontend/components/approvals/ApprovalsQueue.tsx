"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Sparkles,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Send,
  CheckCheck,
} from "lucide-react";
import { useDemoData } from "../../context/DemoDataContext";
import { ApprovalItem } from "../../types";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";

export function ApprovalsQueue() {
  const { approvals, approveItem, rejectItem } = useDemoData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftEdits, setDraftEdits] = useState<Record<string, string>>({});

  const pendingItems = approvals.filter((a) => a.status === "pending");

  const handleEditChange = (id: string, text: string) => {
    setDraftEdits((prev) => ({ ...prev, [id]: text }));
  };

  const handleApprove = (item: ApprovalItem) => {
    const textToSubmit = draftEdits[item.id] !== undefined ? draftEdits[item.id] : item.draftText;
    approveItem(item.id, textToSubmit);
    setEditingId(null);
  };

  const handleBatchApprove = () => {
    pendingItems.forEach((item) => {
      approveItem(item.id);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-indigo-100/70 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Human Review &amp; Approval Queue
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
              {pendingItems.length} Waiting
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Strict human-in-the-loop safety protocol. Every AI-generated connection note or follow-up requires explicit human review and sign-off before being scheduled for dispatch via HeyReach.
          </p>
        </div>

        {pendingItems.length > 0 && (
          <button
            onClick={handleBatchApprove}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            Approve All ({pendingItems.length})
          </button>
        )}
      </div>

      {/* Approvals List */}
      {pendingItems.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="Approval Queue Cleared"
          description="All generated outreach drafts have been verified and approved. New AI drafts will automatically queue here when campaigns process leads."
        />
      ) : (
        <div className="space-y-4">
          {pendingItems.map((item) => {
            const isEditing = editingId === item.id;
            const currentText =
              draftEdits[item.id] !== undefined ? draftEdits[item.id] : item.draftText;

            return (
              <div
                key={item.id}
                className="bg-white/80 backdrop-blur-md border border-indigo-100/70 rounded-2xl p-5 shadow-sm space-y-4 hover:border-indigo-300 hover:shadow-md transition-all"
              >
                {/* Header: Lead Details & Step Pill */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-emerald-100 border border-indigo-200/50 flex items-center justify-center font-black text-indigo-900 text-xs">
                      {item.leadName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{item.leadName}</h3>
                      <p className="text-xs text-slate-500">
                        {item.leadTitle} &bull; <span className="font-medium text-slate-700">{item.leadCompany}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">
                      Campaign: <span className="font-semibold text-indigo-700">{item.campaignName}</span>
                    </span>
                    <Badge variant="warning">
                      {item.stepType.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* AI Rationale Strip */}
                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">AI Context Rationale: </span>
                    {item.aiRationale}
                  </div>
                </div>

                {/* Draft Message Editor */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span>Message Draft</span>
                      {isEditing && (
                        <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full font-bold border border-indigo-100">
                          Editing Mode
                        </span>
                      )}
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {currentText.length}/300 characters
                    </span>
                  </div>

                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={currentText}
                      onChange={(e) => handleEditChange(item.id, e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800 leading-relaxed font-sans"
                    />
                  ) : (
                    <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/60 text-xs text-slate-800 leading-relaxed italic">
                      &ldquo;{currentText}&rdquo;
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Rate limit check passed &bull; Verified no prohibited keywords</span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {isEditing ? (
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingId(item.id)}
                        className="px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Draft
                      </button>
                    )}

                    <button
                      onClick={() => rejectItem(item.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => handleApprove(item)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve &amp; Queue
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
