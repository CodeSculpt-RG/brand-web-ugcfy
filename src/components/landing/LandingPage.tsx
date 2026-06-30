"use client";

import { useState, useEffect } from "react";

import CreatorDiscoveryMockup from './visuals/CreatorDiscoveryMockup';
import CampaignWorkflowMockup from './visuals/CampaignWorkflowMockup';
import CampaignDashboardMockup from './visuals/CampaignDashboardMockup';
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Sparkles, ArrowRight, CheckCircle2, MessageCircle, Users,
  Brain, LayoutDashboard, TrendingUp, Check,
  Headset, BadgeDollarSign, Bot, Quote, ChevronLeft, ChevronRight, ChevronDown, X
} from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Image from "next/image";
import RequestAccessModal from "@/components/RequestAccessModal";

const whyChooseData = [
  { title: "200M+ Influencers Database", desc: "Access a global network of over 200 million influencers. Find your perfect match across platforms and boost visibility.", icon: Users },
  { title: "Smart AI Powered Dashboard", desc: "Get real-time insights and smart recommendations to track performance, measure ROI, and optimize your campaigns.", icon: Brain },
  { title: "End to End Campaign Management", desc: "From influencer discovery to final reporting, manage every step of your campaign in one seamless workflow.", icon: CheckCircle2 },
  { title: "Realtime Performance Tracking", desc: "Monitor your campaign as it happens with live updates on reach and engagement to modify strategies instantly.", icon: TrendingUp },
  { title: "Expert Support at Every Step", desc: "Our dedicated team is always available to guide you through setup, troubleshooting, and scaling.", icon: Headset },
];

interface AiFeature {
  title: string;
  theme: "light" | "dark";
  eyebrow: string;
  points: string[];
  description: string;
  details: string[];
  longDescription: string;
  useCases: string[];
  benefits: string[];
  workflow: string[];
}

const aiFeatures: AiFeature[] = [
  {
    title: "Discover AI",
    theme: "light",
    eyebrow: "Creator Intelligence",
    points: [
      "Automated Discovery",
      "Seamless Connection",
      "Efficient Invitation",
      "Intelligent Matching",
    ],
    description:
      "Discover AI helps brands identify the right creators faster by analyzing audience fit, niche relevance, campaign objectives, and creator performance signals.",
    details: [
      "Find creators aligned with your campaign goal.",
      "Reduce manual searching and shortlisting time.",
      "Improve creator-brand matching accuracy.",
      "Support data-backed creator discovery decisions.",
    ],
    longDescription:
      "Discover AI is built to remove guesswork from creator selection. Instead of manually browsing profiles, brands can use AI-assisted signals to identify creators who match campaign goals, audience demographics, niche relevance, content style, and performance potential.",
    useCases: [
      "Finding creators for a new product launch",
      "Shortlisting niche creators for targeted campaigns",
      "Matching creators based on audience and content fit",
      "Reducing manual research time for brand teams",
    ],
    benefits: [
      "Faster creator discovery",
      "Better audience-brand alignment",
      "Reduced manual shortlisting effort",
      "More confident campaign planning",
    ],
    workflow: [
      "Brand defines campaign objective",
      "AI analyzes creator fit and relevance",
      "Best-matched creators are surfaced",
      "Brand reviews and shortlists creators",
    ],
  },
  {
    title: "Scripting AI",
    theme: "dark",
    eyebrow: "Content Direction",
    points: [
      "NLG Integration",
      "Style Analysis",
      "Content Alignment",
      "Dynamic Adaptation",
    ],
    description:
      "Scripting AI supports creator briefs and content direction by generating campaign-aligned script structures, tone guidance, and platform-specific content angles.",
    details: [
      "Generate structured script ideas for creators.",
      "Match brand tone and content style.",
      "Adapt scripts for reels, shorts, stories, and posts.",
      "Keep messaging aligned with campaign objectives.",
    ],
    longDescription:
      "Scripting AI helps brands convert campaign goals into creator-ready content direction. It assists with script structures, hooks, tone, product mentions, platform-specific formats, and brand-safe messaging so creators can produce content that stays aligned with the brief.",
    useCases: [
      "Creating creator briefs for reels and shorts",
      "Maintaining brand tone across multiple creators",
      "Generating hooks and content angles",
      "Adapting messaging for different platforms",
    ],
    benefits: [
      "Stronger content consistency",
      "Faster brief preparation",
      "Better creator execution",
      "Reduced revision cycles",
    ],
    workflow: [
      "Brand enters campaign objective and key message",
      "AI suggests content angles and script structure",
      "Brand reviews and finalizes guidelines",
      "Creators receive clearer execution direction",
    ],
  },
  {
    title: "Negotiation AI",
    theme: "light",
    eyebrow: "Deal Intelligence",
    points: [
      "Data-Driven Negotiations",
      "Performance Metrics",
      "Efficient Collaboration",
      "Predictive Analytics",
    ],
    description:
      "Negotiation AI helps brands make smarter collaboration decisions by evaluating creator value, expected output, performance history, and campaign budget fit.",
    details: [
      "Compare creator pricing with campaign value.",
      "Support fair collaboration decisions.",
      "Use performance indicators in negotiation.",
      "Improve brand-creator collaboration efficiency.",
    ],
    longDescription:
      "Negotiation AI supports smarter creator collaboration decisions by comparing expected creator value with campaign budget, historical performance, deliverable scope, audience quality, and estimated campaign impact.",
    useCases: [
      "Evaluating creator pricing before approval",
      "Comparing creators for the same campaign",
      "Planning budget allocation across creators",
      "Supporting fair and transparent negotiations",
    ],
    benefits: [
      "More informed negotiation decisions",
      "Better budget control",
      "Reduced overpaying risk",
      "Improved creator collaboration quality",
    ],
    workflow: [
      "Brand reviews creator proposal",
      "AI evaluates pricing and performance signals",
      "Brand receives decision support",
      "Final collaboration terms are confirmed",
    ],
  },
  {
    title: "Content Audit AI",
    theme: "dark",
    eyebrow: "Quality Control",
    points: [
      "Thorough Audit",
      "Script Alignment",
      "Guideline Adherence",
      "Real-Time Reporting",
    ],
    description:
      "Content Audit AI checks submitted content against campaign guidelines, brand safety requirements, scripts, and deliverable expectations before approval.",
    details: [
      "Review content against campaign guidelines.",
      "Detect missing script or brand-message alignment.",
      "Support faster approval workflows.",
      "Improve reporting and content quality control.",
    ],
    longDescription:
      "Content Audit AI helps brands review creator submissions before approval. It checks whether the content follows the campaign brief, includes required talking points, avoids restricted claims, and aligns with the approved script and brand guidelines.",
    useCases: [
      "Checking creator submissions before posting",
      "Reviewing script and guideline compliance",
      "Reducing manual content approval workload",
      "Maintaining brand safety across campaigns",
    ],
    benefits: [
      "Faster content review",
      "Better brand guideline compliance",
      "Reduced approval errors",
      "Stronger content quality control",
    ],
    workflow: [
      "Creator submits content",
      "AI checks content against the brief",
      "Brand receives audit signals",
      "Brand approves, rejects, or requests changes",
    ],
  },
  {
    title: "Performance AI",
    theme: "light",
    eyebrow: "Campaign Optimization",
    points: [
      "Optimize Campaigns",
      "Data-Driven Decisions",
      "Automated Partnerships",
      "Predictive Insights",
    ],
    description:
      "Performance AI helps brands understand campaign progress, creator performance, engagement quality, and optimization opportunities across active campaigns.",
    details: [
      "Track campaign performance indicators.",
      "Identify high-performing creator partnerships.",
      "Support data-backed campaign optimization.",
      "Improve future campaign planning.",
    ],
    longDescription:
      "Performance AI helps brands monitor and improve campaign outcomes by analyzing performance signals, engagement quality, creator contribution, deliverable progress, and optimization opportunities across active and completed campaigns.",
    useCases: [
      "Tracking live campaign performance",
      "Comparing creator output quality",
      "Identifying campaign optimization opportunities",
      "Planning future campaigns using past performance",
    ],
    benefits: [
      "Clearer campaign visibility",
      "Better optimization decisions",
      "Improved creator partnership planning",
      "More data-backed reporting",
    ],
    workflow: [
      "Campaign performance data is collected",
      "AI identifies trends and weak points",
      "Brand receives optimization insights",
      "Future campaigns improve based on learnings",
    ],
  },
];
const platformFeatures = [
  {
    id: 1,
    title: "Discover",
    highlight: "Influencers",
    description: "84% of marketers say finding the right influencers is their top challenge. But No Worries, our AI influencer marketing tool is ready to cater this problem with its advanced influencer discovery features. In just few clicks, find perfect match for your campaign by leveraging filters like audience demographics, follower count, target audience details, influencer and audience location, brand collaborations, engagement rate, average likes, average comments, story views, and more all within a high-tech influencer finder tool.",
    buttonText: "Explore More",
    buttonLink: "/platform/discover",
    visual: <CreatorDiscoveryMockup />
  },
  {
    id: 2,
    title: "Outreach",
    highlight: "Made Easy",
    description: "Say goodbye to messy spreadsheets and lost emails. Our platform allows you to automate personalized outreach campaigns at scale. Sync your email, track open rates, and manage negotiations all from a single, unified inbox designed specifically for influencer relations.",
    buttonText: "Start Outreach",
    buttonLink: "/platform/outreach",
    visual: <CampaignWorkflowMockup />
  },
  {
    id: 3,
    title: "Manage",
    highlight: "Campaigns",
    description: "Keep your entire team in sync with real-time campaign tracking. Monitor content deliverables, approve drafts, and track live posts automatically. Our comprehensive dashboard gives you a bird's-eye view of your entire influencer marketing ecosystem.",
    buttonText: "View Dashboard",
    buttonLink: "/platform/manage",
    visual: <CampaignDashboardMockup />
  }
];

const uspData = [
  {
    id: 1,
    title: "WhatsApp & Zalo Chat Integration",
    description: "Receive real-time updates on WhatsApp and Zalo for campaigns, queries, and workflows. Seamless, personal-level communication between influencers and brands, keeping everyone informed instantly.",
    icon: MessageCircle,
  },
  {
    id: 2,
    title: "Affiliate Marketing Feature",
    description: "Maximize earnings with our built-in affiliate tool. Brands post campaigns to 250M+ influencers, influencers apply directly. Performance-based promotions benefit both parties with broader reach.",
    icon: BadgeDollarSign,
  },
  {
    id: 3,
    title: "Automated Campaign Management",
    description: "AI-powered automation from discovery to tracking. Includes content ideation, validation, and real-time updates. Saves time, ensures accuracy, and streamlines workflows for brands and agencies.",
    icon: Bot,
  },
  {
    id: 4,
    title: "Omnichannel Marketing Dashboard",
    description: "Manage campaigns across Instagram, YouTube, Twitter, and more from one dashboard. Track performance, handle conversations, and eliminate tool-switching for a seamless workflow.",
    icon: LayoutDashboard,
  }
];
// Framer Motion Variants for Staggered Animation
const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function LandingPage() {
  const [activeLogoPage, setActiveLogoPage] = useState(0);
  const [activeAiIndex, setActiveAiIndex] = useState(0);
  const [selectedAiFeature, setSelectedAiFeature] = useState<AiFeature | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(true);

  const logoPages = [
    [1, 2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23, 24]
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLogoPage((prev) => (prev + 1) % logoPages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [logoPages.length]);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqData = [
    { question: "What is an Influencer marketing platform?", answer: "An influencer marketing platform is a tool that helps brands, agencies, and companies find influencers, contact them, run campaigns, and track results. It also helps with handling payments and agreements between the brand and the influencer." },
    { question: "What features does your influencer marketing tool offer?", answer: "Our platform offers AI-driven creator discovery, automated campaign workflows, real-time ROI analytics, escrow-protected payments, and an omnichannel dashboard to manage everything in one place." },
    { question: "How UGCFY is an AI powered Self Serve Influencer marketing platform?", answer: "UGCFY leverages advanced AI to automate the entire influencer workflow. From discovering the perfect creators based on your target audience to generating campaign briefs and predicting performance, our self-serve tools do the heavy lifting." },
    { question: "Do you Provide Training and Support for your influencer discovery tool?", answer: "Absolutely. We offer comprehensive onboarding, dedicated account managers for enterprise clients, and a rich library of resources and tutorials to ensure you get the most out of our tools." },
    { question: "How can users get started with UGCFY's influencer management platform?", answer: "Simply click 'Get Started' or 'Request Access', fill out your details, and our team will set up your workspace. You can begin discovering and reaching out to creators on day one." },
    { question: "What are the USP's of UGCFY Influencer Marketing Tool?", answer: "Our main USPs include our proprietary Discovery AI, escrow-based secure payments, a focus on high-converting 9:16 UGC formats, and our deep integration with major social platform APIs for real-time analytics." },
    { question: "Who can use UGCFY's influencer marketing dashboard?", answer: "Our dashboard is built for scaling brands, marketing agencies managing multiple clients, and enterprise companies looking for a highly efficient, automated way to run influencer campaigns." },
    { question: "Do you provide support from influencer marketing experts if required?", answer: "Yes, we offer fully managed agency services alongside our self-serve platform. If you need hands-on expertise, our in-house strategy and production teams are ready to run your campaigns end-to-end." },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900 w-full overflow-x-hidden selection:bg-[var(--color-primary)]/10 selection:text-[var(--color-primary-hover)]">

      {/* NAVBAR */}
      <Navbar theme="transparent-to-dark" />

      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-screen flex items-center pt-16 pb-24 overflow-hidden bg-[#000000]">
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/hero-bg.mp4"
        />
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center gap-8 relative z-10 w-full pt-12">
          <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#D90429]" />
            THE FUTURE OF INFLUENCER MARKETING
          </div>
          <h1 className="text-5xl lg:text-[72px] font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-2xl">
            Best AI-Powered UGC & Influencer Marketing Platform
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl font-medium leading-relaxed drop-shadow-md">
            UGCFY is an AI-powered platform offering comprehensive, end-to-end features from creator discovery and outreach to campaign management, tracking, and reporting—all integrated within a single dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
            <Link href="/get-started" className="btn-primary px-10 py-5 text-lg flex items-center justify-center gap-2 shadow-xl shadow-[var(--shadow-cta)]">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/request-demo" className="btn-ghost px-10 py-5 text-lg flex items-center justify-center gap-2 border border-white/30 hover:border-white transition-all bg-white/5 backdrop-blur-md hover:bg-white hover:text-black inline-flex">
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* 2. AUTO-PLAYING BRAND CAROUSEL */}
      <section className="py-20 bg-[#FCF6F6] border-b border-[#FCF6F6] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center relative z-10">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">500+ brand collaborations with UGCFY</p>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full max-w-5xl mx-auto overflow-hidden">
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${activeLogoPage * 100}%)` }}
          >
            {logoPages.map((page, pageIndex) => (
              <div key={pageIndex} className="w-full flex-shrink-0">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 md:gap-x-16 items-center justify-items-center px-4 md:px-12">
                  {page.map((item) => (
                    <div
                      key={item}
                      className="h-12 w-28 md:w-36 flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer"
                    >
                      {/* DEVELOPER NOTE: 
                        Currently using inline SVGs to prevent terminal 404 spam.
                        When you have real logos, change the src back to: src={`/logos/brand-${item}.png`} 
                      */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="144" height="48" viewBox="0 0 144 48"><rect width="144" height="48" fill="%23f3f4f6" rx="8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="bold" font-size="14" fill="%239ca3af">BRAND ${item}</text></svg>`}
                        alt={`Brand Partner ${item}`}
                        className="object-contain w-full h-full drop-shadow-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {logoPages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveLogoPage(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeLogoPage === idx ? 'bg-[var(--color-primary)] w-8' : 'bg-gray-200 hover:bg-gray-300'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES SECTION (ZIG-ZAG) */}
      <section className="py-24 bg-[var(--color-bg-light)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="eyebrow">Platform Capabilities</span>
            <h2 className="text-[36px] md:text-[44px] font-bold text-[#0A0A0A]">Core Features of UGCFY</h2>
          </div>

          <div className="flex flex-col gap-24 md:gap-32 overflow-hidden py-10">
            {platformFeatures.map((feature, index) => {
              // Determine visual position based on index to trigger correct left/right slide
              const isVisuallyReversed = index % 2 !== 0;

              return (
                <div
                  key={feature.id}
                  className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 even:md:flex-row-reverse group"
                >


                  {/* If odd (image left), slide from left (-50). If even (image right), slide from right (50) */}
                  <motion.div
                    initial={{ opacity: 0, x: isVisuallyReversed ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="w-full md:w-1/2 relative"
                  >
                    <div className="relative rounded-2xl overflow-hidden bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] transform transition-transform duration-700 ease-out group-hover:-translate-y-3 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] min-h-[400px]">
                      {feature.visual}
                      <div className="absolute inset-0 border border-black/5 rounded-2xl pointer-events-none"></div>
                    </div>
                  </motion.div>



                  <motion.div
                    initial={{ opacity: 0, x: isVisuallyReversed ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                    className="w-full md:w-1/2 flex flex-col items-start text-left"
                  >
                    <h3 className="text-4xl md:text-5xl font-extrabold text-[#0A0A0A] mb-6 tracking-tight">
                      {feature.title} <span className="text-[var(--color-primary)]">{feature.highlight}</span>
                    </h3>
                    <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
                      {feature.description}
                    </p>
                    <Link href={feature.buttonLink} className="inline-flex items-center justify-center bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold py-3.5 px-8 rounded-lg shadow-lg shadow-[var(--shadow-cta)] hover:shadow-[var(--shadow-cta)] transform hover:-translate-y-1 transition-all duration-300">
                      {feature.buttonText}
                    </Link>
                  </motion.div>

                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: EXACT REFERENCE USPS */}
      <section className="py-32 bg-[#FAFAFA] relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">

          {/* Centered Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-[#0A0A0A] tracking-tight"
            >
              Our USPs
            </motion.h2>
          </div>

          {/* The Structured Block Grid */}
          <motion.div
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
          >
            {uspData.map((usp) => (
              <motion.div
                key={usp.id}
                variants={cardVariants}
                // Pure white card, subtle border, rounded corners
                className="relative bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md hover:border-[var(--color-primary)] transition-all duration-300"
              >
                {/* Top Left Dark Icon Box (Exact match to reference) */}
                <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] group-hover:bg-[var(--color-primary)] flex items-center justify-center text-white mb-6 relative z-10 transition-colors duration-300">
                  <usp.icon strokeWidth={2} className="w-6 h-6" />
                </div>

                {/* Block Text Content */}
                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                    {usp.title}
                  </h3>
                  <p className="text-gray-600 text-[15px] md:text-base leading-relaxed max-w-[95%]">
                    {usp.description}
                  </p>
                </div>

                {/* The Distinct Bottom-Right Watermark */}
                <div className="absolute -bottom-10 -right-10 z-0 pointer-events-none transform transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-2">
                  <usp.icon
                    strokeWidth={1.5}
                    className="w-44 h-44 text-gray-200 opacity-5"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* SECTION 6: ORBITAL SOCIAL PROOF */}
      <section className="py-32 bg-[#FCF6F6] overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">

          {/* Left Side: The Orbit */}
          <div className="relative flex justify-center items-center h-[500px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="relative w-[300px] h-[300px] rounded-full border border-dashed border-[var(--color-primary)]/20"
            >
              {/* Orbiting Logo Placeholder */}
              {[0, 90, 180, 270].map((deg, i) => (
                <div
                  key={i}
                  className="absolute w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-100"
                  style={{
                    top: '50%', left: '50%',
                    transform: `rotate(${deg}deg) translate(150px) rotate(-${deg}deg)`
                  }}
                >
                  <div className="w-6 h-6 bg-gray-200 rounded-full" />
                </div>
              ))}
            </motion.div>

            {/* Central Avatar */}
            <div className="absolute w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-white bg-gray-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" alt="Testimonial User" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right Side: The Quote & Stats */}
          <div className="flex flex-col gap-8">
            <Quote className="w-16 h-16 text-[var(--color-primary)] fill-[var(--color-primary)]/10" />
            <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 leading-snug">
              &quot;When you want a campaign to succeed, your partners should share your vision. UGCFY embraced our dream with enthusiasm and dedication.&quot;
            </blockquote>

            {/* Brand Attribution */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold">P</div>
              <span className="font-bold text-gray-900">Popeyes India</span>
            </div>

            <Link href="/get-started" className="bg-black text-white px-8 py-4 rounded-xl font-bold w-fit hover:bg-gray-800 transition-colors inline-block text-center">
              Get Started
            </Link>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              {[
                { label: "Brand Collaborations", value: "200+" },
                { label: "Content Generated", value: "450K" },
                { label: "Quality Creators", value: "180+" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: PROFESSIONAL USP GRID */}
      <section className="py-24 bg-white">
        <div className="max-w-[1100px] mx-auto px-6">

          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] tracking-tight">
              Why Choose UGCFY
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16 mb-16"
          >
            {whyChooseData.slice(0, 3).map((usp, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 mb-6 flex items-center justify-center">
                  <usp.icon className="w-12 h-12 text-red-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">{usp.title}</h3>
                <p className="text-gray-500 leading-relaxed text-base max-w-[300px]">{usp.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false }}
            className="flex flex-col md:flex-row justify-center gap-x-12 gap-y-16"
          >
            {whyChooseData.slice(3, 5).map((usp, idx) => (
              <motion.div
                key={idx + 3}
                variants={cardVariants}
                className="flex flex-col items-center text-center md:w-1/3"
              >
                <div className="w-16 h-16 mb-6 flex items-center justify-center">
                  <usp.icon className="w-12 h-12 text-red-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">{usp.title}</h3>
                <p className="text-gray-500 leading-relaxed text-base max-w-[300px]">{usp.desc}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* SECTION 9: AI INTEGRATION CAROUSEL */}
      <section className="relative overflow-hidden bg-[#FDFBFB] py-16 sm:py-20 lg:py-24">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-center">
            
            {/* Left Editorial Content */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E11D48]/15 bg-white px-4 py-2 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[#E11D48] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#E11D48]">
                    AI Powered
                  </span>
                </div>
                
                <h2 className="max-w-[520px] text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[0.98] text-[#0A0A0A]">
                  AI Integration By UGCFY
                </h2>
                
                <div className="flex flex-col gap-4">
                  <p className="text-gray-600 text-lg leading-relaxed max-w-[480px]">
                    When AI is all the rage in the digital sphere, let us bring you on the same page with our bespoke AI integrations.
                  </p>
                  <p className="text-gray-500 text-base leading-relaxed max-w-[480px]">
                    UGCFY integrates AI to bring precision to your influencer marketing campaigns by delivering data-backed strategies, superior targeting, and real-time adjustments.
                  </p>
                </div>
              </div>

              <Link href="/ai-integration" className="group relative inline-flex w-fit items-center justify-center rounded-2xl bg-[#E11D48] px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-[#E11D48]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#BE123C] hover:shadow-2xl hover:shadow-[#E11D48]/25 active:translate-y-0">
                <span>Explore more</span>
                <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              {/* Small understated feature row */}
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <span className="text-sm font-bold text-gray-800">5 AI modules</span>
                <span className="text-sm font-bold text-gray-300">•</span>
                <span className="text-sm font-bold text-gray-800">Campaign precision</span>
                <span className="text-sm font-bold text-gray-300">•</span>
                <span className="text-sm font-bold text-gray-800">Real-time optimization</span>
              </div>
            </div>

            {/* Right AI Showcase Card (Single Panel) */}
            <div className="relative w-full flex items-center justify-center lg:justify-end">
              <AnimatePresence mode="wait">
                {(() => {
                  const currentAi = (aiFeatures[activeAiIndex] || aiFeatures[0]) as AiFeature;
                  return (
                    <motion.div
                      key={activeAiIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className={`relative w-full flex flex-col justify-between p-7 sm:p-10 lg:p-12 rounded-[36px] border transition-all duration-500 min-h-[430px] ${
                        currentAi.theme === 'dark' 
                          ? 'bg-[#0A0A0A] text-white border-white/10 shadow-2xl shadow-black/20' 
                          : 'bg-white text-[#0A0A0A] border-black/5 shadow-2xl shadow-black/5'
                      }`}
                    >
                      <div className="flex flex-col gap-6">
                        
                        {/* Top row */}
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <div className={`inline-flex px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-[0.15em] ${
                            currentAi.theme === 'dark' ? 'bg-white/10 text-white' : 'bg-[#E11D48]/10 text-[#E11D48]'
                          }`}>
                            {currentAi.eyebrow}
                          </div>
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${
                            currentAi.theme === 'dark' ? 'border-white/10 text-gray-300 bg-white/5' : 'border-gray-100 text-gray-500 bg-gray-50'
                          }`}>
                            <Sparkles className="w-3 h-3" />
                            AI Module
                          </div>
                        </div>

                        {/* Main Title & Desc */}
                        <div>
                          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                            {currentAi.title}
                          </h3>
                          <p className={`text-base leading-relaxed ${currentAi.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {currentAi.description}
                          </p>
                        </div>

                        {/* Points grid */}
                        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 my-2">
                          {currentAi.points.map((point, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[#E11D48]">
                                <Check className="w-3 h-3 text-white stroke-[3]" />
                              </div>
                              <span className={`text-[15px] font-bold leading-tight ${currentAi.theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                                {point}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer: Read More & Controls */}
                      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <button 
                          type="button"
                          onClick={() => setSelectedAiFeature(currentAi)}
                          aria-label={`Read more about ${currentAi.title}`}
                          className={`group flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-4 rounded-xl font-extrabold text-sm border transition-all duration-300 ${
                            currentAi.theme === 'dark' 
                              ? 'border-white/15 text-white bg-white/5 hover:bg-white/10' 
                              : 'border-gray-200 text-[#0A0A0A] bg-gray-50/50 hover:bg-gray-100'
                          }`}
                        >
                          Read More
                          <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>

                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                          
                          {/* Progress Dots */}
                          <div className="flex items-center gap-2">
                            {aiFeatures.map((feature, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setActiveAiIndex(i)}
                                aria-label={`Show ${feature.title}`}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  activeAiIndex === i 
                                    ? 'w-6 bg-[#E11D48]' 
                                    : `w-2 hover:w-3 ${currentAi.theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'}`
                                }`}
                              />
                            ))}
                          </div>

                          {/* Arrows */}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              aria-label="Show previous AI service"
                              onClick={() => setActiveAiIndex(prev => prev === 0 ? aiFeatures.length - 1 : prev - 1)}
                              className={`p-3 rounded-full border transition-all active:scale-95 flex items-center justify-center shadow-sm ${
                                currentAi.theme === 'dark' 
                                  ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white' 
                                  : 'border-gray-200 bg-white hover:bg-gray-50 text-[#0A0A0A]'
                              }`}
                            ><ChevronLeft className="w-5 h-5" /></button>
                            <button
                              type="button"
                              aria-label="Show next AI service"
                              onClick={() => setActiveAiIndex(prev => (prev + 1) % aiFeatures.length)}
                              className={`p-3 rounded-full border transition-all active:scale-95 flex items-center justify-center shadow-sm ${
                                currentAi.theme === 'dark' 
                                  ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white' 
                                  : 'border-gray-200 bg-white hover:bg-gray-50 text-[#0A0A0A]'
                              }`}
                            ><ChevronRight className="w-5 h-5" /></button>
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>
            
          </div>
        </div>
      </section>      {/* 10. FAQ ACCORDION */}
      <section className="py-32 bg-white">
        <div className="max-w-[1000px] mx-auto px-6">

          <div className="flex items-center gap-6 mb-16 justify-center">
            <div className="hidden md:block flex-1 h-[1px] bg-gray-300"></div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A0A0A] leading-none px-4">
              FAQs
            </h2>
            <div className="hidden md:block flex-1 h-[1px] bg-gray-300"></div>
          </div>

          <div className="flex flex-col">
            {faqData.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`border-b border-gray-200 last:border-none overflow-hidden transition-all duration-300`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className={`w-full px-6 py-5 flex items-center justify-between text-left ${isOpen ? 'bg-[#FCF6F6]' : 'bg-white'}`}
                  >
                    <span className={`font-semibold text-[15px] md:text-base ${isOpen ? 'text-[#E11D48]' : 'text-[#0A0A0A]'}`}>
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`${isOpen ? 'text-[#E11D48]' : 'text-gray-500'}`}
                    >
                      <ChevronDown className="w-5 h-5 stroke-[1.5]" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="bg-white"
                      >
                        <div className="px-6 pt-4 pb-6 text-gray-600 text-sm leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 11. CTA BANNER */}
      <section id="cta-section" className="bg-[#000000] overflow-hidden relative">
        <div className="max-w-[1280px] mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between">

          <div className="py-12 lg:py-16 flex-1 z-20 w-full">
            <h3 className="text-white font-bold text-lg md:text-xl mb-3 tracking-wide">
              Let&apos;s make something cool
            </h3>
            <h2 className="text-3xl md:text-5xl lg:text-[56px] font-extrabold text-white mb-8 leading-[1.1] tracking-tight max-w-xl">
              Start your success with UGCFY right now!
            </h2>
            <Link href="/get-started" className="bg-white text-black font-bold text-lg py-3 px-8 rounded-lg w-fit hover:bg-[#E11D48] hover:text-white transition-colors shadow-xl inline-block text-center">
              Get Started
            </Link>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[60%] flex items-center justify-end opacity-30 lg:opacity-100 pointer-events-none z-0">
            {/* Gradient fade on the left to blend into the black background */}
            <div className="absolute left-0 top-0 bottom-0 w-[60%] bg-gradient-to-r from-[#000000] via-[#000000]/80 to-transparent z-10 hidden lg:block"></div>

            <div className="flex gap-3 md:gap-5 -rotate-12 translate-x-[20%] md:translate-x-[15%] scale-90 md:scale-100">
              {/* Column 1 */}
              <div className="flex flex-col gap-3 md:gap-5 -translate-y-16">
                <Image src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80" alt="UGC Fashion Creator filming content" width={400} height={500} unoptimized className="rounded-2xl object-cover w-28 h-40 md:w-40 md:h-56 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/10" />
                <Image src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=400&q=80" alt="UGC Tech Creator setting up equipment" width={400} height={500} unoptimized className="rounded-2xl object-cover w-28 h-40 md:w-40 md:h-56 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/10" />
              </div>
              {/* Column 2 */}
              <div className="flex flex-col gap-3 md:gap-5">
                <Image src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80" alt="UGC Lifestyle Creator vlogging outdoors" width={400} height={500} unoptimized className="rounded-2xl object-cover w-28 h-40 md:w-40 md:h-56 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/10" />
                <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80" alt="UGC Beauty Creator recording a makeup tutorial" width={400} height={500} unoptimized className="rounded-2xl object-cover w-28 h-40 md:w-40 md:h-56 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/10" />
              </div>
              {/* Column 3 */}
              <div className="flex flex-col gap-3 md:gap-5 translate-y-16">
                <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" alt="UGC Skincare Creator showing products" width={400} height={500} unoptimized className="rounded-2xl object-cover w-28 h-40 md:w-40 md:h-56 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/10" />
                <Image src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80" alt="UGC Fitness Creator taking a selfie" width={400} height={500} unoptimized className="rounded-2xl object-cover w-28 h-40 md:w-40 md:h-56 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 12. FOOTER */}
      <Footer />

      {/* 11. COOKIE CONSENT BANNER */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 pointer-events-none flex justify-center">
          <div className="bg-white shadow-[var(--shadow-hover)] border border-gray-200 rounded-2xl p-6 max-w-4xl w-full pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-6 animate-[var(--animate-float)]" style={{ animationDuration: '10s' }}>
            <div>
              <h3 className="text-lg font-bold text-[#0A0A0A] mb-2">Cookies & Privacy</h3>
              <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-xl">
                We use cookies to enhance your ultra-premium browsing experience. By clicking &quot;Accept All&quot;, you consent to our use of Necessary, Analytical, and Marketing cookies.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button onClick={() => setShowCookieBanner(false)} className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition">Accept Necessary</button>
              <button onClick={() => setShowCookieBanner(false)} className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition">Reject All</button>
              <button onClick={() => setShowCookieBanner(false)} className="btn-primary py-2.5 px-6">Accept All</button>
            </div>
          </div>
        </div>
      )}

      {/* Request Access Intercept Modal */}
      <RequestAccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* AI Feature Modal */}
      <AnimatePresence>
        {selectedAiFeature && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedAiFeature(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[32px] w-full max-w-[720px] p-8 sm:p-10 relative shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto hide-scrollbar"
            >
              <button 
                type="button"
                aria-label="Close AI service details"
                onClick={() => setSelectedAiFeature(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#E11D48]/10 px-3 py-1.5">
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#E11D48]">
                  {selectedAiFeature.eyebrow}
                </span>
              </div>

              <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0A0A0A] mb-4 tracking-tight">{selectedAiFeature.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {selectedAiFeature.longDescription}
                </p>
              </div>

              <div className="h-px w-full bg-gray-100 my-2" />

              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="text-lg font-bold text-[#0A0A0A] mb-3">Use Cases</h4>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {selectedAiFeature.useCases.map((uc, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="mt-1 shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-gray-100">
                          <Check className="w-3 h-3 text-gray-500 stroke-[3]" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 leading-relaxed">
                          {uc}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-[#0A0A0A] mb-3">Benefits</h4>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {selectedAiFeature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="mt-1 shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[#E11D48]/10">
                          <Check className="w-3 h-3 text-[#E11D48] stroke-[3]" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 leading-relaxed">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-[#0A0A0A] mb-3">Workflow</h4>
                  <div className="flex flex-col gap-4 relative">
                    <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gray-200" />
                    {selectedAiFeature.workflow.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-4 relative z-10">
                        <div className="w-5 h-5 rounded-full bg-white border-2 border-[#E11D48] flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-[#E11D48]">{idx + 1}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700 leading-relaxed">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setSelectedAiFeature(null)}
                className="mt-2 w-full sm:w-auto sm:self-end bg-[#0A0A0A] hover:bg-black text-white font-bold py-4 px-8 rounded-xl transition-all shadow-md active:scale-[0.98]"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
