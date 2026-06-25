"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { GroupMessage } from "@/lib/supabase/types";
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Archive, 
  Users, 
  Info, 
  Circle, 
  Search, 
  Clock, 
  ArchiveRestore,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Bold,
  List,
  CheckCircle,
  FileVideo,
  Mic,
  X,
  FileText
} from "lucide-react";

import { z } from "zod";

const CreatorSchema = z.object({
  name: z.string().catch("Creator"),
  tag: z.string().catch(""),
  avatar: z.string().catch("")
});

const MockGroupSchema = z.object({
  id: z.string(),
  campaign_id: z.string().catch(""),
  title: z.string().nullish().transform(v => v || "Campaign Group"),
  is_archived: z.boolean().catch(false),
  last_message: z.string().catch(""),
  unread: z.boolean().catch(false),
  avatar_letters: z.string().catch(""),
  budget: z.number().catch(0),
  escrow_deployed: z.number().catch(0),
  escrow_released: z.number().catch(0),
  creators_count: z.number().catch(0),
  poc_name: z.string().catch(""),
  poc_id: z.string().catch(""),
  deadline: z.string().catch(""),
  status: z.string().catch(""),
  creators: z.array(CreatorSchema).catch([])
});

type MockGroup = z.infer<typeof MockGroupSchema>;

interface AttachmentFile {
  name: string;
  type: "image" | "document" | "voice";
  size?: string;
}

const initialMockGroupsRaw: any[] = [];

// Enforce strict Zod parsing to guarantee properties exist without optional chaining
const initialMockGroups = z.array(MockGroupSchema).parse(initialMockGroupsRaw);

export default function MessagesPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [groups, setGroups] = useState<MockGroup[]>(initialMockGroups);
  const [selectedGroup, setSelectedGroup] = useState<MockGroup | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Attachments State
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  // Accordion Sidebar states
  const [openSections, setOpenSections] = useState({
    overview: true,
    vault: true,
    participants: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Load simulated messages
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([
        {
          id: "m1",
          group_id: "GRP-CMP-101",
          sender_id: "poc-1",
          sender_name: "Anjali Sen (Director)",
          content: "Hi team! Welcome to the Air Max Fit Test Campaign channel. Looking forward to some high quality Reels.",
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: "m2",
          group_id: "GRP-CMP-101",
          sender_id: "creator-sharma",
          sender_name: "Rahul Sharma (Creator)",
          content: "Hey Anjali! Super excited to be shortlisted. I've drafted some transition concepts that focus on outdoor pavement sprints.",
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: "m3",
          group_id: "GRP-CMP-101",
          sender_id: "poc-1",
          sender_name: "Anjali Sen (Director)",
          content: "Please review the lighting in segment 2. It felt a bit dark compared to our standard athletic aesthetic. Let's aim for golden hour outdoor lighting.",
          created_at: new Date(Date.now() - 600000).toISOString()
        }
      ]);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectGroup = (g: MockGroup) => {
    setSelectedGroup(g);
    setAttachments([]);
    setIsRecording(false);
    if (g.id === "GRP-CMP-101") {
      setMessages([
        {
          id: "m1",
          group_id: "GRP-CMP-101",
          sender_id: "poc-1",
          sender_name: "Anjali Sen (Director)",
          content: "Hi team! Welcome to the Air Max Fit Test Campaign channel. Looking forward to some high quality Reels.",
          // eslint-disable-next-line react-hooks/purity
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: "m2",
          group_id: "GRP-CMP-101",
          sender_id: "creator-sharma",
          sender_name: "Rahul Sharma (Creator)",
          content: "Hey Anjali! Super excited to be shortlisted. I've drafted some transition concepts that focus on outdoor pavement sprints.",
          // eslint-disable-next-line react-hooks/purity
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: "m3",
          group_id: "GRP-CMP-101",
          sender_id: "poc-1",
          sender_name: "Anjali Sen (Director)",
          content: "Please review the lighting in segment 2. It felt a bit dark compared to our standard athletic aesthetic. Let's aim for golden hour outdoor lighting.",
          // eslint-disable-next-line react-hooks/purity
          created_at: new Date(Date.now() - 600000).toISOString()
        }
      ]);
    } else if (g.id === "GRP-CMP-102") {
      setMessages([
        {
          id: "m4",
          group_id: "GRP-CMP-102",
          sender_id: "poc-2",
          sender_name: "Vikram Malhotra (Lead)",
          content: "Welcome, let's align on visual guidelines for the Dri-FIT story campaign. Focus on bright, natural outdoor environments.",
          // eslint-disable-next-line react-hooks/purity
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: "m5",
          group_id: "GRP-CMP-102",
          sender_id: "creator-sharma",
          sender_name: "Rahul Sharma (Creator)",
          content: "Shortlist accepted, ready for brief details. Can we shoot indoors if we use studio spotlights?",
          // eslint-disable-next-line react-hooks/purity
          created_at: new Date(Date.now() - 60000).toISOString()
        }
      ]);
    } else {
      setMessages([
        {
          id: "m6",
          group_id: "GRP-CMP-099",
          sender_id: "poc-1",
          sender_name: "Anjali Sen (Director)",
          content: "All videos approved and funds released! Excellent work everyone. This campaign is officially marked completed.",
          // eslint-disable-next-line react-hooks/purity
          created_at: new Date(Date.now() - 3600000 * 48).toISOString()
        },
        {
          id: "m7",
          group_id: "system",
          sender_id: "system",
          sender_name: "System",
          content: "Campaign completed. Group archived.",
          // eslint-disable-next-line react-hooks/purity
          created_at: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && attachments.length === 0) return;

    let textContent = inputValue;
    if (attachments.length > 0) {
      const attachInfo = attachments.map(a => `[Attachment: ${a.name} (${a.type})]`).join("\n");
      textContent = textContent ? `${textContent}\n${attachInfo}` : attachInfo;
    }

    const newMessage: GroupMessage = {
      id: Math.random().toString(),
      group_id: selectedGroup!.id,
      sender_id: "brand-poc-active",
      sender_name: `${selectedGroup!.poc_name} (Brand)`,
      content: textContent,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setAttachments([]);

    setGroups(prev => prev.map(g => {
      if (g.id === selectedGroup!.id) {
        return {
          ...g,
          last_message: `${newMessage.sender_name.split(" ")[0]}: ${newMessage.content.slice(0, 30)}...`
        };
      }
      return g;
    }));
  };

  // Mock upload actions
  const triggerImageUpload = () => {
    const images = ["nike_airmax_brief_shot.jpg", "creator_preview_mock.png", "storyboards_frame_1.jpg"];
    const randomImg = images[Math.floor(Math.random() * images.length)] || "fallback.jpg";
    setAttachments(prev => [...prev, { name: randomImg, type: "image" }]);
  };

  const triggerDocUpload = () => {
    const docs = ["airmax_campaign_terms_v2.pdf", "ugc_deliverables_checklist.docx", "nike_running_brief.pdf"];
    const randomDoc = docs[Math.floor(Math.random() * docs.length)] || "fallback.pdf";
    setAttachments(prev => [...prev, { name: randomDoc, type: "document" }]);
  };

  const triggerVoiceNote = () => {
    if (isRecording) {
      setIsRecording(false);
      setAttachments(prev => [...prev, { name: "Voice Note (0:18).mp3", type: "voice" }]);
    } else {
      setIsRecording(true);
      // Automatically finish after 3 seconds for mock interaction
      setTimeout(() => {
        setIsRecording(curr => {
          if (curr) {
            setAttachments(prev => [...prev, { name: "Voice Note (0:12).mp3", type: "voice" }]);
            return false;
          }
          return false;
        });
      }, 3000);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleArchiveGroup = () => {
    if (!selectedGroup) return;
    setGroups(prev => prev.map(g => {
      if (g.id === selectedGroup.id) {
        const archivedState = !g.is_archived;
        const updated = {
          ...g,
          is_archived: archivedState,
          status: archivedState ? "Completed" : "Active"
        };
        setSelectedGroup(updated);
        return updated;
      }
      return g;
    }));
  };

  const filteredGroups = groups.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArchive = showArchived ? true : !g.is_archived;
    return matchesSearch && matchesArchive;
  });

  return (
    <div className="h-full flex bg-white overflow-hidden w-full relative">
      
      {/* PANEL 1: INBOX / THREADS LIST */}
      <div className="w-80 border-r border-slate-200 flex flex-col h-full bg-slate-50/50 shrink-0">
        
        {/* Panel Header */}
        <div className="p-4 border-b border-slate-200 bg-white space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 flex items-center gap-1.5">
              Workspaces
            </h2>
            
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`p-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 cursor-pointer transition ${
                showArchived 
                  ? "bg-slate-100 text-slate-700 border-slate-300" 
                  : "bg-white text-slate-400 border-slate-200 hover:text-slate-600"
              }`}
            >
              <Archive className="h-3.5 w-3.5" />
              {showArchived ? "Show All" : "Active Only"}
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter campaign rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-100 border border-slate-200/60 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-slate-300 transition"
            />
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100/60">
          {filteredGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <MessageSquare className="h-8 w-8 text-slate-300" />
              <p className="text-[11px] font-bold text-slate-400 mt-2">No active campaign rooms</p>
            </div>
          ) : (
            filteredGroups.map((group) => {
              const isSelected = selectedGroup?.id === group.id;
              return (
                <div
                  key={group.id}
                  onClick={() => handleSelectGroup(group)}
                  className={`p-4 cursor-pointer text-left transition-all relative ${
                    isSelected 
                      ? "bg-red-50/50 border-l-2 border-brand-red-600" 
                      : "hover:bg-white/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-extrabold text-slate-400 tracking-wider">
                      {group.id}
                    </span>
                    {group.unread && (
                      <motion.span 
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="h-2 w-2 bg-brand-red-500 rounded-full"
                      />
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 mt-1 truncate">
                    {group.title}
                  </h4>

                  <p className="text-[10px] text-slate-500 mt-1 truncate font-medium">
                    {group.last_message}
                  </p>

                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {group.creators_count} Creators
                    </span>
                    {group.is_archived && (
                      <span className="text-[8px] font-bold bg-slate-200/70 text-slate-500 px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">
                        Archived
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* PANEL 2: ACTIVE WORKSPACE SLACK/LINEAR-STYLE FLOW */}
      <div className="flex-1 flex flex-col h-full bg-slate-50/20 overflow-hidden relative">
        {selectedGroup ? (
          <>
            {/* Header info */}
            <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-800 font-extrabold flex items-center justify-center text-xs border border-slate-200">
                  {selectedGroup.avatar_letters}
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-extrabold text-slate-900 tracking-tight">{selectedGroup.title}</h3>
                  <p className="text-[9px] font-bold text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span>{selectedGroup.id}</span>
                    <span>•</span>
                    <span className="text-brand-red-600 uppercase">Escrow Locked</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`p-2 rounded-xl transition cursor-pointer border ${
                  showDetails 
                    ? "bg-slate-50 text-slate-600 border-slate-200" 
                    : "bg-white text-slate-400 border-slate-200/60 hover:text-slate-600"
                }`}
              >
                <Info className="h-4 w-4" />
              </button>
            </div>

            {/* Conversation Flow (Slack/Linear flow, ONLY container with overflow scroll) */}
            <div className="flex-1 overflow-y-auto bg-white divide-y divide-slate-100/60 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">No messages yet. Start the conversation.</div>
              ) : (
                messages.map((m) => {
                  const isSystem = m.sender_id === "system";
                  const isBrand = m.sender_id.includes("brand") || m.sender_id.includes("poc");
                  const initials = m.sender_name.slice(0, 2).toUpperCase();

                  if (isSystem) {
                    return (
                      <div key={m.id} className="py-3 px-6 bg-slate-50/50 flex justify-center">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-3 py-0.5 rounded-full flex items-center gap-1">
                          <Circle className="h-1.5 w-1.5 fill-slate-400 text-slate-400" />
                          {m.content}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={m.id} 
                      className={`px-6 py-4 flex gap-4 transition-colors ${
                        isBrand ? "bg-slate-50/30" : "bg-white"
                      }`}
                    >
                      {/* Avatar Left */}
                      <div className="shrink-0">
                        {isBrand ? (
                          <div className="h-9 w-9 rounded-full bg-brand-red-100 text-brand-red-700 font-extrabold flex items-center justify-center text-xs border border-brand-red-200/40">
                            {initials}
                          </div>
                        ) : (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb" 
                              alt={m.sender_name} 
                              className="h-9 w-9 rounded-full object-cover border border-slate-200 bg-slate-50"
                            />
                          </>
                        )}
                      </div>

                      {/* Content block */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-bold text-slate-800">{m.sender_name}</span>
                          <span className="text-[9px] font-semibold text-slate-400">
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-3xl whitespace-pre-wrap">
                          {m.content}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Dock Panel (Rich Media Composer) */}
            <div className="p-4 bg-white/70 backdrop-blur-xl border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] shrink-0">
              {selectedGroup.is_archived ? (
                <div className="p-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl text-[10px] font-bold text-slate-500 text-center flex items-center justify-center gap-1.5 uppercase tracking-wider">
                  <Archive className="h-4 w-4" />
                  This workspace channel is archived.
                </div>
              ) : (
                <div className="space-y-3.5">
                  {/* Attachment Previews */}
                  {attachments.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap gap-2"
                    >
                      {attachments.map((file, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 pl-2.5 pr-1.5 py-1 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 shadow-sm"
                        >
                          {file.type === "image" && <ImageIcon className="h-3.5 w-3.5 text-brand-red-500" />}
                          {file.type === "document" && <FileText className="h-3.5 w-3.5 text-blue-500" />}
                          {file.type === "voice" && <Mic className="h-3.5 w-3.5 text-rose-500" />}
                          <span className="truncate max-w-[150px]">{file.name}</span>
                          <button 
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Audio Recording Status Indicator */}
                  {isRecording && (
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 px-3.5 py-2 rounded-xl animate-pulse">
                      <Mic className="h-4 w-4" />
                      <span>Recording voice memo... Click Mic again to stop & attach.</span>
                    </div>
                  )}

                  <form onSubmit={handleSendMessage} className="space-y-2.5">
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={`Send message to #${selectedGroup.title.toLowerCase().replace(/\s+/g, "-")}...`}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-brand-red-400 transition"
                      />
                      <button
                        type="submit"
                        className="p-3 bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-2xl transition cursor-pointer shadow-md shadow-brand-red-600/10 shrink-0"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Rich text Toolbar & Media Attachments */}
                    <div className="flex items-center justify-between px-2 pt-0.5">
                      <div className="flex items-center gap-1">
                        <button type="button" className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition">
                          <Bold className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition">
                          <List className="h-3.5 w-3.5" />
                        </button>
                        <span className="h-4 w-px bg-slate-200 mx-1" />
                        
                        {/* Photo/Image upload trigger */}
                        <button 
                          type="button" 
                          onClick={triggerImageUpload}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition flex items-center gap-1"
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                        </button>

                        {/* Document upload trigger */}
                        <button 
                          type="button" 
                          onClick={triggerDocUpload}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition flex items-center gap-1"
                        >
                          <Paperclip className="h-3.5 w-3.5" />
                        </button>

                        {/* Mic Voice Note trigger */}
                        <button 
                          type="button" 
                          onClick={triggerVoiceNote}
                          className={`p-1.5 rounded-lg transition flex items-center gap-1 ${
                            isRecording 
                              ? "bg-rose-50 text-rose-600" 
                              : "text-slate-400 hover:text-rose-500 hover:bg-rose-50/50"
                          }`}
                        >
                          <Mic className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Markdown Supported
                      </span>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <MessageSquare className="h-12 w-12 text-slate-200" />
            <p className="text-xs font-bold text-slate-400 mt-2">Select a workspace chat to begin collaboration</p>
          </div>
        )}
      </div>

      {/* PANEL 3: CONTEXT & DETAILS SIDEBAR (Collapsible Accordion) */}
      <AnimatePresence>
        {selectedGroup && showDetails && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 290, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="w-72 border-l border-slate-200 flex flex-col h-full bg-white shrink-0"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 font-extrabold text-slate-800 text-[10px] uppercase tracking-widest flex items-center gap-1.5 shrink-0">
              <Info className="h-4 w-4 text-slate-400" />
              Workspace Context
            </div>

            {/* Accordion List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left custom-scrollbar">
              
              {/* SECTION 1: CAMPAIGN OVERVIEW */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/20">
                <button
                  onClick={() => toggleSection("overview")}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-800 bg-slate-50 border-b border-slate-200 cursor-pointer"
                >
                  Campaign Overview
                  {openSections.overview ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </button>
                
                {openSections.overview && (
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Escrow Budget</p>
                      <p className="text-base font-extrabold text-slate-800 mt-0.5">₹{selectedGroup.budget.toLocaleString()}</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                        <span>Escrow Status</span>
                        <span>{((selectedGroup.escrow_released / selectedGroup.escrow_deployed) * 100).toFixed(0)}% Payout</span>
                      </div>
                      {/* Premium progress bar */}
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-brand-red-500 to-rose-600 rounded-full"
                          style={{ width: `${(selectedGroup.escrow_released / selectedGroup.escrow_deployed) * 100}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-slate-400 mt-1 font-semibold">
                        ₹{selectedGroup.escrow_released.toLocaleString()} released of ₹{selectedGroup.escrow_deployed.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Deadline</p>
                      <p className="text-xs font-bold text-slate-700 mt-0.5 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {selectedGroup.deadline}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2: DELIVERABLES VAULT */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/20">
                <button
                  onClick={() => toggleSection("vault")}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-800 bg-slate-50 border-b border-slate-200 cursor-pointer"
                >
                  Deliverables Vault
                  {openSections.vault ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </button>

                {openSections.vault && (
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Thumbnail mockups */}
                      <div className="aspect-video bg-slate-100 rounded-lg border border-slate-200/60 flex flex-col items-center justify-center hover:bg-slate-200/30 transition relative group cursor-pointer overflow-hidden">
                        <FileVideo className="h-5 w-5 text-slate-400 group-hover:text-brand-red-500 transition-colors" />
                        <span className="text-[8px] font-bold text-slate-500 mt-1 uppercase">Draft Reel 1</span>
                        <div className="absolute top-1 right-1 h-3 w-3 rounded-full bg-emerald-500 flex items-center justify-center text-[7px] text-white">
                          <CheckCircle className="h-2.5 w-2.5" />
                        </div>
                      </div>

                      <div className="aspect-video bg-slate-100 rounded-lg border border-slate-200/60 flex flex-col items-center justify-center hover:bg-slate-200/30 transition relative group cursor-pointer overflow-hidden">
                        <FileVideo className="h-5 w-5 text-slate-400 group-hover:text-brand-red-500 transition-colors" />
                        <span className="text-[8px] font-bold text-slate-500 mt-1 uppercase">Promo Story</span>
                        <div className="absolute top-1 right-1 h-3 w-3 rounded-full bg-amber-500 flex items-center justify-center text-[7px] text-white">
                          <Clock className="h-2.5 w-2.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: PARTICIPANTS DIRECTORY */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/20">
                <button
                  onClick={() => toggleSection("participants")}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-800 bg-slate-50 border-b border-slate-200 cursor-pointer"
                >
                  Participants Directory
                  {openSections.participants ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </button>

                {openSections.participants && (
                  <div className="p-3 space-y-2.5">
                    {/* Brand Admin */}
                    <div className="flex items-center justify-between p-2 hover:bg-white rounded-xl transition">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-7 w-7 rounded-full bg-brand-red-100 text-brand-red-700 flex items-center justify-center text-[10px] font-extrabold shrink-0 border border-brand-red-200/40">
                          AS
                        </div>
                        <div className="truncate text-[10px] font-bold text-slate-800">
                          <p className="truncate leading-none">{selectedGroup.poc_name}</p>
                          <span className="text-[8px] text-brand-red-600 mt-0.5 block font-extrabold">BRAND POC</span>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                        {selectedGroup.poc_id}
                      </span>
                    </div>

                    {/* Creators */}
                    {selectedGroup.creators.map((c) => (
                      <div key={c.tag} className="flex items-center justify-between p-2 hover:bg-white rounded-xl transition">
                        <div className="flex items-center gap-2 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={c.avatar} alt={c.name} className="h-7 w-7 rounded-full object-cover shrink-0 border border-slate-200" />
                          <div className="truncate text-[10px] font-bold text-slate-800">
                            <p className="truncate leading-none">{c.name}</p>
                            <span className="text-[8px] text-slate-400 mt-0.5 block font-extrabold">CREATOR</span>
                          </div>
                        </div>
                        <span className="text-[8px] font-mono bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                          {c.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ARCHIVE FOOTER BUTTON */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleArchiveGroup}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer bg-white border border-slate-200 text-slate-500 hover:text-brand-red-600 hover:border-brand-red-200 hover:bg-red-50/20`}
                >
                  {selectedGroup.is_archived ? (
                    <>
                      <ArchiveRestore className="h-4 w-4" />
                      Restore Campaign Room
                    </>
                  ) : (
                    <>
                      <Archive className="h-4 w-4" />
                      Archive Workspace Chat
                    </>
                  )}
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
