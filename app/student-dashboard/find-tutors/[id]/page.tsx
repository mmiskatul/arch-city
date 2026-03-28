import { notFound } from "next/navigation";

import { StudentTutorProfilePage } from "@/components/student/student-tutor-profile-page";
import { getStudentTutorById } from "@/lib/student/tutors-data";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor = getStudentTutorById(id);

  if (!tutor) {
    notFound();
  }

  return <StudentTutorProfilePage tutor={tutor} />;
}
