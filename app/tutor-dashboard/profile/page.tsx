import {
  TutorProfilePage,
  type TutorProfileData,
} from "@/components/tutor/tutor-profile-page";
import { apiGet } from "@/lib/api/api-client";

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
    totalSessions: "0",
    avgRating: "0.0",
    activeStudents: "0",
    allTimeEarnings: "$0",
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
  const profile = await fetchTutorProfile().catch(() => ({
    initials: "TU",
    firstName: "Tutor",
    lastName: "",
    title: "Tutor",
    email: "",
    phone: "",
    location: "",
    status: "Active",
    since: "",
    totalSessions: "0",
    avgRating: "0.0",
    activeStudents: "0",
    allTimeEarnings: "$0",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    backgroundCheck: "Verified",
    dateOfBirth: "",
    gender: "",
    bio: "",
    schoolDistrict: "",
    education: "",
    workExperience: "",
    subjectsAndGrades: "",
    rates: "",
    preferences: "",
    locationPreference: "",
  }));
  return <TutorProfilePage initialProfile={profile} />;
}
