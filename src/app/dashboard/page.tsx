"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Campaign, CampaignApplication, UgcSubmission } from "@/lib/supabase/types";
import { 
  Video, 
  Users, 
  Wallet, 
  CheckSquare, 
  ArrowRight, 
  TrendingUp, 
  Play, 
  Clock, 
  Check, 
  X,
  FileText,
  DollarSign,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalPitches: 0,
    totalSpend: 0,
    pendingApprovals: 0,
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pitches, setPitches] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [brandId, setBrandId] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        // Get user session
        const { data: { user } } = await supabase.auth.getUser();
        const activeBrandId = user?.id || "11111111-1111-1111-1111-111111111111"; // Fallback to Nike in demo
        setBrandId(activeBrandId);

        // 1. Fetch campaigns
        const { data: campaignData, error: campaignError } = await supabase
          .from("campaigns")
          .select("*")
          .eq("brand_id", activeBrandId);

        let finalCampaigns = campaignData || [];

        // 2. Fetch campaign applications (pitches)
        const { data: pitchData } = await supabase
          .from("campaign_applications")
          .select(`
            *,
            campaign:campaigns(*),
            creator:creator_profiles(*)
          `)
          .order("created_at", { ascending: false })
          .limit(5);

        let finalPitches = pitchData || [];

        // 3. Fetch ugc submissions
        const { data: submissionData } = await supabase
          .from("ugc_submissions")
          .select(`
            *,
            campaign:campaigns(*),
            creator:creator_profiles(*)
          `)
          .eq("status", "Pending")
          .limit(3);

        let finalSubmissions = submissionData || [];

        // 4. Fetch payments
        const { data: paymentData } = await supabase
          .from("payments")
          .select("amount")
          .eq("brand_id", activeBrandId);

        let totalPaymentAmt = paymentData?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

        // Fallbacks for Demo Mode
        if (finalCampaigns.length === 0) {
          finalCampaigns = [
            {
              id: "44444444-4444-4444-4444-444444444444",
              brand_id: activeBrandId,
              title: "Air Max Flyknit 2026 - Fit Test Campaign",
              description: "We are looking for athletic creators to showcase the durability and cushion of our latest Air Max Flyknit...",
              budget: 25000.00,
              requirements: [{ type: "Video", details: "1x 30s Reels format" }],
              creators_needed: 2,
              submissions_count: 1,
              deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              status: "Active",
            },
            {
              id: "55555555-5555-5555-5555-555555555555",
              brand_id: activeBrandId,
              title: "Dri-FIT Run-Club Promotional Launch",
              description: "Looking for local running club influencers...",
              budget: 12000.00,
              requirements: [{ type: "Video", details: "1x 15s Story testimonial" }],
              creators_needed: 1,
              submissions_count: 0,
              deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
              status: "Draft",
            }
          ];
        }

        if (finalPitches.length === 0) {
          finalPitches = [
            {
              id: "66666666-6666-6666-6666-666666666666",
              campaign_id: "44444444-4444-4444-4444-444444444444",
              creator_id: "22222222-2222-2222-2222-222222222222",
              status: "Approved",
              cover_letter: "Hey Nike team! I would love to run this campaign. I am a fitness coach and wear Air Max daily. My fitness audience is highly aligned to sportswear campaigns. Here is my portfolio!",
              proposed_rate: 20000.00,
              created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              campaign: { title: "Air Max Flyknit 2026" },
              creator: { 
                location: "New Delhi, Delhi",
                bio: "Active UGC creator specializing in high-energy fitness tutorials...",
                niche: ["Fitness", "Lifestyle"]
              }
            }
          ];
        }

        if (finalSubmissions.length === 0) {
          finalSubmissions = [
            {
              id: "77777777-7777-7777-7777-777777777777",
              application_id: "66666666-6666-6666-6666-666666666666",
              campaign_id: "44444444-4444-4444-4444-444444444444",
              creator_id: "22222222-2222-2222-2222-222222222222",
              video_url: "https://assets.mixkit.co/videos/preview/mixkit-running-in-public-park-42289-large.mp4",
              thumbnail_url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8",
              caption: "Leveling up my workout with the Air Max Flyknit 🚀 Unmatched stability and style. #AirMax2026 #UGC",
              notes: "Attached is the first draft. I went with an outdoor park track shot. Let me know if you need voiceover corrections!",
              status: "Pending",
              campaign: { title: "Air Max Flyknit 2026" },
              creator: { 
                location: "New Delhi",
                instagram_url: "https://instagram.com/rahul_ugc_fit"
              }
            }
          ];
        }

        if (totalPaymentAmt === 0) {
          totalPaymentAmt = 25000.00;
        }

        setCampaigns(finalCampaigns);
        setPitches(finalPitches);
        setSubmissions(finalSubmissions);

        setStats({
          activeCampaigns: finalCampaigns.filter(c => c.status === "Active").length,
          totalPitches: finalPitches.length,
          totalSpend: totalPaymentAmt,
          pendingApprovals: finalSubmissions.length,
        });

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [supabase]);

  // Approve Escrow Handler
  const handleApproveSubmission = async (subId: string) => {
    try {
      // Optimistic update
      setSubmissions(prev => prev.filter(s => s.id !== subId));
      setStats(prev => ({
        ...prev,
        pendingApprovals: Math.max(0, prev.pendingApprovals - 1)
      }));

      // Update in Supabase
      await supabase
        .from("ugc_submissions")
        .update({ status: "Approved" })
        .eq("id", subId);

    } catch (err) {
      console.error(err);
    }
  };

  // Reject Escrow Handler
  const handleRejectSubmission = async (subId: string) => {
    try {
      setSubmissions(prev => prev.filter(s => s.id !== subId));
      setStats(prev => ({
        ...prev,
        pendingApprovals: Math.max(0, prev.pendingApprovals - 1)
      }));

      await supabase
        .from("ugc_submissions")
        .update({ status: "Rejected", feedback: "Content did not meet requirements." })
        .eq("id", subId);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your campaigns, review creator materials, and distribute escrow funds.
          </p>
        </div>
        
        <Link 
          href="/dashboard/campaigns"
          className="px-4 py-2.5 bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-brand-red-600/15 flex items-center justify-center gap-1.5 cursor-pointer w-fit"
        >
          Create Campaign
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Stat 1: Active Campaigns */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Campaigns</span>
            <div className="p-2.5 bg-brand-red-50 text-brand-red-600 rounded-xl">
              <Video className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-900">{stats.activeCampaigns}</h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span>Running live</span>
            </p>
          </div>
        </div>

        {/* Stat 2: Creator Pitches */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Creator Pitches</span>
            <div className="p-2.5 bg-brand-red-50 text-brand-red-600 rounded-xl">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-900">{stats.totalPitches}</h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Applications review</span>
            </p>
          </div>
        </div>

        {/* Stat 3: Total Spend */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Spend</span>
            <div className="p-2.5 bg-brand-red-50 text-brand-red-600 rounded-xl">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-900">₹{stats.totalSpend.toLocaleString()}</h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="font-bold text-slate-700">INR</span>
              <span>• Transacted</span>
            </p>
          </div>
        </div>

        {/* Stat 4: Pending Approvals */}
        <div className="glass-card-accent p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-red-700 uppercase tracking-wider">Pending Approvals</span>
            <div className="p-2.5 bg-brand-red-500/10 text-brand-red-600 rounded-xl">
              <CheckSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-brand-red-700">{stats.pendingApprovals}</h3>
            <p className="text-xs text-brand-red-600 mt-1 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 animate-pulse" />
              <span>Awaiting review</span>
            </p>
          </div>
        </div>

      </div>

      {/* BENTO GRID WORKFLOW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Bento Item: PENDING SUBMISSIONS (Escrow Approval) */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="font-bold text-lg text-slate-900">UGC Deliverable Approvals</h3>
                <p className="text-xs text-slate-500">Inspect content and release escrow payments.</p>
              </div>
              <Link 
                href="/dashboard/approvals" 
                className="text-xs font-bold text-brand-red-600 hover:text-brand-red-700 flex items-center gap-1 transition"
              >
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {submissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
                  <CheckSquare className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700">All caught up!</p>
                <p className="text-xs text-slate-400 mt-1">No pending content reviews at the moment.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {submissions.map((sub) => (
                  <div key={sub.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col md:flex-row gap-5">
                    
                    {/* Video mockup player */}
                    <div className="relative w-full md:w-36 h-48 md:h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                      {sub.thumbnail_url ? (
                        <img 
                          src={sub.thumbnail_url} 
                          alt="Video thumbnail"
                          className="absolute inset-0 w-full h-full object-cover opacity-80"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <button 
                          onClick={() => window.open(sub.video_url, "_blank")}
                          className="h-10 w-10 bg-white/95 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer text-brand-red-600"
                          title="Play Video"
                        >
                          <Play className="h-4 w-4 fill-brand-red-600 ml-0.5" />
                        </button>
                      </div>
                    </div>

                    {/* Submission Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-brand-red-50 text-brand-red-600 rounded">
                            {sub.campaign?.title || "Campaign"}
                          </span>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-xs text-slate-500 font-semibold">{sub.creator?.location || "India"}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mt-1.5">
                          {sub.caption || "UGC Video Review"}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          <span className="font-semibold text-slate-700">Notes: </span>
                          {sub.notes || "No notes submitted."}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-3 mt-4">
                        <button
                          onClick={() => handleApproveSubmission(sub.id)}
                          className="px-3.5 py-1.5 bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Approve & Release Funds
                        </button>
                        <button
                          onClick={() => handleRejectSubmission(sub.id)}
                          className="px-3.5 py-1.5 border border-slate-200 bg-white text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                          Request Revision
                        </button>
                        <button
                          onClick={() => window.open(sub.video_url, "_blank")}
                          className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 ml-auto flex items-center gap-0.5"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open File
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Bento Item: RECENT PITCHES */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Recent Pitches</h3>
                <p className="text-xs text-slate-500">Creators applying to campaigns.</p>
              </div>
              <Link 
                href="/dashboard/creators" 
                className="text-xs font-bold text-brand-red-600 hover:text-brand-red-700 flex items-center gap-1 transition"
              >
                Discover
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {pitches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
                  <Users className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700">No active applications</p>
                <p className="text-xs text-slate-400 mt-1">Creator applications will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pitches.map((pitch) => (
                  <div key={pitch.id} className="p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl transition">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-brand-red-50 text-brand-red-700 font-extrabold flex items-center justify-center text-xs">
                          {pitch.campaign?.title?.slice(0, 2).toUpperCase() || "AM"}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                            {pitch.campaign?.title || "Campaign"}
                          </h4>
                          <p className="text-[10px] text-slate-400">
                            By Creator • {pitch.creator?.location || "India"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <p className="text-xs font-extrabold text-slate-800">
                          ₹{Number(pitch.proposed_rate).toLocaleString()}
                        </p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          pitch.status === "Approved" 
                            ? "bg-emerald-50 text-emerald-700" 
                            : pitch.status === "Pending" 
                              ? "bg-amber-50 text-amber-700" 
                              : "bg-slate-100 text-slate-600"
                        }`}>
                          {pitch.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 italic mt-2 line-clamp-2 leading-relaxed bg-white p-2 rounded-lg border border-slate-100">
                      "{pitch.cover_letter || "No pitch details submitted."}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* BOTTOM ROW: ACTIVE CAMPAIGNS & ESCROW SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Active Campaigns list */}
        <div className="glass-card p-6 rounded-3xl">
          <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-4 mb-4">
            Campaign Channels
          </h3>
          <div className="space-y-4">
            {campaigns.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-2xl hover:border-slate-200 transition">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-brand-red-50 text-brand-red-600 rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
                    {c.status === "Active" ? "ON" : "OFF"}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{c.title}</h4>
                    <p className="text-xs text-slate-400">Budget: ₹{c.budget.toLocaleString()} • Needed: {c.creators_needed}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  c.status === "Active" 
                    ? "bg-red-50 text-brand-red-600 border border-brand-red-100" 
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Escrow summary */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-4 mb-4">
              Escrow Protection System
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              All campaigns on UGCFY enforce an Escrow Payment model. Funds are collected from the brand when the contract is approved, locked in platform holding, and released to creators only when you approve their submissions.
            </p>
            <div className="p-4 bg-red-50/60 border border-brand-red-100/30 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-brand-red-500 text-white rounded-lg shrink-0">
                <Wallet className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Secure Settlement Guarantee</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">If content fails to match your campaign requirements, request unlimited edits or cancel for a full refund of escrow custody.</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
            <span className="text-xs font-semibold text-slate-400">Security Standard</span>
            <span className="text-[11px] font-bold text-brand-red-600 uppercase tracking-widest bg-brand-red-50 px-2 py-0.5 rounded">
              Verified
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
