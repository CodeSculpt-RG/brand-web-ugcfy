import { z } from "zod";

export const kycSchema = z.object({
  document_type: z.string().min(1, "Document type is required"),
  bucket: z.string().min(1),
  path: z.string().min(1),
  original_filename: z.string().optional(),
  mime_type: z.string().optional(),
  size_bytes: z.number().optional(),
});
