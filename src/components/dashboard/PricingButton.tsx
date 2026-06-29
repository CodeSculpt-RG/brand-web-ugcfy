"use client";

import { Sparkles } from "lucide-react";

interface PricingButtonProps {
  label?: string;
  className?: string;
}

export function PricingButton({
  label = "Go Plus",
  className = "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-brand-black px-5 text-sm font-extrabold text-white transition hover:bg-brand-red-700",
}: PricingButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("open-pricing-modal"))}
      className={className}
    >
      <Sparkles className="h-4 w-4" />
      {label}
    </button>
  );
}
