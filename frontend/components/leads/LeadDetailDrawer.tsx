import React, { useState } from "react";
import {
  ExternalLink,
  Sparkles,
  ShieldAlert,
  Send,
  Building2,
  MapPin,
  Tag,
  CheckCircle2,
  Trash2,
  UserCheck,
} from "lucide-react";
import { Lead } from "../../types";
import { Drawer } from "../ui/Drawer";
import { Badge } from "../ui/Badge";
import { useDemoData } from "../../context/DemoDataContext";

interface LeadDetailDrawerProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadDetailDrawer({ lead, isOpen, onClose }: LeadDetailDrawerProps) {
  const { updateLead, qualifyLeadWithAi, deleteLead } = useDemoData();
  const [newTag, setNewTag] = useState("");
  const [isQualifying, setIsQualifying] = useState(false);
  const [editedNote, setEditedNote] = useState("");

  if (!lead) return null;

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    if (!lead.tags.includes(newTag.trim())) {
      updateLead(lead.id, { tags: [...lead.tags, newTag.trim()] });
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateLead(lead.id, { tags: lead.tags.filter((t) => t !== tagToRemove) });
  };

  const handleRunAi = async () => {
    setIsQualifying(true);
    await qualifyLeadWithAi(lead.id);
    setIsQualifying(false);
  };

  const statusVariants: Record<string, "default" | "primary" | "success" | "warning" | "danger" | "purple"> = {
    new: "default",
    qualified: "success",
    contacted: "primary",
    replied: "purple",
    converted: "success",
    unqualified: "danger",
    suppressed: "danger",
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={lead.name}
      subtitle={`${lead.title} at ${lead.company}`}
      width="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => {
              if (confirm(`Remove lead ${lead.name} from pipeline?`)) {
                deleteLead(lead.id);
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Lead
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
      <div className="space-y-6">
        {/* Profile Card Header */}
        <div className="flex items-start justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">{lead.name}</span>
              <Badge variant={statusVariants[lead.status] || "default"} dot>
                {lead.status.toUpperCase()}
              </Badge>
              {lead.isDuplicate && (
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                  Duplicate URL
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600">{lead.title}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {lead.company} ({lead.companySize})
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {lead.location}
              </span>
            </div>
          </div>

          <a
            href={lead.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <span>LinkedIn</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* AI Lead Qualification Card */}
        <div className="p-4 bg-gradient-to-br from-sky-50/50 to-indigo-50/50 rounded-xl border border-sky-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Gemini AI Qualification Score
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-base font-extrabold px-2.5 py-0.5 rounded-md ${
                  lead.aiScore >= 80
                    ? "bg-emerald-100 text-emerald-800"
                    : lead.aiScore >= 50
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {lead.aiScore} / 100
              </span>
              <button
                onClick={handleRunAi}
                disabled={isQualifying}
                className="px-2.5 py-1 bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 rounded-md text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1"
              >
                {isQualifying ? (
                  <span>Evaluating...</span>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    Re-Score
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-700 bg-white/80 p-3 rounded-lg border border-sky-100/80 leading-relaxed font-sans">
            {lead.aiScoreExplanation || "No AI evaluation generated yet. Click Re-Score to trigger Gemini qualification."}
          </p>
        </div>

        {/* Personalized Message Drafts */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-sky-600" />
            AI-Personalized Outreach Drafts
          </h4>

          {/* Connection Note */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Connection Request Note (Max 300 chars)
              </label>
              <span className="text-[11px] text-slate-400">
                {lead.connectionNoteDraft.length}/300 chars
              </span>
            </div>
            <textarea
              rows={3}
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 focus:bg-white text-slate-800 leading-relaxed font-sans"
              value={lead.connectionNoteDraft}
              onChange={(e) => updateLead(lead.id, { connectionNoteDraft: e.target.value })}
              placeholder="No connection note generated yet..."
            />
          </div>

          {/* Follow-up Note */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Post-Acceptance Value Follow-up
              </label>
            </div>
            <textarea
              rows={3}
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 focus:bg-white text-slate-800 leading-relaxed font-sans"
              value={lead.followUpDraft}
              onChange={(e) => updateLead(lead.id, { followUpDraft: e.target.value })}
              placeholder="No follow-up draft created yet..."
            />
          </div>
        </div>

        {/* Tags Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            Prospect Tags &amp; Segmentation
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            {lead.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-slate-400 hover:text-slate-700 text-xs"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddTag} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="Add custom tag (e.g. Series B, VIP)..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              Add
            </button>
          </form>
        </div>

        {/* Campaign & Safety Metadata */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-500">
          <div className="flex justify-between">
            <span>Enrolled Campaign:</span>
            <span className="font-semibold text-slate-800">{lead.campaignName || "Unassigned"}</span>
          </div>
          <div className="flex justify-between">
            <span>Data Source:</span>
            <span className="font-mono text-slate-700 uppercase">{lead.source}</span>
          </div>
          <div className="flex justify-between">
            <span>Suppression Status:</span>
            <span className={lead.suppressed ? "text-rose-600 font-bold" : "text-emerald-600 font-semibold"}>
              {lead.suppressed ? "BLOCKED (On Suppression List)" : "Active / Permitted"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Created At:</span>
            <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
