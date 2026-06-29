import { NextRequest } from "next/server";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { campaignSchema } from "@/lib/validation/campaign";
import { ZodError } from "zod";
import { jsonError, jsonSuccess } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const brandSession = await verifyBrand();
    if (!brandSession.ok) {
      return jsonError("UNAUTHENTICATED", brandSession.message || "Please login to continue.", 401);
    }
    if (!brandSession.brand) {
      return jsonError("BRAND_PROFILE_NOT_FOUND", "Brand profile not found.", 404);
    }

    const body = await req.json();
    const validatedData = campaignSchema.parse(body);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("campaigns")
      .insert({
        brand_id: brandSession.brand.id,
        title: validatedData.title,
        description: validatedData.description || null,
        objective: validatedData.objective || null,
        platforms: validatedData.platforms,
        deliverables: validatedData.deliverables,
        budget: validatedData.budget || null,
        currency: validatedData.currency,
        start_date: validatedData.start_date || null,
        end_date: validatedData.end_date || null,
        requirements: validatedData.requirements,
        guidelines: validatedData.guidelines || null,
        created_by: brandSession.user.id,
        status: "draft"
      })
      .select()
      .single();

    if (error) {
      console.error("[supabase-form-error]", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return jsonError("SUPABASE_INSERT_FAILED", error.message || "Failed to create campaign", 500, {
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
    }

    return jsonSuccess(data);
  } catch (err: unknown) {
    console.error("[form-api] unexpected error", err);
    if (err instanceof ZodError) {
      return jsonError("VALIDATION_ERROR", err.issues[0]?.message || "Validation failed", 400);
    }
    return jsonError("INTERNAL_ERROR", "Internal Server Error", 500);
  }
}
