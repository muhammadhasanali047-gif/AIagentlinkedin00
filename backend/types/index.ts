// ==========================================
// Backend Data Contracts & DTOs
// ==========================================

export interface HeyReachSyncRequest {
  campaignId?: string;
  forceSync?: boolean;
}

export interface HeyReachSyncResult {
  syncedLeadsCount: number;
  syncedRepliesCount: number;
  rateLimitRemaining: number;
  syncedAt: string;
}

export interface GeminiQualificationRequest {
  leadId: string;
  name: string;
  title: string;
  company: string;
  companySize?: string;
  industry?: string;
  location?: string;
  profileSummary?: string;
}

export interface GeminiQualificationResult {
  leadId: string;
  score: number;
  passedThreshold: boolean;
  explanation: string;
  connectionNoteDraft: string;
  followUpDraft: string;
  tokenCount: number;
}

export interface GeminiReplyClassificationRequest {
  replyId: string;
  leadName: string;
  leadTitle: string;
  leadCompany: string;
  incomingText: string;
  threadHistory: { sender: string; text: string }[];
}

export interface GeminiReplyClassificationResult {
  replyId: string;
  classification:
    | "interested"
    | "meeting_request"
    | "question"
    | "not_interested"
    | "out_of_office"
    | "other";
  confidence: number;
  reason: string;
  suggestedResponse: string;
}
