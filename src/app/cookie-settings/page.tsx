"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumHero from "@/components/ui/PremiumHero";
import PremiumStats from "@/components/ui/PremiumStats";
import PremiumAlternatingFeatures from "@/components/ui/PremiumAlternatingFeatures";
import PremiumCtaSection from "@/components/ui/PremiumCtaSection";
import { Sparkles } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar theme="dark" />
      
      <main className="flex-1">
        <PremiumHero 
          title="Privacy &"
          highlight="Cookies"
          description="Manage your data preferences and understand how we use cookies to improve your experience."
          icon={<Sparkles className="w-8 h-8 text-[var(--color-primary)]" />}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "Your Data, Your Control",
              description: "We believe in complete transparency. Review exactly what data we collect, why we collect it, and easily toggle your tracking preferences at any time.",
              bullets: ["Granular controls","Clear explanations","Easy opt-outs"],
              imagePlaceholderText: "Cookie Preferences UI"
            },
            {
              title: "Enterprise-Grade Security",
              description: "Your preferences are stored securely. We comply with all major global privacy regulations including GDPR and CCPA to ensure your data is always protected.",
              bullets: ["GDPR compliance","Encrypted storage","Regular audits"],
              imagePlaceholderText: "Security Badges"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"100%","label":"Transparent"},{"value":"GDPR","label":"Compliant"},{"value":"CCPA","label":"Ready"},{"value":"Total","label":"Control"}]} />
        
        <PremiumCtaSection 
          title="Update your preferences."
          description="Take control of your data today."
        />
      </main>

      <Footer />
    </div>
  );
}
