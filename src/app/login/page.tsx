"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { createClient } from "@/lib/supabase/client";
import { 
  Sparkles, 
  ArrowRight, 
  Mail, 
  Lock, 
  Building, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Clock,
  Play
} from "lucide-react";

// Form Validation Schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Hook Form setup
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLoginForm,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignupForm,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  // Auth Handlers
  const onLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    setAuthSuccess(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setAuthError(error.message);
      } else {
        setAuthSuccess("Logged in successfully! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      }
    } catch (err: any) {
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSignup = async (data: SignupFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    setAuthSuccess(null);

    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            role: "brand",
            full_name: data.companyName,
          },
        },
      });

      if (error) {
        setAuthError(error.message);
      } else {
        setAuthSuccess("Account created successfully! Check your email to verify.");
        resetSignupForm();
      }
    } catch (err: any) {
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setAuthError(null);
    setAuthSuccess(null);
    resetLoginForm();
    resetSignupForm();
  };

  // Google/Apple SSO
  const handleSSO = async (provider: "google" | "apple") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setAuthError(error.message);
    } catch (err) {
      setAuthError(`Failed to connect with ${provider}`);
    }
  };

  return (
    <main className="relative min-h-screen w-screen flex overflow-hidden bg-white select-none">
      
      {/* LEFT SIDE (40%): Visual Sticky Pane */}
      <section className="hidden md:flex md:w-[40%] relative mesh-bg-gradient items-center justify-center p-8 overflow-hidden z-10">
        
        {/* Overlay light effects */}
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="w-full max-w-md flex flex-col justify-between h-full relative z-20 text-white py-12">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
              <span className="text-brand-red-600 font-extrabold text-xl tracking-tighter">U</span>
            </div>
            <div>
              <h1 className="font-extrabold text-2xl tracking-tight leading-none text-white">UGC<span className="text-white/80 font-normal">FY</span></h1>
              <p className="text-[10px] text-brand-red-100 tracking-wider uppercase font-semibold leading-none mt-1">Brand Portal</p>
            </div>
          </div>

          {/* Core Visual Elements (Floating Cards) */}
          <div className="my-auto space-y-6 py-8">
            
            {/* Card 1: Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="backdrop-blur-md bg-white/10 border border-white/20 p-5 rounded-2xl shadow-xl flex items-center gap-4"
            >
              <div className="p-3 bg-white/10 rounded-xl">
                <TrendingUp className="h-6 w-6 text-brand-red-200" />
              </div>
              <div>
                <p className="text-sm text-brand-red-100 font-medium">UGC Campaign Conversion</p>
                <h3 className="text-2xl font-bold mt-0.5">+4.2x Growth</h3>
              </div>
            </motion.div>

            {/* Card 2: Creators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="backdrop-blur-md bg-white/10 border border-white/20 p-5 rounded-2xl shadow-xl flex items-center gap-4"
            >
              <div className="p-3 bg-white/10 rounded-xl">
                <Users className="h-6 w-6 text-brand-red-200" />
              </div>
              <div>
                <p className="text-sm text-brand-red-100 font-medium">Vetted Creator Directory</p>
                <h3 className="text-2xl font-bold mt-0.5">15,000+ Creators</h3>
              </div>
            </motion.div>

            {/* Card 3: Brand Success Quote */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="backdrop-blur-md bg-white/10 border border-white/20 p-5 rounded-2xl shadow-xl relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 p-2 bg-brand-red-500 rounded-bl-xl text-[10px] uppercase font-bold tracking-wider opacity-85">
                Escrow Safe
              </div>
              <p className="text-sm italic text-white/95 mt-1 leading-relaxed">
                "UGCFY scaled our content pipeline from 3 videos a month to 50+ approved high-quality ads. The escrow release system makes it completely risk-free."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  N
                </div>
                <div>
                  <p className="text-xs font-semibold">Nike Sports India</p>
                  <p className="text-[10px] text-white/60">Campaign Manager</p>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Footer Info */}
          <div className="text-xs text-white/60 flex items-center justify-between border-t border-white/10 pt-6">
            <span>© 2026 UGCFY. All rights reserved.</span>
            <div className="flex gap-3">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE (60%): Minimalist Form Area */}
      <section className="w-full md:w-[60%] flex items-center justify-center p-6 sm:p-12 md:p-24 relative overflow-y-auto bg-slate-50/50">
        
        {/* Soft decorative blur shapes for ambient light */}
        <div className="absolute right-[-10%] top-[-10%] h-[30vw] w-[30vw] rounded-full bg-brand-red-50 blur-[120px] pointer-events-none" />
        <div className="absolute left-[10%] bottom-[-10%] h-[30vw] w-[30vw] rounded-full bg-slate-100 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-white/70 backdrop-blur-md border border-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-100 relative z-20">
          
          {/* Mobile Logo (Visible only on mobile) */}
          <div className="flex md:hidden items-center gap-2 mb-8">
            <div className="h-9 w-9 bg-brand-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-extrabold text-lg tracking-tighter">U</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">UGC<span className="text-brand-red-600">FY</span></span>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              {isLogin ? "Welcome back" : "Scale your brand content"}
              <Sparkles className="h-5 w-5 text-brand-red-500 animate-pulse" />
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isLogin 
                ? "Enter your credentials to manage your campaigns" 
                : "Create a brand account to hire creators today"}
            </p>
          </div>

          {/* Alerts */}
          <AnimatePresence mode="wait">
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-xs"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </motion.div>
            )}

            {authSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3 text-emerald-800 text-xs"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{authSuccess}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SSO Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => handleSSO("google")}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200/80 bg-white rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.63 15.02 1 12 1 7.35 1 3.4 3.65 1.5 7.54l3.87 3a7.02 7.02 0 0 1 6.63-5.5Z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63l3.71 2.88c2.17-2 3.71-4.94 3.71-8.75Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.37 14.54a7 7 0 0 1 0-5.08L1.5 6.46a11.96 11.96 0 0 0 0 11.08l3.87-3Z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.71-2.88a7.02 7.02 0 0 1-10.88-3.66l-3.89 3A11.96 11.96 0 0 0 12 23Z"
                />
              </svg>
              Google
            </button>
            <button
              onClick={() => handleSSO("apple")}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200/80 bg-white rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.09.08 2.21-.55 2.94-1.39Z" />
              </svg>
              Apple
            </button>
          </div>

          <div className="relative mb-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200/80" />
            </div>
            <span className="relative bg-white px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Or continue with email
            </span>
          </div>

          {/* Form Content */}
          {isLogin ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    {...loginRegister("email")}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 text-sm focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition bg-slate-50/50 focus:bg-white"
                    placeholder="name@company.com"
                  />
                </div>
                {loginErrors.email && (
                  <p className="text-red-500 text-[10px] font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {loginErrors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-600">Password</label>
                  <a href="#" className="text-[11px] font-semibold text-brand-red-600 hover:text-brand-red-700 transition">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    {...loginRegister("password")}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 text-sm focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition bg-slate-50/50 focus:bg-white"
                    placeholder="••••••••"
                  />
                </div>
                {loginErrors.password && (
                  <p className="text-red-500 text-[10px] font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {loginErrors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-xl py-3 text-xs font-bold transition shadow-lg shadow-brand-red-600/10 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? "Signing in..." : "Sign in to Dashboard"}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Company / Brand Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    {...signupRegister("companyName")}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 text-sm focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition bg-slate-50/50 focus:bg-white"
                    placeholder="Nike Sports India"
                  />
                </div>
                {signupErrors.companyName && (
                  <p className="text-red-500 text-[10px] font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {signupErrors.companyName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Work Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    {...signupRegister("email")}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 text-sm focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition bg-slate-50/50 focus:bg-white"
                    placeholder="partnership@brand.com"
                  />
                </div>
                {signupErrors.email && (
                  <p className="text-red-500 text-[10px] font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {signupErrors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Create Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    {...signupRegister("password")}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 text-sm focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition bg-slate-50/50 focus:bg-white"
                    placeholder="•••••••• (Min 6 chars)"
                  />
                </div>
                {signupErrors.password && (
                  <p className="text-red-500 text-[10px] font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {signupErrors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-xl py-3 text-xs font-bold transition shadow-lg shadow-brand-red-600/10 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? "Creating Account..." : "Register Brand"}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          )}

          {/* Toggle Form Mode */}
          <div className="mt-8 text-center text-xs text-slate-500">
            New to UGCFY?{" "}
            <Link
              href="/signup"
              className="font-bold text-brand-red-600 hover:text-brand-red-700 transition cursor-pointer"
            >
              Request Access
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}
