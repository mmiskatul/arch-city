import { ParentSchedulePage } from "@/components/parent/parent-schedule-page";
import { fetchParentScheduleItems } from "@/lib/api/parent-schedule-api";

export default async function ParentScheduleRoute() {
  const data = await fetchParentScheduleItems();
  return <ParentSchedulePage data={data} />;
}
