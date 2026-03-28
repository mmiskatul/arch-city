import { notFound } from "next/navigation";

import { TutorSessionDetailPage } from "@/components/tutor/tutor-session-detail-page";
import { getTutorScheduleItemById } from "@/lib/tutor/schedule-data";

export default async function TutorSessionDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = getTutorScheduleItemById(id);

  if (!session) {
    notFound();
  }

  return <TutorSessionDetailPage session={session} />;
}
