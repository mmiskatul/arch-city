import { StudentDashboardPage, type StudentDashboardProfile } from "@/components/student/student-dashboard-page";
import { apiGet } from "@/lib/api/api-client";
import { fetchStudentScheduleItems } from "@/lib/api/student-schedule-api";

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
  try {
    const data = await loadStudentDashboardData();
    return <StudentDashboardPage profile={data.profile} scheduleItems={data.scheduleItems} />;
  } catch {
    return (
      <StudentDashboardPage
        profile={{
          firstName: "Student",
          lastName: "",
          initials: "ST",
          email: "",
          gradeLevel: "",
          planName: "Student Plan",
          planPrice: "$0",
          renewsOn: "",
          activePlanLabel: "Inactive",
        }}
        scheduleItems={[]}
      />
    );
  }
}
