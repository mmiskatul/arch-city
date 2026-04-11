import { browserApiRequest, resolveBrowserApiBaseUrl } from "@/lib/api/browser-api-client";

export type ParentStudentStatus = "active" | "pending" | "declined";

export type ParentStudentListItem = {
  id: string;
  email: string;
  initials: string;
  name: string;
  grade: string;
  school: string;
  status: ParentStudentStatus;
  added_label: string;
  active_tutor_initials: string;
  active_tutor_name: string;
  sessions_total: number;
};

export type ParentStudentListResponse = {
  items: ParentStudentListItem[];
};

export type ParentStudentSearchItem = {
  email: string;
  name: string;
  initials: string;
  grade: string;
  school: string;
  already_linked: boolean;
  has_pending_invite: boolean;
};

export type ParentStudentSearchResponse = {
  items: ParentStudentSearchItem[];
};

export type ParentStudentInvitationItem = {
  invitation_id: string;
  parent_email: string;
  parent_name: string;
  parent_initials: string;
  student_email: string;
  student_name: string;
  student_initials: string;
  message: string;
  status: "pending" | "accepted" | "declined" | "cancelled";
  created_at: string;
  updated_at: string;
  responded_at?: string | null;
};

export type ParentStudentInvitationResponse = {
  item: ParentStudentInvitationItem;
  message: string;
};

function baseUrl() {
  const value = resolveBrowserApiBaseUrl();
  if (!value) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }
  return value;
}

export async function getParentStudents() {
  return browserApiRequest<ParentStudentListResponse>({
    url: `${baseUrl()}/parent/students`,
    method: "GET",
  });
}

export async function searchParentStudents(query: string) {
  const encoded = encodeURIComponent(query);
  return browserApiRequest<ParentStudentSearchResponse>({
    url: `${baseUrl()}/parent/students/search?q=${encoded}`,
    method: "GET",
  });
}

export async function inviteParentStudent(payload: { student_email: string; message: string }) {
  return browserApiRequest<ParentStudentInvitationResponse, typeof payload>({
    url: `${baseUrl()}/parent/students/invitations`,
    method: "POST",
    data: payload,
  });
}

export async function getStudentParentInvitation(invitationId: string) {
  return browserApiRequest<ParentStudentInvitationResponse>({
    url: `${baseUrl()}/student/parent-invitations/${encodeURIComponent(invitationId)}`,
    method: "GET",
  });
}

export async function acceptStudentParentInvitation(invitationId: string) {
  return browserApiRequest<ParentStudentInvitationResponse>({
    url: `${baseUrl()}/student/parent-invitations/${encodeURIComponent(invitationId)}/accept`,
    method: "POST",
  });
}

export async function declineStudentParentInvitation(invitationId: string) {
  return browserApiRequest<ParentStudentInvitationResponse>({
    url: `${baseUrl()}/student/parent-invitations/${encodeURIComponent(invitationId)}/decline`,
    method: "POST",
  });
}
