import { notFound } from "next/navigation";

import { StudentSessionDetailPage } from "@/components/student/student-session-detail-page";
import { fetchStudentScheduleItemById } from "@/lib/api/student-schedule-api";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await fetchStudentScheduleItemById(id);

  if (!session) {
    notFound();
  }

  return <StudentSessionDetailPage session={session} />;
}
