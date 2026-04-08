import { browserApiRequest, resolveBrowserApiBaseUrl } from "@/lib/api/browser-api-client";
import type {
  SessionMessage,
  SessionMessageThreadCountResponse,
  SessionMessageThreadDetailResponse,
  SessionMessageThreadListResponse,
  SessionMessageThreadSummary,
} from "@/lib/api/session-messages-api";

export type AdminMessage = SessionMessage;
export type AdminMessageThreadSummary = SessionMessageThreadSummary;
export type AdminMessageThreadListResponse = SessionMessageThreadListResponse;
export type AdminMessageThreadDetailResponse = SessionMessageThreadDetailResponse;
export type AdminMessageThreadCountResponse = SessionMessageThreadCountResponse;

export type AdminMessageCreateRequest = {
  message: string;
  client_message_id?: string;
  attachment_name?: string;
  attachment_type?: string;
  attachment_size?: number;
};

function baseUrl() {
  const value = resolveBrowserApiBaseUrl();
  if (!value) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  return value;
}

function adminMessagesPath(path = "") {
  return `${baseUrl()}/admin-dashboard/messages${path}`;
}

export async function getAdminMessageThreads() {
  return browserApiRequest<AdminMessageThreadListResponse>({
    url: adminMessagesPath(),
    method: "GET",
  });
}

export async function getAdminMessageThread(bookingId: string) {
  return browserApiRequest<AdminMessageThreadDetailResponse>({
    url: adminMessagesPath(`/${bookingId}`),
    method: "GET",
  });
}

export async function getAdminMessageCount() {
  return browserApiRequest<AdminMessageThreadCountResponse>({
    url: adminMessagesPath("/count"),
    method: "GET",
  });
}

export async function sendAdminMessage(bookingId: string, payload: AdminMessageCreateRequest) {
  return browserApiRequest<AdminMessage>({
    url: adminMessagesPath(`/${bookingId}`),
    method: "POST",
    data: payload,
  });
}
