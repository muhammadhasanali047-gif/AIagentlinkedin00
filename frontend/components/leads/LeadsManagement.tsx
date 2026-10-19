"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Upload,
  Sparkles,
  ExternalLink,
  Plus,
  Building2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  MoreVertical,
  ShieldCheck,
  Zap,
  RefreshCw,
  Bot,
  Radio,
} from "lucide-react";
import { useDemoData } from "../../context/DemoDataContext";
import { Lead, LeadStatus } from "../../types";
import { Badge } from "../ui/Badge";
import { LeadDetailDrawer } from "./LeadDetailDrawer";
import { CsvImportModal } from "./CsvImportModal";
import { AiQualifyModal } from "./AiQualifyModal";
import { TargetCategoryModal } from "./TargetCategoryModal";
import { Modal } from "../ui/Modal";

export function LeadsManagement() {
  const { leads, addLead } = useDemoData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isAutopilotRunning, setIsAutopilotRunning] = useState(false);
  const [autopilotNotice, setAutopilotNotice] = useState<string | null>(null);

  const handleRunAutopilot = async () => {
    setIsAutopilotRunning(true);
    setAutopilotNotice(null);
    try {
      const res = await fetch("/api/autopilot/run", { method: "POST" });
      if (res.ok) {
        const json = await res.json();
        setAutopilotNotice(json.message);
      } else {
        setAutopilotNotice("Failed to execute autopilot run.");
      }
    } catch {
      setAutopilotNotice("Network error executing autopilot.");
    } finally {
      setIsAutopilotRunning(false);
      setTimeout(() => setAutopilotNotice(null), 10000);
    }
  };

  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    title: "",
    company: "",
    companySize: "11-50 employees",
    industry: "B2B SaaS",
    location: "United States",
    linkedinUrl: "",
    tags: "Manual Add",
  });

  const [isAddingLead, setIsAddingLead] = useState(false);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.title || !newLeadForm.company) {
      alert("Please enter Name, Title, and Company.");
      return;
    }

    setIsAddingLead(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newLeadForm.name,
          title: newLeadForm.title,
          company: newLeadForm.company,
          companySize: newLeadForm.companySize,
          industry: newLeadForm.industry,
          location: newLeadForm.location,
          linkedinUrl: newLeadForm.linkedinUrl || `https://linkedin.com/in/${newLeadForm.name.toLowerCase().replace(/\s+/g, "-")}`,
          tags: newLeadForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (res.ok && data.lead) {
        // Prepend lead to live state
        addLead(data.lead);
        setAutopilotNotice(
          data.enrolledInHeyReach
            ? `✓ '${newLeadForm.name}' was evaluated by Gemini AI and automatically enrolled into HeyReach Campaign (${data.activeCampaignName || "Active Campaign"})!`
            : `✓ '${newLeadForm.name}' saved to database!`
        );
      } else {
        alert(data.error || "Failed to add lead");
      }
    } catch {
      alert("Network error adding prospect");
    } finally {
      setIsAddingLead(false);
      setIsAddLeadModalOpen(false);
      setNewLeadForm({
        name: "",
        title: "",
        company: "",
        companySize: "11-50 employees",
        industry: "B2B SaaS",
        location: "United States",
        linkedinUrl: "",
        tags: "Manual Add",
      });
      setTimeout(() => setAutopilotNotice(null), 10000);
    }
  };

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.title.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase()) ||
      lead.industry.toLowerCase().includes(search.toLowerCase()) ||
      lead.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

    let matchesScore = true;
    if (scoreFilter === "high") matchesScore = lead.aiScore >= 80;
    if (scoreFilter === "medium") matchesScore = lead.aiScore >= 50 && lead.aiScore < 80;
    if (scoreFilter === "low") matchesScore = lead.aiScore < 50;

    return matchesSearch && matchesStatus && matchesScore;
  });

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
    <div className="space-y-6">
      {/* 24/7 Autonomous AI Agent Control & Status Card */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-lg border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/10 via-indigo-500/10 to-transparent blur-2xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Autonomous AI Agent: 100% Active &amp; Autonomous
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold">
              Zero-Touch Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            The agent automatically discovers target decision-makers, qualifies them with Gemini AI, crafts personalized 1-on-1 connection notes, and dispatches them through <strong>HeyReach</strong> via <strong>ICS Aspire</strong> with human-safe 5–15m LinkedIn pacing.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Auto-Lead Discovery
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Gemini ICP Scoring
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> AI Note Drafting (&le;280 chars)
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Auto-Dispatch (ICS Aspire)
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 relative z-10">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold border border-indigo-400/30 shadow-md hover:shadow-indigo-500/25 transition-all cursor-pointer"
          >
            🎯 Choose Category
          </button>
          <button
            onClick={handleRunAutopilot}
            disabled={isAutopilotRunning}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md hover:shadow-emerald-500/25 transition-all shrink-0 disabled:opacity-50 cursor-pointer"
          >
            <Zap className={`w-4 h-4 ${isAutopilotRunning ? "animate-spin" : "text-emerald-200"}`} />
            {isAutopilotRunning ? "Agent Working..." : "⚡ Trigger Autonomous Cycle"}
          </button>
        </div>
      </div>

      {/* Top Action & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-indigo-100/70 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Leads &amp; Prospects</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage sourced B2B contacts, review AI scores, and import new target accounts safely.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            title="Tell the agent which industry category of leads to discover and outreach"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            🎯 Choose Lead Category
          </button>
          <button
            onClick={handleRunAutopilot}
            disabled={isAutopilotRunning}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            title="Automatically evaluate all new leads with Gemini AI and enroll qualified prospects into HeyReach!"
          >
            <Zap className={`w-3.5 h-3.5 ${isAutopilotRunning ? "animate-spin" : "text-emerald-200"}`} />
            {isAutopilotRunning ? "Running Autopilot..." : "⚡ Run Autopilot"}
          </button>
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Test Scorer
          </button>
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Import CSV
          </button>
          <button
            onClick={() => setIsAddLeadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Prospect
          </button>
        </div>
      </div>

      {/* Autopilot Notice Banner */}
      {autopilotNotice && (
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-950 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2 font-medium">
            <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
            {autopilotNotice}
          </span>
          <button
            onClick={() => setAutopilotNotice(null)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-indigo-100/70 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400" />
          <input
            type="text"
            placeholder="Search leads by name, title, company, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/80 border border-indigo-100/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50/80 border border-indigo-100/80 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses ({leads.length})</option>
            <option value="qualified">Qualified</option>
            <option value="contacted">Contacted</option>
            <option value="replied">Replied</option>
            <option value="converted">Converted</option>
            <option value="unqualified">Unqualified</option>
            <option value="suppressed">Suppressed</option>
          </select>

          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50/80 border border-indigo-100/80 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All AI Scores</option>
            <option value="high">High ICP (≥ 80)</option>
            <option value="medium">Medium ICP (50 - 79)</option>
            <option value="low">Low ICP (&lt; 50)</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white/80 backdrop-blur-md border border-indigo-100/70 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-indigo-50/50 border-b border-indigo-100 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Lead Profile</th>
                <th className="py-3.5 px-4">Company &amp; Industry</th>
                <th className="py-3.5 px-4">AI Score</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Campaign</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No leads matching your current search or filters.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => {
                      setSelectedLead(lead);
                      setIsDrawerOpen(true);
                    }}
                    className="hover:bg-indigo-50/30 cursor-pointer transition-colors"
                  >
                    {/* Name & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-emerald-100 border border-indigo-200/60 flex items-center justify-center font-black text-indigo-900 shrink-0 text-xs">
                          {lead.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 truncate">{lead.name}</span>
                            {lead.isDuplicate && (
                              <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-semibold">
                                Dup
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 truncate block">
                            {lead.title}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Company & Industry */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block truncate">{lead.company}</span>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {lead.industry} &bull; {lead.companySize}
                      </span>
                    </td>

                    {/* AI Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                            lead.aiScore >= 80
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : lead.aiScore >= 50
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {lead.aiScore}/100
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge variant={statusVariants[lead.status] || "default"} dot>
                        {lead.status.toUpperCase()}
                      </Badge>
                    </td>

                    {/* Campaign */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="truncate block max-w-xs text-[11px]">
                        {lead.campaignName || "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                          setIsDrawerOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors inline-flex items-center gap-1"
                        title="View Lead Details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Showing {filteredLeads.length} of {leads.length} total prospects
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Source: HeyReach &bull; CSV &bull; Manual
          </span>
        </div>
      </div>

      {/* Modals & Slide-overs */}
      <LeadDetailDrawer
        lead={selectedLead}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
      />

      <AiQualifyModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Manual Add Lead Modal */}
      <Modal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        title="Add Single B2B Prospect"
        description="Manually enter a verified LinkedIn prospect for AI evaluation."
        maxWidth="md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              onClick={() => setIsAddLeadModalOpen(false)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateLead}
              disabled={isAddingLead}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className={`w-3.5 h-3.5 ${isAddingLead ? "animate-spin" : "text-emerald-200"}`} />
              {isAddingLead ? "Adding & Enrolling in HeyReach..." : "⚡ Add & Auto-Enroll in HeyReach"}
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-800 block mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={newLeadForm.name}
              onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
              placeholder="e.g. Rachel Adams"
              className="w-full p-2.5 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Job Title *</label>
            <input
              type="text"
              required
              value={newLeadForm.title}
              onChange={(e) => setNewLeadForm({ ...newLeadForm, title: e.target.value })}
              placeholder="e.g. Director of Infrastructure"
              className="w-full p-2.5 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={newLeadForm.company}
              onChange={(e) => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
              placeholder="e.g. ScaleVector AI"
              className="w-full p-2.5 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Company Size</label>
              <select
                value={newLeadForm.companySize}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, companySize: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="1-10 employees">1-10 employees</option>
                <option value="11-50 employees">11-50 employees</option>
                <option value="51-200 employees">51-200 employees</option>
                <option value="201-500 employees">201-500 employees</option>
                <option value="500+ employees">500+ employees</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Industry</label>
              <input
                type="text"
                value={newLeadForm.industry}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, industry: e.target.value })}
                placeholder="e.g. B2B SaaS"
                className="w-full p-2.5 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">LinkedIn Profile URL</label>
            <input
              type="url"
              value={newLeadForm.linkedinUrl}
              onChange={(e) => setNewLeadForm({ ...newLeadForm, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/prospect"
              className="w-full p-2.5 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </form>
      </Modal>

      <TargetCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
}
