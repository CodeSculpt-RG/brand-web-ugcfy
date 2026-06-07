"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Video, Shield, Heart, Zap, Bot, Cpu } from "lucide-react";
import RequestAccessModal from "@/components/RequestAccessModal";

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoadingAuth(false);
      }
    }
    checkAuth();
  }, []);

  return (
    <main className="relative min-h-screen w-screen bg-[#0A0A0F] flex flex-col justify-between overflow-x-hidden selection:bg-brand-red-100 select-none">
      
      {/* 1. HERO SECTION WITH BACKGROUND VIDEO */}
      <div className="relative w-full flex flex-col items-center justify-center pt-20 pb-24 min-h-[65vh] overflow-hidden bg-[#0A0A0F]">
        
        {/* Background Video (Optimized preload & muted play) */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="none"
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none appearance-none opacity-85"
          src="/hero-bg.mp4"
        />

        {/* High-Visibility Cinematic Overlay (z-index: 10) */}
        <div className="absolute inset-0 bg-black/30 bg-gradient-to-b from-transparent via-black/20 to-[#0A0A0F] z-10 pointer-events-none" />

        {/* ambient top light blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-b from-brand-red-600/5 to-transparent blur-[80px] pointer-events-none" />

        {/* NAVBAR */}
        <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between absolute top-0 left-0 right-0 z-30">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-brand-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-extrabold text-lg tracking-tighter">U</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">UGC<span className="text-brand-red-600">FY</span></span>
          </div>

          <div className="flex items-center gap-3">
            {!loadingAuth && (
              isAuthenticated ? (
                <Link 
                  href="/dashboard"
                  className="px-4.5 py-2 bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm shadow-brand-red-600/10 hover:shadow-brand-red-600/20"
                >
                  Brand Portal
                </Link>
              ) : (
                <Link 
                  href="/login"
                  className="px-4 py-2 border border-white/20 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Sign In
                </Link>
              )
            )}
          </div>
        </header>

        {/* HERO CONTENT - z-index: 20, flex gap-5 */}
        <section className="relative z-20 flex flex-col items-center text-center gap-5 max-w-4xl mx-auto px-6 mt-12">
          
          {/* Sparkle badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-1.5 px-3 py-1 bg-brand-red-950/40 border border-brand-red-500/30 text-brand-red-400 rounded-full text-[10px] font-bold uppercase tracking-wider"
          >
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>The Escrow-Protected UGC Platform</span>
          </motion.div>

          {/* Hero Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]"
          >
            Scale your brand ads with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red-500 to-rose-500">
              Vetted UGC Creators
            </span>
          </motion.h1>

          {/* Sub title */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-sm sm:text-base text-white max-w-2xl leading-relaxed font-semibold opacity-90"
          >
            UGCFY bridges the gap between top brands and verified creators. Draft your campaigns, hire creator talent, inspect video submissions, and distribute escrow payouts securely.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-brand-red-600 to-rose-600 hover:from-brand-red-700 hover:to-rose-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-brand-red-600/25 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              Request Access
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link 
              href="#features"
              className="w-full sm:w-auto px-6 py-3.5 border border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-sm shadow-sm"
            >
              View Creator Showcase
              <Zap className="h-4 w-4 text-brand-red-500" />
            </Link>
          </motion.div>

        </section>
      </div>

      {/* 2. BENTO CARD FEATURE GRID (OPTIMIZED LAYERS TO REDUCE GPU BLUR Lags) */}
      <div id="features" className="relative z-20 -mt-20 w-full max-w-7xl mx-auto px-4 pb-12 scroll-mt-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full"
        >
          {/* Feature 1 */}
          <div className="bg-[#0D0D12] border border-zinc-800/50 p-6 rounded-2xl text-left shadow-2xl hover:border-brand-red-500/30 hover:-translate-y-1 transition-all duration-300">
            <div className="h-10 w-10 bg-brand-red-500/10 text-brand-red-500 rounded-xl flex items-center justify-center mb-4 border border-brand-red-500/20">
              <Video className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Vetted UGC Formats</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-semibold">Only verified creators with KYC approval can apply. Review rich video testimonials and social channel statistics.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#0D0D12] border border-zinc-800/50 p-6 rounded-2xl text-left shadow-2xl hover:border-brand-red-500/30 hover:-translate-y-1 transition-all duration-300">
            <div className="h-10 w-10 bg-brand-red-500/10 text-brand-red-500 rounded-xl flex items-center justify-center mb-4 border border-brand-red-500/20">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Escrow Protection</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-semibold">Deposit campaign funds safely into platform custody. Funds are released to creators only after your content approval.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#0D0D12] border border-zinc-800/50 p-6 rounded-2xl text-left shadow-2xl hover:border-brand-red-500/30 hover:-translate-y-1 transition-all duration-300">
            <div className="h-10 w-10 bg-brand-red-500/10 text-brand-red-500 rounded-xl flex items-center justify-center mb-4 border border-brand-red-500/20">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Direct Collaboration</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-semibold">No expensive agency markups. Communicate directly with creators, manage iterations, and approve content formats.</p>
          </div>
        </motion.div>
      </div>

      {/* 3. AI-POWERED INTELLIGENCE BANNER */}
      <section className="relative z-20 w-full max-w-7xl mx-auto px-4 pb-20">
        <div className="relative rounded-3xl bg-gradient-to-b from-[#0F0F16] to-[#0A0A0F] border border-zinc-800/80 p-8 sm:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Subtle Ambient Red Glow */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-brand-red-600/10 blur-3xl pointer-events-none rounded-full" />
          
          <div className="flex-1 text-left relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-6 bg-brand-red-500/10 border border-brand-red-500/30 rounded-lg flex items-center justify-center">
                <Bot className="h-3.5 w-3.5 text-brand-red-500" />
              </div>
              <span className="text-[10px] font-bold text-brand-red-400 uppercase tracking-widest">Siya Agent Platform</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              Onboard, Shortlist, and Scale with <span className="text-brand-red-500">Siya</span>.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl font-semibold">
              Our proprietary AI agent handles your KYC verification, campaign brief drafting, and creator matchmaking in seconds. Skip the paperwork and start scaling your campaigns with ease.
            </p>
          </div>

          <div className="flex items-center justify-center shrink-0 w-full md:w-auto relative z-10">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto px-6 py-4 bg-gradient-to-tr from-brand-red-600 to-rose-600 hover:from-brand-red-700 hover:to-rose-700 text-white rounded-2xl text-xs font-bold transition shadow-lg shadow-brand-red-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Cpu className="h-4 w-4 animate-spin text-rose-200" style={{ animationDuration: '3s' }} />
              <span>Verify Brand Instantly</span>
            </button>
          </div>
        </div>
      </section>

      {/* Request Access Intercept Modal */}
      <RequestAccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* FOOTER */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 relative z-10">
        <span>© 2026 UGCFY. All rights reserved.</span>
        <div className="flex gap-5">
          <Link href="/privacy" className="hover:text-zinc-300 transition font-medium">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-zinc-300 transition font-medium">Terms of Service</Link>
          <Link href="/contact" className="hover:text-zinc-300 transition font-medium">Contact</Link>
          <Link href="/about" className="hover:text-zinc-300 transition font-medium">About</Link>
        </div>
      </footer>

    </main>
  );
}

