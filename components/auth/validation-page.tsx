"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { FormStatusMessage } from "@/components/shared/form-status-message";
import { submitPublicApi } from "@/lib/api/public-api";
import {
  ADMIN_DASHBOARD_ROUTE,
  PARENT_DASHBOARD_ROUTE,
  STUDENT_DASHBOARD_ROUTE,
  TUTOR_DASHBOARD_ROUTE,
} from "@/lib/routes";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function shouldRouteToStudentDashboard(data: unknown) {
  if (!isRecord(data)) return false;
  const role = readString(data.role);
  return role === "student";
}

function shouldRouteToParentDashboard(data: unknown) {
  if (!isRecord(data)) return false;
  const role = readString(data.role);
  return role === "parent";
}

function shouldRouteToTutorDashboard(data: unknown) {
  if (!isRecord(data)) return false;
  const role = readString(data.role);
  return role === "tutor";
}

function shouldRouteToAdminDashboard(data: unknown) {
  if (!isRecord(data)) return false;
  const role = readString(data.role);
  return role === "admin";
}

function readAccessToken(data: unknown) {
  if (!isRecord(data)) return "";
  const accessToken = data.access_token ?? data.accessToken;
  return typeof accessToken === "string" ? accessToken : "";
}

function persistSessionCookies(data: unknown) {
  const token = readAccessToken(data);
  const role = isRecord(data) ? readString(data.role) : "";

  if (!token || !role) return;

  const oneWeekInSeconds = 60 * 60 * 24 * 7;
  const secureSuffix =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  document.cookie = `arch_access_token=${encodeURIComponent(token)}; Path=/; Max-Age=${oneWeekInSeconds}; SameSite=Lax${secureSuffix}`;
  document.cookie = `arch_user_role=${encodeURIComponent(role)}; Path=/; Max-Age=${oneWeekInSeconds}; SameSite=Lax${secureSuffix}`;
}

export function ValidationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialEmail = useMemo(() => searchParams.get("email") ?? "", [searchParams]);

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const emailError = email.trim().length === 0 ? "Enter your email address." : "";
  const codeError = code.trim().length === 0 ? "Enter your verification code." : "";
  const canSubmit = !emailError && !codeError;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      setSubmitState("error");
      setSubmitMessage("Please enter email and code.");
      return;
    }

    setSubmitState("submitting");
    setSubmitMessage("");

    const response = await submitPublicApi({
      endpoint: "verifyEmail",
      payload: {
        email: email.trim(),
        verification_code: code.trim(),
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
    <main className="min-h-screen bg-[#f3f0ef] px-4 py-12 sm:px-8">
      <div className="mx-auto w-full max-w-lg rounded-2xl border border-[#e5e7eb] bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
        <h1 className="text-3xl font-black tracking-[-0.04em] text-[#0f172a]">Verify Your Email</h1>
        <p className="mt-3 text-sm text-[#6b7280]">Enter the verification code sent to your email to activate your account.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <FormStatusMessage
            type={
              submitState === "success"
                ? "success"
                : submitState === "error"
                  ? "error"
                  : "idle"
            }
            message={submitMessage}
          />

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#4b5563]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-xl border border-[#e2e6ed] px-4 outline-none focus:border-[#a0afc7]"
            />
            {emailError ? <p className="mt-2 text-sm text-[#df1620]">{emailError}</p> : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#4b5563]">Verification code</label>
            <input
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter code"
              className="h-12 w-full rounded-xl border border-[#e2e6ed] px-4 outline-none focus:border-[#a0afc7]"
            />
            {codeError ? <p className="mt-2 text-sm text-[#df1620]">{codeError}</p> : null}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || submitState === "submitting"}
            className={`inline-flex h-12 w-full items-center justify-center rounded-xl text-base font-bold text-white transition ${
              canSubmit && submitState !== "submitting"
                ? "bg-[#df1620] hover:bg-[#f02029]"
                : "bg-[#d8dde6]"
            }`}
          >
            {submitState === "submitting" ? "Verifying..." : "Verify"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6b7280]">
          Already verified? <Link href="/login" className="font-semibold text-[#ef242a]">Go to login</Link>
        </p>
      </div>
    </main>
  );
}
