"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  X, 
  Send, 
  AlertCircle,
  Bot
} from "lucide-react";

export default function GlobalChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    sendMessage, 
    status,
    error,
    clearError,
    stop,
    setMessages
  } = useChat();

  // Onboarding Intercept trigger
  useEffect(() => {
    const handleOpenOnboarding = () => {
      setIsOpen(true);
      // Reset chat history and insert Siya's first onboarding message
      setMessages([
        {
          id: "siya-onboarding-start",
          role: "assistant",
          parts: [
            {
              type: "text",
              text: "Hi! I'm Siya. Let's get your brand verified for UGC FY. To start, what is your Brand/Company Name?",
            }
          ]
        }
      ]);
    };

    window.addEventListener("open-siya-onboarding", handleOpenOnboarding);
    return () => {
      window.removeEventListener("open-siya-onboarding", handleOpenOnboarding);
    };
  }, [setMessages]);

  // Auto scroll to bottom when new messages arrive or chat window opens
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages]);

  const quickActions = [
    "How do I request brand access?",
    "How long does verification take?",
    "What is Escrow Protection?"
  ];

  const handleQuickActionClick = (actionText: string) => {
    if (error) clearError();
    sendMessage({ text: actionText });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || status === "submitted" || status === "streaming") return;
    if (error) clearError();
    sendMessage({ text: inputValue });
    setInputValue("");
  };

  const isLoading = status === "submitted" || status === "streaming";

  // Helper to extract text from message parts or content
  const getMessageText = (message: any) => {
    if (!message) return "";
    if (message.content) return message.content;
    if (!message.parts) return "";
    return message.parts
      .filter((part: any) => part.type === "text")
      .map((part: any) => part.text)
      .join("\n");
  };

  return (
    <>
      {/* FLOATING ACTION BUTTON (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 px-5 h-12 bg-gradient-to-tr from-brand-red-600 to-rose-600 rounded-full flex items-center gap-2 shadow-[0_8px_30px_rgba(220,38,38,0.35)] hover:shadow-[0_8px_35px_rgba(220,38,38,0.5)] active:scale-95 transition cursor-pointer text-white border border-brand-red-500/20 group font-bold text-xs"
        aria-label="Open Chat with Siya"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5"
            >
              <X className="h-4 w-4" />
              <span>Close Chat</span>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4 group-hover:scale-110 transition-transform text-white animate-pulse" />
              <span>Chat with Siya ✨</span>
              {/* Pulse ring indicator */}
              <span className="absolute -top-1 -right-3 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* CHAT WINDOW INTERFACE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[385px] h-[600px] max-h-[75vh] sm:max-h-[80vh] bg-white/90 backdrop-blur-2xl border border-slate-200/60 shadow-2xl rounded-3xl flex flex-col overflow-hidden text-left"
          >
            {/* 1. CHAT HEADER */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-4 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-brand-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-red-500/10">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm tracking-tight">Siya</span>
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">UGC FY Intelligence</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 2. CHAT MESSAGES BODY */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
              <AnimatePresence initial={false}>
                {/* Cold Start Empty State Greeting */}
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2.5 items-start text-left"
                  >
                    <div className="h-7 w-7 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800 text-white font-bold text-[10px]">
                      S
                    </div>
                    <div className="bg-slate-100 text-slate-800 text-xs py-2.5 px-4 rounded-2xl rounded-tl-none font-medium max-w-[80%] leading-relaxed">
                      Hello! I am Siya, the AI powering UGC FY. How can I help you today? You can ask me about requesting access, verification times, or escrow protection.
                    </div>
                  </motion.div>
                )}

                {/* Map of Active Streamed Messages */}
                {messages.map((message) => {
                  const isAssistant = message.role === "assistant";
                  const textContent = getMessageText(message);
                  
                  // Skip rendering if there is no text chunk in the message content or parts
                  if (!textContent) return null;

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2.5 items-start ${isAssistant ? "justify-start text-left" : "justify-end text-right"}`}
                    >
                      {isAssistant && (
                        <div className="h-7 w-7 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800 text-white font-bold text-[10px] shadow-sm">
                          S
                        </div>
                      )}
                      
                      <div 
                        className={`text-xs py-2.5 px-4 rounded-2xl max-w-[80%] leading-relaxed font-medium whitespace-pre-wrap shadow-sm ${
                          isAssistant 
                            ? "bg-slate-100 border border-slate-200/30 text-slate-800 rounded-tl-none" 
                            : "bg-gradient-to-tr from-brand-red-600 to-rose-600 text-white rounded-tr-none"
                        }`}
                      >
                        {textContent}
                      </div>
                    </motion.div>
                  );
                })}

                {/* API Key Missing or general error block */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-3 rounded-xl flex flex-col gap-1 text-[10px] font-bold ${
                      error.message?.includes("429") || error.message?.includes("Siya is currently assisting")
                        ? "bg-amber-50/90 border border-amber-200 text-amber-800"
                        : "bg-red-50/80 border border-red-100 text-red-700"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className={`h-4 w-4 shrink-0 mt-0.5 ${
                        error.message?.includes("429") || error.message?.includes("Siya is currently assisting")
                          ? "text-amber-600"
                          : "text-red-500"
                      }`} />
                      <div>
                        <span>{error.message?.includes("429") || error.message?.includes("Siya is currently assisting") ? "System Busy" : "Failed to fetch reply."}</span>
                        <p className={`mt-1 text-[9px] font-normal leading-tight ${
                          error.message?.includes("429") || error.message?.includes("Siya is currently assisting")
                            ? "text-amber-700/95"
                            : "text-red-600/90"
                        }`}>
                          {(() => {
                            if (error.message?.includes("429") || error.message?.includes("Siya is currently assisting")) {
                              return "Siya is currently assisting a massive volume of brands. Please wait 10 seconds and try again.";
                            }
                            try {
                              const parsed = JSON.parse(error.message);
                              return parsed.error || error.message;
                            } catch {
                              return error.message;
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Loading State bubble */}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2.5 items-start text-left"
                  >
                    <div className="h-7 w-7 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800 text-white font-bold text-[10px]">
                      S
                    </div>
                    <div className="bg-slate-100 py-3 px-4 rounded-2xl rounded-tl-none max-w-[80%] flex items-center gap-1 shadow-sm">
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* 3. QUICK ACTIONS BAR */}
            {messages.length === 0 && (
              <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-200/50 flex flex-col gap-1.5 shrink-0">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickActionClick(action)}
                    className="w-full text-left px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200/80 text-[11px] font-bold text-slate-600 hover:text-brand-red-600 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-[0.99]"
                  >
                    <span className="text-brand-red-500">⚡</span>
                    <span>{action}</span>
                  </button>
                ))}
              </div>
            )}

            {/* 4. CHAT INPUT PANEL */}
            <form 
              onSubmit={handleFormSubmit}
              className="p-4 bg-slate-50 border-t border-slate-200/50 flex gap-2 items-center shrink-0"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (error) clearError();
                }}
                placeholder="Message Siya..."
                className="flex-1 bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-500/10 outline-none transition font-semibold"
              />
              <button
                type={isLoading ? "button" : "submit"}
                onClick={isLoading ? () => stop() : undefined}
                disabled={!isLoading && !inputValue.trim()}
                className={`h-9 w-9 rounded-xl flex items-center justify-center transition shadow-md cursor-pointer shrink-0 ${
                  isLoading
                    ? "bg-slate-800 hover:bg-slate-900 text-white shadow-slate-900/10"
                    : "bg-brand-red-600 hover:bg-brand-red-700 text-white shadow-brand-red-600/10 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                }`}
                aria-label={isLoading ? "Stop generating" : "Send message"}
              >
                {isLoading ? (
                  <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                    <span className="h-2 w-2 bg-white rounded-sm animate-pulse" />
                  </span>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
