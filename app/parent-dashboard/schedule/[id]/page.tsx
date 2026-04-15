import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { ParentSessionDetailPage } from "@/components/parent/parent-session-detail-page";
import { fetchParentScheduleItemById } from "@/lib/api/parent-schedule-api";
import { ADMIN_PREVIEW_ROLE_COOKIE, ADMIN_PREVIEW_TARGET_COOKIE } from "@/lib/admin-preview";
import { getAdminPreviewParentSchedule } from "@/lib/admin-preview-data";

export default async function ParentSessionDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const role = cookieStore.get("arch_user_role")?.value ?? null;
  const previewRole = cookieStore.get(ADMIN_PREVIEW_ROLE_COOKIE)?.value ?? null;
  const previewTargetId = cookieStore.get(ADMIN_PREVIEW_TARGET_COOKIE)?.value ?? undefined;
  const previewSession = getAdminPreviewParentSchedule(previewTargetId).items.find((item) => item.id === id) ?? null;
  const isAdminParentPreview = role === "admin" && previewRole === "parent";
  const session = isAdminParentPreview
    ? previewSession
    : (await fetchParentScheduleItemById(id).catch(() => null)) ?? previewSession;

  if (!session) {
    notFound();
  }

  return <ParentSessionDetailPage session={session} />;
}
