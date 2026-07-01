"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, X } from "lucide-react";
import RequestAccessModal from "./RequestAccessModal";
import { MegaMenuPanel, PLATFORM_DATA, SOLUTIONS_DATA, RESOURCES_DATA, SERVICES_DATA, COMPANY_DATA } from "./MegaMenu";

interface NavbarProps {
  theme?: "transparent-to-dark" | "dark";
  hideOnScroll?: boolean;
}

export default function Navbar({ theme = "transparent-to-dark", hideOnScroll = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [scrolled, setScrolled] = useState(theme === "dark");
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Background logic
      if (theme !== "dark") {
        setScrolled(currentScrollY > 20);
      }

      // Hide on scroll logic
      if (hideOnScroll) {
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          setIsVisible(false); // Scrolling down
        } else if (currentScrollY < lastScrollY.current) {
          setIsVisible(true);  // Scrolling up
        }
        lastScrollY.current = currentScrollY;
      }
    };
    
    // Check initial scroll position
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [theme, hideOnScroll]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoadingAuth(false);
      }
    }
    checkAuth();
  }, []);

  const headerBg = scrolled || theme === "dark" ? "bg-[#000000] shadow-xl" : "bg-transparent backdrop-blur-md";
  const transformStyle = hideOnScroll && !isVisible ? "-translate-y-full" : "translate-y-0";

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${transformStyle} py-1.5 ${headerBg} border-b border-white/10`}>
        <div className="max-w-[1280px] mx-auto px-6 h-[76px] flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/brand/ugcfy-logo.png" alt="UGCFY" width={140} height={40} className="h-8 w-auto object-contain brightness-0 invert" priority />
          </Link>

          <nav className="hidden lg:flex items-center gap-8 font-medium text-[15px] text-white h-full">
            {/* PLATFORM MEGA MENU */}
            <div className="group px-4 py-6 cursor-pointer">
              <span className="flex items-center gap-1 font-medium text-[15px] hover:text-[var(--color-primary)] transition-colors">
                Platform <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </span>
              <MegaMenuPanel data={PLATFORM_DATA} />
            </div>

            {/* SOLUTIONS MEGA MENU */}
            <div className="group px-4 py-6 cursor-pointer">
              <span className="flex items-center gap-1 font-medium text-[15px] hover:text-[var(--color-primary)] transition-colors">
                Solutions <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </span>
              <MegaMenuPanel data={SOLUTIONS_DATA} />
            </div>

            {/* RESOURCES MEGA MENU */}
            <div className="group px-4 py-6 cursor-pointer">
              <span className="flex items-center gap-1 font-medium text-[15px] hover:text-[var(--color-primary)] transition-colors">
                Resources <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </span>
              <MegaMenuPanel data={RESOURCES_DATA} />
            </div>

            {/* SERVICES MEGA MENU */}
            <div className="group px-4 py-6 cursor-pointer">
              <span className="flex items-center gap-1 font-medium text-[15px] hover:text-[var(--color-primary)] transition-colors">
                Services <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </span>
              <MegaMenuPanel data={SERVICES_DATA} />
            </div>

            {/* COMPANY MEGA MENU */}
            <div className="group px-4 py-6 cursor-pointer">
              <span className="flex items-center gap-1 font-medium text-[15px] hover:text-[var(--color-primary)] transition-colors">
                Company <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </span>
              <MegaMenuPanel data={COMPANY_DATA} />
            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-white border-white/20 hover:bg-white hover:text-black">I am a Brand</Link>
            {!loadingAuth && (
              isAuthenticated ? (
                <Link href="/dashboard" className="btn-primary ml-2 shadow-lg shadow-[var(--shadow-cta)]">
                  Brand Portal
                </Link>
              ) : (
                <Link href="/get-started" className="btn-primary ml-2 shadow-lg shadow-[var(--shadow-cta)]">
                  Get Started
                </Link>
              )
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>}
            </button>
          </div>
        </div>

        {/* MOBILE MENU PANEL */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#000000] border-b border-white/10 shadow-2xl z-50 lg:hidden">
            <div className="px-6 py-4 flex flex-col gap-4 text-white">
              <Link href="/platform/discover" className="text-lg font-bold hover:text-[#E11D48] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Platform</Link>
              <Link href="/solutions/brands" className="text-lg font-bold hover:text-[#E11D48] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Solutions</Link>
              <Link href="/resources/blogs" className="text-lg font-bold hover:text-[#E11D48] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Resources</Link>
              <Link href="/services/influencer-marketing" className="text-lg font-bold hover:text-[#E11D48] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
              <Link href="/about" className="text-lg font-bold hover:text-[#E11D48] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Company</Link>
              <div className="h-px bg-white/10 my-2"></div>
              <Link href="/login" className="text-left font-semibold text-gray-300 py-2 block hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>I am a Brand</Link>
              <Link href="/get-started" className="btn-primary w-full mt-2 text-center block" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
            </div>
          </div>
        )}
      </header>

      <RequestAccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
