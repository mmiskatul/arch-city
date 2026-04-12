import { browserApiRequest, resolveBrowserApiBaseUrl } from "@/lib/api/browser-api-client";

export type ParentSessionBookingPayload = {
  studentEmail: string;
  paymentEmail: string;
  cardholderName: string;
  saveInformation: boolean;
  tutorId: string;
  tutorName: string;
  subject: string;
  sessionDate: string;
  sessionTime: string;
  sessionType: string;
  durationMinutes: number;
  sessionRate: string;
  schedulingFee: string;
  totalAmount: string;
  currency: string;
  meetingLocation?: string;
  sessionNotes?: string;
};

export type ParentSessionBookingResponse = {
  checkout_id: string;
  checkout_type: "membership" | "session";
  status: "completed";
  student_email: string;
  payment_email: string;
  card_brand: string;
  card_last4: string;
  amount: string;
  currency: string;
  message: string;
  created_at: string;
  details: Record<string, string>;
};

function baseUrl() {
  const value = resolveBrowserApiBaseUrl();
  if (!value) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }
  return value;
}

export async function createParentSessionBooking(
  payload: ParentSessionBookingPayload,
): Promise<ParentSessionBookingResponse> {
  return browserApiRequest<ParentSessionBookingResponse>({
    url: `${baseUrl()}/parent/payments/session`,
    method: "POST",
    data: {
      student_email: payload.studentEmail,
      payment_email: payload.paymentEmail,
      cardholder_name: payload.cardholderName,
      save_information: payload.saveInformation,
      tutor_id: payload.tutorId,
      tutor_name: payload.tutorName,
      subject: payload.subject,
      session_date: payload.sessionDate,
      session_time: payload.sessionTime,
      session_type: payload.sessionType,
      duration_minutes: payload.durationMinutes,
      session_rate: payload.sessionRate,
      scheduling_fee: payload.schedulingFee,
      total_amount: payload.totalAmount,
      currency: payload.currency,
      meeting_location: payload.meetingLocation ?? "",
      session_notes: payload.sessionNotes ?? "",
    },
  });
}
