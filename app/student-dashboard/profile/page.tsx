import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  StudentProfilePage,
  type StudentProfileData,
} from "@/components/student/student-profile-page";

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

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
}

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
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const token = (await cookies()).get("arch_access_token")?.value;
  if (!token) {
    redirect("/login");
  }

  const response = await fetch(`${baseUrl}/student/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error(`Student profile API failed (${response.status}).`);
  }

  const data = (await response.json()) as StudentProfileApiResponse;
  return mapStudentProfile(data);
}

export default async function StudentProfileRoute() {
  const profile = await fetchStudentProfile();
  return <StudentProfilePage profile={profile} />;
}
