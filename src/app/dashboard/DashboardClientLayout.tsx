"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import SubscriptionPaywallModal from "@/components/SubscriptionPaywallModal";
import {
  LayoutDashboard,
  Video,
  Search,
  CheckSquare,
  LogOut,
  Menu,
  ChevronLeft,
  Bell,
  Building,
  ChevronDown,
  Sparkles,
  Settings,
  Compass,
  MessageSquare,
  Users,
  Clock
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
}

interface BrandProp {
  id: string;
  user_id?: string | null;
  company_name?: string | null;
  brand_name?: string | null;
  email?: string | null;
  approval_status?: string | null;
}

const sidebarItems: SidebarItem[] = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Explore Feed", href: "/dashboard/feed", icon: Compass },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Video },
  { name: "Creators", href: "/dashboard/creators", icon: Search },
  { name: "Approvals", href: "/dashboard/approvals", icon: CheckSquare },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "POC Management", href: "/dashboard/poc", icon: Users },
  { name: "Brand Profile", href: "/dashboard/profile", icon: Building },
];

export default function DashboardClientLayout({
  children,
  brand,
}: {
  children: React.ReactNode;
  brand: BrandProp;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const profile = {
    company_name: brand.brand_name || "Brand Account",
    email: brand.email || "",
  };
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notifications: any[] = [];
  const [showNotifications, setShowNotifications] = useState(false);
  const isLoading = false;
  const [pocCount, setPocCount] = useState(0);
  const [subscriptionStatus, setSubscriptionStatus] = useState("free");
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  // Listen for paywall and increment triggers
  useEffect(() => {
    const handleOpenPaywall = () => setIsPaywallOpen(true);
    const handleIncrementPoc = () => setPocCount(prev => prev + 1);

    window.addEventListener("open-subscription-paywall", handleOpenPaywall);
    window.addEventListener("increment-poc-count", handleIncrementPoc);

    return () => {
      window.removeEventListener("open-subscription-paywall", handleOpenPaywall);
      window.removeEventListener("increment-poc-count", handleIncrementPoc);
    };
  }, []);

  // Monitor Scroll
  useEffect(() => {
    const handleScroll = () => {
      // Intentionally left blank for future expansion
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Monitor Scroll
  useEffect(() => {
    const handleScroll = () => {
      // Intentionally left blank for future expansion
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-3 bg-slate-50">
        <div className="h-10 w-10 border-4 border-brand-red-200 border-t-brand-red-600 rounded-full animate-spin" />
        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Verifying Access...</span>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-50/50">

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-slate-200/80 transition-all duration-300 shrink-0 ${isSidebarCollapsed ? "w-20" : "w-64"
          }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/80">
          <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
            <div className="h-9 w-9 bg-brand-red-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-extrabold text-lg tracking-tighter">U</span>
            </div>
            {!isSidebarCollapsed && (
              <span className="font-extrabold text-lg tracking-tight text-slate-900 whitespace-nowrap">
                UGC<span className="text-brand-red-600">FY</span>
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-500 cursor-pointer"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${isSidebarCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
            return (
              <Link key={item.name} href={item.href} className="block relative">
                <div
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                      ? "text-brand-red-600 bg-brand-red-50/80"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                    }`}
                >
                  <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "text-brand-red-600" : "text-slate-400"}`} />
                  {!isSidebarCollapsed && <span>{item.name}</span>}

                  {/* Elegant active state red accent line */}
                  {isActive && !isSidebarCollapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-2 top-3 bottom-3 w-1 bg-brand-red-600 rounded-full"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Usage progress bar inside sidebar */}
        {!isSidebarCollapsed && (
          <div className="mx-4 mb-4 p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-2 select-none text-left shrink-0">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-slate-500 uppercase tracking-wider">POC Usage</span>
              <span className={pocCount >= 3 && subscriptionStatus === "free" ? "text-brand-red-600" : "text-slate-700"}>
                {pocCount} / 3 Free
              </span>
            </div>

            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${pocCount >= 3 && subscriptionStatus === "free" ? "bg-brand-red-600" : "bg-slate-800"
                  }`}
                style={{ width: `${Math.min((pocCount / 3) * 100, 100)}%` }}
              />
            </div>

            {pocCount >= 3 && subscriptionStatus === "free" && (
              <button
                onClick={() => setIsPaywallOpen(true)}
                className="w-full text-left text-[10px] font-extrabold text-brand-red-600 hover:text-brand-red-750 hover:underline block pt-1 cursor-pointer"
              >
                Upgrade to Premium
              </button>
            )}
          </div>
        )}

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50/50 transition cursor-pointer"
          >
            <LogOut className="h-5 w-5 shrink-0 text-slate-400" />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black md:hidden"
            />
            {/* Sidebar content */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 z-50 bg-white flex flex-col p-4 shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <div className="h-9 w-9 bg-brand-red-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-extrabold text-lg tracking-tighter">U</span>
                  </div>
                  <span className="font-extrabold text-lg tracking-tight text-slate-900">UGC<span className="text-brand-red-600">FY</span></span>
                </Link>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-500"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 py-6 space-y-1">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                          ? "text-brand-red-600 bg-brand-red-50/80 border-r-4 border-brand-red-600"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                        }`}
                    >
                      <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "text-brand-red-600" : "text-slate-400"}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Progress Bar */}
              <div className="mb-4 p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-2 select-none text-left shrink-0">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-slate-500 uppercase tracking-wider">POC Usage</span>
                  <span className={pocCount >= 3 && subscriptionStatus === "free" ? "text-brand-red-600" : "text-slate-700"}>
                    {pocCount} / 3 Free
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${pocCount >= 3 && subscriptionStatus === "free" ? "bg-brand-red-600" : "bg-slate-800"
                      }`}
                    style={{ width: `${Math.min((pocCount / 3) * 100, 100)}%` }}
                  />
                </div>

                {pocCount >= 3 && subscriptionStatus === "free" && (
                  <button
                    onClick={() => {
                      setIsMobileOpen(false);
                      setIsPaywallOpen(true);
                    }}
                    className="w-full text-left text-[10px] font-extrabold text-brand-red-600 hover:text-brand-red-750 hover:underline block pt-1 cursor-pointer"
                  >
                    Upgrade to Premium
                  </button>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50/50 transition cursor-pointer border-t border-slate-100 pt-4"
              >
                <LogOut className="h-5 w-5 shrink-0 text-slate-400" />
                <span>Sign Out</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT WRAPPER */}
      <div
        className={`flex-1 flex flex-col h-screen relative transition-all duration-300 ${pathname === "/dashboard/messages" ? "overflow-hidden" : "overflow-y-auto"
          }`}
      >
        {/* PREMIUM STICKY NAVBAR */}
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shrink-0">
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Left: Mobile toggle & Breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden p-2 hover:bg-slate-100/50 border border-slate-200/50 rounded-xl text-slate-600 transition"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>UGCFY</span>
                <span>/</span>
                <span className="text-slate-600 font-bold">
                  {sidebarItems.find(item => item.href === pathname || (pathname.startsWith(item.href) && item.href !== "/dashboard"))?.name || "Overview"}
                </span>
              </div>
            </div>

            {/* Right: Notifications & User profile dropdown */}
            <div className="flex items-center gap-3 relative">

              {/* POC Usage header badge */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/60 text-slate-700 rounded-xl text-[10px] font-bold">
                <span>POC Usage:</span>
                <span className={pocCount >= 3 && subscriptionStatus === "free" ? "text-brand-red-600 font-extrabold" : "text-slate-800"}>
                  {pocCount} / 3
                </span>
                {pocCount >= 3 && subscriptionStatus === "free" && (
                  <button
                    onClick={() => setIsPaywallOpen(true)}
                    className="text-brand-red-600 hover:text-brand-red-750 underline ml-1 cursor-pointer font-extrabold"
                  >
                    Upgrade
                  </button>
                )}
              </div>

              {/* Premium Badge / Plan indicator */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-brand-red-500 to-rose-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm shadow-brand-red-500/20">
                <Sparkles className="h-3 w-3" />
                Go Plus
              </div>

              {/* Notification Button */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 hover:bg-white border border-slate-200/60 bg-white/40 backdrop-blur-sm rounded-xl text-slate-600 hover:text-slate-800 transition relative cursor-pointer"
                >
                  <Bell className="h-4 w-4" />
                  {notifications.some(n => !n.is_read) && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-brand-red-600 rounded-full" />
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-white border border-slate-200/80 rounded-2xl shadow-xl z-50 p-4"
                      >
                        <h4 className="font-bold text-xs text-slate-800 border-b border-slate-100 pb-2 mb-2">Notifications</h4>
                        <div className="space-y-2">
                          {notifications.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-4">No new notifications</p>
                          ) : (
                            notifications.map((n) => (
                              <div key={n.id} className="p-2 rounded-lg hover:bg-slate-50 transition text-left">
                                <p className="text-xs font-bold text-slate-800 flex items-center justify-between">
                                  {n.title}
                                  {!n.is_read && <span className="h-1.5 w-1.5 bg-brand-red-600 rounded-full" />}
                                </p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{n.content}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 border border-slate-200/60 bg-white/40 backdrop-blur-sm rounded-xl text-slate-600 hover:text-slate-800 transition cursor-pointer"
                >
                  <div className="h-7 w-7 rounded-lg bg-brand-red-100 flex items-center justify-center text-brand-red-700 font-extrabold text-xs">
                    {profile?.company_name?.slice(0, 2).toUpperCase() || "BR"}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-slate-700">
                    {profile?.company_name || "Nike Sports India"}
                  </span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white border border-slate-200/80 rounded-2xl shadow-xl z-50 p-2"
                      >
                        <div className="p-3 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-800 truncate">{profile?.company_name}</p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{profile?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/settings"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition"
                          >
                            <Settings className="h-3.5 w-3.5" />
                            Settings
                          </Link>
                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50/50 rounded-lg transition text-left cursor-pointer"
                          >
                            <LogOut className="h-3.5 w-3.5" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </header>

        {/* PAGE BODY */}
        <main className={`flex-1 w-full ${pathname === "/dashboard/messages"
            ? "h-[calc(100vh-4rem)] p-0 overflow-hidden"
            : "p-4 md:p-6 lg:p-8 max-w-7xl mx-auto"
          }`}>
          
          {/* Status Banners */}
          {brand.approval_status === "profile_incomplete" && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-amber-900">Your profile is incomplete</h4>
                <p className="text-xs text-amber-700 mt-1">Please complete your brand profile and KYC to unlock full access.</p>
              </div>
              <Link href="/brand/onboarding" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition">
                Complete Profile
              </Link>
            </div>
          )}

          {brand.approval_status === "pending_verification" && (
            <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-blue-900">Application Under Review</h4>
                <p className="text-xs text-blue-700 mt-1">Our curation team is currently reviewing your application. You will receive an email once approved.</p>
              </div>
            </div>
          )}

          {brand.approval_status === "rejected" && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
              <span className="h-5 w-5 flex items-center justify-center bg-red-100 text-red-600 rounded-full font-bold text-xs shrink-0 mt-0.5">!</span>
              <div>
                <h4 className="text-sm font-bold text-red-900">Application Rejected</h4>
                <p className="text-xs text-red-700 mt-1">Unfortunately, your application did not meet our criteria. Please contact support for more details.</p>
              </div>
            </div>
          )}

          {brand.approval_status === "suspended" && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
              <span className="h-5 w-5 flex items-center justify-center bg-red-100 text-red-600 rounded-full font-bold text-xs shrink-0 mt-0.5">!</span>
              <div>
                <h4 className="text-sm font-bold text-red-900">Account Suspended</h4>
                <p className="text-xs text-red-700 mt-1">Your account has been suspended. Please contact partnerships@ugcfy.com for assistance.</p>
              </div>
            </div>
          )}

          <div className="p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
            <ErrorBoundary name="DashboardLayout">
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {isPaywallOpen && (
          <SubscriptionPaywallModal
            isOpen={isPaywallOpen}
            onClose={() => setIsPaywallOpen(false)}
            onUpgrade={() => {
              setSubscriptionStatus("premium");
              setIsPaywallOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
