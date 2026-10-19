export type LeadStatus =
  | "new"
  | "qualified"
  | "contacted"
  | "replied"
  | "converted"
  | "unqualified"
  | "suppressed";

export interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  companySize: string;
  industry: string;
  location: string;
  linkedinUrl: string;
  avatarUrl?: string;
  status: LeadStatus;
  aiScore: number; // 0 - 100
  aiScoreExplanation: string;
  tags: string[];
  connectionNoteDraft: string;
  followUpDraft: string;
  source: "csv_import" | "manual" | "heyreach_sync";
  isDuplicate: boolean;
  suppressed: boolean;
  campaignId?: string;
  campaignName?: string;
  lastActivityAt: string;
  createdAt: string;
}

export type CampaignStatus = "active" | "draft" | "paused" | "completed";

export interface CampaignStep {
  stepNumber: number;
  type: "connection_request" | "followup_message" | "inmail_message";
  delayDays: number;
  template: string;
  aiPersonalizationEnabled: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  targetAudience: string;
  dailyLimit: number;
  totalLeads: number;
  sentCount: number;
  acceptedCount: number;
  repliedCount: number;
  positiveReplies: number;
  steps: CampaignStep[];
  heyreachCampaignId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalItem {
  id: string;
  leadId: string;
  leadName: string;
  leadTitle: string;
  leadCompany: string;
  leadAvatarUrl?: string;
  campaignId: string;
  campaignName: string;
  stepType: "connection_note" | "first_followup" | "second_followup";
  draftText: string;
  editedText?: string;
  aiRationale: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export type ReplyClassification =
  | "interested"
  | "meeting_request"
  | "question"
  | "not_interested"
  | "out_of_office"
  | "other";

export interface MessageThreadItem {
  id: string;
  sender: "agent" | "lead";
  senderName: string;
  text: string;
  timestamp: string;
}

export interface InboxReply {
  id: string;
  leadId: string;
  leadName: string;
  leadTitle: string;
  leadCompany: string;
  leadAvatarUrl?: string;
  campaignName: string;
  lastMessageSnippet: string;
  receivedAt: string;
  classification: ReplyClassification;
  classificationConfidence: number; // 0 - 100
  classificationReason: string;
  aiSuggestedResponse: string;
  responseStatus: "draft" | "approved" | "sent" | "dismissed";
  unread: boolean;
  threadHistory: MessageThreadItem[];
}

export type FollowUpStatus =
  | "scheduled"
  | "cancelled_replied"
  | "cancelled_optout"
  | "cancelled_campaign_stop"
  | "completed";

export interface FollowUpTask {
  id: string;
  leadId: string;
  leadName: string;
  leadCompany: string;
  leadTitle: string;
  campaignName: string;
  sequenceStep: number;
  scheduledFor: string;
  status: FollowUpStatus;
  cancellationReason?: string;
  messagePreview: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  category:
    | "ai_qualification"
    | "human_approval"
    | "heyreach_sync"
    | "campaign_update"
    | "safety_block"
    | "reply_ingested"
    | "system";
  severity: "info" | "success" | "warning" | "error";
  title: string;
  description: string;
  entityId?: string;
}

export interface SuppressionEntry {
  id: string;
  type: "domain" | "linkedin_url" | "company";
  value: string;
  reason: string;
  addedBy: string;
  addedAt: string;
}

export interface IcpSettings {
  targetJobTitles: string[];
  targetIndustries: string[];
  companySizes: string[];
  minScoreThreshold: number;
  requireHumanApproval: boolean;
  prohibitedKeywords: string[];
  qualificationPromptRule: string;
}

export interface IntegrationStatus {
  heyreach: {
    connected: boolean;
    authMethod: "Api-Key Header";
    maskedKey: string;
    verifiedEndpoints: string[];
    rateLimitRemaining: number;
    rateLimitTotal: number;
    lastSyncAt: string;
  };
  gemini: {
    connected: boolean;
    model: string;
    tier: "Free Tier";
    rpmLimit: number;
    rpdLimit: number;
    status: "Healthy";
    lastPingAt: string;
  };
  firebase: {
    authConnected: boolean;
    firestoreConnected: boolean;
    projectId: string;
    adminSdkActive: boolean;
  };
}
