import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { documentType, bucket, path, originalFilename, mimeType, sizeBytes } = body;

    if (!documentType || !bucket || !path) {
      return NextResponse.json({ error: "Missing required document metadata" }, { status: 400 });
    }

    // 1. Insert into brand_kyc_documents
    const { error: insertError } = await supabase
      .from("brand_kyc_documents")
      .insert({
        brand_id: user.id,
        document_type: documentType,
        bucket,
        path,
        original_filename: originalFilename || null,
        mime_type: mimeType || null,
        size_bytes: sizeBytes || null,
        status: "submitted"
      });

    if (insertError) {
      console.error("KYC insert error:", insertError);
      return NextResponse.json({ error: "Failed to save document metadata" }, { status: 500 });
    }

    // 2. Update brand_profiles approval_status
    const { error: updateError } = await supabase
      .from("brand_profiles")
      .update({
        approval_status: "pending_verification",
        verification_submitted_at: new Date().toISOString()
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json({ error: "Failed to update profile status" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("KYC POST error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
