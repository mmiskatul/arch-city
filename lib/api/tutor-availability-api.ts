import { browserApiRequest } from "@/lib/api/browser-api-client";
import { tutorAvailabilitySlots, type TutorAvailabilityDay, type TutorAvailabilitySlot } from "@/lib/tutor/availability-data";

export type TutorAvailabilityApiSlot = TutorAvailabilitySlot & {
  user_id?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
};

export type TutorAvailabilityResponse = {
  slots: TutorAvailabilityApiSlot[];
  max_sessions_per_day: number;
  notice_required: string;
};

export type TutorAvailabilityUpdateRequest = {
  slots: TutorAvailabilityApiSlot[];
  max_sessions_per_day: number;
  notice_required: string;
};

export type TutorAvailabilitySlotRequest = {
  day: TutorAvailabilityDay;
  time: string;
  label: string;
  status: TutorAvailabilitySlot["status"];
  date: string;
  start_time: string;
  end_time: string;
};

async function request<T>(path: string, method: "GET" | "PUT" | "POST" | "DELETE", data?: unknown): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  return browserApiRequest<T>({
    url: `${baseUrl}${path}`,
    method,
    data,
  });
}

export function getFallbackTutorAvailability(): TutorAvailabilityResponse {
  return {
    slots: tutorAvailabilitySlots,
    max_sessions_per_day: 3,
    notice_required: "24 hours",
  };
}

export function fetchTutorAvailability() {
  return request<TutorAvailabilityResponse>("/tutor/availability", "GET");
}

export function updateTutorAvailability(payload: TutorAvailabilityUpdateRequest) {
  return request<TutorAvailabilityResponse>("/tutor/availability", "PUT", payload);
}

export function addTutorAvailabilitySlot(payload: TutorAvailabilitySlotRequest) {
  return request<TutorAvailabilityApiSlot>("/tutor/availability/slots", "POST", payload);
}

export function updateTutorAvailabilitySlot(slotId: string, payload: TutorAvailabilitySlotRequest) {
  return request<TutorAvailabilityApiSlot>(`/tutor/availability/slots/${slotId}`, "PUT", payload);
}

export function deleteTutorAvailabilitySlot(slotId: string) {
  return request<void>(`/tutor/availability/slots/${slotId}`, "DELETE");
}

export function clearTutorAvailabilitySlots() {
  return request<void>("/tutor/availability/slots", "DELETE");
}
