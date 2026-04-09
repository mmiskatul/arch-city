import { notFound } from "next/navigation";

import { ParentTutorProfilePage } from "@/components/parent/parent-tutor-profile-page";
import { fetchAvailableParentTutorById } from "@/lib/api/public-tutors-api";
import { getParentTutorById } from "@/lib/parent/find-tutors-data";

export default async function ParentTutorProfileRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor = (await fetchAvailableParentTutorById(id).catch(() => null)) ?? getParentTutorById(id);

  if (!tutor) {
    notFound();
  }

  return <ParentTutorProfilePage tutor={tutor} />;
}
