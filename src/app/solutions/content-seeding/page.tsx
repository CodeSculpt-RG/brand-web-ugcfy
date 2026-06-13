"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumHero from "@/components/ui/PremiumHero";
import PremiumFeatureSection from "@/components/ui/PremiumFeatureSection";
import { Sparkles, CheckCircle2, Zap } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <Navbar theme="dark" />
      
      <main className="flex-1">
        <PremiumHero 
          title="Content"
          highlight="Seeding"
          description="Distribute your product strategically to niche micro-creators for viral reach."
          icon={<Sparkles className="w-8 h-8 text-[var(--color-primary)]" />}
        />
        
        <PremiumFeatureSection 
          title="Seed and Grow"
          subtitle="Get your product in the right hands."
          features={[
            {
              title: "Automated Logistics",
              description: "We handle shipping and fulfillment to creators.",
              icon: <CheckCircle2 className="w-6 h-6" />
            },
            {
              title: "Micro-influencer Focus",
              description: "Target high-engagement niche audiences.",
              icon: <Zap className="w-6 h-6" />
            },
            {
              title: "Cost-Effective",
              description: "High volume of content for product-only exchanges.",
              icon: <Sparkles className="w-6 h-6" />
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
