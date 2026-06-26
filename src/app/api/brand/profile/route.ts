import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { companyName, businessType, websiteUrl, contactName, contactPhone } = body;

    if (!companyName || !businessType) {
      return NextResponse.json({ error: "Company name and business type are required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("brand_profiles")
      .update({
        company_name: companyName,
        business_type: businessType,
        website: websiteUrl || null,
        contact_name: contactName || null,
        contact_phone: contactPhone || null,
        onboarding_completed_at: new Date().toISOString()
      })
      .eq("id", user.id);

    if (error) {
      console.error("Update profile error:", error);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Profile PATCH error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
