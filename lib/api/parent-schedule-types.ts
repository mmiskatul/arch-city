export type ParentScheduleStatus =
  | "Upcoming"
  | "Expired"
  | "Completion Requested"
  | "Completed"
  | "Cancelled";

export type ParentScheduleType = "Virtual" | "In-Person";

export type ParentSessionHistoryMessageApi = {
  id: string;
  sender: "tutor" | "student" | "admin";
  message: string;
  timestamp: string;
};

export type ParentSessionHistoryItemApi = {
  booking_id: string;
  student_email: string;
  student_initials: string;
  student_name: string;
  student_grade: string;
  tutor_id: string;
  tutor_initials: string;
  tutor_name: string;
  subject: string;
  date: string;
  full_date: string;
  time: string;
  end_time: string;
  duration: string;
  type: ParentScheduleType | string;
  rate: string;
  status: ParentScheduleStatus | string;
  session_date: string;
  session_time: string;
  session_type: string;
  duration_minutes: number;
  amount: string;
  currency: string;
  checkout_id: string;
  created_at: string;
  details: Record<string, string>;
  messages: ParentSessionHistoryMessageApi[];
};

export type ParentScheduleSummaryCardApi = {
  title: string;
  value?: string | null;
  subtitle: string;
  extra?: string | null;
  tone: "red" | "green" | "gold";
};

export type ParentScheduleSummaryApi = {
  total_sessions: number;
  students: ParentScheduleSummaryCardApi[];
};

export type ParentSessionHistoryResponseApi = {
  summary: ParentScheduleSummaryApi;
  items: ParentSessionHistoryItemApi[];
};

export type ParentSessionHistoryMessage = {
  id: string;
  sender: "tutor" | "student" | "admin";
  message: string;
  timestamp: string;
  senderLabel: string;
  timeLabel: string;
};

export type ParentSessionHistoryItem = {
  id: string;
  studentEmail: string;
  studentInitials: string;
  studentName: string;
  studentGrade: string;
  tutorId: string;
  tutorInitials: string;
  tutorName: string;
  subject: string;
  date: string;
  fullDate: string;
  time: string;
  endTime: string;
  duration: string;
  type: ParentScheduleType;
  rate: string;
  status: ParentScheduleStatus;
  sessionDate: string;
  sessionTime: string;
  durationMinutes: number;
  amount: string;
  currency: string;
  checkoutId: string;
  createdAt: string;
  details: Record<string, string>;
  messages: ParentSessionHistoryMessage[];
};

export type ParentScheduleSummaryCard = {
  title: string;
  value: string;
  subtitle: string;
  badge: string;
  tone: "red" | "green" | "gold";
};

export type ParentSessionHistoryResponse = {
  summaryCards: ParentScheduleSummaryCard[];
  items: ParentSessionHistoryItem[];
};

function normalizeStatus(value: string): ParentScheduleStatus {
  const status = String(value || "").trim().toLowerCase();
  if (status === "completion requested") return "Completion Requested";
  if (status === "completed") return "Completed";
  if (status === "cancelled" || status === "canceled") return "Cancelled";
  if (status === "expired") return "Expired";
  return "Upcoming";
}

function normalizeType(value: string): ParentScheduleType {
  return String(value || "").trim().toLowerCase() === "in-person" ? "In-Person" : "Virtual";
}

function formatMessageTime(value: string): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

function senderLabel(message: ParentSessionHistoryMessageApi, item: ParentSessionHistoryItemApi): string {
  if (message.sender === "tutor") return item.tutor_name.split(" ")[0] || item.tutor_name;
  if (message.sender === "admin") return "Admin";
  return item.student_name.split(" ")[0] || item.student_name;
}

function mapItem(item: ParentSessionHistoryItemApi): ParentSessionHistoryItem {
  return {
    id: item.booking_id,
    studentEmail: item.student_email,
    studentInitials: item.student_initials,
    studentName: item.student_name,
    studentGrade: item.student_grade,
    tutorId: item.tutor_id,
    tutorInitials: item.tutor_initials,
    tutorName: item.tutor_name,
    subject: item.subject,
    date: item.date,
    fullDate: item.full_date,
    time: item.time,
    endTime: item.end_time,
    duration: item.duration,
    type: normalizeType(item.type),
    rate: item.rate || item.amount,
    status: normalizeStatus(item.status),
    sessionDate: item.session_date,
    sessionTime: item.session_time,
    durationMinutes: item.duration_minutes,
    amount: item.amount,
    currency: item.currency,
    checkoutId: item.checkout_id,
    createdAt: item.created_at,
    details: item.details || {},
    messages: (item.messages || []).map((message) => ({
      id: message.id,
      sender: message.sender,
      message: message.message,
      timestamp: message.timestamp,
      senderLabel: senderLabel(message, item),
      timeLabel: formatMessageTime(message.timestamp),
    })),
  };
}

function mapSummary(summary: ParentScheduleSummaryApi): ParentScheduleSummaryCard[] {
  return [
    {
      title: "Total Sessions",
      value: String(summary.total_sessions || 0),
      subtitle: "All linked students",
      badge: "",
      tone: "red",
    },
    ...(summary.students || []).map((card) => ({
      title: card.title,
      value: String(card.value || "0"),
      subtitle: card.subtitle,
      badge: String(card.extra || ""),
      tone: card.tone,
    })),
  ];
}

export function mapParentScheduleResponse(data: ParentSessionHistoryResponseApi): ParentSessionHistoryResponse {
  return {
    summaryCards: mapSummary(data.summary || { total_sessions: 0, students: [] }),
    items: (data.items || []).map(mapItem),
  };
}
