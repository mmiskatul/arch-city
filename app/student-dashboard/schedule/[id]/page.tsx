import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { StudentSessionDetailPage } from "@/components/student/student-session-detail-page";
import { fetchStudentScheduleItemById } from "@/lib/api/student-schedule-api";
import { ADMIN_PREVIEW_ROLE_COOKIE, ADMIN_PREVIEW_TARGET_COOKIE } from "@/lib/admin-preview";
import { getAdminPreviewStudentSession } from "@/lib/admin-preview-data";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const role = cookieStore.get("arch_user_role")?.value ?? null;
  const previewRole = cookieStore.get(ADMIN_PREVIEW_ROLE_COOKIE)?.value ?? null;
  const previewTargetId = cookieStore.get(ADMIN_PREVIEW_TARGET_COOKIE)?.value ?? undefined;
  const isAdminStudentPreview = role === "admin" && previewRole === "student";
  const session = isAdminStudentPreview
    ? getAdminPreviewStudentSession(previewTargetId, id)
    : (await fetchStudentScheduleItemById(id).catch(() => null)) ?? getAdminPreviewStudentSession(previewTargetId, id);

  if (!session) {
    notFound();
  }

  return <StudentSessionDetailPage session={session} />;
}
