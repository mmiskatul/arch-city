import { cookies } from "next/headers";

import { StudentDashboardPage, type StudentDashboardProfile } from "@/components/student/student-dashboard-page";
import { apiGet } from "@/lib/api/api-client";
import { fetchStudentScheduleItems } from "@/lib/api/student-schedule-api";
import { ADMIN_PREVIEW_ROLE_COOKIE, ADMIN_PREVIEW_TARGET_COOKIE } from "@/lib/admin-preview";
import { getAdminPreviewStudentProfile, getAdminPreviewStudentSchedule } from "@/lib/admin-preview-data";

type StudentDashboardProfileResponse = {
  first_name: string;
  last_name: string;
  email: string;
  grade_level: string;
  initials: string;
  plan_name: string;
  plan_price: string;
  renews_on: string;
  active_plan_label: string;
};

async function loadStudentDashboardData(): Promise<{
  profile: StudentDashboardProfile;
  scheduleItems: Awaited<ReturnType<typeof fetchStudentScheduleItems>>;
}> {
  const [profileResponse, scheduleItems] = await Promise.all([
    apiGet<StudentDashboardProfileResponse>("/student/profile"),
    fetchStudentScheduleItems(),
  ]);

  return {
    profile: {
      firstName: profileResponse.first_name,
      lastName: profileResponse.last_name,
      initials: profileResponse.initials,
      email: profileResponse.email,
      gradeLevel: profileResponse.grade_level,
      planName: profileResponse.plan_name,
      planPrice: profileResponse.plan_price,
      renewsOn: profileResponse.renews_on,
      activePlanLabel: profileResponse.active_plan_label,
    },
    scheduleItems,
  };
}

export default async function Page() {
  const cookieStore = await cookies();
  const role = cookieStore.get("arch_user_role")?.value ?? null;
  const previewRole = cookieStore.get(ADMIN_PREVIEW_ROLE_COOKIE)?.value ?? null;
  const previewTargetId = cookieStore.get(ADMIN_PREVIEW_TARGET_COOKIE)?.value ?? undefined;
  const isAdminStudentPreview = role === "admin" && previewRole === "student";
  const fallbackProfile: StudentDashboardProfile = getAdminPreviewStudentProfile(previewTargetId);
  const fallbackScheduleItems = getAdminPreviewStudentSchedule(previewTargetId);

  if (isAdminStudentPreview) {
    return <StudentDashboardPage profile={fallbackProfile} scheduleItems={fallbackScheduleItems} />;
  }

  const data = await loadStudentDashboardData().catch(() => null);

  return (
    <StudentDashboardPage
      profile={data?.profile ?? fallbackProfile}
      scheduleItems={data?.scheduleItems ?? fallbackScheduleItems}
    />
  );
}
