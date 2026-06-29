/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandProfile, BrandPoc, Campaign } from "@/lib/supabase/types";
import {
  Globe,
  Phone,
  MapPin,
  Star,
  Video,
  Users,
  Wallet,
  FileText,
  ArrowUpRight,
  AtSign,
  ShieldCheck,
  Download,
  Image as ImageIcon,
  Camera
} from "lucide-react";
import { SafeAvatar } from "@/components/dashboard/SafeAvatar";
import { normalizeImageUrl } from "@/lib/shared/normalizeImage";
import { formatDashboardDate } from "@/lib/dashboard/formatDashboardDate";
import { formatDashboardNumber } from "@/lib/dashboard/formatDashboardNumber";
import { useRouter } from "next/navigation";
import { useRef } from "react";

interface Props {
  initialProfile: any;
  initialCampaigns: any[];
  initialPocs: any[];
}

export function ProfileClient({ initialProfile, initialCampaigns, initialPocs }: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "campaigns" | "poc" | "assets">("overview");

  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [pocs, setPocs] = useState<BrandPoc[]>(initialPocs);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpload = async (file: File, assetType: string) => {
    setIsUploading(true);
    setUploadMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("assetType", assetType);

      const res = await fetch("/api/brand/profile-assets", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setUploadMessage({ type: "error", text: data.error || "Upload failed" });
        return;
      }

      setProfile((prev: any) => ({
        ...prev,
        [assetType === "avatar" || assetType === "logo" ? "logo_url" : "cover_image_url"]: data.url
      }));
      setUploadMessage({ type: "success", text: "Image updated successfully!" });
      setTimeout(() => setUploadMessage(null), 3000);
      router.refresh();
    } catch (err) {
      console.error(err);
      setUploadMessage({ type: "error", text: "Error uploading file" });
    } finally {
      setIsUploading(false);
    }
  };

  const [stats, setStats] = useState({
    campaignsCount: initialCampaigns.length,
    escrowDeployed: initialCampaigns.reduce((acc, c) => acc + (c.budget || 0), 0),
    creatorRating: 4.85,
    pocCount: initialPocs.filter(p => p.status === "Active").length
  });

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "campaigns", label: "Active Campaigns" },
    { id: "poc", label: "POC Directory" },
    { id: "assets", label: "Brand Assets" }
  ] as const;

  return (
    <div className="space-y-6">

      {/* 1. LINKEDIN-STYLE HERO PROFILE CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden pb-6">

        {uploadMessage && (
          <div className={`p-4 text-center text-sm font-bold text-white ${uploadMessage.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}>
            {uploadMessage.text}
          </div>
        )}
        {/* Cover Banner (Strict height restriction h-48 md:h-56) */}
        <div 
          className="h-48 md:h-56 w-full relative group cursor-pointer bg-gradient-to-tr from-red-700 via-rose-950 to-slate-900 overflow-hidden"
          onClick={() => document.getElementById("coverUpload")?.click()}
        >
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Cover photo image overlay */}
          {normalizeImageUrl(profile.cover_image_url) && (
            <img
              src={normalizeImageUrl(profile.cover_image_url) as string}
              alt="Brand Cover"
              className="w-full h-full object-cover opacity-45 mix-blend-overlay"
            />
          )}

          {/* Editable State */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-sm">
            {isUploading ? (
               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
               <>
                 <Camera className="h-5 w-5" />
                 <span>Change Cover</span>
               </>
            )}
          </div>
          <input 
            type="file" 
            id="coverUpload" 
            className="hidden" 
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              if (e.target.files?.[0]) handleUpload(e.target.files[0], "cover");
            }}
          />
        </div>

        {/* Brand Details Layer */}
        <div className="px-6 relative flex flex-col text-left">

          {/* Overlapping circular avatar */}
          <div className="-mt-16 md:-mt-20 z-10 relative inline-block self-start">
            <div 
              className="size-32 rounded-full border-4 border-white shadow-xl relative group cursor-pointer bg-white overflow-hidden flex items-center justify-center"
              onClick={() => document.getElementById("logoUpload")?.click()}
            >
              {/* Fallback to text initials or premium image */}
              <SafeAvatar
                src={profile.logo_url}
                name={profile.brand_name ?? profile.company_name ?? "UGC FY"}
                alt={`${profile.brand_name ?? "Brand"} logo`}
                size="xl"
                className="h-full w-full bg-gradient-to-br from-red-600 to-rose-700 text-white border-0 shadow-none text-3xl font-extrabold tracking-tighter"
              />

              {/* Editable State */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                ) : (
                  <>
                    <ImageIcon className="h-6 w-6 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Update</span>
                  </>
                )}
              </div>
              <input 
                type="file" 
                id="logoUpload" 
                className="hidden" 
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleUpload(e.target.files[0], "logo");
                }}
              />
            </div>
          </div>

          {/* Brand Identity details aligned left below avatar */}
          <div className="mt-4 space-y-2.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                {profile.company_name}
                <ShieldCheck className="h-6 w-6 text-red-500 fill-red-50" />
              </h1>

              {/* Go Plus Tier badge */}
              <div className="px-3 py-1 bg-gradient-to-r from-red-50 to-rose-50 border border-red-100/40 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <span className="h-1.5 w-1.5 bg-red-600 rounded-full animate-ping" />
                Verified Go Plus
              </div>
            </div>

            {/* Industry and Metadata */}
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{profile.industry || "General"}</p>

            {/* Website & Location links */}
            <div className="flex flex-wrap items-center gap-4 text-slate-500 text-xs font-semibold pt-1">
              {profile.website_url && (
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-red-600 transition"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>{profile.website_url.replace("https://", "")}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              )}

              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location}
                </span>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* 2. BIO & BENTO STATISTICS GRID (STACKED FOR HIGH DENSITY DENSITY) */}
      <div className="space-y-6">

        {/* Bio Section */}
        <div className="glass-card p-6 rounded-3xl text-left space-y-4 border border-slate-200/60 shadow-sm bg-white">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Brand Narrative
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {profile.business_description || "No description provided."}
          </p>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-x-6 gap-y-2.5 text-xs font-bold text-slate-500">
            {profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400" />
                Hotline: {profile.phone}
              </div>
            )}
            <div className="flex items-center gap-2">
              <AtSign className="h-4 w-4 text-slate-400" />
              Account email: {profile.contact_email}
            </div>
          </div>
        </div>

        {/* Bento stats cards: Total Campaigns, Escrow Deployed, Creator Rating, Approved POCs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* stat 1 */}
          <div className="bg-white/60 backdrop-blur-xl border border-slate-200/50 hover:bg-white hover:border-slate-300 transition-all duration-300 p-5 rounded-2xl text-left flex flex-col justify-between h-32 relative overflow-hidden group shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Campaigns</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{stats.campaignsCount}</h3>
            <Video className="absolute right-3 bottom-3 h-8 w-8 text-slate-200/40 group-hover:text-red-500/10 transition" />
          </div>

          {/* stat 2 */}
          <div className="bg-white/60 backdrop-blur-xl border border-slate-200/50 hover:bg-white hover:border-slate-300 transition-all duration-300 p-5 rounded-2xl text-left flex flex-col justify-between h-32 relative overflow-hidden group shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Escrow Deployed</p>
            <h3 className="text-xl font-extrabold text-slate-800">₹{(stats.escrowDeployed / 1000).toFixed(0)}k</h3>
            <Wallet className="absolute right-3 bottom-3 h-8 w-8 text-slate-200/40 group-hover:text-red-500/10 transition" />
          </div>

          {/* stat 3 */}
          <div className="bg-white/60 backdrop-blur-xl border border-slate-200/50 hover:bg-white hover:border-slate-300 transition-all duration-300 p-5 rounded-2xl text-left flex flex-col justify-between h-32 relative overflow-hidden group shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Creator Rating</p>
            <h3 className="text-2xl font-extrabold text-amber-600 flex items-center gap-1">
              {stats.creatorRating}
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
            </h3>
            <Star className="absolute right-3 bottom-3 h-8 w-8 text-slate-200/40 group-hover:text-red-500/10 transition" />
          </div>

          {/* stat 4 */}
          <div className="bg-white/60 backdrop-blur-xl border border-slate-200/50 hover:bg-white hover:border-slate-300 transition-all duration-300 p-5 rounded-2xl text-left flex flex-col justify-between h-32 relative overflow-hidden group shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Approved POCs</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{stats.pocCount}</h3>
            <Users className="absolute right-3 bottom-3 h-8 w-8 text-slate-200/40 group-hover:text-red-500/10 transition" />
          </div>

        </div>

      </div>

      {/* 3. STICKY CONTENT TABS SYSTEM */}
      <div className="space-y-6">

        {/* Navigation underline indicator */}
        <div className="border-b border-slate-200/60 sticky top-[72px] bg-slate-50/90 backdrop-blur-md z-10 py-1.5">
          <div className="flex items-center gap-6 max-w-7xl mx-auto w-full overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer relative ${isActive ? "text-red-600" : "text-slate-400 hover:text-slate-700"
                    }`}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-red-600 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Tab Panels */}
        <div className="min-h-[250px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >

              {/* TAB 1: OVERVIEW & TONE */}
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="glass-card p-6 rounded-3xl bg-white space-y-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 flex items-center gap-1.5">
                      Visual Brand voice
                    </h4>
                    <div className="space-y-3 text-xs leading-relaxed text-slate-600">
                      <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                        <span className="font-extrabold text-slate-700 block">Tone of Content</span>
                        <span className="font-semibold text-slate-500 mt-0.5 block">Professional, Inspiring, High-Energy</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                        <span className="font-extrabold text-slate-700 block">Visual Guidelines</span>
                        <span className="font-semibold text-slate-500 mt-0.5 block">Cinematic wide angle shots, outdoor tracks, clean gym backdrops</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-3xl bg-white space-y-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-800">
                      Product Directives
                    </h4>
                    <div className="space-y-3 text-xs leading-relaxed text-slate-600">
                      <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                        <span className="font-extrabold text-emerald-700 block">DOs</span>
                        <span className="font-semibold text-slate-500 mt-0.5 block">Emphasize cushioning technology in close-up slow motion.</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                        <span className="font-extrabold text-red-700 block">DONTs</span>
                        <span className="font-semibold text-slate-500 mt-0.5 block">Avoid busy street clutter or low-light indoor studios.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ACTIVE CAMPAIGNS */}
              {activeTab === "campaigns" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                  {campaigns.length === 0 ? (
                    <div className="col-span-1 sm:col-span-2 text-center py-12 text-slate-400 font-bold text-sm">
                      No active campaigns found.
                    </div>
                  ) : campaigns.map((c) => (
                    <div key={c.id} className="glass-card p-6 rounded-3xl bg-white flex flex-col justify-between h-48 border border-slate-200/60 shadow-sm">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${c.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                            }`}>
                            {c.status}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-400">₹{formatDashboardNumber(c.budget)}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-3">{c.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{c.description}</p>
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex items-center justify-between mt-4">
                        <span className="text-[9px] font-bold text-slate-400">Deadline: {formatDashboardDate(c.deadline)}</span>
                        <button className="text-red-600 hover:text-red-700 font-bold text-[10px] uppercase tracking-wider cursor-pointer">
                          View details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: POC DIRECTORY */}
              {activeTab === "poc" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                  {pocs.length === 0 ? (
                    <div className="col-span-1 sm:col-span-3 text-center py-12 text-slate-400 font-bold text-sm">
                      No POCs found.
                    </div>
                  ) : pocs.map((poc) => (
                    <div key={poc.id} className="glass-card p-5 rounded-3xl bg-white flex items-center gap-3 border border-slate-200/60 shadow-sm">
                      <img
                        src={poc.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(poc.name || "U")}`}
                        alt={poc.name}
                        className="h-10 w-10 rounded-full object-cover border border-slate-200 bg-slate-50"
                      />
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{poc.name}</h4>
                        <p className="text-[9px] font-bold text-slate-400 mt-0.5 truncate">{poc.role}</p>
                        <span className={`inline-block mt-2 px-2 py-0.5 text-[8px] font-bold uppercase rounded-full ${poc.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                          {poc.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: BRAND ASSETS */}
              {activeTab === "assets" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                  {/* asset 1 */}
                  <div className="glass-card p-5 rounded-3xl bg-white border border-slate-200/60 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center border border-slate-200 shrink-0">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Vector Logo Pack</h4>
                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">SVG / EPS format (4.2MB)</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl border border-slate-200/60 cursor-pointer">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>

                  {/* asset 2 */}
                  <div className="glass-card p-5 rounded-3xl bg-white border border-slate-200/60 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center border border-slate-200 shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Creative Media Kit</h4>
                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">PDF Guidelines (12.4MB)</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl border border-slate-200/60 cursor-pointer">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
