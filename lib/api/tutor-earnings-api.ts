import { browserApiRequest, resolveBrowserApiBaseUrl } from "@/lib/api/browser-api-client";

export type TutorEarningRow = {
  id: string;
  student_initials: string;
  student_name: string;
  date: string;
  subject: string;
  duration: string;
  type: "Virtual" | "In-Person";
  rate: string;
  status: "Paid" | "Pending";
};

export type TutorEarningsSummary = {
  current_month_label: string;
  this_month_total: string;
  sessions_completed_this_month: number;
  all_time_total: string;
  all_time_sessions: number;
};

export type TutorEarningsResponse = {
  generated_at: string;
  summary: TutorEarningsSummary;
  items: TutorEarningRow[];
};

function baseUrl() {
  const value = resolveBrowserApiBaseUrl();
  if (!value) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  return value;
}

export async function getTutorEarnings() {
  return browserApiRequest<TutorEarningsResponse>({
    url: `${baseUrl()}/tutor/earnings`,
    method: "GET",
  });
}
