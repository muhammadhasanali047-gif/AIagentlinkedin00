import React from "react";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { useDemoData } from "../../context/DemoDataContext";

export function DemoBanner() {
  const { isDemoMode } = useDemoData();

  if (!isDemoMode) return null;

  return (
    <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white text-xs py-2 px-4 border-b border-indigo-500/20 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
      <div className="flex items-center gap-2 max-w-4xl">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-bold text-emerald-400">DEMO MODE ACTIVE:</span>
        <span className="text-slate-300 hidden sm:inline">
          Showing realistic simulation data. Live HeyReach dispatches &amp; LinkedIn messaging are verified safe.
        </span>
        <span className="text-slate-300 sm:hidden">Simulated demo mode (Phase 1)</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Safety Enforced
        </span>
      </div>
    </div>
  );
}
