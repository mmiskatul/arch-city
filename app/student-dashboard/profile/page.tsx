import {
  StudentProfilePage,
  type StudentProfileData,
} from "@/components/student/student-profile-page";
import { apiGet } from "@/lib/api/api-client";

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
  const profile = await fetchStudentProfile();
  return <StudentProfilePage profile={profile} />;
}
