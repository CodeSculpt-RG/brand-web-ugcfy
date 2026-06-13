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
          title="The Ultimate Tool for"
          highlight="Agencies"
          description="Manage multiple clients, separate billing, and white-labeled reporting from a single master dashboard."
          icon={<Sparkles className="w-8 h-8 text-[var(--color-primary)]" />}
        />
        
        <PremiumAlternatingFeatures 
          features={[
            {
              title: "Isolated Client Workspaces",
              description: "Keep your operations clean. Create isolated workspaces for each client brand with distinct creator lists, messaging templates, and separated billing profiles.",
              bullets: ["Siloed data","Client-specific billing","Role-based access"],
              imagePlaceholderText: "Agency Master View"
            },
            {
              title: "Client Approval Portals",
              description: "Share content with your clients for approval without forcing them to log into a complex platform. Send a simple, white-labeled link where they can review and approve assets.",
              bullets: ["No-login review links","Agency branding","Feedback consolidation"],
              imagePlaceholderText: "Client Portal Example"
            }
          ]}
        />
        
        <PremiumStats stats={[{"value":"Multi","label":"Client Support"},{"value":"White","label":"Labeled"},{"value":"Custom","label":"Margins"},{"value":"Scale","label":"Operations"}]} />
        
        <PremiumCtaSection 
          title="Increase your agency margins."
          description="Streamline operations and take on more clients."
        />
      </main>

      <Footer />
    </div>
  );
}
