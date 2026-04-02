import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { StudentScheduleItem } from "@/lib/student/schedule-data";

export type StudentScheduleApiItem = {
  booking_id?: string;
  schedule_id: string;
  student_email: string;
  tutor_id: string;
  tutor_name: string;
  session_date: string;
  session_time: string;
  session_type: string;
  duration_minutes: number;
  amount: string;
  currency: string;
  status: string;
  checkout_id: string;
  created_at: string;
  payment_email: string;
  card_brand: string;
  card_last4: string;
  details: Record<string, string>;
};

export type StudentScheduleListResponse = {
  items: StudentScheduleApiItem[];
};

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return "ST";
}

function dateLabel(value: string) {
  try {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(parsed);
    }
  } catch {
    // fall through
  }
  return value;
}

function fullDateLabel(value: string) {
  try {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(parsed);
    }
  } catch {
    // fall through
  }
  return value;
}

function sessionRateFromDetails(item: StudentScheduleApiItem): number {
  const raw = item.details?.session_rate ?? item.amount;
  const normalized = String(raw).replace(/[^0-9.]+/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapStudentScheduleItem(item: StudentScheduleApiItem): StudentScheduleItem {
  return {
    id: item.booking_id || item.schedule_id,
    tutorId: item.tutor_id,
    tutorInitials: initials(item.tutor_name),
    tutorName: item.tutor_name,
    subject: item.details?.subject ?? item.details?.session_type ?? "Tutoring",
    date: dateLabel(item.session_date),
    time: item.session_time,
    duration: `${item.duration_minutes} min`,
    type: item.session_type === "In-Person" ? "In-Person" : "Virtual",
    status:
      String(item.status).toLowerCase() === "completed"
        ? "Completed"
        : String(item.status).toLowerCase() === "cancelled"
          ? "Cancelled"
          : "Upcoming",
    fullDate: fullDateLabel(item.session_date),
    sessionRate: sessionRateFromDetails(item),
    chat: [],
  };
}

async function requestSchedule(path: string): Promise<StudentScheduleListResponse | StudentScheduleApiItem> {
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

  return (await response.json()) as StudentScheduleListResponse | StudentScheduleApiItem;
}

export async function fetchStudentScheduleItems(): Promise<StudentScheduleItem[]> {
  const data = (await requestSchedule("/student/schedule")) as StudentScheduleListResponse;
  return (data.items || []).map(mapStudentScheduleItem);
}

export async function fetchStudentScheduleItemById(scheduleId: string): Promise<StudentScheduleItem | null> {
  const data = (await requestSchedule(`/student/schedule/${scheduleId}`)) as StudentScheduleApiItem;
  if (!data) {
    return null;
  }

  return mapStudentScheduleItem(data);
}
