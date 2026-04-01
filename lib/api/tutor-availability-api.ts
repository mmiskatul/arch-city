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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const token = readCookie("arch_access_token");
  if (!token) {
    throw new Error("Unauthorized");
  }

  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  const response = await fetch(`${normalizedBaseUrl}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = typeof data?.detail === "string" ? data.detail : `Request failed (${response.status}).`;
    throw new Error(detail);
  }

  return data as T;
}

function readCookie(name: string) {
  if (typeof document === "undefined") return "";
  const prefix = `${name}=`;
  const parts = document.cookie.split(";").map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : "";
}

export function getFallbackTutorAvailability(): TutorAvailabilityResponse {
  return {
    slots: tutorAvailabilitySlots,
    max_sessions_per_day: 3,
    notice_required: "24 hours",
  };
}

export function fetchTutorAvailability() {
  return request<TutorAvailabilityResponse>("/tutor/availability");
}

export function updateTutorAvailability(payload: TutorAvailabilityUpdateRequest) {
  return request<TutorAvailabilityResponse>("/tutor/availability", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function addTutorAvailabilitySlot(payload: TutorAvailabilitySlotRequest) {
  return request<TutorAvailabilityApiSlot>("/tutor/availability/slots", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTutorAvailabilitySlot(slotId: string, payload: TutorAvailabilitySlotRequest) {
  return request<TutorAvailabilityApiSlot>(`/tutor/availability/slots/${slotId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteTutorAvailabilitySlot(slotId: string) {
  return request<void>(`/tutor/availability/slots/${slotId}`, {
    method: "DELETE",
  });
}

export function clearTutorAvailabilitySlots() {
  return request<void>("/tutor/availability/slots", {
    method: "DELETE",
  });
}
