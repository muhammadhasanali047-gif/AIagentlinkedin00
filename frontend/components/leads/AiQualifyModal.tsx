import React, { useState } from "react";
import { Sparkles, CheckCircle2, AlertCircle, ShieldCheck, User } from "lucide-react";
import { Modal } from "../ui/Modal";
import { useDemoData } from "../../context/DemoDataContext";

interface AiQualifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiQualifyModal({ isOpen, onClose }: AiQualifyModalProps) {
  const { leads, icpSettings } = useDemoData();
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || "");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    explanation: string;
    connectionNote: string;
    followUpNote: string;
    passedIcp: boolean;
  } | null>(null);

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  const handleRunEvaluation = async () => {
    if (!selectedLead) return;
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai/qualify-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: selectedLead.id,
          name: selectedLead.name,
          title: selectedLead.title,
          company: selectedLead.company,
          companySize: selectedLead.companySize,
          industry: selectedLead.industry,
          location: selectedLead.location,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.result) {
          setResult({
            score: json.result.score,
            passedIcp: json.result.passedThreshold,
            explanation: json.result.explanation,
            connectionNote: json.result.connectionNoteDraft,
            followUpNote: json.result.followUpDraft,
          });
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Fallback below
    }

    // Fallback if API was not reached
    const isMatch = icpSettings.targetJobTitles.some((t) =>
      selectedLead.title.toLowerCase().includes(t.toLowerCase())
    );
    const score = isMatch ? 88 : 50;
    const passed = score >= icpSettings.minScoreThreshold;

    setResult({
      score,
      passedIcp: passed,
      explanation: passed
        ? `Lead matches high-priority ICP profile. Executive title '${selectedLead.title}' provides budget signing authority in ${selectedLead.companySize} organizations.`
        : `Lead scored ${score}/100. Target title '${selectedLead.title}' is below minimum threshold (${icpSettings.minScoreThreshold}).`,
      connectionNote: `Hi ${selectedLead.name.split(" ")[0]}, noticed your engineering leadership at ${selectedLead.company}. Really admire your team's focus on distributed systems. Would love to connect and follow your updates!`,
      followUpNote: `Hi ${selectedLead.name.split(" ")[0]}, thanks for connecting! We recently compiled an architectural blueprint on reducing latency in async workflow pipelines. Happy to share if relevant!`,
    });

    setIsLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Interactive Gemini AI Qualification Tester"
      description="Simulate real-time Gemini ICP scoring and personalized note generation without using third-party paid models."
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            Gemini Free Tier Guardrail Enabled
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Lead Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Select Pipeline Prospect</label>
          <select
            value={selectedLeadId}
            onChange={(e) => {
              setSelectedLeadId(e.target.value);
              setResult(null);
            }}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
          >
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.name} — {lead.title} at {lead.company} ({lead.companySize})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Prospect Summary Card */}
        {selectedLead && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Current Title:</span>
              <span className="font-semibold text-slate-800">{selectedLead.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Target Industry:</span>
              <span className="font-semibold text-slate-800">{selectedLead.industry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ICP Threshold:</span>
              <span className="font-mono text-slate-700">{icpSettings.minScoreThreshold} points</span>
            </div>
          </div>
        )}

        {/* Trigger Button */}
        <button
          onClick={handleRunEvaluation}
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Calling Gemini Engine...
            </span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-sky-200" />
              Run Gemini Evaluation &amp; Personalization
            </>
          )}
        </button>

        {/* Results Card */}
        {result && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Evaluation Output
              </span>
              <span
                className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                  result.passedIcp
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-rose-100 text-rose-800 border border-rose-200"
                }`}
              >
                Score: {result.score}/100 — {result.passedIcp ? "PASSED ICP" : "BELOW THRESHOLD"}
              </span>
            </div>

            <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed font-sans">
              {result.explanation}
            </p>

            {result.passedIcp && (
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-bold text-slate-700 uppercase flex items-center justify-between">
                  <span>Generated LinkedIn Connection Note</span>
                  <span className="font-mono text-slate-400">
                    {result.connectionNote.length}/300 chars
                  </span>
                </div>
                <div className="text-xs p-3 bg-white rounded-lg border border-slate-200 text-slate-800 italic">
                  &ldquo;{result.connectionNote}&rdquo;
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
