"use client";

import React, { useState } from "react";
import {
  ScrollText,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Send,
  Inbox,
  Lock,
} from "lucide-react";
import { useDemoData } from "../../context/DemoDataContext";
import { Badge } from "../ui/Badge";
import { ActivityLog } from "../../types";

export function ActivityLogs() {
  const { activityLogs } = useDemoData();
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.title.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.category.toLowerCase().includes(search.toLowerCase());

    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  const severityBadges: Record<
    string,
    { variant: "primary" | "success" | "warning" | "danger"; label: string }
  > = {
    info: { variant: "primary", label: "INFO" },
    success: { variant: "success", label: "SUCCESS" },
    warning: { variant: "warning", label: "WARNING" },
    error: { variant: "danger", label: "SAFETY BLOCK" },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-indigo-100/70 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Security &amp; Activity Audit Log
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Immutable system audit log tracking AI evaluations, human sign-offs, HeyReach sync cycles, and safety blocks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" dot>
            Tamper-Resistant Logging Active
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-indigo-100/70 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400" />
          <input
            type="text"
            placeholder="Search audit trail by action, prospect, or detail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/80 border border-indigo-100/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/90"
          />
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3.5 py-2 bg-slate-50/80 border border-indigo-100/80 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
        >
          <option value="all">All Severities</option>
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Safety Block</option>
        </select>
      </div>

      {/* Log Feed */}
      <div className="bg-white/80 backdrop-blur-md border border-indigo-100/70 rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-indigo-50/60">
          {filteredLogs.map((log) => {
            const badge = severityBadges[log.severity] || { variant: "primary", label: log.severity };

            return (
              <div
                key={log.id}
                className="p-4 hover:bg-indigo-50/20 transition-colors flex items-start gap-3.5"
              >
                <div className="pt-0.5">
                  <Badge variant={badge.variant} size="sm">
                    {badge.label}
                  </Badge>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900">{log.title}</h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-sans">
                    {log.description}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="font-mono bg-indigo-50/60 text-indigo-800 border border-indigo-100/60 px-2 py-0.5 rounded-md font-medium">
                      Category: {log.category}
                    </span>
                    {log.entityId && (
                      <span className="font-mono text-slate-500">
                        Ref: {log.entityId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3.5 bg-slate-50/70 border-t border-indigo-50 text-xs text-slate-500 flex items-center justify-between">
          <span>All system events are logged server-side for compliance.</span>
          <span className="font-mono text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">Total Entries: {activityLogs.length}</span>
        </div>
      </div>
    </div>
  );
}
