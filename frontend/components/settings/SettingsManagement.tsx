"use client";

import React, { useState } from "react";
import {
  Settings,
  ShieldCheck,
  Key,
  Sparkles,
  Database,
  Sliders,
  Ban,
  CheckCircle2,
  Trash2,
  Plus,
  RefreshCw,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { useDemoData } from "../../context/DemoDataContext";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";

export function SettingsManagement() {
  const {
    integrationStatus,
    icpSettings,
    updateIcpSettings,
    suppressionList,
    addSuppressionEntry,
    removeSuppressionEntry,
    testHeyReachConnection,
  } = useDemoData();

  const [activeTab, setActiveTab] = useState<"integrations" | "icp" | "suppression">("integrations");
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<{
    success: boolean;
    latencyMs: number;
    message: string;
  } | null>(null);

  // Suppression modal state
  const [isAddSupOpen, setIsAddSupOpen] = useState(false);
  const [newSupValue, setNewSupValue] = useState("");
  const [newSupType, setNewSupType] = useState<"domain" | "company" | "linkedin_url">("domain");
  const [newSupReason, setNewSupReason] = useState("");

  const handleTestHeyReach = async () => {
    setTestingConnection(true);
    setConnectionTestResult(null);
    const result = await testHeyReachConnection();
    setConnectionTestResult(result);
    setTestingConnection(false);
  };

  const handleAddSuppression = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupValue.trim()) return;

    addSuppressionEntry({
      type: newSupType,
      value: newSupValue.trim(),
      reason: newSupReason.trim() || "Manual user block",
      addedBy: "Hassan (Admin)",
    });

    setIsAddSupOpen(false);
    setNewSupValue("");
    setNewSupReason("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-indigo-100/70 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Settings &amp; Integrations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage HeyReach API credentials, Gemini AI scoring criteria, and LinkedIn suppression lists.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-xl border border-indigo-100/60">
          <button
            onClick={() => setActiveTab("integrations")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "integrations"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:text-indigo-600"
            }`}
          >
            API Integrations
          </button>
          <button
            onClick={() => setActiveTab("icp")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "icp"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:text-indigo-600"
            }`}
          >
            ICP &amp; AI Rules
          </button>
          <button
            onClick={() => setActiveTab("suppression")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "suppression"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:text-indigo-600"
            }`}
          >
            Suppression ({suppressionList.length})
          </button>
        </div>
      </div>

      {/* Tab 1: API Integrations */}
      {activeTab === "integrations" && (
        <div className="space-y-4">
          {/* HeyReach Integration Card */}
          <div className="bg-white/80 backdrop-blur-md border border-indigo-100/70 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">HeyReach Outreach API</h3>
                    <Badge variant="success" dot>
                      CONNECTED
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    Documented endpoints used for authorized LinkedIn campaign sync &amp; message actions.
                  </p>
                </div>
              </div>

              <button
                onClick={handleTestHeyReach}
                disabled={testingConnection}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? "animate-spin" : ""}`} />
                {testingConnection ? "Pinging HeyReach..." : "Test Connection"}
              </button>
            </div>

            {/* Connection Test Output */}
            {connectionTestResult && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{connectionTestResult.message}</span>
                </div>
                <span className="font-mono text-emerald-700 text-[11px]">
                  Latency: {connectionTestResult.latencyMs}ms
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Masked API Key</span>
                <span className="font-mono text-slate-800 font-bold">
                  {integrationStatus.heyreach.maskedKey}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Authentication Method</span>
                <span className="font-semibold text-slate-800">
                  {integrationStatus.heyreach.authMethod}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Daily Rate Limit Status</span>
                <span className="font-mono font-bold text-slate-900">
                  {integrationStatus.heyreach.rateLimitRemaining} / {integrationStatus.heyreach.rateLimitTotal} reqs remaining
                </span>
              </div>
            </div>

            {/* Documented Endpoints */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Verified Documented Endpoints
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                {integrationStatus.heyreach.verifiedEndpoints.map((ep) => (
                  <div
                    key={ep}
                    className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{ep}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gemini AI Integration Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Google Gemini AI Engine</h3>
                  <Badge variant="success" dot>
                    FREE TIER HEALTHY
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  Server-side execution only. Quota governed to prevent unexpected billing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Active Model</span>
                <span className="font-mono text-slate-800 font-bold">
                  {integrationStatus.gemini.model}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Free Tier Limits</span>
                <span className="font-mono text-slate-800 font-semibold">
                  {integrationStatus.gemini.rpmLimit} RPM / {integrationStatus.gemini.rpdLimit} RPD
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Cost Protection Guard</span>
                <span className="font-semibold text-emerald-600">
                  Auto-Degrade on Quota Exhaustion
                </span>
              </div>
            </div>
          </div>

          {/* Firebase Configuration Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Firebase Auth &amp; Firestore</h3>
                  <Badge variant="success" dot>
                    ONLINE
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  Project: <code className="font-mono text-slate-800">{integrationStatus.firebase.projectId}</code>
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" />
                Firebase Admin Service Account isolated on server. Browser receives client tokens only.
              </span>
              <span className="font-mono text-[11px] text-slate-400">Least-Privilege Rules</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: ICP Rules */}
      {activeTab === "icp" && (
        <div className="bg-white/80 backdrop-blur-md border border-indigo-100/70 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="pb-4 border-b border-indigo-50">
            <h3 className="text-base font-bold text-slate-900">Ideal Customer Profile (ICP) Criteria</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure parameters Gemini uses to calculate numerical prospect scores (0 - 100) and draft personalized icebreakers.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Target Titles */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Target Executive Titles (Comma-separated)
              </label>
              <input
                type="text"
                value={icpSettings.targetJobTitles.join(", ")}
                onChange={(e) =>
                  updateIcpSettings({
                    targetJobTitles: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full p-2.5 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            {/* Target Industries */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Target Industries (Comma-separated)
              </label>
              <input
                type="text"
                value={icpSettings.targetIndustries.join(", ")}
                onChange={(e) =>
                  updateIcpSettings({
                    targetIndustries: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full p-2.5 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            {/* Minimum Score Threshold Slider */}
            <div className="p-4 bg-slate-50/80 border border-indigo-100/70 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800">
                  Minimum AI Qualification Threshold
                </label>
                <span className="font-mono font-black text-indigo-700 text-sm">
                  {icpSettings.minScoreThreshold} / 100
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={icpSettings.minScoreThreshold}
                onChange={(e) => updateIcpSettings({ minScoreThreshold: Number(e.target.value) })}
                className="w-full accent-indigo-600"
              />
              <p className="text-[11px] text-slate-500">
                Prospects scoring below this threshold are flagged as &ldquo;Unqualified&rdquo; and excluded from automated sequences.
              </p>
            </div>

            {/* Human Approval Toggle */}
            <div className="p-4 bg-slate-50/80 border border-indigo-100/70 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">
                  Mandatory Human Sign-Off Before Outbound Dispatch
                </span>
                <span className="text-slate-500 text-[11px]">
                  Requires an operator to approve initial connection notes in the approval queue before sending.
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateIcpSettings({ requireHumanApproval: !icpSettings.requireHumanApproval })
                }
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  icpSettings.requireHumanApproval ? "bg-emerald-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    icpSettings.requireHumanApproval ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Mode B: 100% Autonomous Inbound Auto-Chat (Zero-Touch AI Reply) */}
            <div className="p-4 bg-gradient-to-r from-emerald-50/90 to-teal-50/60 border border-emerald-200/80 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 block text-xs">
                      ⚡ Mode B: 100% Autonomous Inbound Auto-Chat (Zero-Touch)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-xs">
                      {icpSettings.autoReplyEnabled !== false ? "ACTIVE" : "PAUSED"}
                    </span>
                  </div>
                  <span className="text-slate-600 text-[11px] block mt-0.5 leading-relaxed">
                    When a lead replies on LinkedIn, Gemini AI understands their message context, answers their questions, and automatically dispatches the response without waiting for button clicks.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateIcpSettings({ autoReplyEnabled: icpSettings.autoReplyEnabled === false ? true : false })
                  }
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    icpSettings.autoReplyEnabled !== false ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      icpSettings.autoReplyEnabled !== false ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Meeting Booking Link Input */}
              <div className="pt-2 border-t border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap">
                  📅 Calendar Booking Link (Sent automatically on interest):
                </label>
                <input
                  type="text"
                  value={icpSettings.calendarBookingUrl || "https://cal.com/hassan-ai/15min"}
                  onChange={(e) => updateIcpSettings({ calendarBookingUrl: e.target.value })}
                  placeholder="https://cal.com/your-name/15min"
                  className="w-full sm:w-72 px-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs font-mono text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Suppression List */}
      {activeTab === "suppression" && (
        <div className="bg-white/80 backdrop-blur-md border border-indigo-100/70 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-50">
            <div>
              <h3 className="text-base font-bold text-slate-900">Outreach Suppression List</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Companies, domains, and individual LinkedIn URLs barred from any outreach. Never automatically messaged.
              </p>
            </div>

            <button
              onClick={() => setIsAddSupOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Block Entry
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-indigo-50/50 border-b border-indigo-100 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Value / Target</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Added By</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-50/60">
                {suppressionList.map((entry) => (
                  <tr key={entry.id} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold uppercase text-[10px] text-indigo-700">
                      {entry.type}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">{entry.value}</td>
                    <td className="py-3.5 px-4 text-slate-600">{entry.reason}</td>
                    <td className="py-3.5 px-4 text-slate-500">{entry.addedBy}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => removeSuppressionEntry(entry.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Suppression Modal */}
      <Modal
        isOpen={isAddSupOpen}
        onClose={() => setIsAddSupOpen(false)}
        title="Add Exclusion / Suppression Entry"
        description="Prevent future outreach to a specific domain, competitor, or individual."
        maxWidth="md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              onClick={() => setIsAddSupOpen(false)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSuppression}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Enforce Suppression
            </button>
          </div>
        }
      >
        <form onSubmit={handleAddSuppression} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-800 block mb-1">Exclusion Type</label>
            <select
              value={newSupType}
              onChange={(e) =>
                setNewSupType(e.target.value as "domain" | "company" | "linkedin_url")
              }
              className="w-full p-2.5 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="domain">Domain (e.g. competitor.com)</option>
              <option value="company">Company Name (e.g. Acme Corp)</option>
              <option value="linkedin_url">LinkedIn URL (Individual)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Value to Block *</label>
            <input
              type="text"
              required
              value={newSupValue}
              onChange={(e) => setNewSupValue(e.target.value)}
              placeholder="e.g. competitor.com or Acme Inc"
              className="w-full p-2.5 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Reason for Exclusion</label>
            <input
              type="text"
              value={newSupReason}
              onChange={(e) => setNewSupReason(e.target.value)}
              placeholder="e.g. Requested opt-out or market competitor"
              className="w-full p-2.5 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
