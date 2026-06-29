/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { FileText } from "lucide-react";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { KycClient } from "@/app/brand/kyc/KycClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function VerificationPage() {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    redirect("/login");
  }

  const supabase = await createClient();
  const brandId = brandSession.brand.id;
  let documents: any[] = [];
  let tableMissing = false;

  try {
    const { data, error } = await supabase
      .from("brand_kyc_documents")
      .select("*")
      .eq("brand_id", brandId)
      .order("uploaded_at", { ascending: false });

    if (error) {
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        tableMissing = true;
      } else {
        console.error("[Verification] Error fetching documents:", error);
      }
    } else {
      documents = data ?? [];
    }
  } catch (err) {
    console.warn("[Verification] handled error:", err);
  }

  if (tableMissing) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Verification"
          description="Submit business registration documents and track verification status."
        />
        <DashboardEmptyState
          title="Verification unavailable"
          description="The KYC verification service is currently being configured."
          icon={FileText}
        />
      </div>
    );
  }

  return <KycClient initialDocuments={documents} />;
}
