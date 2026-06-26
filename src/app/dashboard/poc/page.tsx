"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { BrandPoc } from "@/lib/supabase/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Users,
  Plus,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  ShieldAlert,
  Sparkles,
  Mail,
  User,
  Briefcase
} from "lucide-react";
import { getErrorMessage } from "@/lib/utils/error";

// Form Schema
const pocSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  photo_url: z.string().url("Invalid image URL").or(z.literal("")),
});

type PocFormValues = z.infer<typeof pocSchema>;

export default function PocPage() {
  const supabase = createClient();
  const [pocs, setPocs] = useState<BrandPoc[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState("free");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load POCs
  const loadPocs = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      const activeBrandId = user?.id || "11111111-1111-1111-1111-111111111111"; // Fallback to Nike in demo
      // Fetch current subscription status
      const { data: brandProfile } = await supabase
        .from("brand_profiles")
        .select("subscription_status")
        .eq("id", activeBrandId)
        .single();

      if (brandProfile) {
        setSubscriptionStatus(brandProfile.subscription_status || "free");
      } else {
        setSubscriptionStatus("free");
      }
      const { data, error } = await supabase
        .from("brand_poc")
        .select("*")
        .eq("brand_id", activeBrandId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setPocs(data);
      } else {
        // Mock default POCs
        setPocs([
          {
            id: "poc-1",
            brand_id: activeBrandId,
            name: "Anjali Sen",
            email: "anjali@nike.in",
            role: "UGC Campaign Director",
            photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
            status: "Active",
            created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "poc-2",
            brand_id: activeBrandId,
            name: "Vikram Malhotra",
            email: "vikram@nike.in",
            role: "Sports Marketing Lead",
            photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
            status: "Active",
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "poc-3",
            brand_id: activeBrandId,
            name: "Rohan Das",
            email: "rohan@nike.in",
            role: "Digital Producer Assistant",
            photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
            status: "Pending Admin Approval",
            created_at: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PocFormValues>({
    resolver: zodResolver(pocSchema),
    defaultValues: {
      photo_url: "",
    }
  });

  const onSubmit = async (data: PocFormValues) => {
    if (subscriptionStatus === "free" && pocs.length >= 3) {
      window.dispatchEvent(new CustomEvent("open-subscription-paywall"));
      return;
    }

    try {
      const payload = {
        full_name: data.name,
        email: data.email,
        designation: data.role,
        is_primary: false,
        phone: ""
      };

      const res = await fetch("/api/brand/poc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 160)}`);
      }

      const result = await res.json();

      if (!res.ok || !result.ok) {
        throw new Error(result.error?.message || "Failed to add POC");
      }

      // We added successfully, reload POCs
      await loadPocs();
      setIsAddOpen(false);
      reset();
      setErrorMsg(null);
      window.dispatchEvent(new CustomEvent("increment-poc-count"));
    } catch (err) {
      console.error("Failed to add POC:", err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to add POC");
    }
  };

  // Delete POC handler
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/brand/poc?id=${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 160)}`);
      }

      const result = await res.json();
      if (!res.ok || !result.ok) {
        throw new Error(result.error?.message || "Failed to delete POC");
      }
      setPocs(prev => prev.filter(p => p.id !== id));
      setErrorMsg(null);
      window.dispatchEvent(new CustomEvent("decrement-poc-count"));
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to delete POC");
    }
  };

  return (
    <div className="space-y-8 relative">

      {/* Header with Tier Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Point of Contacts (POC)</h1>
          <p className="text-sm text-slate-500 mt-1">Manage corporate supervisors allotted to monitor creator pitches, contracts, and chat rooms.</p>
        </div>

        {/* Tier Controls & Add Action */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-[11px] font-bold border border-slate-200">
            <button
              onClick={() => setSubscriptionStatus("free")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${subscriptionStatus === "free"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
                }`}
            >
              Free Tier (Max 3)
            </button>
            <button
              onClick={() => setSubscriptionStatus("premium")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${subscriptionStatus !== "free"
                  ? "bg-gradient-to-r from-brand-red-600 to-rose-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
                }`}
            >
              Go Plus
            </button>
          </div>

          <button
            onClick={() => {
              if (subscriptionStatus === "free" && pocs.length >= 3) {
                window.dispatchEvent(new CustomEvent("open-subscription-paywall"));
              } else {
                setIsAddOpen(true);
              }
            }}
            className="px-4 py-2.5 bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-brand-red-600/15 flex items-center gap-1.5 cursor-pointer w-fit"
          >
            <Plus className="h-4 w-4" />
            Add POC
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-xs font-semibold">
          <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Overview stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Registered</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{pocs.length}</h3>
          </div>
          <div className="h-10 w-10 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Active Staff</p>
            <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">
              {pocs.filter(p => p.status === "Active").length}
            </h3>
          </div>
          <div className="h-10 w-10 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-xl flex items-center justify-center">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Pending Verification</p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
              {pocs.filter(p => p.status === "Pending Admin Approval").length}
            </h3>
          </div>
          <div className="h-10 w-10 bg-amber-50 text-amber-500 border border-amber-100 rounded-xl flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      {isLoading && pocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red-600" />
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="px-6 py-4">Point of Contact</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Corporate Role</th>
                  <th className="px-6 py-4">Approval Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {pocs.map((poc) => (
                  <tr key={poc.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={poc.photo_url || ""}
                          alt={poc.name}
                          className="h-9 w-9 rounded-full object-cover border border-slate-100 bg-slate-50 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(poc.name)}&background=F3F4F6&color=EF4444`;
                          }}
                        />
                        <span className="font-bold text-slate-900">{poc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-medium">
                      {poc.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-600">
                      {poc.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${poc.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : poc.status === "Rejected"
                            ? "bg-red-50 text-brand-red-700 border border-brand-red-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                        {poc.status === "Active" && <CheckCircle2 className="h-3 w-3 shrink-0" />}
                        {poc.status === "Pending Admin Approval" && <Clock className="h-3 w-3 shrink-0" />}
                        {poc.status === "Rejected" && <AlertTriangle className="h-3 w-3 shrink-0" />}
                        {poc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(poc.id)}
                        className="px-2.5 py-1.5 border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-lg text-[10px] font-bold transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD POC DRAWER / SLIDE OUT */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    Add Representative
                    <Sparkles className="h-4 w-4 text-brand-red-500" />
                  </h3>
                  <button
                    onClick={() => setIsAddOpen(false)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                <div className="mt-4 p-3 bg-amber-50 border border-amber-100 text-amber-800 text-[10px] font-bold rounded-lg flex gap-1.5 leading-relaxed">
                  <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-amber-500" />
                  <span>Newly registered POCs require administrative verification before joining active campaign chat rooms.</span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Full Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        {...register("name")}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition"
                        placeholder="Anjali Sen"
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-[10px] font-semibold mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Work Email</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition"
                        placeholder="anjali@nike.in"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-[10px] font-semibold mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Role Title</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                        <Briefcase className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        {...register("role")}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition"
                        placeholder="Campaign Specialist"
                      />
                    </div>
                    {errors.role && <p className="text-red-500 text-[10px] font-semibold mt-1">{errors.role.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Avatar Image URL (Optional)</label>
                    <input
                      type="text"
                      {...register("photo_url")}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition"
                      placeholder="https://images.unsplash.com/... or leave empty"
                    />
                    {errors.photo_url && <p className="text-red-500 text-[10px] font-semibold mt-1">{errors.photo_url.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-xl py-3 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-brand-red-600/10 cursor-pointer"
                  >
                    Submit Representative Application
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
