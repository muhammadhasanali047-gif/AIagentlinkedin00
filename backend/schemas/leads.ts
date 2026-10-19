import { z } from "zod";

export const LeadStatusSchema = z.enum([
  "new",
  "qualified",
  "contacted",
  "replied",
  "converted",
  "unqualified",
  "suppressed",
]);

export const CreateLeadSchema = z.object({
  name: z.string().min(1, "Lead name is required").max(100),
  title: z.string().min(1, "Job title is required").max(150),
  company: z.string().min(1, "Company name is required").max(150),
  companySize: z.string().optional().default("11-50 employees"),
  industry: z.string().optional().default("Technology"),
  location: z.string().optional().default("Remote"),
  linkedinUrl: z.string().min(1, "LinkedIn URL is required"),
  tags: z.array(z.string().max(50)).optional().default([]),
  campaignId: z.string().optional(),
  campaignName: z.string().optional(),
});

export const UpdateLeadSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  title: z.string().min(1).max(150).optional(),
  company: z.string().min(1).max(150).optional(),
  companySize: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  status: LeadStatusSchema.optional(),
  aiScore: z.number().min(0).max(100).optional(),
  aiScoreExplanation: z.string().optional(),
  tags: z.array(z.string()).optional(),
  connectionNoteDraft: z.string().max(300).optional(),
  followUpDraft: z.string().max(1000).optional(),
  suppressed: z.boolean().optional(),
  campaignId: z.string().optional(),
  campaignName: z.string().optional(),
});

export const ImportCsvLeadsSchema = z.object({
  leads: z.array(CreateLeadSchema).min(1, "At least one lead is required for CSV import"),
});
