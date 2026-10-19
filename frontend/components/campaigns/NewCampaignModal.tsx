import React, { useState } from "react";
import { Send, Clock, Sparkles, Plus, Trash2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { useDemoData } from "../../context/DemoDataContext";
import { CampaignStep } from "../../types";

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewCampaignModal({ isOpen, onClose }: NewCampaignModalProps) {
  const { createCampaign } = useDemoData();

  const [name, setName] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [dailyLimit, setDailyLimit] = useState(20);
  const [steps, setSteps] = useState<CampaignStep[]>([
    {
      stepNumber: 1,
      type: "connection_request",
      delayDays: 0,
      template:
        "Hi {{firstName}}, admired your team's engineering work at {{company}}. Would love to connect and follow your updates!",
      aiPersonalizationEnabled: true,
    },
    {
      stepNumber: 2,
      type: "followup_message",
      delayDays: 3,
      template:
        "Hi {{firstName}}, thanks for connecting! We put together a short architecture brief on reducing workflow latency. Happy to share if helpful!",
      aiPersonalizationEnabled: true,
    },
  ]);

  const handleAddStep = () => {
    setSteps([
      ...steps,
      {
        stepNumber: steps.length + 1,
        type: "followup_message",
        delayDays: 5,
        template:
          "Hey {{firstName}}, quick check-in—let me know if your team is exploring AI optimizations this quarter.",
        aiPersonalizationEnabled: true,
      },
    ]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) return;
    const updated = steps.filter((_, i) => i !== index).map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setSteps(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAudience) {
      alert("Please provide Campaign Name and Target Audience.");
      return;
    }

    createCampaign({
      name,
      targetAudience,
      dailyLimit,
      totalLeads: 0,
      status: "draft",
      steps,
    });

    onClose();
    setName("");
    setTargetAudience("");
    setDailyLimit(20);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create LinkedIn Outreach Campaign"
      description="Configure target audience, daily safety throttle, and sequence message cadence."
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            Create Draft Campaign
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="font-bold text-slate-700 block mb-1">Campaign Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. US FinTech CTOs - Q4 Scalability"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Target Audience Persona *</label>
          <input
            type="text"
            required
            placeholder="e.g. CTOs and VPs of Engineering at Series A/B Fintechs"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-bold text-slate-700">Daily Invites Throttle</label>
            <span className="font-mono text-slate-500">{dailyLimit} invites/day</span>
          </div>
          <input
            type="range"
            min="5"
            max="30"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(Number(e.target.value))}
            className="w-full accent-sky-600"
          />
          <p className="text-[11px] text-slate-400 mt-0.5">
            LinkedIn Safety Limit: Kept under 30/day to prevent account restrictions.
          </p>
        </div>

        {/* Sequences */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-800 uppercase tracking-wide text-xs">
              Sequence Steps
            </label>
            <button
              type="button"
              onClick={handleAddStep}
              className="text-xs text-sky-600 font-semibold flex items-center gap-1 hover:text-sky-700"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Follow-Up
            </button>
          </div>

          {steps.map((step, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-200 text-sky-900 font-bold text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-800">
                    {idx === 0 ? "Connection Request" : `Follow-Up #${idx}`}
                  </span>
                </div>
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <textarea
                rows={2}
                value={step.template}
                onChange={(e) => {
                  const updated = [...steps];
                  updated[idx].template = e.target.value;
                  setSteps(updated);
                }}
                className="w-full p-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          ))}
        </div>
      </form>
    </Modal>
  );
}
