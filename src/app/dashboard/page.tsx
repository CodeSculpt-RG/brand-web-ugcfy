import { getBrandDashboardData } from "@/lib/dashboard/getBrandDashboardData";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const data = await getBrandDashboardData();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <DashboardOverview data={data} />
    </div>
  );
}
