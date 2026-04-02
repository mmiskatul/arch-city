import { notFound } from "next/navigation";

import { TutorSessionDetailRoute } from "@/components/tutor/tutor-session-detail-route";

export default async function TutorSessionDetailPageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) {
    notFound();
  }

  return <TutorSessionDetailRoute id={id} />;
}
