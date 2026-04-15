import { cookies } from "next/headers";

import { ParentSchedulePage } from "@/components/parent/parent-schedule-page";
import type { ParentSessionHistoryResponse } from "@/lib/api/parent-schedule-types";
import { ADMIN_PREVIEW_ROLE_COOKIE, ADMIN_PREVIEW_TARGET_COOKIE } from "@/lib/admin-preview";
import { getAdminPreviewParentSchedule } from "@/lib/admin-preview-data";

const initialScheduleData: ParentSessionHistoryResponse = {
  summaryCards: [
    {
      title: "Total Sessions",
      value: "0",
      subtitle: "All linked students",
      badge: "",
      tone: "red",
    },
  ],
  items: [],
};

export default async function ParentScheduleRoute() {
  const cookieStore = await cookies();
  const role = cookieStore.get("arch_user_role")?.value ?? null;
  const previewRole = cookieStore.get(ADMIN_PREVIEW_ROLE_COOKIE)?.value ?? null;
  const previewTargetId = cookieStore.get(ADMIN_PREVIEW_TARGET_COOKIE)?.value ?? undefined;
  const isAdminParentPreview = role === "admin" && previewRole === "parent";

  return <ParentSchedulePage initialData={isAdminParentPreview ? getAdminPreviewParentSchedule(previewTargetId) : initialScheduleData} />;
}
