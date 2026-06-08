"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { CreatorProfile } from "@/lib/supabase/types";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Instagram, 
  Youtube, 
  Sparkles, 
  MessageSquare,
  X,
  Check,
  ChevronRight
} from "lucide-react";

interface VettedCreator extends CreatorProfile {
  full_name: string;
  avatar_url: string | null;
  followers: string;
}

const MOCK_CREATORS = [
  {
    id: "22222222-2222-2222-2222-222222222222",
    full_name: "Rahul Sharma",
    avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
    phone: "+91 99999 88888",
    location: "New Delhi, Delhi",
    bio: "Active UGC creator specializing in high-energy fitness tutorials, commercial athletic reviews, and organic lifestyle shorts. Focuses on high conversion rates.",
    niche: ["Fitness", "Lifestyle", "Athletic Footwear"],
    instagram_url: "https://instagram.com/rahul_ugc_fit",
    youtube_url: "https://youtube.com/c/RahulFitnessUGC",
    tiktok_url: "https://tiktok.com/@rahul_ugc_shorts",
    portfolio_links: [{ name: "Fitness Portfolio", url: "https://ugcfy.com/portfolios/rahul" }],
    rate_card: { video_15s: 5000, video_30s: 8000, photoshoot: 3000 },
    followers: "42.8K"
  },
  {
    id: "c2-uuid-mock",
    full_name: "Pooja Mehta",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    phone: "+91 98888 77777",
    location: "Mumbai, Maharashtra",
    bio: "Fashion and beauty creator capturing aesthetic lifestyle routines. Expert in product placements, unboxings, and high-fashion transitions.",
    niche: ["Fashion", "Beauty", "Lifestyle"],
    instagram_url: "https://instagram.com/pooja_style_ugc",
    youtube_url: null,
    tiktok_url: null,
    portfolio_links: [],
    rate_card: { video_15s: 4000, video_30s: 6500, photoshoot: 2500 },
    followers: "85.2K"
  },
  {
    id: "c3-uuid-mock",
    full_name: "Aman Sen",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    phone: "+91 97777 66666",
    location: "Bengaluru, Karnataka",
    bio: "Tech gear and desk setup reviewer. Creates cinematic tech aesthetic content for brands looking to showcase gadgets, electronics, and accessories.",
    niche: ["Tech", "Productivity"],
    instagram_url: "https://instagram.com/aman_tech_desk",
    youtube_url: "https://youtube.com/c/AmanTechUGC",
    tiktok_url: null,
    portfolio_links: [],
    rate_card: { video_15s: 7000, video_30s: 11000 },
    followers: "120K"
  },
  {
    id: "c4-uuid-mock",
    full_name: "Sneha Rao",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    phone: "+91 96666 55555",
    location: "Hyderabad, Telangana",
    bio: "Food blogger and culinary aesthetic designer. Crafting gourmet kitchen reviews, recipe shorts, and clean organic product testing.",
    niche: ["Food", "Lifestyle", "Beauty"],
    instagram_url: "https://instagram.com/sneha_cooks_ugc",
    youtube_url: null,
    tiktok_url: null,
    portfolio_links: [],
    rate_card: { video_15s: 3000, video_30s: 5000 },
    followers: "18.3K"
  }
];

export default function CreatorsPage() {
  const supabase = createClient();
  const [creators, setCreators] = useState<VettedCreator[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedNiche, setSelectedNiche] = useState<string>("All");
  const [selectedPrice, setSelectedPrice] = useState<string>("All");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [inviteModalCreator, setInviteModalCreator] = useState<VettedCreator | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load creators and campaigns with Supabase live search
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        // 1. Fetch creators from DB with live Supabase .ilike filtering
        let dbQuery = supabase.from("creator_profiles").select("*");

        if (debouncedSearch) {
          dbQuery = dbQuery.or(`full_name.ilike.%${debouncedSearch}%,bio.ilike.%${debouncedSearch}%,location.ilike.%${debouncedSearch}%`);
        }

        const { data: profiles, error } = await dbQuery;

        let fetchedCreators: VettedCreator[] = [];

        if (profiles && profiles.length > 0) {
          fetchedCreators = profiles.map(p => ({
            ...p,
            full_name: p.full_name || "Vetted Creator",
            avatar_url: p.avatar_url || null,
            followers: p.followers || "12.5K"
          }));
        }

        // Fallback to high quality mock vetted creators if DB is empty
        if (fetchedCreators.length === 0) {
          fetchedCreators = MOCK_CREATORS as unknown as VettedCreator[];
        }

        // Apply remaining filters locally (Niche, Price, Platform)
        // This is done locally to easily support filtering the fallback mock data too
        const fullyFiltered = fetchedCreators.filter((creator) => {
          // If we are using mock data, apply the debouncedSearch locally too
          if (profiles?.length === 0 && debouncedSearch) {
             const query = debouncedSearch.toLowerCase();
             const matchesLocalSearch = 
               creator.full_name?.toLowerCase().includes(query) ||
               creator.location?.toLowerCase().includes(query) ||
               creator.bio?.toLowerCase().includes(query) ||
               creator.niche?.some(n => n.toLowerCase().includes(query));
             if (!matchesLocalSearch) return false;
          }

          // Niche filter
          if (selectedNiche !== "All" && !creator.niche?.includes(selectedNiche)) return false;

          // Platform filter
          if (selectedPlatform === "Instagram" && !creator.instagram_url) return false;
          if (selectedPlatform === "YouTube" && !creator.youtube_url) return false;
          if (selectedPlatform === "TikTok" && !creator.tiktok_url) return false;

          // Pricing filter
          const rate15s = creator.rate_card?.video_15s || 0;
          if (selectedPrice === "<5k" && rate15s >= 5000) return false;
          if (selectedPrice === "5k-10k" && (rate15s < 5000 || rate15s > 10000)) return false;
          if (selectedPrice === ">10k" && rate15s <= 10000) return false;

          return true;
        });

        setCreators(fullyFiltered);

        // Fetch brand campaigns for invitations
        const { data: { user } } = await supabase.auth.getUser();
        const activeBrandId = user?.id || "11111111-1111-1111-1111-111111111111";

        const { data: campaignData } = await supabase
          .from("campaigns")
          .select("id, title")
          .eq("brand_id", activeBrandId)
          .eq("status", "Active");

        if (campaignData && campaignData.length > 0) {
          setCampaigns(campaignData);
          setSelectedCampaign(campaignData[0].id);
        } else {
          setCampaigns([
            { id: "44444444-4444-4444-4444-444444444444", title: "Air Max Flyknit 2026 - Fit Test Campaign" }
          ]);
          setSelectedCampaign("44444444-4444-4444-4444-444444444444");
        }

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [supabase, debouncedSearch, selectedNiche, selectedPrice, selectedPlatform]);

  // Invitation Handler
  const handleSendInvite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // prevent card click
    if (!inviteModalCreator || !selectedCampaign) return;

    try {
      // Create invitation entry in database
      const { error } = await supabase
        .from("notifications")
        .insert({
          user_id: inviteModalCreator.id,
          title: "New Campaign Invitation!",
          content: `You have been invited by Nike Sports India to apply for the "${campaigns.find(c => c.id === selectedCampaign)?.title}" campaign.`,
          notification_type: "Info",
          metadata: { campaign_id: selectedCampaign }
        });

      setInviteSuccess(true);
      setTimeout(() => {
        setInviteModalCreator(null);
        setInviteSuccess(false);
      }, 1500);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Creator Discovery</h1>
        <p className="text-sm text-slate-500 mt-1">Browse and vet micro-influencer content specialists. Filter by budget rates, content niche, and channel sizes.</p>
      </div>

      {/* FILTER BAR */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between z-10 relative">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition bg-slate-50/50 focus:bg-white"
            placeholder="Search creators, niche, or location..."
          />
        </div>

        {/* Filters dropdown lists */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* Niche */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Niche:</span>
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-red-500 cursor-pointer"
            >
              <option value="All">All Niches</option>
              <option value="Fitness">Fitness</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Fashion">Fashion</option>
              <option value="Beauty">Beauty</option>
              <option value="Tech">Tech</option>
              <option value="Food">Food</option>
            </select>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Rate (15s):</span>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-red-500 cursor-pointer"
            >
              <option value="All">All Rates</option>
              <option value="<5k">Under ₹5,000</option>
              <option value="5k-10k">₹5,000 - ₹10,000</option>
              <option value=">10k">Above ₹10,000</option>
            </select>
          </div>

          {/* Platform */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Channel:</span>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-red-500 cursor-pointer"
            >
              <option value="All">All Platforms</option>
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
            </select>
          </div>

        </div>

      </div>

      {/* CREATORS GRID */}
      {isLoading && creators.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red-600" />
        </div>
      ) : creators.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
            <Search className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No matching creators</p>
          <p className="text-xs text-slate-400 mt-1">Try relaxing your search terms or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {creators.map((creator) => (
            <Link 
              key={creator.id} 
              href={`/dashboard/creators/${creator.id}`}
              className="block group"
            >
              <motion.div
                layout
                className="glass-card p-6 rounded-3xl flex flex-col justify-between h-full group-hover:border-brand-red-300 group-hover:shadow-lg transition duration-300 cursor-pointer bg-white"
              >
                <div>
                  {/* Header: Avatar, Name, Location */}
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-2xl overflow-hidden bg-brand-red-100 shrink-0 border border-brand-red-200 group-hover:shadow-md transition">
                      {creator.avatar_url ? (
                        <img 
                          src={creator.avatar_url} 
                          alt={creator.full_name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-brand-red-700 font-extrabold text-lg">
                          {creator.full_name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 truncate flex items-center gap-1.5 group-hover:text-brand-red-700 transition">
                        {creator.full_name}
                        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold border border-emerald-100">
                          Vetted
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {creator.location || "India"}
                      </p>
                    </div>
                    
                    {/* Followers Indicator */}
                    <div className="text-right shrink-0">
                      <p className="text-xs font-extrabold text-slate-800">{creator.followers}</p>
                      <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Reach</p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-500 mt-4 line-clamp-3 leading-relaxed">
                    {creator.bio || "No biography provided."}
                  </p>

                  {/* Niches */}
                  <div className="mt-4 flex flex-wrap gap-1">
                    {creator.niche?.map((n) => (
                      <span 
                        key={n}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-red-50 text-brand-red-600 border border-brand-red-100/30"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer: Price rates & Hire action */}
                <div className="border-t border-slate-100 mt-6 pt-4 flex items-center justify-between">
                  
                  {/* Rate details */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Est Rate:</span>
                    <span className="text-sm font-extrabold text-slate-800">
                      ₹{(creator.rate_card?.video_15s || 3000).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">/ 15s Video</span>
                  </div>

                  {/* Social and Hire actions */}
                  <div className="flex items-center gap-2">
                    {/* Instagram link */}
                    {creator.instagram_url && (
                      <a 
                        href={creator.instagram_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition z-10"
                        title="Instagram Profile"
                      >
                        <Instagram className="h-4 w-4" />
                      </a>
                    )}
                    {/* YouTube link */}
                    {creator.youtube_url && (
                      <a 
                        href={creator.youtube_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition z-10"
                        title="YouTube Channel"
                      >
                        <Youtube className="h-4 w-4" />
                      </a>
                    )}

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setInviteModalCreator(creator);
                      }}
                      className="ml-2 px-3 py-1.5 bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-sm z-10"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      Invite
                    </button>
                  </div>

                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}

      {/* INVITATION MODAL */}
      <AnimatePresence>
        {inviteModalCreator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={(e) => { e.stopPropagation(); setInviteModalCreator(null); }}
              className="absolute inset-0 bg-black"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 z-10"
            >
              <button 
                onClick={(e) => { e.stopPropagation(); setInviteModalCreator(null); }}
                className="absolute right-4 top-4 p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="text-center pb-6">
                <div className="mx-auto h-12 w-12 rounded-full bg-brand-red-50 text-brand-red-600 flex items-center justify-center mb-3">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900">Invite Creator</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Invite <span className="font-semibold text-slate-800">{inviteModalCreator.full_name}</span> to partner with your brand.
                </p>
              </div>

              {inviteSuccess ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl flex flex-col items-center justify-center text-center text-xs font-semibold py-8 space-y-2">
                  <Check className="h-6 w-6 text-emerald-600 bg-white p-1 rounded-full border border-emerald-100 shadow-sm" />
                  <span>Invitation sent successfully!</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Select Campaign</label>
                    <select
                      value={selectedCampaign}
                      onChange={(e) => setSelectedCampaign(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition"
                    >
                      {campaigns.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleSendInvite}
                    disabled={campaigns.length === 0}
                    className="w-full bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-xl py-2.5 text-xs font-bold transition flex items-center justify-center gap-1 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    Send Invitation
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
