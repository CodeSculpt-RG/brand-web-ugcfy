import type { SupabaseClient, User } from "@supabase/supabase-js";

export const BRAND_ONBOARDING_PATH = "/brand/onboarding";
export const BRAND_VERIFICATION_PATH = "/dashboard/verification";
export const BRAND_DASHBOARD_PATH = "/dashboard";

type BrandProfileForRouting = {
  id: string;
  user_id?: string | null;
  contact_email?: string | null;
  company_name?: string | null;
  brand_name?: string | null;
  approval_status?: string | null;
  kyc_status?: string | null;
};

type SerializedSupabaseError = {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
  status?: number;
};

export type BrandRoutingDecision =
  | {
      ok: true;
      profile: BrandProfileForRouting | null;
      redirectTo: typeof BRAND_ONBOARDING_PATH | typeof BRAND_VERIFICATION_PATH | typeof BRAND_DASHBOARD_PATH;
      reason: "missing_profile" | "profile_incomplete" | "verification_required" | "ready";
    }
  | {
      ok: false;
      code: "BRAND_PROFILE_DUPLICATE" | "BRAND_QUERY_FAILED";
      message: string;
      error?: SerializedSupabaseError;
    };

type MaybeSupabaseError = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
  status?: number;
};

export function serializeSupabaseError(error: unknown): SerializedSupabaseError {
  if (error && typeof error === "object") {
    const value = error as MaybeSupabaseError;
    const serialized: SerializedSupabaseError = {
      message: value.message || "Unknown Supabase error",
    };

    if (value.code) serialized.code = value.code;
    if (value.details) serialized.details = value.details;
    if (value.hint) serialized.hint = value.hint;
    if (value.status) serialized.status = value.status;

    return serialized;
  }

  return {
    message: error instanceof Error ? error.message : "Unknown error",
  };
}

export function isMissingRelationError(error: MaybeSupabaseError | null | undefined) {
  return error?.code === "42P01" || Boolean(error?.message?.includes("does not exist"));
}



import { getBrandAccessStatus } from "./getBrandAccessStatus";

export async function getBrandRoutingDecision(
  supabase: SupabaseClient,
  userId: string
): Promise<BrandRoutingDecision> {
  const { data: profiles, error: profileError } = await supabase
    .from("brand_profiles")
    .select("*")
    .eq("user_id", userId)
    .limit(2);

  if (profileError) {
    return {
      ok: false,
      code: "BRAND_QUERY_FAILED",
      message: profileError.message,
      error: serializeSupabaseError(profileError),
    };
  }

  if (!profiles || profiles.length === 0) {
    return {
      ok: true,
      profile: null,
      redirectTo: BRAND_VERIFICATION_PATH,
      reason: "missing_profile",
    };
  }

  if (profiles.length > 1) {
    return {
      ok: false,
      code: "BRAND_PROFILE_DUPLICATE",
      message: "Multiple brand profiles found for this user.",
    };
  }

  const profile = profiles[0] as BrandProfileForRouting;
  const status = getBrandAccessStatus(profile);

  if (status === "approved") {
    return {
      ok: true,
      profile,
      redirectTo: BRAND_DASHBOARD_PATH,
      reason: "ready",
    };
  }

  if (status === "incomplete") {
    return {
      ok: true,
      profile,
      redirectTo: BRAND_VERIFICATION_PATH,
      reason: "profile_incomplete",
    };
  }

  return {
    ok: true,
    profile,
    redirectTo: BRAND_VERIFICATION_PATH,
    reason: "verification_required",
  };
}

export async function createMinimalBrandProfile(supabase: SupabaseClient, user: User) {
  return supabase.from("brand_profiles").upsert({
    id: user.id,
    user_id: user.id,
    contact_email: user.email ?? null,
    approval_status: "profile_incomplete",
  });
}
