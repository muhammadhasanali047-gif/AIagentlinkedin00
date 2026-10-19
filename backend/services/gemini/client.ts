// ==========================================
// Google Gemini AI Client with Quota Governance & Fallback
// Server-side only: Uses free-tier rate limits safely
// ==========================================

import { GoogleGenerativeAI } from "@google/generative-ai";
import { serverConfig } from "../../config/env";

const CANDIDATE_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-flash-latest",
];

class GeminiQuotaTracker {
  private requestTimestamps: number[] = [];
  private dailyRequestCount: number = 0;
  private lastResetDay: number = new Date().getDate();

  // Free Tier constraints
  private readonly RPM_LIMIT = 15;
  private readonly RPD_LIMIT = 1500;

  checkAndRecord(): boolean {
    const now = Date.now();
    const currentDay = new Date().getDate();

    // Reset daily counter on day roll
    if (currentDay !== this.lastResetDay) {
      this.dailyRequestCount = 0;
      this.lastResetDay = currentDay;
    }

    // Filter requests in the last 60 seconds
    this.requestTimestamps = this.requestTimestamps.filter((t) => now - t < 60000);

    if (this.requestTimestamps.length >= this.RPM_LIMIT) {
      return false; // RPM exceeded
    }

    if (this.dailyRequestCount >= this.RPD_LIMIT) {
      return false; // RPD exceeded
    }

    this.requestTimestamps.push(now);
    this.dailyRequestCount++;
    return true;
  }

  getStats() {
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter((t) => now - t < 60000);
    return {
      currentRpm: this.requestTimestamps.length,
      maxRpm: this.RPM_LIMIT,
      currentRpd: this.dailyRequestCount,
      maxRpd: this.RPD_LIMIT,
    };
  }
}

export const quotaTracker = new GeminiQuotaTracker();

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(serverConfig.gemini.apiKey);
  }

  /**
   * Generates structured JSON with automatic model fallbacks and retry logic
   */
  async generateJson<T>(prompt: string, systemInstruction?: string): Promise<T> {
    if (!serverConfig.gemini.apiKey) {
      throw new Error("GEMINI_API_KEY is missing from environment variables.");
    }

    const quotaOk = quotaTracker.checkAndRecord();
    if (!quotaOk) {
      throw new Error(
        "Gemini free-tier quota limit reached (15 RPM or 1500 RPD). Request deferred to protect free-tier status."
      );
    }

    let lastError: Error | null = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3, // Consistent deterministic evaluations
          },
          systemInstruction: systemInstruction || undefined,
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        try {
          const parsed = JSON.parse(text) as T;
          return parsed;
        } catch {
          // Attempt markdown json block stripping
          const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
          return JSON.parse(cleaned) as T;
        }
      } catch (err: any) {
        lastError = err;
        // If 503 high demand or 404, try next candidate model
        if (err?.status === 503 || err?.status === 404) {
          continue;
        }
        throw err;
      }
    }

    throw lastError || new Error("Failed to generate response from Gemini API models.");
  }
}

export const geminiService = new GeminiService();
