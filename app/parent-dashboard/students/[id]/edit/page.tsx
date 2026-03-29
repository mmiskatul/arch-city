import { notFound } from "next/navigation";

import { ParentStudentEditPage } from "@/components/parent/parent-student-edit-page";
import { getParentStudentById } from "@/lib/parent/students-data";

export default async function ParentStudentEditRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = getParentStudentById(id);

  if (!student) {
    notFound();
  }

  return <ParentStudentEditPage student={student} />;
}
