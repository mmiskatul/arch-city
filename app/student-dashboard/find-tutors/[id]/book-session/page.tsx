import { notFound } from "next/navigation";

import { StudentBookSessionPage } from "@/components/student/student-book-session-page";
import { fetchAvailableStudentTutorById } from "@/lib/api/public-tutors-api";
import { getStudentTutorById } from "@/lib/student/tutors-data";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor = (await fetchAvailableStudentTutorById(id).catch(() => null)) ?? getStudentTutorById(id);

  if (!tutor) {
    notFound();
  }

  return <StudentBookSessionPage tutor={tutor} />;
}
