import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSchedulesPage } from "@/components/admin/admin-schedules-page";

export default function Page() {
  return (
    <AdminShell breadcrumbLabel="Schedules">
      <AdminSchedulesPage />
    </AdminShell>
  );
}
