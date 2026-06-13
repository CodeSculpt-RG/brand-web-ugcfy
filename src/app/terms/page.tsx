"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
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
          <span className="text-xs font-bold uppercase tracking-wider text-brand-red-500">Terms and Conditions</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-8 tracking-tight">Terms of Service</h1>

          <p className="text-sm text-zinc-400 leading-relaxed font-semibold mb-6">
            Last Updated: June 7, 2026
          </p>

          <div className="space-y-8 text-sm text-zinc-300 leading-relaxed">
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">1. Agreement to Terms</h2>
              <p>
                By accessing or using the UGCFY platform (&quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you are prohibited from using the platform.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">2. Access and Account Verification</h2>
              <p>
                UGCFY reserves the right to approve or deny brand access requests at our sole discretion. Brands must complete onboarding questions administered by our AI concierge, SIYAA, and submit verified credentials. You agree to provide accurate, current, and complete information.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">3. Escrow and Funds Protection</h2>
              <p>
                Funds for creator campaigns must be deposited into UGCFY escrow custody prior to campaign commencement. Escrow funds will only be released to creators upon brand approval of the submitted deliverables. Disputed funds are subject to resolution processes overseen by UGCFY administration.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">4. Creator Relationships & Content Licences</h2>
              <p>
                UGCFY is a platform facilitating collaboration between brands and independent creators. Once a creator&apos;s deliverable is approved and paid for via escrow release, the brand receives licensing rights as agreed upon in the project brief.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">5. Limitation of Liability</h2>
              <p>
                UGCFY shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, resulting from your use or inability to use the platform.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">6. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify you of any material changes by updating the date on this page. Continuing to use the platform indicates agreement to the updated terms. For legal inquiries, contact <a href="mailto:support@ugcfy.com" className="text-brand-red-500 hover:underline">support@ugcfy.com</a>.
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
