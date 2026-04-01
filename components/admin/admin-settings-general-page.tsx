"use client";

import { useEffect, useMemo, useState } from "react";
import { FiCamera, FiLock, FiMail, FiPhone, FiUser } from "react-icons/fi";

import { AdminSettingsLayout } from "@/components/admin/admin-settings-layout";
import {
  fetchAdminGeneralSettings,
  updateAdminPassword,
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
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

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

  const openPasswordModal = () => {
    setPasswordModalOpen(true);
    setPasswordError(null);
  };

  const closePasswordModal = () => {
    setPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordError(null);
  };

  const onPasswordSave = async () => {
    setPasswordSaving(true);
    setPasswordError(null);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("Fill in all password fields.");
      setPasswordSaving(false);
      return;
    }

    try {
      const response = await updateAdminPassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
      });
      setMessage(response.message || "Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setPasswordModalOpen(false);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to update admin password.");
    } finally {
      setPasswordSaving(false);
    }
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
            Password changes are managed through a secure popup
          </p>
        </div>

        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[22px] font-semibold text-[#20242b]">Password</p>
            <p className="text-[20px] text-[#5b5b99]">Update the admin login password from this popup</p>
          </div>
          <button
            type="button"
            onClick={openPasswordModal}
            className="inline-flex h-9 items-center rounded-lg border border-[#d1d5db] bg-white px-4 text-[14px] font-semibold text-[#5b5b99] transition hover:bg-[#f7f7f8]"
          >
            Update Password
          </button>
        </div>
      </article>

      {passwordModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
              <div>
                <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#111827]">Change Password</h2>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Update the admin login password used for dashboard access.
                </p>
              </div>

              <button
                type="button"
                onClick={closePasswordModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
                aria-label="Close password popup"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              {passwordError ? (
                <p className="rounded-lg bg-[#fff1f2] px-3 py-2 text-sm text-[#b91c1c]">{passwordError}</p>
              ) : null}

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-[#4b5563]">Current Password</span>
                <span className="flex h-12 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#fafafb] px-3">
                  <FiLock className="h-4 w-4 text-[#6b6b90]" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    className="w-full bg-transparent outline-none"
                    autoComplete="current-password"
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-[#4b5563]">New Password</span>
                <span className="flex h-12 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#fafafb] px-3">
                  <FiLock className="h-4 w-4 text-[#6b6b90]" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="w-full bg-transparent outline-none"
                    autoComplete="new-password"
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-[#4b5563]">Confirm New Password</span>
                <span className="flex h-12 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#fafafb] px-3">
                  <FiLock className="h-4 w-4 text-[#6b6b90]" />
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(event) => setConfirmNewPassword(event.target.value)}
                    className="w-full bg-transparent outline-none"
                    autoComplete="new-password"
                  />
                </span>
              </label>

              <p className="text-sm leading-6 text-[#6b7280]">
                Use at least 8 characters and make sure the confirmation matches exactly.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#e5e7eb] px-5 py-4">
              <button
                type="button"
                onClick={closePasswordModal}
                className="inline-flex h-10 items-center rounded-xl border border-[#d1d5db] bg-white px-4 text-sm font-semibold text-[#4b5563]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void onPasswordSave()}
                disabled={passwordSaving}
                className="inline-flex h-10 items-center rounded-xl bg-[#20242b] px-4 text-sm font-semibold text-white transition hover:bg-[#11151b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {passwordSaving ? "Saving..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminSettingsLayout>
  );
}

