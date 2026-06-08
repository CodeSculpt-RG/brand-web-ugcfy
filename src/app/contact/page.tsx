"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-zinc-100 flex flex-col justify-between selection:bg-brand-red-100 select-none">

      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-zinc-900">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 bg-brand-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-extrabold text-lg tracking-tighter">U</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">UGC<span className="text-brand-red-600">FY</span></span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </header>

      {/* Main Content Area */}
      <section className="flex-1 w-full max-w-7xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left Side: Contact Info */}
        <div className="space-y-8 text-left">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-red-500">Get in Touch</span>
            <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none">Contact Us</h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-semibold max-w-md">
              Have questions about Siya&apos;s onboarding, brand access approvals, or creator escrow integrations? Drop us a message and our support team will respond shortly.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-zinc-300">
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-brand-red-500">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-white">Support Email</p>
                <a href="mailto:support@ugcfy.com" className="text-zinc-400 hover:text-brand-red-400 transition font-semibold">
                  support@ugcfy.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-brand-red-500">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-white">Office Line</p>
                <p className="text-zinc-400 font-semibold">+91 90001 90001</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-brand-red-500">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-white">Headquarters</p>
                <p className="text-zinc-400 font-semibold">Bhilai, CG 490001</p>

              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="bg-[#0D0D12] border border-zinc-850 p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden text-left">
          {/* Accent red glow */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-brand-red-600/5 blur-3xl pointer-events-none rounded-full" />

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div>
              <label htmlFor="name" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sarah Jenkins"
                className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-500/10 outline-none transition font-semibold"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. sarah@brand.com"
                className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-500/10 outline-none transition font-semibold"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="How can we help?"
                className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-500/10 outline-none transition font-semibold"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Message Detail
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your details here..."
                className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-500/10 outline-none transition font-semibold resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-3.5 bg-gradient-to-tr from-brand-red-600 to-rose-600 hover:from-brand-red-700 hover:to-rose-700 disabled:from-zinc-800 disabled:to-zinc-900 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs transition shadow-lg shadow-brand-red-600/15 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              {status === "sending" ? (
                <span>Sending Message...</span>
              ) : status === "success" ? (
                <span className="text-emerald-400">✓ Message Sent Successfully!</span>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>

      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
        <span>© 2026 UGCFY. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-zinc-300 transition">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-zinc-300 transition">Terms of Service</Link>
          <Link href="/contact" className="hover:text-zinc-300 transition">Contact</Link>
          <Link href="/about" className="hover:text-zinc-300 transition">About</Link>
        </div>
      </footer>

    </main>
  );
}
