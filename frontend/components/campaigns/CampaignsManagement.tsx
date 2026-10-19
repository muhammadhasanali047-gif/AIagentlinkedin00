"use client";

import React, { useState } from "react";
import {
  Send,
  Plus,
  Play,
  Pause,
  Clock,
  Sparkles,
  Users,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { useDemoData } from "../../context/DemoDataContext";
import { Campaign } from "../../types";
import { Badge } from "../ui/Badge";
import { CampaignDetailModal } from "./CampaignDetailModal";
import { NewCampaignModal } from "./NewCampaignModal";

export function CampaignsManagement() {
  const { campaigns, toggleCampaignStatus } = useDemoData();

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const statusVariants: Record<string, "success" | "warning" | "default" | "primary"> = {
    active: "success",
    paused: "warning",
    draft: "default",
    completed: "primary",
  };

  const handleSyncHeyReach = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch("/api/heyreach/campaigns");
      if (res.ok) {
        const json = await res.json();
        setSyncStatus(`HeyReach API connected. ${json.totalCount} active campaigns found in remote workspace.`);
      } else {
        setSyncStatus("Failed to sync with HeyReach campaigns.");
      }
    } catch {
      setSyncStatus("Network error syncing with HeyReach.");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 6000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-indigo-100/70 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Campaigns &amp; Sequences</h2>
          <p className="text-xs text-slate-500 mt-1">
            Automate personalized multi-step sequences via authorized HeyReach endpoints with safe daily pacing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncHeyReach}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200/70 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync HeyReach"}
          </button>

          <button
            onClick={() => setIsNewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncStatus && (
        <div className="p-3.5 bg-indigo-50/90 border border-indigo-200 text-indigo-950 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            {syncStatus}
          </span>
          <button
            onClick={() => setSyncStatus(null)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((camp) => {
          const acceptanceRate =
            camp.sentCount > 0 ? ((camp.acceptedCount / camp.sentCount) * 100).toFixed(0) : "0";
          const replyRate =
            camp.acceptedCount > 0 ? ((camp.repliedCount / camp.acceptedCount) * 100).toFixed(0) : "0";

          return (
            <div
              key={camp.id}
              onClick={() => {
                setSelectedCampaign(camp);
                setIsDetailOpen(true);
              }}
              className="bg-white/80 backdrop-blur-md border border-indigo-100/70 rounded-2xl p-5 shadow-sm hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{camp.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{camp.targetAudience}</p>
                  </div>
                  <Badge variant={statusVariants[camp.status] || "default"} dot>
                    {camp.status.toUpperCase()}
                  </Badge>
                </div>

                {/* Performance Mini Funnel */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs mt-4 pt-4 border-t border-indigo-50">
                  <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Leads</span>
                    <span className="text-sm font-bold text-slate-800">{camp.totalLeads}</span>
                  </div>
                  <div className="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100/60">
                    <span className="text-[10px] text-indigo-500 block font-semibold uppercase">Sent</span>
                    <span className="text-sm font-bold text-indigo-700">{camp.sentCount}</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100/60">
                    <span className="text-[10px] text-emerald-600 block font-semibold uppercase">Accept</span>
                    <span className="text-sm font-bold text-emerald-700">{acceptanceRate}%</span>
                  </div>
                  <div className="p-2.5 bg-emerald-100/60 rounded-xl border border-emerald-200/60">
                    <span className="text-[10px] text-emerald-700 block font-semibold uppercase">Positive</span>
                    <span className="text-sm font-bold text-emerald-900">{camp.positiveReplies}</span>
                  </div>
                </div>

                {/* Sequence Step Chips */}
                <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Steps:</span>
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {camp.steps.map((st) => (
                      <span
                        key={st.stepNumber}
                        className="px-2.5 py-0.5 bg-indigo-50/50 rounded-lg text-indigo-800 border border-indigo-100 text-[10px] whitespace-nowrap font-medium"
                      >
                        {st.stepNumber}. {st.type === "connection_request" ? "Invite" : "Follow-up"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-indigo-50 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  Limit: {camp.dailyLimit}/day
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCampaignStatus(camp.id);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                      camp.status === "active"
                        ? "text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                        : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                    }`}
                  >
                    {camp.status === "active" ? (
                      <>
                        <Pause className="w-3 h-3" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        Resume
                      </>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCampaign(camp);
                      setIsDetailOpen(true);
                    }}
                    className="p-1 text-slate-400 hover:text-indigo-600 rounded-md transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <CampaignDetailModal
        campaign={selectedCampaign}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <NewCampaignModal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
      />
    </div>
  );
}
