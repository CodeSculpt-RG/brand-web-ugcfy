/* eslint-disable @typescript-eslint/no-explicit-any */

import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileClient } from "./ProfileClient";
import { Building } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProfilePage() {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    redirect("/login");
  }

  const supabase = await createClient();
  const brandId = brandSession.brand.id;

  let profile = {
    id: brandId,
    company_name: brandSession.brand.company_name || "Brand Account",
    website_url: "",
    industry: "",
    phone: "",
    location: "",
    business_description: "",
    contact_email: brandSession.brand.email || brandSession.user.email || ""
  };

  let campaigns: any[] = [];
  let pocs: any[] = [];
  let tableMissing = false;

  try {
    // Fetch Profile
    const { data: brandData, error: profileError } = await supabase
      .from("brand_profiles")
      .select("*")
      .eq("id", brandId)
      .single();

    if (profileError) {
      if (profileError.code === "42P01" || profileError.message?.includes("does not exist")) {
        tableMissing = true;
      } else if (profileError.code !== "PGRST116") {
        console.error("[Profile] Error fetching profile:", profileError);
      }
    } else if (brandData) {
      profile = {
        ...profile,
        ...brandData
      };
    }

    if (!tableMissing) {
      // Fetch Campaigns
      const { data: campaignData, error: campaignError } = await supabase
        .from("campaigns")
        .select("*")
        .eq("brand_id", brandId);

      if (campaignError) {
        if (campaignError.code !== "42P01") console.error("[Profile] Error fetching campaigns:", campaignError);
      } else if (campaignData) {
        campaigns = campaignData;
      }

      // Fetch POCs
      const { data: pocData, error: pocError } = await supabase
        .from("brand_poc")
        .select("*")
        .eq("brand_id", brandId);

      if (pocError) {
        if (pocError.code !== "42P01") console.error("[Profile] Error fetching pocs:", pocError);
      } else if (pocData) {
        pocs = pocData;
      }
    }
  } catch (err) {
    console.warn("[Profile] Error:", err);
  }

  if (tableMissing) {
    return (
      <div className="space-y-6">
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <Building className="h-10 w-10 text-slate-300 mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-700">Profile data unavailable</p>
          <p className="text-xs text-slate-500 mt-1">The brand profile database is currently being configured.</p>
        </div>
      </div>
    );
  }

  return <ProfileClient initialProfile={profile} initialCampaigns={campaigns} initialPocs={pocs} />;
}
