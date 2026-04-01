"use client";

import { useEffect, useMemo, useState } from "react";
import { FiCamera, FiMail, FiPhone, FiUser } from "react-icons/fi";

import { AdminSettingsLayout } from "@/components/admin/admin-settings-layout";
import {
  fetchAdminGeneralSettings,
  updateAdminGeneralSettings,
  type AdminProfileSettings,
} from "@/lib/api/admin-settings-api";

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  initials: string;
};

const emptyForm: FormState = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  initials: "A",
};

function toFormState(profile: AdminProfileSettings): FormState {
  return {
    first_name: profile.first_name,
    last_name: profile.last_name,
    email: profile.email,
    phone_number: profile.phone_number,
    initials: profile.initials || "A",
  };
}

function formatLastModified(value: string, updatedBy: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return `Last modified by ${updatedBy || "Admin"}`;
  }

  return `Last modified by ${updatedBy || "Admin"} on ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

export function AdminSettingsGeneralPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [initialForm, setInitialForm] = useState<FormState>(emptyForm);
  const [lastModifiedAt, setLastModifiedAt] = useState<string>("");
  const [updatedBy, setUpdatedBy] = useState<string>("Admin");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchAdminGeneralSettings();
        if (cancelled) return;

        const nextForm = toFormState(response.profile);
        setForm(nextForm);
        setInitialForm(nextForm);
        setLastModifiedAt(response.last_modified_at);
        setUpdatedBy(response.updated_by);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load admin settings.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const dirty = useMemo(
    () =>
      form.first_name !== initialForm.first_name ||
      form.last_name !== initialForm.last_name ||
      form.phone_number !== initialForm.phone_number,
    [form, initialForm],
  );

  const onSave = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await updateAdminGeneralSettings({
        first_name: form.first_name,
        last_name: form.last_name,
        phone_number: form.phone_number,
      });

      const nextForm = toFormState(response.profile);
      setForm(nextForm);
      setInitialForm(nextForm);
      setLastModifiedAt(response.last_modified_at);
      setUpdatedBy(response.updated_by);
      setMessage("General settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save admin settings.");
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    setForm(initialForm);
    setMessage(null);
    setError(null);
  };

  return (
    <AdminSettingsLayout
      title="General Settings"
      subtitle="Manage your personal account profile"
      rightMeta={lastModifiedAt ? formatLastModified(lastModifiedAt, updatedBy) : undefined}
    >
      <article className="overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white">
        <div className="border-b border-[#eceef2] px-5 py-4">
          <h2 className="text-[34px] font-bold leading-none text-[#20242b]">Profile Information</h2>
          <p className="mt-2 text-[22px] text-[#5b5b99]">Update your photo and personal details.</p>
        </div>

        <div className="px-5 py-5">
          {loading ? <p className="text-[15px] text-[#6b7280]">Loading admin profile...</p> : null}
          {error ? <p className="mb-4 rounded-lg bg-[#fff1f2] px-3 py-2 text-[14px] text-[#b91c1c]">{error}</p> : null}
          {message ? <p className="mb-4 rounded-lg bg-[#ecfdf5] px-3 py-2 text-[14px] text-[#047857]">{message}</p> : null}

          <div className="grid gap-4 lg:grid-cols-[110px_minmax(0,1fr)]">
            <div className="relative">
              <div className="flex h-[104px] w-[104px] items-center justify-center rounded-full bg-gradient-to-br from-[#d7e7ff] via-[#e5f1ff] to-[#f4f8ff] p-1">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#dce9f7] text-[24px] font-bold text-[#37557a]">
                  {form.initials}
                </div>
              </div>
              <button
                type="button"
                className="absolute bottom-1 right-0 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#4b5563]"
                aria-label="Change profile photo"
              >
                <FiCamera className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[22px] font-semibold uppercase tracking-[0.04em] text-[#2a2a56]">
                    First Name
                  </span>
                  <span className="flex h-12 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#fafafb] px-3 text-[15px] text-[#5b5b99]">
                    <FiUser className="h-4 w-4 text-[#6b6b90]" />
                    <input
                      value={form.first_name}
                      onChange={(event) => setForm((prev) => ({ ...prev, first_name: event.target.value }))}
                      className="w-full bg-transparent outline-none"
                      disabled={loading}
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[22px] font-semibold uppercase tracking-[0.04em] text-[#2a2a56]">
                    Last Name
                  </span>
                  <span className="flex h-12 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#fafafb] px-3 text-[15px] text-[#5b5b99]">
                    <FiUser className="h-4 w-4 text-[#6b6b90]" />
                    <input
                      value={form.last_name}
                      onChange={(event) => setForm((prev) => ({ ...prev, last_name: event.target.value }))}
                      className="w-full bg-transparent outline-none"
                      disabled={loading}
                    />
                  </span>
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[22px] font-semibold uppercase tracking-[0.04em] text-[#2a2a56]">
                    Email
                  </span>
                  <span className="flex h-12 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#fafafb] px-3 text-[15px] text-[#5b5b99]">
                    <FiMail className="h-4 w-4 text-[#6b6b90]" />
                    <input value={form.email} className="w-full bg-transparent outline-none" readOnly />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[22px] font-semibold uppercase tracking-[0.04em] text-[#2a2a56]">
                    Contact
                  </span>
                  <span className="flex h-12 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#fafafb] px-3 text-[15px] text-[#5b5b99]">
                    <FiPhone className="h-4 w-4 text-[#6b6b90]" />
                    <input
                      value={form.phone_number}
                      onChange={(event) => setForm((prev) => ({ ...prev, phone_number: event.target.value }))}
                      className="w-full bg-transparent outline-none"
                      disabled={loading}
                    />
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={!dirty || saving}
              className="inline-flex h-9 items-center rounded-lg border border-[#d1d5db] bg-white px-4 text-[14px] font-semibold text-[#6b7280] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void onSave()}
              disabled={!dirty || loading || saving}
              className="inline-flex h-9 items-center rounded-lg bg-[#20242b] px-4 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </article>

      <article className="mt-4 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white">
        <div className="border-b border-[#eceef2] px-5 py-4">
          <h2 className="text-[34px] font-bold leading-none text-[#20242b]">Password settings</h2>
          <p className="mt-2 text-[22px] text-[#5b5b99]">
            Password changes are managed through authentication flows
          </p>
        </div>

        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[22px] font-semibold text-[#20242b]">Password</p>
            <p className="text-[20px] text-[#5b5b99]">Use the login flow to reset admin credentials</p>
          </div>
          <button
            type="button"
            disabled
            className="inline-flex h-9 items-center rounded-lg border border-[#d1d5db] bg-white px-4 text-[14px] font-semibold text-[#5b5b99] opacity-50"
          >
            Update Password
          </button>
        </div>
      </article>
    </AdminSettingsLayout>
  );
}
