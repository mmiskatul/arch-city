import { notFound } from "next/navigation";

import { TutorSessionDetailPage } from "@/components/tutor/tutor-session-detail-page";
import { fetchTutorScheduleItemById } from "@/lib/api/tutor-schedule-api";

export default async function TutorSessionDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await fetchTutorScheduleItemById(id);

  if (!session) {
    notFound();
  }

  return <TutorSessionDetailPage session={session} />;
}
