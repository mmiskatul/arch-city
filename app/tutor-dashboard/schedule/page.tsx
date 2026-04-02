import { fetchTutorScheduleItems } from "@/lib/api/tutor-schedule-api";
import { TutorSchedulePage } from "@/components/tutor/tutor-schedule-page";

export default async function TutorScheduleRoute() {
  const sessions = await fetchTutorScheduleItems();

  return <TutorSchedulePage initialSessions={sessions} />;
}
