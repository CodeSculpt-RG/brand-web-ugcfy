import { requireBrand } from "@/lib/auth/requireBrand";
import DashboardClientLayout from "./DashboardClientLayout";

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Strongly protect the dashboard routes on the server
  const brandSession = await requireBrand();
  
  return (
    <DashboardClientLayout 
      brand={{
        id: brandSession.brand.id,
        user_id: brandSession.brand.user_id ?? null,
        email: brandSession.user.email ?? brandSession.brand.email ?? null,
        company_name: brandSession.brand.company_name ?? null,
        brand_name: brandSession.brand.brand_name ?? null,
        approval_status: brandSession.brand.approval_status ?? null,
      }}
    >
      {children}
    </DashboardClientLayout>
  );
}
