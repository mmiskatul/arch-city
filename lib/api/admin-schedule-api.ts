import { apiGet } from "@/lib/api/api-client";
import type {
  AdminScheduleDetail,
  AdminScheduleRow,
} from "@/lib/admin/schedules-data";

export type AdminScheduleApiRow = {
  booking_id: string;
  student_name: string;
  tutor_name: string;
  subject: string;
  session_date: string;
  session_time: string;
  duration_minutes: number;
  session_type: string;
  status: string;
  amount: string;
  student_email: string;
};

export type AdminScheduleApiDetail = AdminScheduleDetail;

export type AdminSchedulesListResponse = {
  total: number;
  items: AdminScheduleApiRow[];
};

export type AdminScheduleDetailResponse = {
  item: AdminScheduleApiDetail;
};

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

function formatCurrency(value: string) {
  if (!value) {
    return "";
  }
  return value.startsWith("$") ? value : `$${value}`;
}

function mapAdminScheduleDetail(detail: AdminScheduleApiDetail): AdminScheduleDetail {
  return {
    sessionId: detail.sessionId,
    status: detail.status,
    subject: detail.subject,
    dateLabel: formatDateLabel(detail.dateLabel),
    timeRange: formatTimeRange(detail.timeRange),
    sessionType: detail.sessionType,
    overview: {
      date: formatFullDateLabel(detail.overview.date),
      duration: detail.overview.duration ? `${detail.overview.duration} min` : "",
      platform: detail.overview.platform || detail.sessionType,
    },
    payment: {
      sessionRate: formatCurrency(detail.payment.sessionRate),
      durationHours: detail.payment.durationHours ? `${detail.payment.durationHours} hrs` : "",
      subtotal: formatCurrency(detail.payment.subtotal),
      platformFee: formatCurrency(detail.payment.platformFee),
      totalCharged: formatCurrency(detail.payment.totalCharged),
      tutorPayout: formatCurrency(detail.payment.tutorPayout),
      method: detail.payment.method || "Card",
      paidAt: detail.payment.paidAt,
    },
    student: {
      initials: detail.student.initials || "ST",
      initialsClassName: detail.student.initialsClassName || "bg-[#f1f1f1] text-[#6b7280]",
      name: detail.student.name || "Student",
      gradeSchool: detail.student.gradeSchool || "Not provided",
      parentPhone: detail.student.parentPhone || "",
      email: detail.student.email || "",
      plan: detail.student.plan || "",
      sessionsUsed: detail.student.sessionsUsed || "",
      totalSessions: detail.student.totalSessions || "",
    },
    tutor: {
      initials: detail.tutor.initials || "TU",
      initialsClassName: detail.tutor.initialsClassName || "bg-[#ebf7ef] text-[#239157]",
      name: detail.tutor.name || "Tutor",
      title: detail.tutor.title || "Tutor",
      ratingAndSessions: detail.tutor.ratingAndSessions || "",
      email: detail.tutor.email || "",
      phone: detail.tutor.phone || "",
      rateApplied: formatCurrency(detail.tutor.rateApplied),
      status: detail.tutor.status || "Approved",
    },
    notes: detail.notes || "",
    notesMeta: detail.notesMeta || "",
    timeline: (detail.timeline || []).map((item) => ({
      title: item.title,
      meta: item.meta,
    })),
  };
}

async function request<T>(path: string): Promise<T> {
  return apiGet<T>(path);
}

export async function fetchAdminScheduleRows(): Promise<AdminScheduleRow[]> {
  const data = await request<AdminSchedulesListResponse>("/admin-dashboard/schedules");
  return (data.items || []).map((row) => ({
    sessionId: row.booking_id,
    studentInitials: row.studentInitials || "",
    studentInitialsClassName: row.studentInitialsClassName || "bg-[#f1f1f1] text-[#6b7280]",
    student: row.student_name,
    tutor: row.tutor_name,
    subject: row.subject,
    dateTime: `${row.session_date} ${row.session_time}`.trim(),
    duration: row.duration_minutes ? `${row.duration_minutes} min` : "",
    type: row.session_type === "In-Person" ? "In-Person" : "Virtual",
    status:
      String(row.status).toLowerCase() === "completed"
        ? "Completed"
        : String(row.status).toLowerCase() === "cancelled"
          ? "Cancelled"
          : "Upcoming",
    fee: row.amount,
  }));
}

export async function fetchAdminScheduleDetailById(sessionId: string): Promise<AdminScheduleDetail | null> {
  const data = await request<AdminScheduleDetailResponse>(`/admin-dashboard/schedules/${sessionId}`);
  return data.item ? mapAdminScheduleDetail(data.item) : null;
}
