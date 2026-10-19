"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Send,
  ShieldAlert,
  Inbox,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Bot,
} from "lucide-react";
import { useDemoData } from "../../context/DemoDataContext";
import { MetricCard } from "../ui/MetricCard";
import { Badge } from "../ui/Badge";

export function DashboardOverview() {
  const { leads, campaigns, approvals, replies, followUps, activityLogs, approveItem, rejectItem } =
    useDemoData();

  // Aggregate numbers
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter((l) => l.status === "qualified" || l.aiScore >= 75).length;
  const activeCampaigns = campaigns.filter((c) => c.status === "active");

  const totalSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0);
  const totalAccepted = campaigns.reduce((acc, c) => acc + c.acceptedCount, 0);
  const totalReplied = campaigns.reduce((acc, c) => acc + c.repliedCount, 0);
  const totalPositive = campaigns.reduce((acc, c) => acc + c.positiveReplies, 0);

  const acceptanceRate = totalSent > 0 ? ((totalAccepted / totalSent) * 100).toFixed(1) : "0";
  const replyRate = totalAccepted > 0 ? ((totalReplied / totalAccepted) * 100).toFixed(1) : "0";
  const positiveRate = totalReplied > 0 ? ((totalPositive / totalReplied) * 100).toFixed(1) : "0";

  const pendingApprovals = approvals.filter((a) => a.status === "pending");
  const dueFollowUps = followUps.filter((f) => f.status === "scheduled");

  return (
    <div className="space-y-6">
      {/* Welcome & System Summary Bar */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-7 shadow-xl border border-indigo-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              LinkedIn AI Outreach Command Center
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Autonomous Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            Zero-touch prospect discovery and personalized outreach powered by <span className="text-indigo-300 font-semibold">Google Gemini AI</span> &amp; <span className="text-emerald-400 font-semibold">HeyReach Engine</span>. Safe LinkedIn pacing with automated follow-ups.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Link
            href="/leads"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Users className="w-4 h-4 text-indigo-100" />
            Manage Leads
          </Link>
          <Link
            href="/approvals"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
          >
            <ShieldAlert className="w-4 h-4 text-emerald-100" />
            Review Queue ({pendingApprovals.length})
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Pipeline Leads"
          value={totalLeads}
          change={`+${qualifiedLeads} Qualified by AI`}
          changeType="positive"
          subtitle="ICP Score ≥ 75"
          icon={Users}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <MetricCard
          title="Active Campaigns"
          value={activeCampaigns.length}
          change={`${totalSent} Invitations Dispatched`}
          changeType="neutral"
          subtitle="Via HeyReach API"
          icon={Send}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <MetricCard
          title="Connection Rate"
          value={`${acceptanceRate}%`}
          change={`${totalAccepted} Accepted Connections`}
          changeType="positive"
          subtitle="Industry avg ~28%"
          icon={TrendingUp}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <MetricCard
          title="Positive Reply Rate"
          value={`${positiveRate}%`}
          change={`${totalPositive} Meetings / Demos`}
          changeType="positive"
          subtitle={`${totalReplied} total replies`}
          icon={Inbox}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
      </div>

      {/* Second Row: Urgent Approvals Queue & Active Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Urgent Human Approval Queue Preview */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-md border border-indigo-100/70 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-indigo-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Human Sign-Off Required
                </h3>
                <p className="text-xs text-slate-500">
                  AI-drafted notes awaiting your validation prior to LinkedIn dispatch
                </p>
              </div>
            </div>
            <Link
              href="/approvals"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
            >
              View All ({pendingApprovals.length})
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="p-5 space-y-4">
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                No pending approvals! All generated outreach messages are vetted.
              </div>
            ) : (
              pendingApprovals.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-indigo-100/80 bg-white/90 hover:bg-indigo-50/30 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {item.leadName} &bull;{" "}
                        <span className="font-normal text-slate-600">
                          {item.leadTitle} at {item.leadCompany}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Campaign: <span className="font-medium text-indigo-700">{item.campaignName}</span>
                      </p>
                    </div>
                    <Badge variant="warning">
                      {item.stepType.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>

                  {/* AI Note Content */}
                  <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200/60 text-xs text-slate-700 font-sans leading-relaxed">
                    &ldquo;{item.draftText}&rdquo;
                  </div>

                  {/* Rationale & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate max-w-sm">{item.aiRationale}</span>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => rejectItem(item.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approveItem(item.id)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg shadow-sm transition-all"
                      >
                        Approve &amp; Queue
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-5 py-3 bg-slate-50/70 border-t border-indigo-50 text-slate-500 text-[11px] flex items-center justify-between">
            <span>Safety Rule: No message is dispatched without human approval mode in test state.</span>
            <span className="text-emerald-600 font-medium font-mono text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">HeyReach Guard Active</span>
          </div>
        </div>

        {/* Right Col: Conversion Funnel & Reply Sentiment Breakdown */}
        <div className="bg-white/80 backdrop-blur-md border border-indigo-100/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Campaign Outreach Funnel</h3>
              <Badge variant="outline">Live Aggregates</Badge>
            </div>

            <div className="space-y-3.5">
              {/* Step 1: Sent */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Invites Dispatched</span>
                  <span className="font-bold text-slate-900">{totalSent}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-500 h-2 rounded-full w-full" />
                </div>
              </div>

              {/* Step 2: Accepted */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Accepted Connections</span>
                  <span className="font-bold text-slate-900">
                    {totalAccepted} <span className="text-slate-400 font-normal">({acceptanceRate}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${Math.min(Number(acceptanceRate), 100)}%` }}
                  />
                </div>
              </div>

              {/* Step 3: Replied */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Responses Received</span>
                  <span className="font-bold text-slate-900">
                    {totalReplied} <span className="text-slate-400 font-normal">({replyRate}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{ width: `${Math.min(Number(replyRate), 100)}%` }}
                  />
                </div>
              </div>

              {/* Step 4: Positive Meetings */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Positive / Meeting Requests</span>
                  <span className="font-bold text-emerald-600">
                    {totalPositive} <span className="text-slate-400 font-normal">({positiveRate}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${Math.min(Number(positiveRate), 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Inbound Classification Summary */}
            <div className="mt-6 pt-5 border-t border-indigo-50">
              <h4 className="text-xs font-semibold text-slate-800 mb-2.5">
                Gemini Inbound Sentiment Classification
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-100 text-emerald-950">
                  <span className="block text-[10px] uppercase font-bold text-emerald-600">
                    Meetings / Interest
                  </span>
                  <span className="text-base font-black">{totalPositive} Leads</span>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-950">
                  <span className="block text-[10px] uppercase font-bold text-indigo-600">
                    Technical Questions
                  </span>
                  <span className="text-base font-black">3 Inquiries</span>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/analytics"
            className="mt-4 pt-3 border-t border-indigo-50 flex items-center justify-between text-xs font-semibold text-indigo-600 hover:text-indigo-700 group"
          >
            <span>View Complete Conversion Analytics</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Third Row: Recent Inbound Replies & System Activity Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inbound Replies */}
        <div className="bg-white/80 backdrop-blur-md border border-indigo-100/70 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
          <div className="p-5 border-b border-indigo-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                <Inbox className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Recent Prospect Replies</h3>
            </div>
            <Link
              href="/inbox"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
            >
              Open Inbox
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="divide-y divide-indigo-50/60">
            {replies.slice(0, 3).map((reply) => {
              const classificationBadges: Record<string, { variant: "success" | "primary" | "danger" | "warning"; label: string }> = {
                meeting_request: { variant: "success", label: "Meeting Request" },
                question: { variant: "primary", label: "Product Question" },
                interested: { variant: "success", label: "Interested" },
                not_interested: { variant: "danger", label: "Not Interested" },
                out_of_office: { variant: "warning", label: "Out of Office" },
                other: { variant: "primary", label: "Other" },
              };

              const badgeInfo = classificationBadges[reply.classification] || {
                variant: "primary",
                label: reply.classification,
              };

              return (
                <div key={reply.id} className="p-4 hover:bg-indigo-50/20 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">
                      {reply.leadName} &bull;{" "}
                      <span className="text-slate-500 font-normal">{reply.leadCompany}</span>
                    </span>
                    <Badge variant={badgeInfo.variant} dot>
                      {badgeInfo.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/60 mb-2">
                    &ldquo;{reply.lastMessageSnippet}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      Gemini confidence: <span className="font-semibold text-indigo-700">{reply.classificationConfidence}%</span>
                    </span>
                    <Link
                      href="/inbox"
                      className="text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1 group"
                    >
                      Draft response
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Safety & Audit Activity Logs */}
        <div className="bg-white/80 backdrop-blur-md border border-indigo-100/70 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-indigo-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                  <Bot className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">System Safety &amp; Audit Trail</h3>
              </div>
              <Link
                href="/activity"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
              >
                Full Logs
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="p-4 space-y-2.5">
              {activityLogs.slice(0, 4).map((log) => {
                const severityColors = {
                  info: "bg-indigo-50 text-indigo-700 border-indigo-200",
                  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
                  warning: "bg-amber-50 text-amber-700 border-amber-200",
                  error: "bg-rose-50 text-rose-700 border-rose-200",
                };

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-indigo-50/80 bg-white/60 hover:bg-indigo-50/30 transition-all"
                  >
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase shrink-0 border ${
                        severityColors[log.severity]
                      }`}
                    >
                      {log.severity}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{log.title}</p>
                      <p className="text-[11px] text-slate-500 leading-tight">{log.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-slate-50/70 border-t border-indigo-50 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Automated opt-outs and suppression triggers logged in real time.</span>
            <span className="font-mono text-emerald-600 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Audit Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
