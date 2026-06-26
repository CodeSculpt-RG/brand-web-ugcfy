"use client";

import Link from "next/link";
import { ArrowLeft, Linkedin, Star, Award } from "lucide-react";

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-zinc-100 flex flex-col justify-between selection:bg-brand-red-100 select-none">

      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-zinc-900">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 bg-brand-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-extrabold text-lg tracking-tighter">U</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">UGC<span className="text-brand-red-600">FY</span></span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </header>

      {/* Main Content Area */}
      <section className="flex-1 max-w-3xl mx-auto py-20 px-6 text-left">
        <div className="space-y-10">

          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-red-500">About the Company</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none">
              Backed by Industry Expertise
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-semibold">
              UGCFY was built to redefine how global brands discover, contract, and scale content generation campaigns with independent creators.
            </p>
          </div>

          {/* Description paragraphs */}
          <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
            <p>
              Traditional influencer marketing is plagued by manual negotiations, high agency overheads, and payment insecurity. UGCFY resolves these paint points by introducing an escrow-protected collaboration hub. Brands fund campaigns securely, and creators receive payouts instantly upon brief fulfillment.
            </p>
            <p>
              To push the boundaries of productivity, we have built <strong>SIYAA</strong>—our proprietary AI onboarding and matchmaking agent. SIYAA acts as an automated concierge that completes partner KYC verifications, compiles creative brand profiles, and expedites platform access.
            </p>
          </div>

          {/* Owner Showcase Card */}
          <div className="relative rounded-3xl bg-[#0D0D12] border border-zinc-850 p-6 sm:p-8 overflow-hidden shadow-2xl">
            {/* Ambient Red Glow */}
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-brand-red-600/5 blur-3xl pointer-events-none rounded-full" />

            <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">

              {/* Profile Avatar Placeholder (or initials) */}
              <div className="h-20 w-20 bg-gradient-to-tr from-brand-red-600 to-rose-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shrink-0">
                SM
              </div>

              {/* Bio Details */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">Shubham Mishra</h3>
                  <span className="inline-block self-center sm:self-auto px-2 py-0.5 bg-brand-red-950/40 border border-brand-red-500/20 text-brand-red-400 rounded-full text-[9px] font-bold uppercase tracking-wider">
                    Founder & CEO
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
                  Shubham&apos;s vision is to bridge the gap between elite brands and vetted creators through AI-driven workflows, eliminating inefficiencies and establishing payment trust.
                </p>

                <div className="pt-2">
                  <a
                    href="https://www.linkedin.com/in/shubham-mishra-795083172/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#0A66C2] hover:text-[#0077B5] transition border border-[#0A66C2]/20 hover:border-[#0A66C2]/50 bg-[#0A66C2]/5 hover:bg-[#0A66C2]/10 px-3.5 py-2 rounded-xl"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span>Connect on LinkedIn</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Key Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900/30 border border-zinc-850 rounded-2xl flex gap-3.5 items-start">
              <div className="h-8 w-8 bg-brand-red-500/10 text-brand-red-500 border border-brand-red-500/20 rounded-lg flex items-center justify-center shrink-0">
                <Star className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Vetted Quality</h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">Every creator undergoes KYC validation and portfolio screening prior to onboarding.</p>
              </div>
            </div>

            <div className="p-4 bg-zinc-900/30 border border-zinc-850 rounded-2xl flex gap-3.5 items-start">
              <div className="h-8 w-8 bg-brand-red-500/10 text-brand-red-500 border border-brand-red-500/20 rounded-lg flex items-center justify-center shrink-0">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">AI-Optimized Workflow</h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">Save hours of administrative setup using automated matchmaking and drafting tools.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
        <span>© 2026 UGCFY. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-zinc-300 transition">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-zinc-300 transition">Terms of Service</Link>
          <Link href="/contact" className="hover:text-zinc-300 transition">Contact</Link>
          <Link href="/about" className="hover:text-zinc-300 transition">About</Link>
        </div>
      </footer>

    </main>
  );
}
