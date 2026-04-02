import { notFound } from "next/navigation";

import { AdminScheduleDetailPage } from "@/components/admin/admin-schedule-detail-page";
import { fetchAdminScheduleDetailById } from "@/lib/api/admin-schedule-api";

export default async function AdminScheduleDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await fetchAdminScheduleDetailById(id);

  if (!session) {
    notFound();
  }

  return <AdminScheduleDetailPage session={session} />;
}
