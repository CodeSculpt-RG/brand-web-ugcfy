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
          title="Scale Your Brand's"
          highlight="UGC Engine"
          description="Empower your marketing team to source thousands of authentic videos without the operational headache."
          icon={<Sparkles className="w-8 h-8 text-[var(--color-primary)]" />}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "Built for Fast-Growing Brands",
              description: "From hyper-growth D2C startups to enterprise retail, our platform provides the infrastructure to scale your user-generated content engine without expanding your headcount.",
              bullets: ["Unlimited discovery","Automated rights management","Team collaboration"],
              imagePlaceholderText: "Brand Dashboard"
            },
            {
              title: "Automated Commercial Rights",
              description: "Never worry about licensing disputes. Every piece of content sourced through UGC FY comes with perpetual, global, and multi-channel commercial usage rights baked into the smart contract.",
              bullets: ["Perpetual licensing","Whitelisting rights","Downloadable assets"],
              imagePlaceholderText: "Rights Management Panel"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"40%","label":"Lower CPA"},{"value":"3x","label":"Higher ROAS"},{"value":"100+","label":"Videos/Mo"},{"value":"Full","label":"Usage Rights"}]} />
        
        <PremiumCtaSection 
          title="Dominate social commerce."
          description="Equip your brand with high-converting authentic content."
        />
      </main>

      <Footer />
    </div>
  );
}
