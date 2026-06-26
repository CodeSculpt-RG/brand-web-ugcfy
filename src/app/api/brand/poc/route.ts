import { NextRequest } from "next/server";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { brandPocSchema } from "@/lib/validation/brandProfile";
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
    const validatedData = brandPocSchema.parse(body);

    const supabase = await createClient();

    const { data: insertedData, error: insertError } = await supabase
      .from("brand_poc")
      .insert({
        brand_id: brandSession.brand.id,
        full_name: validatedData.full_name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        designation: validatedData.designation || null,
        is_primary: validatedData.is_primary
      })
      .select()
      .single();

    if (insertError) {
      console.error("[supabase-form-error]", {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
      });
      return jsonError(
        "SUPABASE_INSERT_FAILED",
        insertError.message || "Failed to save POC",
        500,
        {
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint,
        }
      );
    }

    return jsonSuccess(insertedData);
  } catch (err: unknown) {
    console.error("[form-api] unexpected error", err);
    if (err instanceof ZodError) {
      return jsonError("VALIDATION_ERROR", err.issues[0]?.message || "Validation failed", 400);
    }
    return jsonError("INTERNAL_ERROR", "Internal Server Error", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const brandSession = await verifyBrand();
    if (!brandSession.ok) {
      return jsonError("UNAUTHENTICATED", brandSession.message || "Please login to continue.", 401);
    }
    if (!brandSession.brand) {
      return jsonError("BRAND_PROFILE_NOT_FOUND", "Brand profile not found.", 404);
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return jsonError("BAD_REQUEST", "Missing id parameter", 400);
    }

    const supabase = await createClient();
    
    const { error } = await supabase
      .from("brand_poc")
      .delete()
      .eq("id", id)
      .eq("brand_id", brandSession.brand.id);

    if (error) {
      console.error("[supabase-form-error]", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return jsonError(
        "SUPABASE_DELETE_FAILED",
        error.message || "Failed to delete POC",
        500,
        {
          code: error.code,
          details: error.details,
          hint: error.hint,
        }
      );
    }

    return jsonSuccess({ deleted: true });
  } catch (err) {
    console.error("[form-api] unexpected error", err);
    return jsonError("INTERNAL_ERROR", "Internal Server Error", 500);
  }
}
