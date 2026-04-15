import { cookies } from "next/headers";

import { fetchStudentScheduleItems } from "@/lib/api/student-schedule-api";
import { StudentSchedulePage } from "@/components/student/student-schedule-page";
import { ADMIN_PREVIEW_ROLE_COOKIE, ADMIN_PREVIEW_TARGET_COOKIE } from "@/lib/admin-preview";
import { getAdminPreviewStudentSchedule } from "@/lib/admin-preview-data";

export default async function Page() {
  const cookieStore = await cookies();
  const role = cookieStore.get("arch_user_role")?.value ?? null;
  const previewRole = cookieStore.get(ADMIN_PREVIEW_ROLE_COOKIE)?.value ?? null;
  const previewTargetId = cookieStore.get(ADMIN_PREVIEW_TARGET_COOKIE)?.value ?? undefined;
  const isAdminStudentPreview = role === "admin" && previewRole === "student";
  const fallbackSessions = getAdminPreviewStudentSchedule(previewTargetId);

  const sessions = isAdminStudentPreview
    ? fallbackSessions
    : await fetchStudentScheduleItems().catch(() => fallbackSessions);

  return <StudentSchedulePage initialSessions={sessions} />;
}
