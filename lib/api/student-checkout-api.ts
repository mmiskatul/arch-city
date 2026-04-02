type StudentSessionCheckoutPayload = {
  paymentEmail: string;
  cardholderName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCountry: string;
  saveInformation: boolean;
  tutorId: string;
  tutorName: string;
  sessionDate: string;
  sessionTime: string;
  sessionType: string;
  durationMinutes: number;
  sessionRate: string;
  schedulingFee: string;
  totalAmount: string;
  currency: string;
};

type StudentMembershipCheckoutPayload = {
  paymentEmail: string;
  cardholderName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCountry: string;
  saveInformation: boolean;
  planName: string;
  billingInterval: string;
  amount: string;
  currency: string;
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

function readCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const encodedName = `${encodeURIComponent(name)}=`;
  const parts = document.cookie.split(";");

  for (const part of parts) {
    const cookie = part.trim();
    if (cookie.startsWith(encodedName)) {
      return decodeURIComponent(cookie.slice(encodedName.length));
    }
  }

  return null;
}

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
}

async function submitStudentCheckout(path: string, payload: Record<string, unknown>): Promise<StudentCheckoutResponse> {
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const token = readCookie("arch_access_token");
  if (!token) {
    throw new Error("Authentication required. Please login again.");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("Authentication required. Please login again.");
  }

  if (!response.ok) {
    let detail: string | undefined;
    try {
      const data = (await response.json()) as { detail?: string };
      detail = data.detail;
    } catch {
      // Ignore non-JSON error responses.
    }
    throw new Error(detail ?? `Checkout request failed (${response.status}).`);
  }

  return (await response.json()) as StudentCheckoutResponse;
}

export async function createStudentSessionCheckout(
  payload: StudentSessionCheckoutPayload,
): Promise<StudentCheckoutResponse> {
  return submitStudentCheckout("/student/payments/session", {
    payment_email: payload.paymentEmail,
    cardholder_name: payload.cardholderName,
    card_number: payload.cardNumber,
    card_expiry: payload.cardExpiry,
    card_country: payload.cardCountry,
    save_information: payload.saveInformation,
    tutor_id: payload.tutorId,
    tutor_name: payload.tutorName,
    session_date: payload.sessionDate,
    session_time: payload.sessionTime,
    session_type: payload.sessionType,
    duration_minutes: payload.durationMinutes,
    session_rate: payload.sessionRate,
    scheduling_fee: payload.schedulingFee,
    total_amount: payload.totalAmount,
    currency: payload.currency,
  });
}

export async function createStudentMembershipCheckout(
  payload: StudentMembershipCheckoutPayload,
): Promise<StudentCheckoutResponse> {
  return submitStudentCheckout("/student/payments/membership", {
    payment_email: payload.paymentEmail,
    cardholder_name: payload.cardholderName,
    card_number: payload.cardNumber,
    card_expiry: payload.cardExpiry,
    card_country: payload.cardCountry,
    save_information: payload.saveInformation,
    plan_name: payload.planName,
    billing_interval: payload.billingInterval,
    amount: payload.amount,
    currency: payload.currency,
  });
}
