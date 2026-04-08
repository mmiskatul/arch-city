import { browserApiRequest, resolveBrowserApiBaseUrl } from "@/lib/api/browser-api-client";

export type SessionMessage = {
  id: string;
  sender: "student" | "tutor" | "admin";
  message: string;
  timestamp: string;
  senderName?: string;
  senderInitials?: string;
  clientMessageId?: string;
  attachmentName?: string;
  attachmentType?: string;
  attachmentSize?: number;
};

export type SessionMessageThreadSummary = {
  thread_id: string;
  booking_id: string;
  student_email: string;
  student_name: string;
  student_initials: string;
  tutor_email: string;
  tutor_name: string;
  tutor_initials: string;
  subject: string;
  session_date: string;
  session_time: string;
  session_type: string;
  duration_minutes: number;
  status: string;
  last_message: string;
  last_sender_role: string;
  last_message_at: string;
  updated_at: string;
  unread_count_student: number;
  unread_count_tutor: number;
  unread_count_admin: number;
};

export type SessionMessageThreadListResponse = {
  items: SessionMessageThreadSummary[];
};

export type SessionMessageThreadDetailResponse = {
  thread: SessionMessageThreadSummary;
  messages: SessionMessage[];
};

export type SessionMessageThreadCountResponse = {
  unread_count: number;
  total_threads: number;
};

function baseUrl() {
  const value = resolveBrowserApiBaseUrl();
  if (!value) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  return value;
}

function studentPath(path = "") {
  return `${baseUrl()}/student/messages${path}`;
}

function tutorPath(path = "") {
  return `${baseUrl()}/tutor/messages${path}`;
}

export async function getStudentMessageThreads() {
  return browserApiRequest<SessionMessageThreadListResponse>({ url: studentPath(), method: "GET" });
}

export async function getStudentMessageThread(bookingId: string) {
  return browserApiRequest<SessionMessageThreadDetailResponse>({
    url: studentPath(`/${bookingId}`),
    method: "GET",
  });
}

export async function getStudentMessageCount() {
  return browserApiRequest<SessionMessageThreadCountResponse>({
    url: studentPath("/count"),
    method: "GET",
  });
}

export async function markStudentMessageThreadRead(bookingId: string) {
  return browserApiRequest<SessionMessageThreadSummary>({
    url: studentPath(`/${bookingId}/read`),
    method: "PUT",
  });
}

export async function getTutorMessageThreads() {
  return browserApiRequest<SessionMessageThreadListResponse>({ url: tutorPath(), method: "GET" });
}

export async function getTutorMessageThread(bookingId: string) {
  return browserApiRequest<SessionMessageThreadDetailResponse>({
    url: tutorPath(`/${bookingId}`),
    method: "GET",
  });
}

export async function getTutorMessageCount() {
  return browserApiRequest<SessionMessageThreadCountResponse>({
    url: tutorPath("/count"),
    method: "GET",
  });
}

export async function markTutorMessageThreadRead(bookingId: string) {
  return browserApiRequest<SessionMessageThreadSummary>({
    url: tutorPath(`/${bookingId}/read`),
    method: "PUT",
  });
}
