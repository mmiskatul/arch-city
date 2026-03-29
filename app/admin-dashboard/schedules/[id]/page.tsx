import { notFound } from "next/navigation";

import { AdminScheduleDetailPage } from "@/components/admin/admin-schedule-detail-page";
import { getAdminScheduleDetailById } from "@/lib/admin/schedules-data";

export default async function AdminScheduleDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = getAdminScheduleDetailById(id);

  if (!session) {
    notFound();
  }

  return <AdminScheduleDetailPage session={session} />;
}
