"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Mail, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type PendingSignup = {
  firstName: string;
  lastName: string;
  email: string;
  passwordSet?: boolean;
};

function getPendingSignup(emailParam: string | null): PendingSignup {
  if (typeof window === "undefined") {
    return { firstName: "", lastName: "", email: emailParam || "", passwordSet: false };
  }

  try {
    const stored = sessionStorage.getItem("pendingBrandSignup");
    if (stored) {
      const parsed = JSON.parse(stored) as PendingSignup;
      return {
        firstName: parsed.firstName || "",
        lastName: parsed.lastName || "",
        email: parsed.email || emailParam || "",
        passwordSet: Boolean(parsed.passwordSet),
      };
    }
  } catch {
    // Ignore malformed client storage and fall back to the query string.
  }

  return { firstName: "", lastName: "", email: emailParam || "", passwordSet: false };
}

function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [pendingSignup] = React.useState<PendingSignup>(() => getPendingSignup(searchParams.get("email")));
  const [otp, setOtp] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg("");
    setMessage("");

    if (!pendingSignup.email) {
      setErrorMsg("Please start signup again with your work email.");
      return;
    }

    if (!otp.trim()) {
      setErrorMsg("Please enter the OTP sent to your work email.");
      return;
    }

    setIsVerifying(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: pendingSignup.email,
        token: otp.trim(),
        type: "email",
      });

      if (error) {
        const lowerMessage = error.message.toLowerCase();
        if (lowerMessage.includes("expired")) {
          throw new Error("This code has expired. Please request a new one.");
        }
        throw new Error("We could not verify this code. Please check the OTP and try again.");
      }

      router.replace(`/auth/set-password?email=${encodeURIComponent(pendingSignup.email)}`);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "We could not verify this code. Please check the OTP and try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setErrorMsg("");
    setMessage("");

    if (!pendingSignup.email) {
      setErrorMsg("Please start signup again with your work email.");
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: pendingSignup.email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;
      setMessage("A new OTP has been sent to your work email.");
    } catch {
      setErrorMsg("Unable to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="w-full max-w-md mx-auto">
          <Link href="/" className="flex items-center gap-3 mb-16">
            <div className="h-10 w-10 bg-[#000000] flex items-center justify-center rounded-xl shadow-lg">
              <span className="text-[#D90429] font-extrabold text-xl tracking-tighter">u</span>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">UGCFY</span>
          </Link>

          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#E11D48]">
            <Mail className="h-5 w-5" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Verify your email</h1>
          <p className="text-slate-500 mb-8">
            Enter the OTP sent to <span className="font-bold text-slate-800">{pendingSignup.email || "your work email"}</span>.
          </p>

          <form className="space-y-5" onSubmit={handleVerify}>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email OTP</label>
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 8))}
                inputMode="numeric"
                autoComplete="one-time-code"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50"
                placeholder="Enter OTP"
              />
            </div>

            {errorMsg && <p className="text-red-600 text-sm font-bold">{errorMsg}</p>}
            {message && <p className="text-emerald-600 text-sm font-bold">{message}</p>}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-[#0A0A0A] hover:bg-black text-white flex items-center justify-center gap-2 group text-lg px-8 py-4 rounded-[14px] shadow-xl transition-all disabled:opacity-75"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
              {!isVerifying && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RotateCcw className="h-4 w-4" />
            {isResending ? "Sending..." : "Resend OTP"}
          </button>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Verification workspace"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <OtpForm />
    </Suspense>
  );
}
