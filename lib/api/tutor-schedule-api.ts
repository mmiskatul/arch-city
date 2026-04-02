import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { TutorScheduleItem, TutorScheduleStatus } from "@/lib/tutor/schedule-data";

export type TutorScheduleChatApiItem = {
  id: string;
  sender: "tutor" | "student";
  message: string;
  timestamp: string;
};

export type TutorScheduleApiItem = {
  booking_id: string;
  student_initials: string;
  student_name: string;
  grade: string;
  subject: string;
  session_date: string;
  session_time: string;
  session_type: string;
  duration_minutes: number;
  amount: string;
  status: TutorScheduleStatus | string;
  session_link: string;
  chat: TutorScheduleChatApiItem[];
  tutor_id: string;
  tutor_name: string;
  currency: string;
  checkout_id: string;
  created_at: string;
  payment_email: string;
  card_brand: string;
  card_last4: string;
  details: Record<string, string>;
};

export type TutorScheduleListResponse = {
  items: TutorScheduleApiItem[];
};

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
}

function formatDateLabel(value: string) {
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(parsed);
  }
  return value;
}

function formatFullDateLabel(value: string) {
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(parsed);
  }
  return value;
}

function formatTimeRange(value: string) {
  const raw = String(value || "").trim();
  const match = raw.match(/(\d{1,2}:\d{2}\s*[AP]M?)\s*-\s*(\d{1,2}:\d{2}\s*[AP]M?)/i);
  if (match) {
    return `${match[1].replace(/\s+([AP]M)$/i, " $1")} - ${match[2].replace(/\s+([AP]M)$/i, " $1")}`;
  }
  return raw;
}

function mapScheduleItem(api: TutorScheduleApiItem): TutorScheduleItem {
  const sessionDate = api.session_date || "";
  const sessionTime = formatTimeRange(api.session_time || "");
  const duration = api.duration_minutes ? `${api.duration_minutes} min` : "";
  return {
    id: api.booking_id,
    studentInitials: api.student_initials,
    studentName: api.student_name,
    grade: api.grade,
    subject: api.subject,
    date: formatDateLabel(sessionDate),
    fullDate: formatFullDateLabel(sessionDate),
    time: sessionTime,
    endTime: "",
    duration,
    type: api.session_type === "In-Person" ? "In-Person" : "Virtual",
    rate: api.amount,
    status:
      api.status === "Completed"
        ? "Completed"
        : api.status === "Cancelled"
          ? "Cancelled"
          : "Upcoming",
    sessionLink: api.session_link,
    chat: (api.chat || []).map((message) => ({
      id: message.id,
      sender: message.sender,
      message: message.message,
      timestamp: message.timestamp,
    })),
  };
}

async function requestSchedule(path: string): Promise<TutorScheduleListResponse | TutorScheduleApiItem> {
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const token = (await cookies()).get("arch_access_token")?.value;
  if (!token) {
    redirect("/login");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error(`API failed (${response.status}).`);
  }

  return (await response.json()) as TutorScheduleListResponse | TutorScheduleApiItem;
}

export async function fetchTutorScheduleItems(): Promise<TutorScheduleItem[]> {
  const data = (await requestSchedule("/tutor/schedule")) as TutorScheduleListResponse;
  return (data.items || []).map(mapScheduleItem);
}

export async function fetchTutorScheduleItemById(bookingId: string): Promise<TutorScheduleItem | null> {
  const data = (await requestSchedule(`/tutor/schedule/${bookingId}`)) as TutorScheduleApiItem;
  if (!data) {
    return null;
  }

  return mapScheduleItem(data);
}
