import {
  StudentProfilePage,
  type StudentProfileData,
} from "@/components/student/student-profile-page";
import { apiGet } from "@/lib/api/api-client";
import { cookies } from "next/headers";
import { ADMIN_PREVIEW_ROLE_COOKIE, ADMIN_PREVIEW_TARGET_COOKIE } from "@/lib/admin-preview";
import { getAdminPreviewStudentProfile } from "@/lib/admin-preview-data";

export const dynamic = "force-dynamic";

type StudentProfileApiResponse = {
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

function mapStudentProfile(data: StudentProfileApiResponse): StudentProfileData {
  return {
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    gradeLevel: data.grade_level,
    initials: data.initials,
    planName: data.plan_name,
    planPrice: data.plan_price,
    renewsOn: data.renews_on,
    activePlanLabel: data.active_plan_label,
  };
}

async function fetchStudentProfile(): Promise<StudentProfileData> {
  const data = await apiGet<StudentProfileApiResponse>("/student/profile");
  return mapStudentProfile(data);
}

export default async function StudentProfileRoute() {
  const cookieStore = await cookies();
  const role = cookieStore.get("arch_user_role")?.value ?? null;
  const previewRole = cookieStore.get(ADMIN_PREVIEW_ROLE_COOKIE)?.value ?? null;
  const previewTargetId = cookieStore.get(ADMIN_PREVIEW_TARGET_COOKIE)?.value ?? undefined;
  const isAdminStudentPreview = role === "admin" && previewRole === "student";
  const fallbackProfile: StudentProfileData = getAdminPreviewStudentProfile(previewTargetId);
  const profile = isAdminStudentPreview
    ? fallbackProfile
    : await fetchStudentProfile().catch(() => fallbackProfile);
  return <StudentProfilePage profile={profile} />;
}
