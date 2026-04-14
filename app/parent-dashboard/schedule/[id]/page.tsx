import { notFound } from "next/navigation";

import { ParentSessionDetailPage } from "@/components/parent/parent-session-detail-page";
import { fetchParentScheduleItemById } from "@/lib/api/parent-schedule-api";

export default async function ParentSessionDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await fetchParentScheduleItemById(id);

  if (!session) {
    notFound();
  }

  return <ParentSessionDetailPage session={session} />;
}
