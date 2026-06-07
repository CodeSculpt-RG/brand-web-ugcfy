"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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

      {/* Main Content */}
      <section className="flex-1 max-w-3xl mx-auto py-20 px-6">
        <div className="prose prose-invert prose-red">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-red-500">Legal Agreement</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-8 tracking-tight">Privacy Policy</h1>
          
          <p className="text-sm text-zinc-400 leading-relaxed font-semibold mb-6">
            Effective Date: June 7, 2026
          </p>

          <div className="space-y-8 text-sm text-zinc-300 leading-relaxed">
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
              <p>
                We collect personal information that you provide to us directly when you request access to the UGCFY platform, register a brand profile, or communicate with our onboarding concierge, Siya. This includes your name, email address, company details, social profile handles, and billing details.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to operate, maintain, and improve the UGCFY platform. This includes validating brand credentials, executing KYC verifications, matching brands with vetted creators, processing escrow payments, and safeguarding collaborate transactions.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">3. Data Sharing & Escrow Custody</h2>
              <p>
                UGCFY does not sell or lease your personal information. Your profile details are shared with registered creators strictly for collaboration purposes. Payment credentials and project funds are held in secure escrow in compliance with industry safety standards.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">4. Artificial Intelligence Processing</h2>
              <p>
                By utilizing our AI onboarding concierge, Siya, you acknowledge that conversation history and business registration details are processed programmatically by our models to determine access permissions and generate campaign materials.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">5. Security</h2>
              <p>
                We implement robust security measures to protect your data. However, no electronic transmission or storage is completely secure. We encourage you to use unique passwords and safeguard your account credentials.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">6. Your Rights & Contacts</h2>
              <p>
                You have the right to request access to, correction of, or deletion of your personal data. For any questions regarding this Privacy Policy, please contact our legal support desk at <a href="mailto:support@ugcfy.com" className="text-brand-red-500 hover:underline">support@ugcfy.com</a>.
              </p>
            </div>
          </div>
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
