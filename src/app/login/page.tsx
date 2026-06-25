"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
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

          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Welcome back</h1>
          <p className="text-slate-500 mb-8">Log in to your account to manage your campaigns.</p>

          <button className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors mb-6 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Log in with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-sm font-medium text-slate-400">or</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Work Email</label>
              <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50" placeholder="john@company.com" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs font-semibold text-[var(--color-primary)] hover:underline">Forgot password?</a>
              </div>
              <input type="password" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50" placeholder="••••••••" />
            </div>

            <button type="submit" className="w-full bg-[#0A0A0A] hover:bg-black text-white flex items-center justify-center gap-2 group text-lg px-8 py-4 mt-8 rounded-[14px] shadow-xl transition-all">
              Log In
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Don&apos;t have an account? <Link href="/register" className="text-[var(--color-primary)] hover:underline">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right Image Side */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Team Collaboration" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
        
        <div className="relative z-10 p-16 flex flex-col justify-end h-full text-white">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl max-w-lg">
            <h3 className="text-2xl font-bold mb-4">Scale your creator pipeline.</h3>
            <p className="text-lg text-white/80 leading-relaxed">
              &quot;We used to spend 20 hours a week sourcing and emailing creators. Now the UGC FY engine does it automatically while we sleep.&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
