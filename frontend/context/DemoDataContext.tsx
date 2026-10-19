"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Lead,
  Campaign,
  ApprovalItem,
  InboxReply,
  FollowUpTask,
  ActivityLog,
  SuppressionEntry,
  IcpSettings,
  IntegrationStatus,
} from "../types";
import {
  INITIAL_LEADS,
  INITIAL_CAMPAIGNS,
  INITIAL_APPROVALS,
  INITIAL_REPLIES,
  INITIAL_FOLLOW_UPS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_SUPPRESSION_LIST,
  INITIAL_ICP_SETTINGS,
  INITIAL_INTEGRATION_STATUS,
} from "../mock/demoData";

interface DemoDataContextType {
  leads: Lead[];
  campaigns: Campaign[];
  approvals: ApprovalItem[];
  replies: InboxReply[];
  followUps: FollowUpTask[];
  activityLogs: ActivityLog[];
  suppressionList: SuppressionEntry[];
  icpSettings: IcpSettings;
  integrationStatus: IntegrationStatus;
  isDemoMode: boolean;
  toggleDemoMode: () => void;

  // Lead operations
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "lastActivityAt">) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  importCsvLeads: (leads: Partial<Lead>[]) => { added: number; duplicates: number };
  qualifyLeadWithAi: (leadId: string) => Promise<void>;

  // Campaign operations
  toggleCampaignStatus: (id: string) => void;
  createCampaign: (campaign: Omit<Campaign, "id" | "createdAt" | "updatedAt" | "sentCount" | "acceptedCount" | "repliedCount" | "positiveReplies">) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;

  // Approvals operations
  approveItem: (id: string, editedText?: string) => void;
  rejectItem: (id: string) => void;

  // Inbox & Replies operations
  sendReplyResponse: (replyId: string, responseText: string) => void;
  markReplyRead: (replyId: string) => void;
  classifyReplyWithAi: (replyId: string) => Promise<{ success: boolean; result?: any }>;

  // Follow-up operations
  completeFollowUp: (id: string) => void;
  cancelFollowUp: (id: string, reason: string) => void;

  // Suppression list operations
  addSuppressionEntry: (entry: Omit<SuppressionEntry, "id" | "addedAt">) => void;
  removeSuppressionEntry: (id: string) => void;

  // Settings
  updateIcpSettings: (settings: Partial<IcpSettings>) => void;
  testHeyReachConnection: () => Promise<{ success: boolean; latencyMs: number; message: string }>;
}

const DemoDataContext = createContext<DemoDataContextType | undefined>(undefined);

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [replies, setReplies] = useState<InboxReply[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpTask[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [suppressionList, setSuppressionList] = useState<SuppressionEntry[]>([]);
  const [icpSettings, setIcpSettings] = useState<IcpSettings>(INITIAL_ICP_SETTINGS);
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus>(INITIAL_INTEGRATION_STATUS);

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => {
      const next = !prev;
      if (next) {
        setLeads(INITIAL_LEADS);
        setCampaigns(INITIAL_CAMPAIGNS);
        setApprovals(INITIAL_APPROVALS);
        setReplies(INITIAL_REPLIES);
        setFollowUps(INITIAL_FOLLOW_UPS);
      } else {
        setLeads([]);
        setApprovals([]);
        setReplies([]);
        setFollowUps([]);
        // Re-fetch live data
        fetch("/api/campaigns").then(r => r.json()).then(d => { if (d.campaigns) setCampaigns(d.campaigns); });
      }
      return next;
    });
  };

  // Load live Firestore collections on mount
  useEffect(() => {
    async function loadFirestoreData() {
      try {
        const [leadsRes, campRes, supRes, actRes] = await Promise.allSettled([
          fetch("/api/leads").then((r) => (r.ok ? r.json() : null)),
          fetch("/api/campaigns").then((r) => (r.ok ? r.json() : null)),
          fetch("/api/suppression").then((r) => (r.ok ? r.json() : null)),
          fetch("/api/activity").then((r) => (r.ok ? r.json() : null)),
        ]);

        if (leadsRes.status === "fulfilled" && leadsRes.value?.leads) {
          setLeads(leadsRes.value.leads);
        }
        if (campRes.status === "fulfilled" && campRes.value?.campaigns) {
          setCampaigns(campRes.value.campaigns);
        }
        if (supRes.status === "fulfilled" && supRes.value?.suppressionList) {
          setSuppressionList(supRes.value.suppressionList);
        }
        if (actRes.status === "fulfilled" && actRes.value?.logs) {
          setActivityLogs(actRes.value.logs);
        }
      } catch (err) {
        console.warn("Using local cached state, Firestore API not reached:", err);
      }
    }

    loadFirestoreData();

    // Auto-refresh live data every 20 seconds for seamless autonomous monitoring
    const pollInterval = setInterval(() => {
      loadFirestoreData();
    }, 20000);

    return () => clearInterval(pollInterval);
  }, []);

  // Add Lead (persists to Firestore /api/leads)
  const addLead = async (leadData: Omit<Lead, "id" | "createdAt" | "lastActivityAt">) => {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.lead) {
          setLeads((prev) => [json.lead, ...prev]);
          return;
        }
      }
    } catch {
      // Fallback local state if API fails
    }

    const fallbackLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };
    setLeads((prev) => [fallbackLead, ...prev]);
  };

  // Update Lead (persists to /api/leads/[id])
  const updateLead = async (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updates, lastActivityAt: new Date().toISOString() } : lead))
    );

    try {
      await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch {
      // Retain optimistic update
    }
  };

  // Delete Lead (persists to /api/leads/[id])
  const deleteLead = async (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    try {
      await fetch(`/api/leads/${id}`, { method: "DELETE" });
    } catch {
      // Retain optimistic delete
    }
  };

  // Import CSV with batch persistence to Firestore
  const importCsvLeads = (newItems: Partial<Lead>[]) => {
    let addedCount = 0;
    let duplicateCount = 0;
    const existingUrls = new Set(leads.map((l) => l.linkedinUrl.toLowerCase().trim()));
    const existingCompanies = new Set(suppressionList.map((s) => s.value.toLowerCase().trim()));

    const processedLeads: Lead[] = [];

    newItems.forEach((item, index) => {
      const url = (item.linkedinUrl || "").toLowerCase().trim();
      const isDup = existingUrls.has(url);
      const isSuppressed = existingCompanies.has((item.company || "").toLowerCase().trim());

      if (isDup) {
        duplicateCount++;
      } else {
        addedCount++;
        existingUrls.add(url);
        processedLeads.push({
          id: `lead-csv-${Date.now()}-${index}`,
          name: item.name || "Unknown Prospect",
          title: item.title || "Professional",
          company: item.company || "Independent",
          companySize: item.companySize || "11-50 employees",
          industry: item.industry || "Technology",
          location: item.location || "Remote",
          linkedinUrl: item.linkedinUrl || "https://linkedin.com/in/prospect",
          status: isSuppressed ? "suppressed" : "new",
          aiScore: item.aiScore ?? 78,
          aiScoreExplanation: item.aiScoreExplanation || "Preliminary CSV import evaluation.",
          tags: ["CSV Import", ...(item.tags || [])],
          connectionNoteDraft: "",
          followUpDraft: "",
          source: "csv_import",
          isDuplicate: isDup,
          suppressed: isSuppressed,
          createdAt: new Date().toISOString(),
          lastActivityAt: new Date().toISOString(),
        });
      }
    });

    setLeads((prev) => [...processedLeads, ...prev]);

    // Send batch to server Firestore API in background
    fetch("/api/leads/import-csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leads: processedLeads }),
    }).catch(() => null);

    return { added: addedCount, duplicates: duplicateCount };
  };


  // AI Qualify Lead (powered by live Gemini AI)
  const qualifyLeadWithAi = async (leadId: string): Promise<void> => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) return;

    try {
      const res = await fetch("/api/ai/qualify-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          name: targetLead.name,
          title: targetLead.title,
          company: targetLead.company,
          companySize: targetLead.companySize,
          industry: targetLead.industry,
          location: targetLead.location,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.result) {
          updateLead(leadId, {
            aiScore: json.result.score,
            aiScoreExplanation: json.result.explanation,
            connectionNoteDraft: json.result.connectionNoteDraft,
            followUpDraft: json.result.followUpDraft,
            status: json.result.passedThreshold ? "qualified" : "unqualified",
          });
          return;
        }
      }
    } catch {
      // Fallback below
    }

    // Dynamic scoring fallback
    const titleMatch = icpSettings.targetJobTitles.some((t) =>
      targetLead.title.toLowerCase().includes(t.toLowerCase())
    );
    const calculatedScore = titleMatch ? 88 : 55;

    updateLead(leadId, {
      aiScore: calculatedScore,
      aiScoreExplanation: `Role evaluated against ICP parameters. Status: ${
        calculatedScore >= icpSettings.minScoreThreshold ? "Qualified" : "Unqualified"
      }.`,
      connectionNoteDraft: `Hi ${targetLead.name.split(" ")[0]}, noticed your leadership at ${targetLead.company}. Would love to connect and follow your updates!`,
      status: calculatedScore >= icpSettings.minScoreThreshold ? "qualified" : "unqualified",
    });
  };

  // Toggle Campaign status
  const toggleCampaignStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === "active" ? "paused" : "active";
          return { ...c, status: nextStatus, updatedAt: new Date().toISOString() };
        }
        return c;
      })
    );
  };

  // Create Campaign (persists to /api/campaigns)
  const createCampaign = async (
    campaignData: Omit<Campaign, "id" | "createdAt" | "updatedAt" | "sentCount" | "acceptedCount" | "repliedCount" | "positiveReplies">
  ) => {
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.campaign) {
          setCampaigns((prev) => [json.campaign, ...prev]);
          return;
        }
      }
    } catch {
      // Fallback local state
    }

    const newCamp: Campaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      sentCount: 0,
      acceptedCount: 0,
      repliedCount: 0,
      positiveReplies: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCampaigns((prev) => [newCamp, ...prev]);
  };


  // Update Campaign
  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
  };

  // Approve item
  const approveItem = (id: string, editedText?: string) => {
    const item = approvals.find((a) => a.id === id);
    if (!item) return;

    setApprovals((prev) => prev.filter((a) => a.id !== id));

    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: "human_approval",
      severity: "success",
      title: "Message Draft Approved",
      description: `Human operator approved outreach note for ${item.leadName} (${item.leadCompany}). Ready for scheduled dispatch.`,
      entityId: item.leadId,
    };
    setActivityLogs((prev) => [log, ...prev]);
  };

  // Reject item
  const rejectItem = (id: string) => {
    const item = approvals.find((a) => a.id === id);
    if (!item) return;

    setApprovals((prev) => prev.filter((a) => a.id !== id));

    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: "human_approval",
      severity: "warning",
      title: "Message Draft Rejected",
      description: `Human operator rejected outreach draft for ${item.leadName}. Removed from dispatch queue.`,
      entityId: item.leadId,
    };
    setActivityLogs((prev) => [log, ...prev]);
  };

  // Send reply response
  const sendReplyResponse = (replyId: string, responseText: string) => {
    setReplies((prev) =>
      prev.map((r) => {
        if (r.id === replyId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            sender: "agent" as const,
            senderName: "Hassan (AI Outreach)",
            text: responseText,
            timestamp: new Date().toISOString(),
          };
          return {
            ...r,
            responseStatus: "sent",
            threadHistory: [...r.threadHistory, newMsg],
          };
        }
        return r;
      })
    );

    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: "reply_ingested",
      severity: "success",
      title: "Response Dispatched",
      description: `Dispatched approved response message to prospect thread.`,
      entityId: replyId,
    };
    setActivityLogs((prev) => [log, ...prev]);
  };

  const markReplyRead = (replyId: string) => {
    setReplies((prev) => prev.map((r) => (r.id === replyId ? { ...r, unread: false } : r)));
  };

  // Live Gemini Reply Classification
  const classifyReplyWithAi = async (replyId: string) => {
    const targetReply = replies.find((r) => r.id === replyId);
    if (!targetReply) return { success: false };

    try {
      const res = await fetch("/api/ai/classify-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          replyId,
          leadName: targetReply.leadName,
          leadTitle: targetReply.leadTitle,
          leadCompany: targetReply.leadCompany,
          incomingText: targetReply.lastMessageSnippet,
          threadHistory: targetReply.threadHistory.map((m) => ({
            sender: m.senderName,
            text: m.text,
          })),
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.result) {
          setReplies((prev) =>
            prev.map((r) =>
              r.id === replyId
                ? {
                    ...r,
                    classification: json.result.classification,
                    classificationConfidence: json.result.confidence,
                    classificationReason: json.result.reason,
                    aiSuggestedResponse: json.result.suggestedResponse,
                  }
                : r
            )
          );
          return { success: true, result: json.result };
        }
      }
    } catch (err) {
      console.warn("AI reply classification failed, retaining state:", err);
    }
    return { success: false };
  };

  // Follow-up actions
  const completeFollowUp = (id: string) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "completed" as const } : f))
    );
  };

  const cancelFollowUp = (id: string, reason: string) => {
    setFollowUps((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              status: "cancelled_replied" as const,
              cancellationReason: reason,
            }
          : f
      )
    );
  };

  // Suppression list actions (persists to /api/suppression)
  const addSuppressionEntry = async (entry: Omit<SuppressionEntry, "id" | "addedAt">) => {
    try {
      fetch("/api/suppression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      }).catch(() => null);
    } catch {
      // Optimistic update
    }

    const newEntry: SuppressionEntry = {
      ...entry,
      id: `sup-${Date.now()}`,
      addedAt: new Date().toISOString(),
    };
    setSuppressionList((prev) => [newEntry, ...prev]);

    // Mark matching leads as suppressed
    setLeads((prev) =>
      prev.map((l) => {
        if (
          (entry.type === "company" && l.company.toLowerCase().includes(entry.value.toLowerCase())) ||
          (entry.type === "linkedin_url" && l.linkedinUrl.toLowerCase().includes(entry.value.toLowerCase()))
        ) {
          return { ...l, suppressed: true, status: "suppressed" };
        }
        return l;
      })
    );
  };

  const removeSuppressionEntry = async (id: string) => {
    setSuppressionList((prev) => prev.filter((s) => s.id !== id));
    try {
      fetch(`/api/suppression?id=${id}`, { method: "DELETE" }).catch(() => null);
    } catch {
      // Optimistic delete
    }
  };

  // Settings
  const updateIcpSettings = (newSettings: Partial<IcpSettings>) => {
    setIcpSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const testHeyReachConnection = async () => {
    try {
      const res = await fetch("/api/heyreach/test-connection");
      if (res.ok) {
        const json = await res.json();
        setIntegrationStatus((prev) => ({
          ...prev,
          heyreach: {
            ...prev.heyreach,
            connected: json.success,
            lastSyncAt: new Date().toISOString(),
          },
        }));
        return {
          success: json.success,
          latencyMs: json.latencyMs || 150,
          message: json.message || "HeyReach API credentials verified successfully. Active plan endpoints accessible.",
        };
      }
    } catch (err) {
      console.warn("Live HeyReach test failed:", err);
    }

    return {
      success: false,
      latencyMs: 0,
      message: "Failed to connect to HeyReach API endpoint.",
    };
  };

  return (
    <DemoDataContext.Provider
      value={{
        leads,
        campaigns,
        approvals,
        replies,
        followUps,
        activityLogs,
        suppressionList,
        icpSettings,
        integrationStatus,
        isDemoMode,
        toggleDemoMode,
        addLead,
        updateLead,
        deleteLead,
        importCsvLeads,
        qualifyLeadWithAi,
        toggleCampaignStatus,
        createCampaign,
        updateCampaign,
        approveItem,
        rejectItem,
        sendReplyResponse,
        markReplyRead,
        classifyReplyWithAi,
        completeFollowUp,
        cancelFollowUp,
        addSuppressionEntry,
        removeSuppressionEntry,
        updateIcpSettings,
        testHeyReachConnection,
      }}
    >
      {children}
    </DemoDataContext.Provider>
  );
}

export function useDemoData() {
  const context = useContext(DemoDataContext);
  if (!context) {
    throw new Error("useDemoData must be used within a DemoDataProvider");
  }
  return context;
}
