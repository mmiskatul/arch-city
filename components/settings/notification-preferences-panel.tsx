"use client";

import { useEffect, useMemo, useState } from "react";

import { browserApiRequestWithFallback } from "@/lib/api/browser-api-client";

type PreferenceOption = {
  key: string;
  label: string;
};

type SettingsScope = "student" | "parent" | "tutor";

type NotificationPreferencesPanelProps = {
  options: PreferenceOption[];
  scope?: SettingsScope;
};

type NotificationPreferencesResponse = {
  role: string;
  preferences: Record<string, boolean>;
};

function getNotificationPreferenceEndpoints(scope: SettingsScope) {
  return ["/settings/notification-preferences"];
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

export function NotificationPreferencesPanel({
  options,
  scope = "student",
}: NotificationPreferencesPanelProps) {
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
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim()?.replace(/\/$/, "");

    if (!baseUrl) {
      const fallback = Object.fromEntries(options.map((option) => [option.key, false]));
      setInitialPreferences(fallback);
      setPreferences(fallback);
      setIsLoading(false);
      return;
    }

    const apiBaseUrl = baseUrl;

    async function loadPreferences() {
      try {
        const response = await browserApiRequestWithFallback<NotificationPreferencesResponse>({
          urls: getNotificationPreferenceEndpoints(scope).map((endpoint) => `${apiBaseUrl}${endpoint}`),
          method: "GET",
        });
        const merged: Record<string, boolean> = {};

        for (const option of options) {
          merged[option.key] = Boolean(response.preferences?.[option.key]);
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
  }, [options, scope]);

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
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim()?.replace(/\/$/, "");

    if (!baseUrl) {
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

      const response = await browserApiRequestWithFallback<NotificationPreferencesResponse>({
        urls: getNotificationPreferenceEndpoints(scope).map((endpoint) => `${baseUrl}${endpoint}`),
        method: "PUT",
        data: payload,
      });
      const nextState: Record<string, boolean> = {};

      for (const option of options) {
        nextState[option.key] = Boolean(response.preferences?.[option.key]);
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

