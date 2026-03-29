import { notFound } from "next/navigation";

import { ParentStudentSchedulePage } from "@/components/parent/parent-student-schedule-page";
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

  return <ParentStudentSchedulePage student={student} />;
}
