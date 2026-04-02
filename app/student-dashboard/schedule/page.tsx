import { fetchStudentScheduleItems } from "@/lib/api/student-schedule-api";
import { StudentSchedulePage } from "@/components/student/student-schedule-page";

export default async function Page() {
  const sessions = await fetchStudentScheduleItems();
  return <StudentSchedulePage initialSessions={sessions} />;
}
