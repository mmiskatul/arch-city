"use client";

import { useMemo, useState } from "react";

import { browserApiRequest, browserApiRequestWithFallback } from "@/lib/api/browser-api-client";

type ChangePasswordResponse = {
  message: string;
};

type SettingsScope = "student" | "parent" | "tutor";

type ChangePasswordPanelProps = {
  confirmPlaceholder?: string;
  scope?: SettingsScope;
};

function clearAuthCookies() {
  if (typeof document === "undefined") return;
  const expired = "Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `arch_access_token=; Path=/; Expires=${expired}; Max-Age=0; SameSite=Lax`;
  document.cookie = `arch_refresh_token=; Path=/; Expires=${expired}; Max-Age=0; SameSite=Lax`;
  document.cookie = `arch_user_role=; Path=/; Expires=${expired}; Max-Age=0; SameSite=Lax`;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getChangePasswordEndpoints(scope: SettingsScope) {
  const scopedPrefix =
    scope === "student"
      ? "/student/settings"
      : scope === "parent"
        ? "/parent/settings"
        : "/tutor/settings";

  return [`${scopedPrefix}/change-password`, "/settings/change-password"];
}

async function postWithEndpointFallback({
  endpoints,
  body,
}: {
  endpoints: string[];
  body: Record<string, unknown>;
}): Promise<ChangePasswordResponse | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim()?.replace(/\/$/, "");
  if (!baseUrl) {
    return null;
  }

  return browserApiRequestWithFallback({
    urls: endpoints.map((endpoint) => `${baseUrl}${endpoint}`),
    method: "POST",
      data: body,
    });
  }

export function ChangePasswordPanel({
  confirmPlaceholder = "Re-enter new password",
  scope = "student",
}: ChangePasswordPanelProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCompletingLogout, setIsCompletingLogout] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      currentPassword.trim().length >= 8 &&
      newPassword.trim().length >= 8 &&
      confirmNewPassword.trim().length >= 8
    );
  }, [confirmNewPassword, currentPassword, newPassword]);

  async function triggerLogoutAndRedirect(baseUrl: string) {
    try {
      await browserApiRequest({
        url: `${baseUrl}/auth/logout`,
        method: "POST",
      });
    } catch {
      // Ignore logout API failure and continue local logout.
    }

    clearAuthCookies();
    window.dispatchEvent(new Event("arch-session-updated"));
    window.location.replace("/login");
  }

  async function handleUpdatePassword() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim()?.replace(/\/$/, "");

    if (!baseUrl) {
      setError("Missing API configuration.");
      setSuccess(null);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match.");
      setSuccess(null);
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await postWithEndpointFallback({
        endpoints: getChangePasswordEndpoints(scope),
        body: {
          current_password: currentPassword,
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        },
      });

      if (!data) {
        throw new Error("Failed to update password.");
      }

      setSuccess(data.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      setShowSuccessPopup(true);
      setIsCompletingLogout(true);
      await wait(1200);
      await triggerLogoutAndRedirect(baseUrl);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to update password.");
      setShowSuccessPopup(false);
      setIsCompletingLogout(false);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">Current Password</label>
          <input
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value);
              setError(null);
              setSuccess(null);
            }}
            className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">New Password</label>
          <input
            type="password"
            placeholder="Min. 8 characters"
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value);
              setError(null);
              setSuccess(null);
            }}
            className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">Confirm New Password</label>
          <input
            type="password"
            placeholder={confirmPlaceholder}
            value={confirmNewPassword}
            onChange={(event) => {
              setConfirmNewPassword(event.target.value);
              setError(null);
              setSuccess(null);
            }}
            className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] outline-none"
          />
        </div>

        {error ? <p className="text-[13px] text-[#d61c3f]">{error}</p> : null}
        {success ? <p className="text-[13px] text-[#1b8a5a]">{success}</p> : null}

        <button
          type="button"
          onClick={handleUpdatePassword}
          disabled={!canSubmit || isSaving || isCompletingLogout}
          className="inline-flex h-10 items-center justify-center rounded-full bg-[#d61c3f] px-5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Updating..." : "Update Password"}
        </button>
      </div>

      {showSuccessPopup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 text-center shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
            <p className="text-[16px] font-bold text-[#20242b]">Password Changed</p>
            <p className="mt-2 text-[13px] text-[#6b7280]">Logging out and redirecting to login...</p>
          </div>
        </div>
      ) : null}
    </>
  );
}

