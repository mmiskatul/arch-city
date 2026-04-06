type StudentSessionCheckoutPayload = {
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
  successUrl: string;
  cancelUrl: string;
};

type StudentMembershipCheckoutPayload = {
  paymentEmail: string;
  cardholderName: string;
  saveInformation: boolean;
  planName: string;
  billingInterval: string;
  amount: string;
  currency: string;
  successUrl: string;
  cancelUrl: string;
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
};

type StudentStripeCheckoutResponse = {
  checkout_id: string;
  checkout_type: "membership" | "session";
  status: "pending";
  student_email: string;
  payment_email: string;
  checkout_session_id: string;
  checkout_url: string;
  amount: string;
  currency: string;
  message: string;
};

type StudentStripeCheckoutConfirmPayload = {
  checkoutId: string;
  stripeSessionId: string;
};

async function submitStudentCheckout<TResponse>(path: string, payload: Record<string, unknown>): Promise<TResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const data = (await response.json()) as { detail?: string | { msg?: string }[] };
      if (typeof data.detail === "string") {
        detail = data.detail;
      } else if (Array.isArray(data.detail) && data.detail[0]?.msg) {
        detail = data.detail[0].msg as string;
      }
    } catch {
      // keep fallback
    }
    throw new Error(detail);
  }

  return (await response.json()) as TResponse;
}

export async function createStudentSessionCheckout(
  payload: StudentSessionCheckoutPayload,
): Promise<StudentStripeCheckoutResponse> {
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
    success_url: payload.successUrl,
    cancel_url: payload.cancelUrl,
  });
}

export async function createStudentMembershipCheckout(
  payload: StudentMembershipCheckoutPayload,
): Promise<StudentStripeCheckoutResponse> {
  return submitStudentCheckout("/student/payments/membership", {
    payment_email: payload.paymentEmail,
    cardholder_name: payload.cardholderName,
    save_information: payload.saveInformation,
    plan_name: payload.planName,
    billing_interval: payload.billingInterval,
    amount: payload.amount,
    currency: payload.currency,
    success_url: payload.successUrl,
    cancel_url: payload.cancelUrl,
  });
}

export async function confirmStudentSessionCheckout(payload: StudentStripeCheckoutConfirmPayload): Promise<StudentCheckoutResponse> {
  return submitStudentCheckout("/student/payments/session/confirm", {
    checkout_id: payload.checkoutId,
    stripe_session_id: payload.stripeSessionId,
  });
}

export async function confirmStudentMembershipCheckout(payload: StudentStripeCheckoutConfirmPayload): Promise<StudentCheckoutResponse> {
  return submitStudentCheckout("/student/payments/membership/confirm", {
    checkout_id: payload.checkoutId,
    stripe_session_id: payload.stripeSessionId,
  });
}
