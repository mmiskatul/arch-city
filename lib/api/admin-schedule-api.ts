import { proxyApiGet } from "@/lib/api/local-proxy-api";
import type {
  AdminScheduleDetail,
  AdminScheduleRow,
} from "@/lib/admin/schedules-data";

export type AdminScheduleApiRow = {
  session_id?: string;
  booking_id?: string;
  schedule_id?: string;
  checkout_id?: string;
  student_name: string;
  tutor_name: string;
  subject: string;
  session_date: string;
  session_time: string;
  meeting_location?: string;
  meetingLocation?: string;
  duration_minutes: number;
  session_type: string;
  status: string;
  amount: string;
  student_email: string;
  student_initials?: string;
  student_initials_class_name?: string;
};

export type AdminScheduleApiDetail = {
  session_id: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  subject: string;
  date_label: string;
  time_range: string;
  session_type: "In-Person" | "Virtual";
  meeting_location?: string;
  overview: {
    date: string;
    duration: string;
    platform: string;
  };
  payment: {
    session_rate: string;
    duration_hours: string;
    subtotal: string;
    platform_fee: string;
    total_charged: string;
    tutor_payout: string;
    method: string;
    paid_at: string;
  };
  student: {
    student_id: string;
    initials: string;
    initials_class_name: string;
    name: string;
    grade_school: string;
    parent_phone: string;
    email: string;
    plan: string;
    sessions_used: string;
    total_sessions: string;
  };
  tutor: {
    tutor_id: string;
    initials: string;
    initials_class_name: string;
    name: string;
    title: string;
    rating_and_sessions: string;
    email: string;
    phone: string;
    rate_applied: string;
    status: string;
  };
  session_notes?: string;
  notes_meta?: string;
  notes: string;
  timeline: {
    title: string;
    meta: string;
  }[];
};

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
    sessionId: detail.session_id || "",
    status: detail.status,
    subject: detail.subject,
    dateLabel: formatDateLabel(detail.date_label || ""),
    timeRange: formatTimeRange(detail.time_range || ""),
    sessionType: detail.session_type || "Virtual",
    meetingLocation: detail.meeting_location || "",
    overview: {
      date: formatFullDateLabel(detail.overview.date),
      duration: detail.overview.duration ? `${detail.overview.duration} min` : "",
      platform: detail.overview.platform || detail.session_type,
    },
    payment: {
      sessionRate: formatCurrency(detail.payment.session_rate),
      durationHours: detail.payment.duration_hours ? `${detail.payment.duration_hours} hrs` : "",
      subtotal: formatCurrency(detail.payment.subtotal),
      platformFee: formatCurrency(detail.payment.platform_fee),
      totalCharged: formatCurrency(detail.payment.total_charged),
      tutorPayout: formatCurrency(detail.payment.tutor_payout),
      method: detail.payment.method || "Card",
      paidAt: detail.payment.paid_at,
    },
    student: {
      studentId: detail.student.student_id || "",
      initials: detail.student.initials || "ST",
      initialsClassName: detail.student.initials_class_name || "bg-[#f1f1f1] text-[#6b7280]",
      name: detail.student.name || "Student",
      gradeSchool: detail.student.grade_school || "Not provided",
      parentPhone: detail.student.parent_phone || "",
      email: detail.student.email || "",
      plan: detail.student.plan || "",
      sessionsUsed: detail.student.sessions_used || "",
      totalSessions: detail.student.total_sessions || "",
    },
    tutor: {
      tutorId: detail.tutor.tutor_id || "",
      initials: detail.tutor.initials || "TU",
      initialsClassName: detail.tutor.initials_class_name || "bg-[#ebf7ef] text-[#239157]",
      name: detail.tutor.name || "Tutor",
      title: detail.tutor.title || "Tutor",
      ratingAndSessions: detail.tutor.rating_and_sessions || "",
      email: detail.tutor.email || "",
      phone: detail.tutor.phone || "",
      rateApplied: formatCurrency(detail.tutor.rate_applied),
      status: detail.tutor.status || "Approved",
    },
    sessionNotes: detail.session_notes || "",
    notes: detail.notes || "",
    notesMeta: detail.notes_meta || "",
    timeline: (detail.timeline || []).map((item) => ({
      title: item.title,
      meta: item.meta,
    })),
  };
}

async function request<T>(path: string): Promise<T> {
  return proxyApiGet<T>(path);
}

export async function fetchAdminScheduleRows(): Promise<AdminScheduleRow[]> {
  const data = await request<AdminSchedulesListResponse>("/api/admin/schedules");
  return (data.items || []).map((row) => ({
    sessionId: row.session_id || row.booking_id || row.schedule_id || row.checkout_id || "",
    studentInitials: row.student_initials || "",
    studentInitialsClassName: row.student_initials_class_name || "bg-[#f1f1f1] text-[#6b7280]",
    student: row.student_name,
    tutor: row.tutor_name,
    subject: row.subject,
    sessionDate: row.session_date || "",
    sessionTime: row.session_time || "",
    dateTime: [row.session_date, row.session_time].filter(Boolean).join(" "),
    meetingLocation: row.meeting_location || row.meetingLocation || "",
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
  const data = await request<AdminScheduleDetailResponse>(`/api/admin/schedules/${sessionId}`);
  return data.item ? mapAdminScheduleDetail(data.item) : null;
}
