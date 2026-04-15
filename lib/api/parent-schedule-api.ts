import { apiGet } from "@/lib/api/api-client";
import {
  mapParentScheduleResponse,
  type ParentSessionHistoryItem,
  type ParentSessionHistoryItemApi,
  type ParentSessionHistoryResponse,
  type ParentSessionHistoryResponseApi,
} from "@/lib/api/parent-schedule-types";

export type {
  ParentScheduleStatus,
  ParentScheduleSummaryCard,
  ParentScheduleSummaryCardApi,
  ParentScheduleSummaryApi,
  ParentScheduleType,
  ParentSessionHistoryItem,
  ParentSessionHistoryItemApi,
  ParentSessionHistoryMessage,
  ParentSessionHistoryMessageApi,
  ParentSessionHistoryResponse,
  ParentSessionHistoryResponseApi,
} from "@/lib/api/parent-schedule-types";

export async function fetchParentScheduleItems(): Promise<ParentSessionHistoryResponse> {
  const data = await apiGet<ParentSessionHistoryResponseApi>("/parent/schedule");
  return mapParentScheduleResponse(data);
}

export async function fetchParentScheduleItemById(bookingId: string): Promise<ParentSessionHistoryItem | null> {
  const data = await apiGet<ParentSessionHistoryItemApi>(`/parent/schedule/${encodeURIComponent(bookingId)}`);
  if (!data) return null;
  return mapParentScheduleResponse({
    summary: { total_sessions: 0, students: [] },
    items: [data],
  }).items[0] ?? null;
}
