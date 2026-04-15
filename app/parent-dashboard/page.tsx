import { ParentDashboardPage } from "@/components/parent/parent-dashboard-page";
import type { ParentDashboardOverview } from "@/lib/api/parent-dashboard-types";
import { parentDashboardState, parentStudents, parentSummaryCards, parentUpcomingSessions } from "@/lib/parent/dashboard-data";

const fallbackDashboardData: ParentDashboardOverview = {
  state: parentDashboardState,
  students: parentStudents,
  summaryCards: parentSummaryCards,
  upcomingSessions: parentUpcomingSessions,
};

export default function ParentDashboardRoute() {
  return <ParentDashboardPage initialData={fallbackDashboardData} />;
}
