// ==========================================
// Gemini Prompt Engineering & Safety Guardrails
// Strict rules: no hallucinations, character limits, deterministic scoring
// ==========================================

import { IcpSettings, Lead, ReplyClassification } from "@/frontend/types";

export interface LeadQualificationInput {
  name: string;
  title: string;
  company: string;
  companySize?: string;
  industry?: string;
  location?: string;
  icpSettings: IcpSettings;
}

export interface LeadQualificationOutput {
  score: number; // 0 - 100
  passedThreshold: boolean;
  explanation: string;
  connectionNoteDraft: string;
  followUpDraft: string;
}

export interface ReplyClassificationInput {
  leadName: string;
  leadTitle: string;
  leadCompany: string;
  incomingText: string;
  threadHistory: { sender: string; text: string }[];
}

export interface ReplyClassificationOutput {
  classification: ReplyClassification;
  confidence: number; // 0 - 100
  reason: string;
  suggestedResponse: string;
  actionRequired: "send_response" | "schedule_meeting" | "suppress_contact" | "pause_sequence" | "none";
}

export function buildLeadQualificationPrompt(input: LeadQualificationInput): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = `You are an elite B2B LinkedIn AI outreach qualification agent for an engineering & AI software firm.
Your job is to objectively score prospects against Ideal Customer Profile (ICP) criteria and compose high-converting, professional connection notes.

STRICT SAFETY & QUALITY RULES:
1. NEVER hallucinate or invent personal information, mutual friends, past meetings, or unverified claims.
2. Connection note draft MUST be UNDER 280 CHARACTERS (LinkedIn max is 300). Be concise and friendly.
3. Scoring must be an integer between 0 and 100 based strictly on title seniority, budget authority, and industry overlap.
4. If the title contains any prohibited keywords, score must be below 40.
5. Output must be strictly valid JSON matching the requested schema.`;

  const userPrompt = `Evaluate this prospect against our ICP settings:

PROSPECT PROFILE:
- Full Name: ${input.name}
- Job Title: ${input.title}
- Company: ${input.company}
- Company Size: ${input.companySize || "Unknown"}
- Industry: ${input.industry || "Technology"}
- Location: ${input.location || "Remote"}

ICP CRITERIA:
- Target Job Titles: ${input.icpSettings.targetJobTitles.join(", ")}
- Target Industries: ${input.icpSettings.targetIndustries.join(", ")}
- Target Company Sizes: ${input.icpSettings.companySizes.join(", ")}
- Minimum Score Threshold: ${input.icpSettings.minScoreThreshold}
- Prohibited Keywords: ${input.icpSettings.prohibitedKeywords.join(", ")}
- Custom ICP Rule: ${input.icpSettings.qualificationPromptRule}

RETURN THIS JSON SCHEMA:
{
  "score": <number between 0 and 100>,
  "passedThreshold": <boolean, true if score >= ${input.icpSettings.minScoreThreshold}>,
  "explanation": "<2-3 sentence clear justification of the score>",
  "connectionNoteDraft": "<Personalized peer-to-peer LinkedIn invite note under 280 chars>",
  "followUpDraft": "<Value-add follow-up message offering architectural insight or benchmark data>"
}`;

  return { systemPrompt, userPrompt };
}

export function buildReplyClassificationPrompt(input: ReplyClassificationInput): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = `You are an AI reply triage specialist managing B2B LinkedIn inbox threads.
Your role is to accurately classify incoming responses and generate respectful, appropriate replies.

CLASSIFICATION LABELS:
- "meeting_request": Prospect asks for a call, meeting, demo, or proposes calendar times.
- "question": Prospect asks a specific technical or product question.
- "interested": Prospect expresses general positive interest or agreement.
- "not_interested": Prospect declines, asks to be removed, or expresses negative interest.
- "out_of_office": Automated out-of-office autoreply with or without return date.
- "other": Ambiguous or irrelevant message.

SAFETY RULES:
1. For "not_interested": Always draft a polite, respectful acknowledgment and set actionRequired="suppress_contact".
2. For "meeting_request": Provide calendar link placeholder: https://cal.com/hassan-ai/15min.
3. Never be aggressive, pushy, or dismissive.
4. Return strictly valid JSON matching the requested schema.`;

  const threadContext = input.threadHistory
    .map((m) => `[${m.sender}]: ${m.text}`)
    .join("\n");

  const userPrompt = `Classify this inbound LinkedIn message:

PROSPECT:
- Name: ${input.leadName} (${input.leadTitle} at ${input.leadCompany})

PREVIOUS THREAD CONTEXT:
${threadContext || "No prior messages."}

LATEST INBOUND MESSAGE FROM PROSPECT:
"${input.incomingText}"

RETURN THIS JSON SCHEMA:
{
  "classification": "meeting_request" | "question" | "interested" | "not_interested" | "out_of_office" | "other",
  "confidence": <integer 0 to 100>,
  "reason": "<one sentence explanation of why this classification was assigned>",
  "suggestedResponse": "<draft response ready for human operator review>",
  "actionRequired": "send_response" | "schedule_meeting" | "suppress_contact" | "pause_sequence" | "none"
}`;

  return { systemPrompt, userPrompt };
}
