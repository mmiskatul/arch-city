import { notFound } from "next/navigation";

import { ParentBookSessionPage } from "@/components/parent/parent-book-session-page";
import { getParentTutorById } from "@/lib/parent/find-tutors-data";

export default async function ParentBookSessionConfirmRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor = getParentTutorById(id);

  if (!tutor) {
    notFound();
  }

  return <ParentBookSessionPage tutor={tutor} step="confirm" />;
}
