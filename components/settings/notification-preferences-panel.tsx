"use client";

import { useEffect, useMemo, useState } from "react";

type PreferenceOption = {
  key: string;
  label: string;
};

type NotificationPreferencesPanelProps = {
  options: PreferenceOption[];
};

type NotificationPreferencesResponse = {
  role: string;
  preferences: Record<string, boolean>;
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

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-10 items-center rounded-full transition ${
        enabled ? "bg-[#d61c3f]" : "bg-[#e5e7eb]"
      }`}
      aria-pressed={enabled}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transition ${
          enabled ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export function NotificationPreferencesPanel({ options }: NotificationPreferencesPanelProps) {
  const [initialPreferences, setInitialPreferences] = useState<Record<string, boolean>>({});
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const allowedKeys = useMemo(() => new Set(options.map((option) => option.key)), [options]);

  const hasChanges = useMemo(() => {
    const keys = options.map((option) => option.key);
    return keys.some((key) => (initialPreferences[key] ?? false) !== (preferences[key] ?? false));
  }, [initialPreferences, options, preferences]);

  useEffect(() => {
    const token = readCookie("arch_access_token");
    const baseUrl = resolveApiBaseUrl();

    if (!token || !baseUrl) {
      const fallback = Object.fromEntries(options.map((option) => [option.key, false]));
      setInitialPreferences(fallback);
      setPreferences(fallback);
      setIsLoading(false);
      return;
    }

    async function loadPreferences() {
      try {
        const response = await fetch(`${baseUrl}/settings/notification-preferences`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load preferences (${response.status}).`);
        }

        const data = (await response.json()) as NotificationPreferencesResponse;
        const merged: Record<string, boolean> = {};

        for (const option of options) {
          merged[option.key] = Boolean(data.preferences?.[option.key]);
        }

        setInitialPreferences(merged);
        setPreferences(merged);
      } catch (loadError) {
        const fallback = Object.fromEntries(options.map((option) => [option.key, false]));
        setInitialPreferences(fallback);
        setPreferences(fallback);
        setError(loadError instanceof Error ? loadError.message : "Failed to load preferences.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPreferences();
  }, [options]);

  function handleToggle(key: string) {
    if (!allowedKeys.has(key)) return;

    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
    setError(null);
    setSuccess(null);
  }

  async function handleUpdate() {
    const token = readCookie("arch_access_token");
    const baseUrl = resolveApiBaseUrl();

    if (!token || !baseUrl) {
      setError("Missing API configuration or authentication token.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        preferences: Object.fromEntries(options.map((option) => [option.key, Boolean(preferences[option.key])])),
      };

      const response = await fetch(`${baseUrl}/settings/notification-preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let detail: string | undefined;
        try {
          const data = (await response.json()) as { detail?: string };
          detail = data.detail;
        } catch {
          // Ignore non-JSON error body.
        }
        throw new Error(detail ?? `Failed to update preferences (${response.status}).`);
      }

      const data = (await response.json()) as NotificationPreferencesResponse;
      const nextState: Record<string, boolean> = {};

      for (const option of options) {
        nextState[option.key] = Boolean(data.preferences?.[option.key]);
      }

      setInitialPreferences(nextState);
      setPreferences(nextState);
      setSuccess("Notification preferences updated.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to update preferences.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p className="text-[13px] text-[#6b7280]">Loading preferences...</p>;
  }

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <div
          key={option.key}
          className="flex items-center justify-between rounded-lg border border-[#eceef2] bg-[#fafafb] px-4 py-3"
        >
          <p className="text-[14px] font-medium text-[#20242b]">{option.label}</p>
          <Toggle enabled={Boolean(preferences[option.key])} onToggle={() => handleToggle(option.key)} />
        </div>
      ))}

      {error ? <p className="text-[13px] text-[#d61c3f]">{error}</p> : null}
      {success ? <p className="text-[13px] text-[#1b8a5a]">{success}</p> : null}

      {hasChanges ? (
        <div className="pt-2">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={isSaving}
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#d61c3f] px-5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Updating..." : "Update"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
