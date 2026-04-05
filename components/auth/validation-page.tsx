"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, ClipboardEvent, FormEvent, KeyboardEvent } from "react";

import { FormStatusMessage } from "@/components/shared/form-status-message";
import { submitPublicApi } from "@/lib/api/public-api";
import {
  ADMIN_DASHBOARD_ROUTE,
  PARENT_DASHBOARD_ROUTE,
  STUDENT_DASHBOARD_ROUTE,
  TUTOR_DASHBOARD_ROUTE,
} from "@/lib/routes";

const OTP_LENGTH = 6;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function shouldRouteToStudentDashboard(data: unknown) {
  if (!isRecord(data)) return false;
  return readString(data.role) === "student";
}

function shouldRouteToParentDashboard(data: unknown) {
  if (!isRecord(data)) return false;
  return readString(data.role) === "parent";
}

function shouldRouteToTutorDashboard(data: unknown) {
  if (!isRecord(data)) return false;
  return readString(data.role) === "tutor";
}

function shouldRouteToAdminDashboard(data: unknown) {
  if (!isRecord(data)) return false;
  return readString(data.role) === "admin";
}

function readAccessToken(data: unknown) {
  if (!isRecord(data)) return "";
  const accessToken = data.access_token ?? data.accessToken;
  return typeof accessToken === "string" ? accessToken : "";
}

function readRefreshToken(data: unknown) {
  if (!isRecord(data)) return "";
  const refreshToken = data.refresh_token ?? data.refreshToken;
  return typeof refreshToken === "string" ? refreshToken : "";
}

function persistSessionCookies(data: unknown) {
  const token = readAccessToken(data);
  const refreshToken = readRefreshToken(data);
  const role = isRecord(data) ? readString(data.role) : "";

  if (!token || !refreshToken || !role) return;

  const oneWeekInSeconds = 60 * 60 * 24 * 7;
  const refreshTokenSeconds = 60 * 60 * 24 * 30;
  const secureSuffix =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  document.cookie = `arch_access_token=${encodeURIComponent(token)}; Path=/; Max-Age=${oneWeekInSeconds}; SameSite=Lax${secureSuffix}`;
  document.cookie = `arch_refresh_token=${encodeURIComponent(refreshToken)}; Path=/; Max-Age=${refreshTokenSeconds}; SameSite=Lax${secureSuffix}`;
  document.cookie = `arch_user_role=${encodeURIComponent(role)}; Path=/; Max-Age=${oneWeekInSeconds}; SameSite=Lax${secureSuffix}`;
  window.dispatchEvent(new Event("arch-session-updated"));
}

export function ValidationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = useMemo(() => searchParams.get("email")?.trim() ?? "", [searchParams]);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const verificationCode = otpDigits.join("");
  const canSubmit = Boolean(email) && verificationCode.length === OTP_LENGTH;

  function setDigitAt(index: number, value: string) {
    const next = [...otpDigits];
    next[index] = value;
    setOtpDigits(next);
  }

  function handleChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value;
    const digit = raw.replace(/\D/g, "").slice(-1);
    setDigitAt(index, digit);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const text = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!text) return;

    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < text.length; i += 1) {
      next[i] = text[i];
    }
    setOtpDigits(next);
    const focusIndex = Math.min(text.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  }

  function handleResendClick() {
    setSubmitState("idle");
    setSubmitMessage("Resend is not enabled yet. Please sign up again to request a new code.");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email) {
      setSubmitState("error");
      setSubmitMessage("Missing email context. Please return to signup.");
      return;
    }

    if (!canSubmit) {
      setSubmitState("error");
      setSubmitMessage("Please enter the full verification code.");
      return;
    }

    setSubmitState("submitting");
    setSubmitMessage("");

    const response = await submitPublicApi({
      endpoint: "verifyEmail",
      payload: {
        email,
        verification_code: verificationCode,
      },
    });

    if (!response.ok) {
      setSubmitState("error");
      setSubmitMessage(response.error);
      return;
    }

    setSubmitState("success");
    setSubmitMessage("Verification successful. Redirecting...");
    persistSessionCookies(response.data);

    if (shouldRouteToAdminDashboard(response.data)) {
      router.push(ADMIN_DASHBOARD_ROUTE);
      return;
    }

    if (shouldRouteToStudentDashboard(response.data)) {
      router.push(STUDENT_DASHBOARD_ROUTE);
      return;
    }

    if (shouldRouteToParentDashboard(response.data)) {
      router.push(PARENT_DASHBOARD_ROUTE);
      return;
    }

    if (shouldRouteToTutorDashboard(response.data)) {
      router.push(TUTOR_DASHBOARD_ROUTE);
      return;
    }

    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-[#ececec] px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-2xl text-center">
        <h1 className="text-5xl font-bold tracking-[-0.04em] text-black">Verify Code</h1>

        <p className="mx-auto mt-4 max-w-xl text-[38px] leading-tight text-[#161616] sm:text-[32px]">
          We Sent OTP code to your email <br />
          {email || "your-email@example.com"} Enter the code below to verify
        </p>

        <form className="mt-10" onSubmit={handleSubmit} noValidate>
          <FormStatusMessage
            type={submitState === "success" ? "success" : submitState === "error" ? "error" : "idle"}
            message={submitMessage}
          />

          <div className="mt-6 flex justify-center gap-8">
            {Array.from({ length: OTP_LENGTH }).map((_, index) => (
              <input
                key={`otp-${index}`}
                ref={(node) => {
                  inputRefs.current[index] = node;
                }}
                value={otpDigits[index]}
                onChange={(event) => handleChange(index, event)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={handlePaste}
                inputMode="numeric"
                maxLength={1}
                className="h-24 w-24 rounded-[18px] border-4 border-[#adadad] bg-transparent text-center text-6xl font-semibold text-[#3f3f46] outline-none focus:border-[#ef242a]"
                aria-label={`Verification digit ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || submitState === "submitting"}
            className={`mt-16 h-[74px] w-full rounded-[18px] text-[38px] font-medium text-white transition ${
              canSubmit && submitState !== "submitting"
                ? "bg-[#f78d47] hover:bg-[#ef7c30]"
                : "bg-[#d8dde6]"
            }`}
          >
            {submitState === "submitting" ? "Verifying..." : "Next"}
          </button>
        </form>

        <p className="mt-10 text-[40px] text-[#1f1f1f]">
          Don&apos;t receive OTP?{" "}
          <button
            type="button"
            onClick={handleResendClick}
            className="text-[#d84b39] underline-offset-4 hover:underline"
          >
            Resend again
          </button>
        </p>

        <p className="mt-14 text-[44px] font-medium text-[#111111]">
          <Link href="/login" className="inline-flex items-center gap-3 hover:opacity-80">
            <span aria-hidden="true">&#8592;</span>
            <span>Back to Login</span>
          </Link>
        </p>
      </div>
    </main>
  );
}

