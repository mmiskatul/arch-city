"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type ChangePasswordResponse = {
  message: string;
};

type SettingsScope = "student" | "parent" | "tutor";

type ChangePasswordPanelProps = {
  confirmPlaceholder?: string;
  scope?: SettingsScope;
};

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

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

function clearAuthCookies() {
  if (typeof document === "undefined") return;
  document.cookie = "arch_access_token=; Path=/; Max-Age=0; SameSite=Lax";
  document.cookie = "arch_user_role=; Path=/; Max-Age=0; SameSite=Lax";
}

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
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
  baseUrl,
  token,
  endpoints,
  body,
}: {
  baseUrl: string;
  token: string;
  endpoints: string[];
  body: string;
}) {
  let lastResponse: Response | null = null;

  for (const endpoint of endpoints) {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    if (response.ok) {
      return response;
    }

    lastResponse = response;
    if (![404, 405, 501].includes(response.status)) {
      return response;
    }
  }

  return lastResponse;
}

export function ChangePasswordPanel({
  confirmPlaceholder = "Re-enter new password",
  scope = "student",
}: ChangePasswordPanelProps) {
  const router = useRouter();
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

  async function triggerLogoutAndRedirect(token: string, baseUrl: string) {
    try {
      await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Ignore logout API failure and continue local logout.
    }

    clearAuthCookies();
    router.replace("/login");
    router.refresh();
  }

  async function handleUpdatePassword() {
    const baseUrl = resolveApiBaseUrl();
    const token = readCookie("arch_access_token");

    if (!baseUrl || !token) {
      setError("Missing API configuration or authentication token.");
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
      const response = await postWithEndpointFallback({
        baseUrl,
        token,
        endpoints: getChangePasswordEndpoints(scope),
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        }),
      });

      if (!response || !response.ok) {
        let detail: string | undefined;
        try {
          const data = (await response?.json()) as { detail?: string };
          detail = data.detail;
        } catch {
          // Ignore non-JSON responses.
        }

        throw new Error(detail ?? `Failed to update password (${response?.status ?? "no-response"}).`);
      }

      const data = (await response.json()) as ChangePasswordResponse;
      setSuccess(data.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      setShowSuccessPopup(true);
      setIsCompletingLogout(true);
      await wait(1200);
      await triggerLogoutAndRedirect(token, baseUrl);
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

