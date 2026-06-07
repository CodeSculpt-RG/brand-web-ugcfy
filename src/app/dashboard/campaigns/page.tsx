"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Campaign, CampaignRequirement, CampaignStatus } from "@/lib/supabase/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Video, 
  Plus, 
  Calendar, 
  Users, 
  Wallet, 
  X, 
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Trash2,
  FileText,
  Clock,
  ChevronRight
} from "lucide-react";
// Form Schema
const campaignSchema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  budget: z.number().min(100, "Budget must be at least ₹100"),
  creatorsNeeded: z.number().min(1, "At least 1 creator is needed"),
  deadline: z.string().min(1, "Please select a campaign deadline"),
  requirements: z.string().optional(),
  pocId: z.string().optional(),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export default function CampaignsPage() {
  const supabase = createClient();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pocs, setPocs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | "Active" | "Draft" | "Completed">("All");
  const [brandId, setBrandId] = useState<string | null>(null);
  const [pocCount, setPocCount] = useState(0);
  const [subscriptionStatus, setSubscriptionStatus] = useState("free");

  // Load Campaigns
  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      const activeBrandId = user?.id || "11111111-1111-1111-1111-111111111111"; // Fallback to Nike in demo
      setBrandId(activeBrandId);
      // Fetch current POC limit states
      const { data: brandProfile } = await supabase
        .from("brand_profiles")
        .select("poc_count, subscription_status")
        .eq("id", activeBrandId)
        .single();

      if (brandProfile) {
        setPocCount(brandProfile.poc_count || 0);
        setSubscriptionStatus(brandProfile.subscription_status || "free");
      } else {
        setPocCount(2); // Simulated count
        setSubscriptionStatus("free");
      }
      // Load active POCs
      const { data: pocData } = await supabase
        .from("brand_poc")
        .select("*")
        .eq("brand_id", activeBrandId)
        .eq("status", "Active");

      if (pocData && pocData.length > 0) {
        setPocs(pocData);
      } else {
        setPocs([
          { id: "poc-1", name: "Anjali Sen", role: "UGC Campaign Director" },
          { id: "poc-2", name: "Vikram Malhotra", role: "Sports Marketing Lead" }
        ]);
      }

      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("brand_id", activeBrandId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setCampaigns(data);
      } else {
        // Mock default campaigns
        setCampaigns([
          {
            id: "44444444-4444-4444-4444-444444444444",
            brand_id: activeBrandId,
            title: "Air Max Flyknit 2026 - Fit Test Campaign",
            description: "Athletic creators wanted to showcase the durability and cushioning of our new Flyknit running models in short aesthetic videos.",
            budget: 25000.00,
            requirements: [
              { type: "Deliverables", details: "1x 30s High Definition Reel" },
              { type: "Vibe", details: "High-energy athletic outdoor transition" }
            ],
            creators_needed: 2,
            submissions_count: 1,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: "Active",
            created_at: new Date().toISOString()
          },
          {
            id: "55555555-5555-5555-5555-555555555555",
            brand_id: activeBrandId,
            title: "Dri-FIT Run-Club Promotional Launch",
            description: "Seeking community runners and outdoor creators to showcase Dri-FIT summer shirts. Natural, candid style content preferred.",
            budget: 12000.00,
            requirements: [
              { type: "Deliverables", details: "1x 15s Story post with swipe up" }
            ],
            creators_needed: 1,
            submissions_count: 0,
            deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            status: "Draft",
            created_at: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, [supabase]);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      budget: 15000,
      creatorsNeeded: 2,
    }
  });

  // Create Campaign Submission
  const onSubmit = async (data: CampaignFormValues) => {
    setFormError(null);
    setFormSuccess(null);

    const parsedRequirements: CampaignRequirement[] = data.requirements
      ? data.requirements.split(",").map(req => ({ type: "Format", details: req.trim() }))
      : [{ type: "Content", details: "UGC Video Post" }];

    const newCampaign: Omit<Campaign, "id" | "submissions_count" | "created_at" | "updated_at"> = {
      brand_id: brandId || "11111111-1111-1111-1111-111111111111",
      title: data.title,
      description: data.description,
      budget: data.budget,
      requirements: parsedRequirements,
      creators_needed: data.creatorsNeeded,
      deadline: new Date(data.deadline).toISOString(),
      status: "Active",
    };

    try {
      const { data: insertedData, error } = await supabase
        .from("campaigns")
        .insert([newCampaign])
        .select();

      if (error) {
        // If there's an infrastructure issue or we're in offline demo, simulate insertion locally
        console.warn("DB Insert Failed, falling back to local simulation:", error.message);
        const simulated: Campaign = {
          ...newCampaign,
          id: Math.random().toString(36).substring(2, 9),
          submissions_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setCampaigns(prev => [simulated, ...prev]);
        setFormSuccess("Campaign successfully created (Demo Mode)!");
        setPocCount(prev => prev + 1);
        window.dispatchEvent(new CustomEvent("increment-poc-count"));
      } else if (insertedData && insertedData[0]) {
        setCampaigns(prev => [insertedData[0], ...prev]);
        setFormSuccess("Campaign successfully published!");
        setPocCount(prev => prev + 1);
        window.dispatchEvent(new CustomEvent("increment-poc-count"));
      }

      setTimeout(() => {
        setIsModalOpen(false);
        reset();
        setFormSuccess(null);
      }, 1000);

    } catch (err: any) {
      setFormError("Failed to create campaign. Try again.");
    }
  };

  // Delete Campaign handler
  const handleDelete = async (id: string) => {
    try {
      setCampaigns(prev => prev.filter(c => c.id !== id));
      await supabase.from("campaigns").delete().eq("id", id);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (filter === "All") return true;
    return c.status === filter;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Campaign Management</h1>
          <p className="text-sm text-slate-500 mt-1">Create new design mandates, view current active budgets, and monitor creator milestones.</p>
        </div>
        
        <button 
          onClick={() => {
            if (subscriptionStatus === "free" && pocCount >= 3) {
              window.dispatchEvent(new CustomEvent("open-subscription-paywall"));
            } else {
              setIsModalOpen(true);
            }
          }}
          className="px-4 py-2.5 bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-brand-red-600/15 flex items-center justify-center gap-1.5 cursor-pointer w-fit"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200/80 gap-6">
        {(["All", "Active", "Draft", "Completed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-3 text-xs font-bold uppercase tracking-wider relative transition-all cursor-pointer ${
              filter === tab ? "text-brand-red-600 font-extrabold" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
            {filter === tab && (
              <motion.div 
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red-600 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {isLoading && campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red-600" />
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
            <Video className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No campaigns found</p>
          <p className="text-xs text-slate-400 mt-1">Try switching tabs or publish a new campaign.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((c) => (
            <motion.div 
              key={c.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.status === "Active" 
                      ? "bg-red-50 text-brand-red-600 border border-brand-red-100" 
                      : c.status === "Draft" 
                        ? "bg-slate-100 text-slate-500"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  }`}>
                    {c.status}
                  </span>
                  <button 
                    onClick={() => handleDelete(c.id)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded transition cursor-pointer"
                    title="Delete Campaign"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 line-clamp-1">{c.title}</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {c.description}
                </p>

                {/* Requirements list */}
                {c.requirements && c.requirements.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.requirements.slice(0, 3).map((req, index) => (
                      <span key={index} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100 font-medium truncate max-w-full">
                        {req.details}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 mt-6 pt-4 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <p className="text-slate-400 font-medium text-[9px] uppercase tracking-wider">Budget</p>
                    <p className="font-bold text-slate-800 mt-0.5">₹{c.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium text-[9px] uppercase tracking-wider">Needs</p>
                    <p className="font-bold text-slate-800 mt-0.5">{c.creators_needed} Creators</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium text-[9px] uppercase tracking-wider">Pitches</p>
                    <p className="font-bold text-slate-800 mt-0.5">{c.submissions_count || 0}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Deadline: {new Date(c.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                  <span className="text-brand-red-600 hover:text-brand-red-700 font-bold flex items-center gap-0.5 cursor-pointer">
                    Manage
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* CREATE CAMPAIGN DIALOG */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh] z-10"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  Create Campaign Mandate
                  <Sparkles className="h-4.5 w-4.5 text-brand-red-500" />
                </h3>
                <p className="text-xs text-slate-500">Provide campaign instructions, deliverables, and total escrow budgets.</p>
              </div>

              {/* Status messages */}
              {formError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2 text-red-700 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              {formSuccess && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-emerald-800 text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Campaign Title</label>
                  <input
                    type="text"
                    {...register("title")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition"
                    placeholder="e.g. Air Max Fit Test Campaign"
                  />
                  {errors.title && <p className="text-red-500 text-[10px] font-semibold mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Mandate Details / Description</label>
                  <textarea
                    rows={4}
                    {...register("description")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition resize-none"
                    placeholder="Specify the content narrative, format requirements, and brand guidelines..."
                  />
                  {errors.description && <p className="text-red-500 text-[10px] font-semibold mt-1">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Escrow Budget (₹ INR)</label>
                    <input
                      type="number"
                      {...register("budget", { valueAsNumber: true })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition"
                    />
                    {errors.budget && <p className="text-red-500 text-[10px] font-semibold mt-1">{errors.budget.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Creators Needed</label>
                    <input
                      type="number"
                      {...register("creatorsNeeded", { valueAsNumber: true })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition"
                    />
                    {errors.creatorsNeeded && <p className="text-red-500 text-[10px] font-semibold mt-1">{errors.creatorsNeeded.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Campaign Deadline</label>
                    <input
                      type="date"
                      {...register("deadline")}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition"
                    />
                    {errors.deadline && <p className="text-red-500 text-[10px] font-semibold mt-1">{errors.deadline.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Assigned Representative (POC)</label>
                    <select
                      {...register("pocId")}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none bg-white transition"
                    >
                      <option value="">Select POC</option>
                      {pocs.map((poc) => (
                        <option key={poc.id} value={poc.id}>
                          {poc.name} ({poc.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Requirements (Comma Separated tags)</label>
                  <input
                    type="text"
                    {...register("requirements")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition"
                    placeholder="e.g. 1x 30s HD Reel, Athletic setting, Transition shots"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-xl py-3 text-xs font-bold transition shadow-lg shadow-brand-red-600/10 active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                >
                  Publish Campaign & Deposit Escrow
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
