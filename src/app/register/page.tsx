"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const supabase = createClient();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setLoadingProvider("google");

    const origin = window.location.origin;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      setErrorMsg("Google sign-in could not be completed. Please try again.");
      setLoadingProvider(null);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-16">
            <div className="h-10 w-10 bg-[#000000] flex items-center justify-center rounded-xl shadow-lg">
              <span className="text-[#D90429] font-extrabold text-xl tracking-tighter">u</span>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">UGCFY</span>
          </Link>

          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Create an account</h1>
          <p className="text-slate-500 mb-8">Join thousands of brands scaling their creator pipeline.</p>

          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            disabled={loadingProvider === "google"}
            className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors mb-6 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            {loadingProvider === "google" ? "Connecting..." : "Continue with Google"}
          </button>
          {errorMsg && <p className="text-red-500 text-xs font-bold mb-4">{errorMsg}</p>}

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-sm font-medium text-slate-400">or continue with email</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">First Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50" placeholder="John" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Last Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50" placeholder="Doe" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Work Email</label>
              <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50" placeholder="john@company.com" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <PasswordInput autoComplete="new-password" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50" placeholder="••••••••" />
            </div>

            <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 group text-lg px-8 py-4 mt-8 shadow-xl shadow-red-500/20">
              Create Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Already have an account? <Link href="/login" className="text-[var(--color-primary)] hover:underline">Log in</Link>
          </p>
        </div>
      </div>

      {/* Right Image Side */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Dashboard" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
        
        <div className="relative z-10 p-16 flex flex-col justify-end h-full text-white">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl max-w-lg">
            <div className="flex items-center gap-4 mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Sarah" className="w-14 h-14 rounded-full border-2 border-white/50" />
              <div>
                <h4 className="font-bold text-lg">Sarah Jenkins</h4>
                <p className="text-white/70 text-sm">VP Marketing, Acme Corp</p>
              </div>
            </div>
            <p className="text-xl font-medium leading-relaxed">
              &quot;Switching to UGC FY completely transformed our acquisition pipeline. We dropped our CPA by 40% in the first month just by sourcing authentic creators at scale.&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
