import { ParentDashboardPage } from "@/components/parent/parent-dashboard-page";
import { fetchParentDashboardOverview } from "@/lib/api/parent-dashboard-api";

export default async function ParentDashboardRoute() {
  const data = await fetchParentDashboardOverview();
  return <ParentDashboardPage initialData={data} />;
}
