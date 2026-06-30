import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  BRAND_VERIFICATION_PATH,
  createMinimalBrandProfile,
  getBrandRoutingDecision,
  serializeSupabaseError,
} from "@/lib/auth/brandRouting";

function redirectTo(origin: string, pathname: string) {
  return NextResponse.redirect(new URL(pathname, origin));
}

function redirectToLogin(origin: string, error: string) {
  return redirectTo(origin, `/login?error=${encodeURIComponent(error)}`);
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (!code) {
    return redirectToLogin(origin, "missing_oauth_code");
  }

  try {
    const supabase = await createClient();

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("[Auth Callback] exchange failed:", serializeSupabaseError(exchangeError));
      return redirectToLogin(origin, "oauth_exchange_failed");
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      if (userError) {
        console.error("[Auth Callback] user lookup failed:", serializeSupabaseError(userError));
      }
      return redirectToLogin(origin, "session_missing");
    }

    const decision = await getBrandRoutingDecision(supabase, user.id);

    if (!decision.ok) {
      console.error("[Auth Callback] profile routing failed:", {
        code: decision.code,
        message: decision.message,
        error: decision.error,
      });
      return redirectToLogin(origin, "oauth_profile_check_failed");
    }

    if (decision.reason === "missing_profile") {
      const { error: createProfileError } = await createMinimalBrandProfile(supabase, user);

      if (createProfileError) {
        console.error("[Auth Callback] minimal profile create failed:", serializeSupabaseError(createProfileError));
        return redirectToLogin(origin, "oauth_profile_create_failed");
      }

      return redirectTo(origin, BRAND_VERIFICATION_PATH);
    }

    return redirectTo(origin, decision.redirectTo);
  } catch (error) {
    console.error("[Auth Callback] unexpected failure:", serializeSupabaseError(error));
    return redirectToLogin(origin, "oauth_callback_failed");
  }
}
