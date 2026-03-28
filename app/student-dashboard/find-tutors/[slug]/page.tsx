import { notFound } from "next/navigation";

import { StudentTutorProfilePage } from "@/components/student/student-tutor-profile-page";
import { getStudentTutorBySlug } from "@/lib/student/tutors-data";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tutor = getStudentTutorBySlug(slug);

  if (!tutor) {
    notFound();
  }

  return <StudentTutorProfilePage tutor={tutor} />;
}
