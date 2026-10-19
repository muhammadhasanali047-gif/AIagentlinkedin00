import { z } from "zod";

export const CreateSuppressionSchema = z.object({
  type: z.enum(["domain", "company", "linkedin_url"]),
  value: z.string().min(1, "Suppression target value is required").max(200),
  reason: z.string().min(1, "Reason for exclusion is required").max(300),
});
