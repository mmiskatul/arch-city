import { browserApiRequest, resolveBrowserApiBaseUrl } from "@/lib/api/browser-api-client";
import type { StudentScheduleApiItem } from "@/lib/api/student-schedule-api";
import type { StudentScheduleItem } from "@/lib/student/schedule-data";

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function resolveBrowserBaseUrl() {
  const url = resolveBrowserApiBaseUrl();
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
    subject: item.subject ?? item.details?.subject ?? item.details?.session_type ?? "Tutoring",
    date: dateLabel(item.session_date),
    time: item.session_time,
    duration: `${item.duration_minutes} min`,
    type: item.session_type === "In-Person" ? "In-Person" : "Virtual",
    status:
      String(item.status).toLowerCase() === "completion requested"
        ? "Completion Requested"
        : String(item.status).toLowerCase() === "completed"
          ? "Completed"
          : String(item.status).toLowerCase() === "cancelled"
            ? "Cancelled"
            : "Upcoming",
    fullDate: item.session_date,
    sessionRate: sessionRateFromDetails(item),
    chat: [],
  };
}

export async function fetchStudentScheduleItemsBrowser(): Promise<StudentScheduleItem[]> {
  const baseUrl = resolveBrowserBaseUrl();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const data = await browserApiRequest<{ items: StudentScheduleApiItem[] }>({
    url: `${baseUrl}/student/schedule`,
    method: "GET",
  });

  return (data.items || []).map(mapStudentScheduleItem);
}
