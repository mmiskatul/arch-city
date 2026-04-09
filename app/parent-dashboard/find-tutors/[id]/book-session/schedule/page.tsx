import { notFound } from "next/navigation";

import { ParentBookSessionPage } from "@/components/parent/parent-book-session-page";
import { fetchAvailableParentTutorById } from "@/lib/api/public-tutors-api";
import { getParentTutorById } from "@/lib/parent/find-tutors-data";

export default async function ParentBookSessionScheduleRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor = (await fetchAvailableParentTutorById(id).catch(() => null)) ?? getParentTutorById(id);

  if (!tutor) {
    notFound();
  }

  return <ParentBookSessionPage tutor={tutor} step="schedule" />;
}
