import { ParentSchedulePage } from "@/components/parent/parent-schedule-page";
import type { ParentSessionHistoryResponse } from "@/lib/api/parent-schedule-types";

const initialScheduleData: ParentSessionHistoryResponse = {
  summaryCards: [
    {
      title: "Total Sessions",
      value: "0",
      subtitle: "All linked students",
      badge: "",
      tone: "red",
    },
  ],
  items: [],
};

export default function ParentScheduleRoute() {
  return <ParentSchedulePage initialData={initialScheduleData} />;
}
