"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Sparkles, 
  Compass, 
  SlidersHorizontal,
  Heart,
  Volume2,
  VolumeX,
  Plus,
  Check,
  Play
} from "lucide-react";

// Native Cloudinary UGC assets
const DEMO_UGC_VIDEOS = [
  { id: "1", url: "https://res.cloudinary.com/dxlv2xnms/video/upload/v1780558844/CN2466_H3_wlaaor.mp4", creator: "@sneha_ugc", category: "Beauty & Skincare", caption: "Premium serum daily hydration and morning glow wear test." },
  { id: "2", url: "https://res.cloudinary.com/dxlv2xnms/video/upload/v1780558837/CN2466_H2_uckgsc.mp4", creator: "@rohit_creates", category: "Tech Unboxing", caption: "Next-gen mechanical keyboard click sounds and build overview." },
  { id: "3", url: "https://res.cloudinary.com/dxlv2xnms/video/upload/v1780558830/CN2466_H1_i01seg.mp4", creator: "@tanvi_fits", category: "Fitness & Health", caption: "High intensity jump rope conditioning and stretching routine." },
  { id: "4", url: "https://res.cloudinary.com/dxlv2xnms/video/upload/v1780558770/16_ajescr.mp4", creator: "@aman_vlogs", category: "Lifestyle & Travel", caption: "Aesthetic cafe hopping vlog in New Delhi with scenic edits." },
  { id: "5", url: "https://res.cloudinary.com/dxlv2xnms/video/upload/v1780558781/20_bhwhb0.mp4", creator: "@ria_reviews", category: "Fashion Lookbook", caption: "Korean inspired minimal summer linen outfit styling tips." },
  { id: "6", url: "https://res.cloudinary.com/dxlv2xnms/video/upload/v1780558796/22_qho17h.mp4", creator: "@kabir_digital", category: "Gadget Review", caption: "Noise cancelling earbud stress test and audio profiles." }
];

const filterPills = ["All", "Beauty & Skincare", "Tech Unboxing", "Fitness & Health", "Lifestyle & Travel", "Fashion Lookbook", "Gadget Review"];

interface VideoCardProps {
  video: typeof DEMO_UGC_VIDEOS[number];
  isLiked: boolean;
  isShortlisted: boolean;
  onToggleLike: (e: React.MouseEvent) => void;
  onToggleShortlist: (e: React.MouseEvent) => void;
}

function VideoCard({ video, isLiked, isShortlisted, onToggleLike, onToggleShortlist }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Autoplay blocked:", err));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[9/16] bg-slate-950 border border-slate-900/10 rounded-2xl overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-300 select-none text-left"
    >
      <video
        ref={videoRef}
        src={video.url}
        muted={isMuted}
        playsInline
        loop
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none z-10" />

      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
        <span className="text-[8px] font-bold bg-slate-950/80 backdrop-blur-md text-zinc-300 px-2 py-0.5 rounded-full border border-white/5 uppercase tracking-wider">
          {video.category}
        </span>

        <div className="flex gap-2">
          <button 
            type="button"
            onClick={toggleMute}
            className="h-7 w-7 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5 text-brand-red-500" />}
          </button>

          <button 
            type="button"
            onClick={onToggleLike}
            className="h-7 w-7 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            <Heart className={`size-3.5 ${isLiked ? "fill-brand-red-500 text-brand-red-500" : "text-white"}`} />
          </button>
        </div>
      </div>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 group-hover:opacity-0 transition-opacity duration-300">
          <div className="size-10 rounded-full bg-brand-red-600/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-brand-red-600/25">
            <Play className="size-4 text-white fill-white translate-x-0.5" />
          </div>
        </div>
      )}

      <div className="absolute bottom-0 inset-x-0 p-4 z-20 flex flex-col justify-end gap-2.5">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-extrabold text-white tracking-tight">
              {video.creator}
            </span>
            <span className="text-[8px] bg-blue-500 text-white rounded-full h-3 w-3 flex items-center justify-center font-bold">✓</span>
          </div>
          <p className="text-[9px] text-zinc-300 font-semibold leading-relaxed line-clamp-2">
            {video.caption}
          </p>
        </div>

        <button
          onClick={onToggleShortlist}
          className={`w-full py-2 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border select-none ${
            isShortlisted
              ? "bg-emerald-600/95 border-emerald-500 text-white hover:bg-emerald-700"
              : "bg-brand-red-600/95 border-brand-red-500 hover:bg-brand-red-700 text-white shadow-md shadow-brand-red-600/15"
          }`}
        >
          {isShortlisted ? (
            <>
              <Check className="size-3 stroke-[3]" />
              <span>Shortlisted!</span>
            </>
          ) : (
            <>
              <Plus className="size-3" />
              <span>Shortlist Creator</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function FeedPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(true);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);

  const handleToggleLike = (id: string) => {
    setLikedIds((prev) => 
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleShortlist = (id: string) => {
    setShortlistedIds((prev) => 
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredVideos = DEMO_UGC_VIDEOS.filter((video) => {
    const matchesSearch = 
      video.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.caption.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeFilter === "All" || video.category === activeFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-12 selection:bg-brand-red-100 select-none">
      
      {/* Header section - NOT sticky, scrolls naturally */}
      <div className="w-full space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-brand-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-brand-red-500/10">
              <Compass className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Explore Feed</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Discover and shortlist top-performing UGC creators for your campaigns.</p>
            </div>
          </div>
        </div>

        {/* Integrated Search & Filter Bar */}
        <div className="w-full">
          <div className="relative flex items-center w-full max-w-2xl bg-white/50 backdrop-blur-md border border-gray-200/80 rounded-xl shadow-sm transition-all focus-within:border-red-500/50 focus-within:ring-2 focus-within:ring-red-500/10">
            <Search className="size-5 text-gray-400 ml-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search niche, creator or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent pl-3 pr-24 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 border-none"
            />
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-medium text-gray-600 rounded-lg transition-colors cursor-pointer select-none"
            >
              <SlidersHorizontal className="size-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Category Pills Sub-header */}
        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 8 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="w-full flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
                {filterPills.map((pill) => {
                  const isSelected = activeFilter === pill;
                  return (
                    <button
                      key={pill}
                      onClick={() => setActiveFilter(pill)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                        isSelected 
                          ? "bg-brand-red-600 text-white shadow-md shadow-brand-red-600/15" 
                          : "bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {pill}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LUXURY FEED CARDS GRID */}
      {filteredVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white/40 border border-slate-200/50 rounded-2xl">
          <Compass className="h-10 w-10 text-slate-300 animate-spin" style={{ animationDuration: "10s" }} />
          <p className="text-sm font-bold text-slate-400 mt-3">No matching creative clips in this category</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting your search query or category filters.</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-8"
        >
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              isLiked={likedIds.includes(video.id)}
              isShortlisted={shortlistedIds.includes(video.id)}
              onToggleLike={() => handleToggleLike(video.id)}
              onToggleShortlist={() => handleToggleShortlist(video.id)}
            />
          ))}
        </motion.div>
      )}

    </div>
  );
}
