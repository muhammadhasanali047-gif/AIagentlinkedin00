import React from "react";
import {
  Send,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
} from "lucide-react";
import { Modal } from "../ui/Modal";
import { Badge } from "../ui/Badge";
import { Campaign } from "../../types";
import { useDemoData } from "../../context/DemoDataContext";

interface CampaignDetailModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CampaignDetailModal({
  campaign,
  isOpen,
  onClose,
}: CampaignDetailModalProps) {
  const { toggleCampaignStatus } = useDemoData();

  if (!campaign) return null;

  const statusVariants: Record<string, "success" | "warning" | "default" | "primary"> = {
    active: "success",
    paused: "warning",
    draft: "default",
    completed: "primary",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={campaign.name}
      description={`Target: ${campaign.targetAudience}`}
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => toggleCampaignStatus(campaign.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              campaign.status === "active"
                ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            {campaign.status === "active" ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Pause Campaign
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Resume Campaign
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Quick Campaign Metrics */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Leads</span>
            <span className="text-base font-extrabold text-slate-900">{campaign.totalLeads}</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Sent</span>
            <span className="text-base font-extrabold text-sky-600">{campaign.sentCount}</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Accepted</span>
            <span className="text-base font-extrabold text-blue-600">{campaign.acceptedCount}</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Positive</span>
            <span className="text-base font-extrabold text-emerald-600">{campaign.positiveReplies}</span>
          </div>
        </div>

        {/* Campaign Parameters */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 text-slate-600">
          <div className="flex justify-between">
            <span>Status:</span>
            <Badge variant={statusVariants[campaign.status] || "default"} dot>
              {campaign.status.toUpperCase()}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Daily Outbound Throttle:</span>
            <span className="font-semibold text-slate-800">{campaign.dailyLimit} invites/day</span>
          </div>
          <div className="flex justify-between">
            <span>HeyReach Campaign ID:</span>
            <span className="font-mono text-slate-700">{campaign.heyreachCampaignId || "Pending Sync"}</span>
          </div>
        </div>

        {/* Sequence Steps */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-sky-600" />
            Outreach Sequence Cadence ({campaign.steps.length} Steps)
          </h4>

          <div className="space-y-3">
            {campaign.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold text-[10px] flex items-center justify-center">
                      {step.stepNumber}
                    </span>
                    <span className="font-bold text-xs text-slate-900 uppercase">
                      {step.type.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {step.delayDays === 0 ? "Immediate" : `Wait ${step.delayDays} days`}
                    </span>
                    {step.aiPersonalizationEnabled && (
                      <span className="text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-sky-500" />
                        AI Personalization
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg text-xs font-sans text-slate-700 border border-slate-100">
                  {step.template}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
