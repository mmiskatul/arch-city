import { notFound } from "next/navigation";

import { StudentSessionDetailPage } from "@/components/student/student-session-detail-page";
import { getStudentScheduleItemById } from "@/lib/student/schedule-data";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = getStudentScheduleItemById(id);

  if (!session) {
    notFound();
  }

  return <StudentSessionDetailPage session={session} />;
}
