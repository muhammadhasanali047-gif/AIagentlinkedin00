import { z } from "zod";

export const CampaignStatusSchema = z.enum(["active", "draft", "paused", "completed"]);

export const CampaignStepSchema = z.object({
  stepNumber: z.number().int().min(1),
  type: z.enum(["connection_request", "followup_message", "inmail_message"]),
  delayDays: z.number().int().min(0).max(60),
  template: z.string().min(1, "Template content is required").max(1000),
  aiPersonalizationEnabled: z.boolean().default(true),
});

export const CreateCampaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required").max(150),
  targetAudience: z.string().min(1, "Target audience persona is required").max(300),
  dailyLimit: z.number().int().min(1).max(50).default(20),
  steps: z.array(CampaignStepSchema).min(1, "At least one sequence step is required"),
  status: CampaignStatusSchema.optional().default("draft"),
});

export const UpdateCampaignSchema = z.object({
  name: z.string().min(1).max(150).optional(),
  targetAudience: z.string().min(1).max(300).optional(),
  dailyLimit: z.number().int().min(1).max(50).optional(),
  status: CampaignStatusSchema.optional(),
  steps: z.array(CampaignStepSchema).optional(),
});
