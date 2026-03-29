import { notFound } from "next/navigation";

import { AdminTutorDetailPage } from "@/components/admin/admin-tutor-detail-page";
import { getAdminTutorDetailById } from "@/lib/admin/tutors-data";

export default async function AdminTutorDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor = getAdminTutorDetailById(id);

  if (!tutor) {
    notFound();
  }

  return <AdminTutorDetailPage tutor={tutor} />;
}
