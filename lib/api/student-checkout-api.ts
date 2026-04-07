import { browserApiRequest, resolveBrowserApiBaseUrl } from "@/lib/api/browser-api-client";

type StudentSessionBookingPayload = {
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

type StudentMembershipCheckoutPayload = {
  paymentEmail: string;
  cardholderName: string;
  saveInformation: boolean;
  planName: string;
  billingInterval: string;
  amount: string;
  currency: string;
  cardNumber: string;
  cardExpiry: string;
  cardCountry: string;
};

type StudentCheckoutResponse = {
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

async function submitStudentCheckout<TResponse>(path: string, payload: Record<string, unknown>): Promise<TResponse> {
  const baseUrl = resolveBrowserApiBaseUrl();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  return browserApiRequest<TResponse>({
    url: `${baseUrl}${path}`,
    method: "POST",
    data: payload,
    includeAuth: true,
    withCredentials: false,
  });
}

export async function createStudentSessionCheckout(
  payload: StudentSessionBookingPayload,
): Promise<StudentCheckoutResponse> {
  return submitStudentCheckout("/student/payments/session", {
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
  });
}

export async function createStudentMembershipCheckout(
  payload: StudentMembershipCheckoutPayload,
): Promise<StudentCheckoutResponse> {
  return submitStudentCheckout("/student/payments/membership", {
    payment_email: payload.paymentEmail,
    cardholder_name: payload.cardholderName,
    save_information: payload.saveInformation,
    plan_name: payload.planName,
    billing_interval: payload.billingInterval,
    amount: payload.amount,
    currency: payload.currency,
    card_number: payload.cardNumber,
    card_expiry: payload.cardExpiry,
    card_country: payload.cardCountry,
  });
}
