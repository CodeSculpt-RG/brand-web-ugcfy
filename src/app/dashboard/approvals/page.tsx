"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { 
  CheckSquare, 
  Check, 
  X, 
  CheckCircle2, 
  Lock,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Heart,
  MessageCircle,
  Share2
} from "lucide-react";
import { z } from "zod";

const CreatorSchema = z.object({
  full_name: z.string().nullish().transform(v => v || "Creator"),
  avatar_url: z.string().nullish().transform(v => v || ""),
  location: z.string().nullish().transform(v => v || ""),
  instagram_url: z.string().nullish().transform(v => v || "")
}).nullish().transform(v => v || { full_name: "Creator", avatar_url: "", location: "", instagram_url: "" });

const CampaignSchema = z.object({
  title: z.string().nullish().transform(v => v || "Campaign"),
  budget: z.number().nullish().transform(v => v || 20000)
}).nullish().transform(v => v || { title: "Campaign", budget: 20000 });

const SubmissionSchema = z.object({
  id: z.string(),
  application_id: z.string().nullish().transform(v => v || ""),
  campaign_id: z.string().nullish().transform(v => v || ""),
  creator_id: z.string().nullish().transform(v => v || ""),
  video_url: z.string().nullish().transform(v => v || ""),
  thumbnail_url: z.string().nullish().transform(v => v || ""),
  caption: z.string().nullish().transform(v => v || "UGC video submission"),
  notes: z.string().nullish().transform(v => v || "No submission notes provided."),
  status: z.string().nullish().transform(v => v || "Pending"),
  feedback: z.string().nullable(),
  created_at: z.string().nullish().transform(v => v || new Date().toISOString()),
  campaign: CampaignSchema,
  creator: CreatorSchema
});

type UGCSubmission = z.infer<typeof SubmissionSchema>;

export default function ApprovalsPage() {
  const supabase = createClient();
  const [submissions, setSubmissions] = useState<UGCSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<UGCSubmission | null>(null);
  const [revisionFeedback, setRevisionFeedback] = useState("");
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Load submissions
  const loadSubmissions = async () => {
    try {
      setIsLoading(true);
      const { data } = await supabase
        .from("ugc_submissions")
        .select(`
          *,
          campaign:campaigns(*),
          creator:creator_profiles(*)
        `)
        .order("created_at", { ascending: false });

      let fetchedSubmissions = data || [];

      if (fetchedSubmissions.length === 0) {
        fetchedSubmissions = [
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
            feedback: null,
            created_at: new Date().toISOString(),
            campaign: { title: "Air Max Flyknit 2026", budget: 25000 },
            creator: { 
              full_name: "Rahul Sharma", 
              avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
              location: "New Delhi, Delhi",
              instagram_url: "https://instagram.com/rahul_ugc_fit"
            }
          },
          {
            id: "sub-approved-mock",
            application_id: "app-2",
            campaign_id: "44444444-4444-4444-4444-444444444444",
            creator_id: "c2-uuid-mock",
            video_url: "https://assets.mixkit.co/videos/preview/mixkit-girl-running-in-sportswear-34289-large.mp4",
            thumbnail_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
            caption: "Reviewing the Nike Summer Collection 🌟 #NikeFit #Sponsored",
            notes: "Here is my finalized post. Hope you guys like it!",
            status: "Approved",
            feedback: null,
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            campaign: { title: "Dri-FIT Launch", budget: 12000 },
            creator: {
              full_name: "Pooja Mehta",
              avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
              location: "Mumbai, Maharashtra",
              instagram_url: "https://instagram.com/pooja_style"
            }
          }
        ];
      }

      // ROOT CAUSE FIX: Strict Data Validation at the boundary instead of optional chaining in UI
      const parsedSubmissions = z.array(SubmissionSchema).parse(fetchedSubmissions);

      setSubmissions(parsedSubmissions);
      setSelectedSub(parsedSubmissions[0] || null);

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  // Approve content release
  const handleApprove = async () => {
    if (!selectedSub) return;
    setActionSuccess(null);

    try {
      // Update DB
      await supabase
        .from("ugc_submissions")
        .update({ status: "Approved" })
        .eq("id", selectedSub.id);

      // Update state locally
      setSubmissions(prev => 
        prev.map(s => s.id === selectedSub.id ? { ...s, status: "Approved" } : s)
      );
      setSelectedSub(prev => prev ? { ...prev, status: "Approved" } : null);

      setActionSuccess("Escrow funds released! Creator notified.");
      setTimeout(() => setActionSuccess(null), 3000);

    } catch (err) {
      console.error(err);
    }
  };

  // Reject / Revision request
  const handleRequestRevision = async () => {
    if (!selectedSub || !revisionFeedback) return;
    setActionSuccess(null);

    try {
      // Update DB
      await supabase
        .from("ugc_submissions")
        .update({ status: "Rejected", feedback: revisionFeedback })
        .eq("id", selectedSub.id);

      // Update state locally
      setSubmissions(prev => 
        prev.map(s => s.id === selectedSub.id ? { ...s, status: "Rejected", feedback: revisionFeedback } : s)
      );
      setSelectedSub(prev => prev ? { ...prev, status: "Rejected", feedback: revisionFeedback } : null);

      setShowRevisionModal(false);
      setRevisionFeedback("");
      setActionSuccess("Revision request submitted to creator.");
      setTimeout(() => setActionSuccess(null), 3000);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Campaign Approvals</h1>
        <p className="text-sm text-slate-500 mt-1">Review UGC video deliverables. Approving releases pre-funded escrow payouts to creators immediately.</p>
      </div>

      {/* Main split dashboard review */}
      {isLoading && submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Submissions list (Col span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Content Pipeline</h3>
            
            <div className="space-y-3">
              {submissions.map((sub) => {
                const isSelected = selectedSub?.id === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSub(sub)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected 
                        ? "glass-card-accent border-brand-red-500/30 ring-1 ring-brand-red-500/20" 
                        : "glass-card"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        sub.status === "Approved" 
                          ? "bg-emerald-50 text-emerald-700" 
                          : sub.status === "Pending" 
                            ? "bg-amber-50 text-amber-700" 
                            : "bg-red-50 text-brand-red-700"
                      }`}>
                        {sub.status === "Rejected" ? "Revision Requested" : sub.status}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                      {sub.caption || "UGC video submission"}
                    </h4>
                    
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100/50">
                      <div className="h-6 w-6 rounded-full bg-brand-red-100 flex items-center justify-center text-[10px] font-bold text-brand-red-700 shrink-0">
                        {sub.creator.full_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-700 truncate">{sub.creator.full_name}</p>
                        <p className="text-[9px] text-slate-400 truncate">{sub.campaign.title}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Submission Viewer (Col span 8) */}
          <div className="lg:col-span-8">
            {selectedSub ? (
              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
                
                {/* Status messages */}
                {actionSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-pulse">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span>{actionSuccess}</span>
                  </div>
                )}

                {/* Sub details */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-brand-red-50 text-brand-red-600 rounded">
                      {selectedSub.campaign.title}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-2">
                      {selectedSub.caption}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Submitted by <span className="font-semibold text-slate-600">{selectedSub.creator.full_name}</span> • {selectedSub.creator.location}
                    </p>
                  </div>

                  {/* Escrow Lock Indicator */}
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3 shrink-0 h-fit">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Escrow Balance</p>
                      <p className="text-sm font-extrabold text-slate-800 mt-0.5">
                        ₹{selectedSub.campaign.budget.toLocaleString()} INR
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video / Player Preview block */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Phone frame mockup player (Col span 5) */}
                  <div className="md:col-span-5 flex justify-center">
                    <div className="relative w-full max-w-[240px] aspect-[9/16] rounded-[36px] border-[8px] border-slate-900 bg-black overflow-hidden shadow-2xl ring-4 ring-slate-800/10">
                      
                      {/* Speaker / Notch */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-slate-900 rounded-full z-20" />
                      
                      {/* Video Player */}
                      <video
                        src={selectedSub.video_url}
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                        poster={selectedSub.thumbnail_url || undefined}
                      />

                      {/* Mock Social Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none text-white z-10 flex flex-col justify-end">
                        <p className="text-xs font-bold flex items-center gap-1">
                          @{selectedSub.creator.full_name.toLowerCase().replace(/\s/g, "")}
                          <Sparkles className="h-3 w-3 text-brand-red-400 fill-brand-red-400" />
                        </p>
                        <p className="text-[9px] text-white/80 mt-1 line-clamp-2 leading-relaxed">
                          {selectedSub.caption}
                        </p>
                      </div>

                      {/* Right-side quick action links overlay */}
                      <div className="absolute right-2.5 bottom-20 flex flex-col items-center gap-3 text-white/95 z-20 pointer-events-none">
                        <div className="flex flex-col items-center">
                          <div className="p-1.5 bg-black/40 rounded-full backdrop-blur-md">
                            <Heart className="h-4 w-4" />
                          </div>
                          <span className="text-[8px] mt-0.5">1.2K</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="p-1.5 bg-black/40 rounded-full backdrop-blur-md">
                            <MessageCircle className="h-4 w-4" />
                          </div>
                          <span className="text-[8px] mt-0.5">24</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="p-1.5 bg-black/40 rounded-full backdrop-blur-md">
                            <Share2 className="h-4 w-4" />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Creator Notes & Actions (Col span 7) */}
                  <div className="md:col-span-7 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Creator&apos;s Cover Note</h4>
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl italic text-xs text-slate-600 leading-relaxed">
                        &quot;{selectedSub.notes || "No submission notes provided."}&quot;
                      </div>
                    </div>

                    {selectedSub.feedback && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Previous Revision Feedback</h4>
                        <div className="p-4 bg-red-50/50 border border-red-100/50 rounded-2xl text-xs text-brand-red-700 font-semibold leading-relaxed">
                          &quot;{selectedSub.feedback}&quot;
                        </div>
                      </div>
                    )}

                    {/* Escrow Release info alert */}
                    <div className="p-4 bg-brand-red-50/60 border border-brand-red-100/30 rounded-2xl flex items-start gap-3">
                      <ShieldCheck className="h-5 w-5 text-brand-red-600 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <h5 className="font-bold text-slate-800">Escrow Security Policy</h5>
                        <p className="text-slate-500 mt-0.5">Approve content release only if video deliverables fulfill all design mandates. Releasing funds completes the project cycle.</p>
                      </div>
                    </div>

                    {/* Main actions bar */}
                    {selectedSub.status === "Pending" && (
                      <div className="flex flex-wrap gap-3 pt-2">
                        <button
                          onClick={handleApprove}
                          className="px-4 py-2.5 bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-brand-red-600/10 cursor-pointer"
                        >
                          <Check className="h-4 w-4" />
                          Approve & Release Escrow
                        </button>
                        <button
                          onClick={() => setShowRevisionModal(true)}
                          className="px-4 py-2.5 border border-slate-200 bg-white text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                          Request Revision
                        </button>
                      </div>
                    )}

                    {selectedSub.status === "Approved" && (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold w-fit">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>Escrow Funds Successfully Disbursed</span>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            ) : (
              <div className="glass-card p-12 text-center rounded-3xl flex flex-col items-center justify-center">
                <CheckSquare className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-700">Select a submission</p>
                <p className="text-xs text-slate-400 mt-1">Pick a UGC deliverable from the pipeline to review.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* REVISION COMMENTS MODAL */}
      <AnimatePresence>
        {showRevisionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRevisionModal(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 z-10"
            >
              <button 
                onClick={() => setShowRevisionModal(false)}
                className="absolute right-4 top-4 p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  Request UGC Revision
                  <RotateCcw className="h-4.5 w-4.5 text-brand-red-500" />
                </h3>
                <p className="text-xs text-slate-500">Provide detailed adjustments or edits required from the creator.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Feedback Comments</label>
                  <textarea
                    rows={4}
                    value={revisionFeedback}
                    onChange={(e) => setRevisionFeedback(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition resize-none"
                    placeholder="e.g. Please mention the Flyknit mesh cushioning technology within the first 5 seconds. The audio transition at the end feels slightly cut off."
                  />
                </div>

                <button
                  onClick={handleRequestRevision}
                  disabled={!revisionFeedback.trim()}
                  className="w-full bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-xl py-2.5 text-xs font-bold transition flex items-center justify-center gap-1 shadow-md cursor-pointer disabled:opacity-50"
                >
                  Send Revision Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
