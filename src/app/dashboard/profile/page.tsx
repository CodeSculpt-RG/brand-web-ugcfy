"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { BrandProfile, BrandPoc, Campaign } from "@/lib/supabase/types";
import { 
  Building, 
  Globe, 
  Phone, 
  MapPin, 
  Star, 
  Video, 
  Users, 
  Wallet, 
  FileText, 
  ArrowUpRight, 
  Briefcase, 
  Mail,
  ShieldCheck,
  Download,
  Image as ImageIcon,
  Camera
} from "lucide-react";

export default function ProfilePage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<"overview" | "campaigns" | "poc" | "assets">("overview");
  
  const [profile, setProfile] = useState<BrandProfile & { contact_email?: string }>({
    id: "",
    company_name: "",
    website_url: "",
    industry: "",
    phone: "",
    location: "",
    business_description: "",
    contact_email: ""
  });

  const [stats, setStats] = useState({
    campaignsCount: 14,
    escrowDeployed: 485000,
    creatorRating: 4.85,
    pocCount: 3
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pocs, setPocs] = useState<BrandPoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile, campaigns, and POCs
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        const activeBrandId = user?.id || "11111111-1111-1111-1111-111111111111"; // Fallback to Nike in demo

        // Fetch Profile
        const { data: brandData } = await supabase
          .from("brand_profiles")
          .select("*")
          .eq("id", activeBrandId)
          .single();

        if (brandData) {
          setProfile({
            ...brandData,
            contact_email: user?.email || "nike_brand@ugcfy.com"
          });
        } else {
          setProfile({
            id: activeBrandId,
            company_name: "Nike Sports India",
            website_url: "https://nike.com",
            industry: "Athletic Apparels & Footwear",
            phone: "+91 80 4434 5000",
            location: "Bengaluru, Karnataka",
            business_description: "Nike is the world's leading designer, marketer, and distributor of authentic athletic footwear, apparel, equipment, and accessories. Our mission is to bring inspiration and innovation to every athlete in the world.",
            contact_email: "nike_brand@ugcfy.com"
          });
        }

        // Fetch POCs
        const { data: pocData } = await supabase
          .from("brand_poc")
          .select("*")
          .eq("brand_id", activeBrandId);

        if (pocData && pocData.length > 0) {
          setPocs(pocData);
          setStats(prev => ({ ...prev, pocCount: pocData.length }));
        } else {
          setPocs([
            { id: "poc-1", brand_id: activeBrandId, name: "Anjali Sen", email: "anjali@nike.in", role: "UGC Campaign Director", photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330", status: "Active" },
            { id: "poc-2", brand_id: activeBrandId, name: "Vikram Malhotra", email: "vikram@nike.in", role: "Sports Marketing Lead", photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", status: "Active" },
            { id: "poc-3", brand_id: activeBrandId, name: "Rohan Das", email: "rohan@nike.in", role: "Digital Producer Assistant", photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", status: "Pending Admin Approval" }
          ]);
        }

        // Fetch Campaigns
        const { data: campaignData } = await supabase
          .from("campaigns")
          .select("*")
          .eq("brand_id", activeBrandId);

        if (campaignData && campaignData.length > 0) {
          setCampaigns(campaignData);
          setStats(prev => ({ ...prev, campaignsCount: campaignData.length }));
        } else {
          setCampaigns([
            {
              id: "c-1",
              brand_id: activeBrandId,
              title: "Air Max Flyknit 2026 - Fit Test Campaign",
              description: "Athletic creators wanted to showcase the durability and cushioning of our new Flyknit running models.",
              budget: 25000,
              requirements: null,
              creators_needed: 2,
              submissions_count: 1,
              deadline: "July 6, 2026",
              status: "Active"
            },
            {
              id: "c-2",
              brand_id: activeBrandId,
              title: "Dri-FIT Run-Club Promotional Launch",
              description: "Seeking community runners and outdoor creators to showcase Dri-FIT summer shirts.",
              budget: 12000,
              requirements: null,
              creators_needed: 1,
              submissions_count: 0,
              deadline: "June 21, 2026",
              status: "Draft"
            }
          ]);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [supabase]);

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
        
        {/* Cover Banner (Strict height restriction h-48 md:h-56) */}
        <div className="h-48 md:h-56 w-full relative group cursor-pointer bg-gradient-to-tr from-brand-red-700 via-rose-950 to-slate-900 overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          {/* Cover photo image overlay mock */}
          <img 
            src="https://images.unsplash.com/photo-1507398909848-53ab29396772" 
            alt="Brand Cover" 
            className="w-full h-full object-cover opacity-45 mix-blend-overlay"
          />
          
          {/* Editable State */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-sm">
            <Camera className="h-5 w-5" />
            <span>Change Cover</span>
          </div>
        </div>

        {/* Brand Details Layer */}
        <div className="px-6 relative flex flex-col text-left">
          
          {/* Overlapping circular avatar */}
          <div className="-mt-16 md:-mt-20 z-10 relative inline-block self-start">
            <div className="size-32 rounded-full border-4 border-white shadow-xl relative group cursor-pointer bg-white overflow-hidden flex items-center justify-center">
              {/* Fallback to text initials or premium image */}
              <div className="h-full w-full bg-gradient-to-br from-brand-red-600 to-rose-700 flex items-center justify-center text-white font-extrabold text-3xl tracking-tighter">
                NIKE
              </div>
              
              {/* Editable State */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <Camera className="h-5 w-5" />
                <span className="text-[10px] font-bold mt-1">Edit Logo</span>
              </div>
            </div>
          </div>

          {/* Brand Identity details aligned left below avatar */}
          <div className="mt-4 space-y-2.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                {profile.company_name}
                <ShieldCheck className="h-6 w-6 text-brand-red-500 fill-brand-red-50" />
              </h1>
              
              {/* Enterprise Tier badge */}
              <div className="px-3 py-1 bg-gradient-to-r from-brand-red-50 to-rose-50 border border-brand-red-100/40 text-brand-red-600 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <span className="h-1.5 w-1.5 bg-brand-red-600 rounded-full animate-ping" />
                Verified Enterprise
              </div>
            </div>

            {/* Industry and Metadata */}
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{profile.industry}</p>

            {/* Website & Location links */}
            <div className="flex flex-wrap items-center gap-4 text-slate-500 text-xs font-semibold pt-1">
              <a 
                href={profile.website_url || "#"} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-brand-red-600 transition"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>{profile.website_url?.replace("https://", "")}</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
              
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </span>
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
            {profile.business_description}
          </p>
          
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-x-6 gap-y-2.5 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400" />
              Hotline: {profile.phone}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" />
              Contact: {profile.contact_email}
            </div>
          </div>
        </div>

        {/* Bento stats cards: Total Campaigns, Escrow Deployed, Creator Rating, Approved POCs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* stat 1 */}
          <div className="bg-white/60 backdrop-blur-xl border border-slate-200/50 hover:bg-white hover:border-slate-300 transition-all duration-300 p-5 rounded-2xl text-left flex flex-col justify-between h-32 relative overflow-hidden group shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Campaigns</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{stats.campaignsCount}</h3>
            <Video className="absolute right-3 bottom-3 h-8 w-8 text-slate-200/40 group-hover:text-brand-red-500/10 transition" />
          </div>

          {/* stat 2 */}
          <div className="bg-white/60 backdrop-blur-xl border border-slate-200/50 hover:bg-white hover:border-slate-300 transition-all duration-300 p-5 rounded-2xl text-left flex flex-col justify-between h-32 relative overflow-hidden group shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Escrow Deployed</p>
            <h3 className="text-xl font-extrabold text-slate-800">₹{(stats.escrowDeployed / 1000).toFixed(0)}k</h3>
            <Wallet className="absolute right-3 bottom-3 h-8 w-8 text-slate-200/40 group-hover:text-brand-red-500/10 transition" />
          </div>

          {/* stat 3 */}
          <div className="bg-white/60 backdrop-blur-xl border border-slate-200/50 hover:bg-white hover:border-slate-300 transition-all duration-300 p-5 rounded-2xl text-left flex flex-col justify-between h-32 relative overflow-hidden group shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Creator Rating</p>
            <h3 className="text-2xl font-extrabold text-amber-600 flex items-center gap-1">
              {stats.creatorRating}
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
            </h3>
            <Star className="absolute right-3 bottom-3 h-8 w-8 text-slate-200/40 group-hover:text-brand-red-500/10 transition" />
          </div>

          {/* stat 4 */}
          <div className="bg-white/60 backdrop-blur-xl border border-slate-200/50 hover:bg-white hover:border-slate-300 transition-all duration-300 p-5 rounded-2xl text-left flex flex-col justify-between h-32 relative overflow-hidden group shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Approved POCs</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{stats.pocCount}</h3>
            <Users className="absolute right-3 bottom-3 h-8 w-8 text-slate-200/40 group-hover:text-brand-red-500/10 transition" />
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
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer relative ${
                    isActive ? "text-brand-red-600" : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-red-600 rounded-full"
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
                  {campaigns.map((c) => (
                    <div key={c.id} className="glass-card p-6 rounded-3xl bg-white flex flex-col justify-between h-48 border border-slate-200/60 shadow-sm">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                            c.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            {c.status}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-400">₹{c.budget.toLocaleString()}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-3">{c.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{c.description}</p>
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex items-center justify-between mt-4">
                        <span className="text-[9px] font-bold text-slate-400">Deadline: {new Date(c.deadline).toLocaleDateString()}</span>
                        <button className="text-brand-red-600 hover:text-brand-red-700 font-bold text-[10px] uppercase tracking-wider cursor-pointer">
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
                  {pocs.map((poc) => (
                    <div key={poc.id} className="glass-card p-5 rounded-3xl bg-white flex items-center gap-3 border border-slate-200/60 shadow-sm">
                      <img 
                        src={poc.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(poc.name)}`}
                        alt={poc.name} 
                        className="h-10 w-10 rounded-full object-cover border border-slate-200 bg-slate-50"
                      />
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{poc.name}</h4>
                        <p className="text-[9px] font-bold text-slate-400 mt-0.5 truncate">{poc.role}</p>
                        <span className={`inline-block mt-2 px-2 py-0.5 text-[8px] font-bold uppercase rounded-full ${
                          poc.status === "Active" 
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
                    <button className="p-2 hover:bg-slate-50 text-slate-400 hover:text-brand-red-600 rounded-xl border border-slate-200/60 cursor-pointer">
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
                    <button className="p-2 hover:bg-slate-50 text-slate-400 hover:text-brand-red-600 rounded-xl border border-slate-200/60 cursor-pointer">
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
