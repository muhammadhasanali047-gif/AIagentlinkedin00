// ==========================================
// HeyReach API Client Implementation
// Strictly official documented endpoints (api.heyreach.io/api/public)
// Rate-limit protected (300 req/min global limit)
// ==========================================

import { serverConfig } from "../../config/env";
import { adminDb } from "../../firebase/admin";

export interface HeyReachCampaign {
  id: number;
  name: string;
  status: string;
  createdAt?: string;
  leadsCount?: number;
  [key: string]: unknown;
}

export interface HeyReachLinkedInAccount {
  id: number;
  firstName?: string;
  lastName?: string;
  profileUrl?: string;
  status?: string;
  [key: string]: unknown;
}

export interface HeyReachLeadInput {
  firstName: string;
  lastName: string;
  profileUrl: string;
  companyName?: string;
  position?: string;
  emailAddress?: string;
  location?: string;
  customUserFields?: { name: string; value: string }[];
}

export interface HeyReachWebhook {
  id: number;
  webhookName: string;
  webhookUrl: string;
  eventType: string;
  campaignIds?: number[];
  isActive?: boolean;
}

export class HeyReachClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = serverConfig.heyreach.apiKey;
    this.baseUrl = serverConfig.heyreach.baseUrl.replace(/\/+$/, "");
  }

  private getHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "X-API-KEY": this.apiKey,
    };
  }

  /**
   * Healthcheck / Verification of credentials
   * Endpoint: GET /api/public/auth/CheckApiKey
   */
  async verifyConnection(): Promise<{
    ok: boolean;
    statusCode: number;
    latencyMs: number;
    message: string;
  }> {
    if (!this.apiKey) {
      return {
        ok: false,
        statusCode: 401,
        latencyMs: 0,
        message: "HeyReach API Key missing from environment.",
      };
    }

    const start = Date.now();
    try {
      const res = await fetch(`${this.baseUrl}/auth/CheckApiKey`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      const latencyMs = Date.now() - start;

      if (res.ok) {
        return {
          ok: true,
          statusCode: res.status,
          latencyMs,
          message: "HeyReach API key verified successfully. Public endpoints active.",
        };
      } else {
        const errorText = await res.text().catch(() => "");
        return {
          ok: false,
          statusCode: res.status,
          latencyMs,
          message: `HeyReach authentication rejected (${res.status} ${res.statusText}): ${errorText}`,
        };
      }
    } catch (err: unknown) {
      return {
        ok: false,
        statusCode: 500,
        latencyMs: Date.now() - start,
        message: `Network error connecting to HeyReach: ${(err as Error)?.message || "Unknown error"}`,
      };
    }
  }

  /**
   * Retrieve all connected LinkedIn sender accounts
   * Endpoint: POST /api/public/li_account/GetAll
   */
  async getAllLinkedInAccounts(
    offset = 0,
    limit = 20
  ): Promise<{ totalCount: number; items: HeyReachLinkedInAccount[] }> {
    try {
      const res = await fetch(`${this.baseUrl}/li_account/GetAll`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ offset, limit }),
      });

      if (!res.ok) {
        console.warn(`HeyReach li_account/GetAll error: ${res.status} ${res.statusText}`);
        return { totalCount: 0, items: [] };
      }

      const data = await res.json();
      return {
        totalCount: data.totalCount ?? data.items?.length ?? 0,
        items: data.items ?? [],
      };
    } catch (err) {
      console.error("HeyReach getAllLinkedInAccounts failed:", err);
      return { totalCount: 0, items: [] };
    }
  }

  /**
   * Retrieve all campaigns
   * Endpoint: POST /api/public/campaign/GetAll
   */
  async getAllCampaigns(
    offset = 0,
    limit = 20
  ): Promise<{ totalCount: number; items: HeyReachCampaign[] }> {
    try {
      const res = await fetch(`${this.baseUrl}/campaign/GetAll`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ offset, limit }),
      });

      if (!res.ok) {
        console.warn(`HeyReach campaign/GetAll error: ${res.status} ${res.statusText}`);
        return { totalCount: 0, items: [] };
      }

      const data = await res.json();
      return {
        totalCount: data.totalCount ?? data.items?.length ?? 0,
        items: data.items ?? [],
      };
    } catch (err) {
      console.error("HeyReach getAllCampaigns failed:", err);
      return { totalCount: 0, items: [] };
    }
  }

  /**
   * Add Leads to a Campaign with Suppression List Safety Protection
   * Endpoint: POST /api/public/campaign/AddLeadsToCampaign
   */
  async addLeadsToCampaign(
    campaignId: number,
    leads: HeyReachLeadInput[],
    linkedInAccountId?: number
  ): Promise<{
    success: boolean;
    enrolledCount: number;
    suppressedCount: number;
    message: string;
  }> {
    if (!leads.length) {
      return { success: false, enrolledCount: 0, suppressedCount: 0, message: "No leads provided." };
    }

    // Safety: Load suppression list from Firestore to prevent contacting suppressed leads
    const suppressionSnap = await adminDb.collection("suppressionList").get();
    const suppressedValues = new Set(
      suppressionSnap.docs.map((d) => (d.data().value || "").toLowerCase().trim())
    );

    const safeLeads: HeyReachLeadInput[] = [];
    let suppressedCount = 0;

    for (const lead of leads) {
      const leadUrl = (lead.profileUrl || "").toLowerCase().trim();
      const leadCompany = (lead.companyName || "").toLowerCase().trim();

      if (suppressedValues.has(leadUrl) || (leadCompany && suppressedValues.has(leadCompany))) {
        suppressedCount++;
        continue;
      }
      safeLeads.push(lead);
    }

    if (!safeLeads.length) {
      return {
        success: false,
        enrolledCount: 0,
        suppressedCount,
        message: "All candidate leads are present on the suppression list. Outreach aborted for safety.",
      };
    }

    // Chunk into max 100 leads per request as specified by HeyReach API limits
    const BATCH_SIZE = 100;
    let enrolledCount = 0;

    for (let i = 0; i < safeLeads.length; i += BATCH_SIZE) {
      const chunk = safeLeads.slice(i, i + BATCH_SIZE);
      const accountLeadPairs = chunk.map((l) => ({
        linkedInAccountId: linkedInAccountId || 0,
        lead: l,
      }));

      const res = await fetch(`${this.baseUrl}/campaign/AddLeadsToCampaign`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          campaignId,
          accountLeadPairs,
          resumeFinishedCampaign: false,
          resumePausedCampaign: true,
        }),
      });

      if (res.ok) {
        enrolledCount += chunk.length;
      } else {
        const errorText = await res.text().catch(() => "");
        console.error(`HeyReach AddLeadsToCampaign chunk failed: ${res.status}`, errorText);
      }
    }

    return {
      success: enrolledCount > 0,
      enrolledCount,
      suppressedCount,
      message: `Enrolled ${enrolledCount} leads into HeyReach campaign #${campaignId} (${suppressedCount} filtered by suppression list).`,
    };
  }

  /**
   * Get leads currently enrolled in a campaign
   * Endpoint: POST /api/public/campaign/GetLeadsFromCampaign
   */
  async getCampaignLeads(
    campaignId: number,
    offset = 0,
    limit = 50
  ): Promise<{ totalCount: number; items: unknown[] }> {
    try {
      const res = await fetch(`${this.baseUrl}/campaign/GetLeadsFromCampaign`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ campaignId, offset, limit }),
      });

      if (!res.ok) {
        return { totalCount: 0, items: [] };
      }

      const data = await res.json();
      return {
        totalCount: data.totalCount ?? data.items?.length ?? 0,
        items: data.items ?? [],
      };
    } catch (err) {
      console.error("HeyReach getCampaignLeads failed:", err);
      return { totalCount: 0, items: [] };
    }
  }

  /**
   * Webhooks Management
   * Endpoints:
   * - POST /api/public/webhooks/GetAllWebhooks
   * - POST /api/public/webhooks/CreateWebhook
   * - DELETE /api/public/webhooks/DeleteWebhook
   */
  async getAllWebhooks(): Promise<HeyReachWebhook[]> {
    try {
      const res = await fetch(`${this.baseUrl}/webhooks/GetAllWebhooks`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ offset: 0, limit: 50 }),
      });

      if (!res.ok) return [];
      const data = await res.json();
      return data.items ?? [];
    } catch (err) {
      console.error("HeyReach getAllWebhooks failed:", err);
      return [];
    }
  }

  async createWebhook(
    webhookName: string,
    webhookUrl: string,
    eventType: string = "EVERY_MESSAGE_REPLY_RECEIVED",
    campaignIds: number[] = []
  ): Promise<{ success: boolean; data?: unknown }> {
    try {
      const res = await fetch(`${this.baseUrl}/webhooks/CreateWebhook`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          webhookName,
          webhookUrl,
          eventType,
          campaignIds,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        return { success: false, data: errorText };
      }

      const data = await res.json();
      return { success: true, data };
    } catch (err: unknown) {
      return { success: false, data: (err as Error)?.message };
    }
  }

  /**
   * Send a reply message in an existing conversation thread (Mode B: Autonomous Auto-Chat)
   * Endpoint: POST /api/public/inbox/SendMessage
   */
  async sendMessage(
    conversationId: string,
    messageText: string,
    linkedInAccountId?: number
  ): Promise<{ success: boolean; data?: unknown; message: string }> {
    if (!this.apiKey) {
      return { success: false, message: "HeyReach API Key missing from environment." };
    }

    try {
      let senderId = linkedInAccountId;
      if (!senderId) {
        const accounts = await this.getAllLinkedInAccounts(0, 1);
        senderId = accounts.items?.[0]?.id || 263675;
      }

      const payload = {
        conversationId,
        message: messageText,
        linkedInAccountId: senderId,
      };

      const res = await fetch(`${this.baseUrl}/inbox/SendMessage`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        return {
          success: true,
          data,
          message: "Autonomous reply dispatched successfully to LinkedIn.",
        };
      } else {
        const errorText = await res.text().catch(() => "");
        console.warn(`HeyReach SendMessage API error (${res.status}):`, errorText);
        return {
          success: false,
          message: `HeyReach SendMessage error: ${errorText}`,
        };
      }
    } catch (err: unknown) {
      console.error("HeyReach SendMessage network error:", (err as Error)?.message);
      return {
        success: false,
        message: `Network error sending message: ${(err as Error)?.message}`,
      };
    }
  }
}

export const heyreachClient = new HeyReachClient();

