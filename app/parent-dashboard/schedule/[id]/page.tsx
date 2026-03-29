import { notFound } from "next/navigation";

import { ParentSessionDetailPage } from "@/components/parent/parent-session-detail-page";
import { getParentSessionById } from "@/lib/parent/schedule-data";

export default async function ParentSessionDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = getParentSessionById(id);

  if (!session) {
    notFound();
  }

  return <ParentSessionDetailPage session={session} />;
}
