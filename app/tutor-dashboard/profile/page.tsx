import {
  TutorProfilePage,
  type TutorProfileData,
} from "@/components/tutor/tutor-profile-page";
import { apiGet } from "@/lib/api/api-client";
import { cookies } from "next/headers";
import { ADMIN_PREVIEW_ROLE_COOKIE, ADMIN_PREVIEW_TARGET_COOKIE } from "@/lib/admin-preview";
import { getAdminPreviewTutorProfile } from "@/lib/admin-preview-data";

export const dynamic = "force-dynamic";

type TutorProfileApiResponse = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  initials: string;
  title: string;
  status: string;
  location: string;
  background_check: string;
  date_of_birth?: string;
  gender?: string;
  bio?: string;
  school_district?: string;
  total_sessions?: number;
  avg_rating?: number;
  active_students?: number;
  all_time_earnings?: string;
};

function mapTutorProfile(data: TutorProfileApiResponse): TutorProfileData {
  return {
    initials: data.initials || "TU",
    firstName: data.first_name,
    lastName: data.last_name,
    title: data.title || "Tutor",
    email: data.email,
    phone: data.phone_number,
    location: data.location || "",
    status: data.status || "Active",
    since: "",
    totalSessions: String(data.total_sessions ?? 0),
    avgRating: (data.avg_rating ?? 0).toFixed(1),
    activeStudents: String(data.active_students ?? 0),
    allTimeEarnings: data.all_time_earnings || "$0",
    streetAddress: data.street_address,
    city: data.city,
    state: data.state,
    zipCode: data.zip_code,
    emergencyContactName: data.emergency_contact_name,
    emergencyContactPhone: data.emergency_contact_phone,
    backgroundCheck: data.background_check || "Verified",
    dateOfBirth: data.date_of_birth || "",
    gender: data.gender || "",
    bio: data.bio || "",
    schoolDistrict: data.school_district || "",
    education: "",
    workExperience: "",
    subjectsAndGrades: "",
    rates: "",
    preferences: "",
    locationPreference: "",
  };
}

async function fetchTutorProfile(): Promise<TutorProfileData> {
  const data = await apiGet<TutorProfileApiResponse>("/tutor/profile");
  return mapTutorProfile(data);
}

export default async function TutorProfileRoute() {
  const cookieStore = await cookies();
  const role = cookieStore.get("arch_user_role")?.value ?? null;
  const previewRole = cookieStore.get(ADMIN_PREVIEW_ROLE_COOKIE)?.value ?? null;
  const previewTargetId = cookieStore.get(ADMIN_PREVIEW_TARGET_COOKIE)?.value ?? undefined;
  const isAdminTutorPreview = role === "admin" && previewRole === "tutor";
  const fallbackProfile: TutorProfileData = getAdminPreviewTutorProfile(previewTargetId);
  const profile = isAdminTutorPreview
    ? fallbackProfile
    : await fetchTutorProfile().catch(() => fallbackProfile);
  return <TutorProfilePage initialProfile={profile} />;
}
