"use client";

import React, { useState } from "react";
import {
  Inbox,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldAlert,
  User,
  Bot,
  Calendar,
  Search,
} from "lucide-react";
import { useDemoData } from "../../context/DemoDataContext";
import { InboxReply, ReplyClassification } from "../../types";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";

export function InboxManagement() {
  const { replies, sendReplyResponse, markReplyRead, classifyReplyWithAi } = useDemoData();
  const [selectedReplyId, setSelectedReplyId] = useState<string>(replies[0]?.id || "");
  const [classificationFilter, setClassificationFilter] = useState<string>("all");
  const [responseText, setResponseText] = useState("");
  const [search, setSearch] = useState("");
  const [isClassifying, setIsClassifying] = useState(false);

  const filteredReplies = replies.filter((reply) => {
    const matchesFilter =
      classificationFilter === "all" || reply.classification === classificationFilter;
    const matchesSearch =
      reply.leadName.toLowerCase().includes(search.toLowerCase()) ||
      reply.leadCompany.toLowerCase().includes(search.toLowerCase()) ||
      reply.lastMessageSnippet.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const selectedReply =
    replies.find((r) => r.id === selectedReplyId) || filteredReplies[0] || null;

  const handleSelectReply = (reply: InboxReply) => {
    setSelectedReplyId(reply.id);
    markReplyRead(reply.id);
    setResponseText(reply.aiSuggestedResponse);
  };

  const handleSend = () => {
    if (!selectedReply || !responseText.trim()) return;
    sendReplyResponse(selectedReply.id, responseText.trim());
  };

  const handleReclassify = async () => {
    if (!selectedReply) return;
    setIsClassifying(true);
    const res = await classifyReplyWithAi(selectedReply.id);
    if (res?.success && res.result) {
      setResponseText(res.result.suggestedResponse);
    }
    setIsClassifying(false);
  };

  const classificationConfig: Record<
    ReplyClassification,
    { label: string; variant: "success" | "primary" | "warning" | "danger" | "purple" | "default" }
  > = {
    interested: { label: "Interested", variant: "success" },
    meeting_request: { label: "Meeting Request", variant: "success" },
    question: { label: "Question", variant: "primary" },
    not_interested: { label: "Not Interested", variant: "danger" },
    out_of_office: { label: "Out of Office", variant: "warning" },
    other: { label: "Other", variant: "default" },
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-indigo-100/70 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Inbox &amp; Reply Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Inbound prospect responses ingested and classified automatically by Google Gemini AI with recommended next steps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" dot>
            Gemini Intent Classifier Active
          </Badge>
        </div>
      </div>

      {/* Main Master-Detail Layout */}
      <div className="bg-white/80 backdrop-blur-md border border-indigo-100/70 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        {/* Left Column: Reply List (5 cols) */}
        <div className="lg:col-span-5 border-r border-indigo-100/70 flex flex-col">
          {/* Search & Filter Header */}
          <div className="p-4 border-b border-indigo-100/70 space-y-2.5 bg-indigo-50/20">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400" />
              <input
                type="text"
                placeholder="Search replies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white/90 border border-indigo-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {["all", "meeting_request", "question", "interested", "not_interested", "out_of_office"].map(
                (filterKey) => (
                  <button
                    key={filterKey}
                    onClick={() => setClassificationFilter(filterKey)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      classificationFilter === filterKey
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-white/90 text-slate-600 hover:bg-indigo-50 border border-indigo-100/70"
                    }`}
                  >
                    {filterKey.replace("_", " ").toUpperCase()}
                  </button>
                )
              )}
            </div>
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-indigo-50/60 max-h-[550px]">
            {filteredReplies.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No conversations matching this filter.
              </div>
            ) : (
              filteredReplies.map((reply) => {
                const isSelected = selectedReply?.id === reply.id;
                const config = classificationConfig[reply.classification] || {
                  label: reply.classification,
                  variant: "default",
                };

                return (
                  <div
                    key={reply.id}
                    onClick={() => handleSelectReply(reply)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-indigo-50/70 border-l-4 border-indigo-600"
                        : "hover:bg-indigo-50/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {reply.leadName}
                        </span>
                        {reply.unread && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                        )}
                      </div>
                      <Badge variant={config.variant} size="sm" dot>
                        {config.label}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mb-1">
                      {reply.leadTitle} &bull; {reply.leadCompany}
                    </p>

                    <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                      &ldquo;{reply.lastMessageSnippet}&rdquo;
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                      <span className="font-mono text-slate-500">
                        {new Date(reply.receivedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center gap-1 text-sky-700 font-medium">
                        <Sparkles className="w-2.5 h-2.5" />
                        {reply.classificationConfidence}% AI Match
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Thread & Suggested Response (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/30">
          {selectedReply ? (
            <>
              {/* Thread Header */}
              <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedReply.leadName}</h3>
                  <p className="text-xs text-slate-500">
                    {selectedReply.leadTitle} at{" "}
                    <span className="font-semibold text-slate-700">{selectedReply.leadCompany}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      classificationConfig[selectedReply.classification]?.variant || "default"
                    }
                    size="md"
                    dot
                  >
                    {classificationConfig[selectedReply.classification]?.label}
                  </Badge>
                </div>
              </div>

              {/* Classification Explanation Box */}
              <div className="m-4 p-3.5 bg-gradient-to-r from-indigo-50/90 to-emerald-50/50 border border-indigo-100/80 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center gap-1.5 text-indigo-950 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Gemini Classification Rationale
                  </span>
                  <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 font-bold">
                    Confidence: {selectedReply.classificationConfidence}%
                  </span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed font-sans">
                  {selectedReply.classificationReason}
                </p>
              </div>

              {/* Message History Stream */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[350px]">
                {selectedReply.threadHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === "agent" ? "items-end" : "items-start"
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 mb-0.5 px-1 font-medium">
                      {msg.senderName} &bull;{" "}
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <div
                      className={`max-w-lg p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === "agent"
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none shadow-sm"
                          : "bg-white border border-slate-200/80 text-slate-800 rounded-tl-none shadow-xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Suggested Response Box */}
              <div className="p-4 bg-white/90 border-t border-indigo-100/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Gemini AI Suggested Reply</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReclassify}
                      disabled={isClassifying}
                      className="text-[11px] text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 disabled:opacity-50 transition-colors cursor-pointer"
                      title="Re-run Gemini classification and draft generation"
                    >
                      <Sparkles className={`w-3 h-3 ${isClassifying ? "animate-spin" : ""}`} />
                      {isClassifying ? "Classifying..." : "Re-evaluate with Gemini"}
                    </button>
                    <span className="text-slate-300 text-xs">|</span>
                    <button
                      onClick={() => setResponseText(selectedReply.aiSuggestedResponse)}
                      className="text-[11px] text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={responseText || selectedReply.aiSuggestedResponse}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Review or customize suggested response..."
                  className="w-full text-xs p-3 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/70 focus:bg-white text-slate-800 leading-relaxed font-sans"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Status:{" "}
                    <span className="font-bold text-indigo-700 uppercase">
                      {selectedReply.responseStatus}
                    </span>
                  </span>
                  <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Reply
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <EmptyState
                icon={Inbox}
                title="No Conversation Selected"
                description="Click on any prospect reply from the left panel to inspect the conversation and AI recommendations."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
