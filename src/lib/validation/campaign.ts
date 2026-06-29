import { z } from "zod";

export const campaignSchema = z.object({
  title: z.string().min(1, "Campaign title is required"),
  description: z.string().optional(),
  objective: z.string().optional(),
  platforms: z.array(z.string()).default([]),
  deliverables: z.array(z.any()).default([]),
  budget: z.coerce.number().positive("Budget must be positive").optional(),
  currency: z.string().default("INR"),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  requirements: z.record(z.string(), z.any()).default({}),
  guidelines: z.string().optional(),
});
