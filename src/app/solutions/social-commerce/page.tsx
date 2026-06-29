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
          title="Drive Sales with"
          highlight="Social Commerce"
          description="Turn authentic UGC into your highest converting sales channel on Instagram and YouTube."
          icon={<Sparkles className="w-8 h-8 text-[var(--color-primary)]" />}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "Social Commerce Sync",
              description: "Seamlessly integrate your creator campaigns with Social Commerce affiliate programs. Automatically track creator sales and manage commission payouts natively.",
              bullets: ["Direct API sync","Commission tracking","Creator onboarding"],
              imagePlaceholderText: "Social Commerce Integration"
            },
            {
              title: "Shoppable Link Generation",
              description: "Automatically generate trackable affiliate links and promo codes for creators to use in their content, ensuring perfect attribution for every sale.",
              bullets: ["Custom promo codes","Link tracking","Attribution modeling"],
              imagePlaceholderText: "Affiliate Link Manager"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"Social","label":"Integrated"},{"value":"Live","label":"Shopping"},{"value":"Auto","label":"Affiliate Links"},{"value":"Scale","label":"Revenue"}]} />
        
        <PremiumCtaSection 
          title="Turn views into revenue."
          description="Master the new era of social commerce."
        />
      </main>

      <Footer />
    </div>
  );
}
