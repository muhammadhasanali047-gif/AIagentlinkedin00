"use client";

import React, { useState } from "react";
import { Sparkles, Building2, MapPin, CheckCircle2, ChevronRight, Zap, Target } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Badge } from "../ui/Badge";

interface TargetCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CATEGORY_PRESETS = [
  {
    id: "tech_saas",
    name: "AI & B2B SaaS",
    icon: "🏢",
    titles: "Founder, Co-Founder, CEO, CTO, VP of Engineering",
    industry: "Artificial Intelligence & B2B SaaS",
  },
  {
    id: "real_estate",
    name: "Real Estate & Brokerages",
    icon: "🏠",
    titles: "Agency Owner, Principal Broker, Managing Director",
    industry: "Real Estate Brokerages & Agencies",
  },
  {
    id: "ecommerce",
    name: "E-Commerce & D2C Brands",
    icon: "🛍️",
    titles: "Founder, CEO, Head of E-commerce, CMO",
    industry: "E-Commerce & Consumer Brands",
  },
  {
    id: "fintech",
    name: "FinTech & Financial Advisory",
    icon: "💳",
    titles: "Managing Partner, Founder & CEO, FinTech Director",
    industry: "FinTech & Financial Services",
  },
  {
    id: "healthcare",
    name: "Healthcare & MedTech",
    icon: "🏥",
    titles: "Medical Director, Clinic Owner, Founder & CEO",
    industry: "Healthcare & Medical Technology",
  },
  {
    id: "agency",
    name: "Marketing & Growth Agencies",
    icon: "🚀",
    titles: "Agency Founder, Managing Director, Head of Growth",
    industry: "Digital Marketing & Creative Agencies",
  },
];

export function TargetCategoryModal({ isOpen, onClose, onSuccess }: TargetCategoryModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>("tech_saas");
  const [customCategory, setCustomCategory] = useState<string>("");
  const [titles, setTitles] = useState<string>("Founder, Co-Founder, CEO, CTO, VP of Engineering");
  const [location, setLocation] = useState<string>("United States");
  const [leadCount, setLeadCount] = useState<number>(3);
  const [autoDispatch, setAutoDispatch] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSelectPreset = (preset: typeof CATEGORY_PRESETS[0]) => {
    setSelectedPreset(preset.id);
    setCustomCategory("");
    setTitles(preset.titles);
  };

  const handleLaunchDiscovery = async () => {
    setIsLoading(true);
    setResults(null);
    setStatusMessage(null);

    const activeCategory =
      selectedPreset === "custom" ? customCategory : (CATEGORY_PRESETS.find((p) => p.id === selectedPreset)?.name || "B2B SaaS");

    try {
      const res = await fetch("/api/leads/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: activeCategory,
          targetJobTitles: titles.split(",").map((t) => t.trim()).filter(Boolean),
          location,
          count: leadCount,
          autoDispatch,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResults(data.leads || []);
        setStatusMessage(data.message || `Successfully discovered leads in '${activeCategory}'!`);
        if (onSuccess) onSuccess();
      } else {
        setStatusMessage(data.error || "Failed to discover category leads.");
      }
    } catch {
      setStatusMessage("Network error during category lead discovery.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setStatusMessage(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🎯 Target Category Lead Discovery"
      description="Tell the AI Agent which exact industry and decision-maker category to source and qualify."
      maxWidth="2xl"
    >
      <div className="space-y-5 text-xs">
        {!results ? (
          <>
            {/* Category Presets */}
            <div>
              <label className="font-bold text-slate-800 block mb-2">
                1. Select Target Industry / Category:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORY_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedPreset === preset.id
                        ? "border-indigo-500 bg-indigo-50/80 text-indigo-950 ring-2 ring-indigo-400/20 font-bold shadow-xs"
                        : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700"
                    }`}
                  >
                    <span className="text-base mb-1">{preset.icon}</span>
                    <span className="text-xs font-bold leading-tight">{preset.name}</span>
                  </button>
                ))}
              </div>

              {/* Custom Category Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedPreset("custom");
                  if (!customCategory) setCustomCategory("Cybersecurity Software Startups");
                }}
                className={`mt-2 w-full p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedPreset === "custom"
                    ? "border-indigo-500 bg-indigo-50/80 text-indigo-950 ring-2 ring-indigo-400/20 font-bold"
                    : "border-slate-200 hover:bg-slate-100 text-slate-600"
                }`}
              >
                ✍️ Or Type Any Custom Niche / Industry
              </button>
            </div>

            {/* Custom Category Input if selected */}
            {selectedPreset === "custom" && (
              <div className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-1.5 animate-in fade-in">
                <label className="font-bold text-indigo-900 block">Custom Category Description *</label>
                <input
                  type="text"
                  placeholder="e.g. Solar Energy Installation Companies, Luxury Interior Designers, Shopify Plus Stores"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full p-2.5 bg-white rounded-lg border border-indigo-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Target Job Titles */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                2. Target Decision-Maker Job Titles (Comma-separated)
              </label>
              <input
                type="text"
                value={titles}
                onChange={(e) => setTitles(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-indigo-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                placeholder="e.g. Founder, CEO, Agency Owner, Managing Broker"
              />
            </div>

            {/* Geography & Count Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">3. Target Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-indigo-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="United States">United States (Default)</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany & DACH">Germany &amp; DACH</option>
                  <option value="Worldwide">Worldwide / Remote</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">4. How Many Leads to Source?</label>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 3, 5].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setLeadCount(count)}
                      className={`p-2.5 rounded-xl text-center font-bold border transition-colors cursor-pointer ${
                        leadCount === count
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {count} Leads
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Auto Dispatch Toggle */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-950 block">⚡ Auto-Qualify &amp; HeyReach Dispatch</span>
                <span className="text-[11px] text-emerald-700">
                  Agent will score each lead with Gemini AI and queue in HeyReach automatically.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoDispatch}
                onChange={(e) => setAutoDispatch(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 cursor-pointer"
              />
            </div>

            {statusMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
                {statusMessage}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-indigo-50">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLaunchDiscovery}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-bold shadow-md hover:shadow-indigo-500/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "AI Sourcing & Evaluating..." : "🚀 Launch Targeted AI Discovery"}
              </button>
            </div>
          </>
        ) : (
          /* Real-Time Results Preview */
          <div className="space-y-4 animate-in fade-in">
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{statusMessage}</span>
              </div>
              <span className="text-[11px] bg-emerald-200/70 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                {results.length} Leads
              </span>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {results.map((lead, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        {lead.name}
                        <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-bold">
                          {lead.category || "Targeted"}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">
                        {lead.title} @ <span className="font-bold text-slate-800">{lead.company}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>📍 {lead.location}</span>
                        <span>🏢 {lead.companySize}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg inline-block">
                        {lead.score}/100 Match
                      </span>
                    </div>
                  </div>

                  {lead.explanation && (
                    <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                      💡 <strong>AI Fit:</strong> {lead.explanation}
                    </p>
                  )}

                  {lead.draft && (
                    <div className="bg-indigo-50/70 border border-indigo-100/80 p-2.5 rounded-lg space-y-1">
                      <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wide block">
                        Tailored Connection Note ({lead.draft.length} chars):
                      </span>
                      <p className="text-xs text-indigo-950 font-medium italic">"{lead.draft}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-indigo-50 flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
              >
                ← Search Another Category
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Done / View in Leads Table
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
