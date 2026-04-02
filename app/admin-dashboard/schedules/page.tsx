import { AdminSchedulesPage } from "@/components/admin/admin-schedules-page";
import { fetchAdminScheduleRows } from "@/lib/api/admin-schedule-api";

export default async function AdminSchedulesRoute() {
  const rows = await fetchAdminScheduleRows();
  return <AdminSchedulesPage initialRows={rows} />;
}
