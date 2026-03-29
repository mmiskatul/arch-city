import { notFound } from "next/navigation";

import { AdminStudentDetailPage } from "@/components/admin/admin-student-detail-page";
import { getAdminStudentDetailById } from "@/lib/admin/students-data";

export default async function AdminStudentDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = getAdminStudentDetailById(id);

  if (!student) {
    notFound();
  }

  return <AdminStudentDetailPage student={student} />;
}
