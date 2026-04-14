import { notFound } from "next/navigation";

import { ParentStudentSchedulePage } from "@/components/parent/parent-student-schedule-page";
import { fetchParentScheduleItems } from "@/lib/api/parent-schedule-api";
import { getParentStudentById } from "@/lib/parent/students-data";

export default async function ParentStudentScheduleRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = getParentStudentById(id);

  if (!student) {
    notFound();
  }

  const schedule = await fetchParentScheduleItems();
  const sessions = schedule.items.filter((item) => item.studentName === student.name);

  return <ParentStudentSchedulePage student={student} sessions={sessions} />;
}
