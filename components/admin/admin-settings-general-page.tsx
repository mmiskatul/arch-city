"use client";

import { useState } from "react";
import { FiCamera, FiMail, FiPhone, FiUser } from "react-icons/fi";

import { AdminSettingsLayout } from "@/components/admin/admin-settings-layout";

export function AdminSettingsGeneralPage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("example@gmail.com");
  const [contact, setContact] = useState("+1 265 665 2266");

  return (
    <AdminSettingsLayout
      title="General Settings"
      subtitle="Manage your personal account profile"
    >
      <article className="overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white">
        <div className="border-b border-[#eceef2] px-5 py-4">
          <h2 className="text-[34px] font-bold leading-none text-[#20242b]">Profile Information</h2>
          <p className="mt-2 text-[22px] text-[#5b5b99]">Update your photo and personal details.</p>
        </div>

        <div className="px-5 py-5">
          <div className="grid gap-4 lg:grid-cols-[110px_minmax(0,1fr)]">
            <div className="relative">
              <div className="h-[104px] w-[104px] rounded-full bg-gradient-to-br from-[#d7e7ff] via-[#e5f1ff] to-[#f4f8ff] p-1">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#dce9f7] text-[24px] font-bold text-[#37557a]">
                  JD
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
                    Name
                  </span>
                  <span className="flex h-12 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#fafafb] px-3 text-[15px] text-[#5b5b99]">
                    <FiUser className="h-4 w-4 text-[#6b6b90]" />
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="w-full bg-transparent outline-none"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[22px] font-semibold uppercase tracking-[0.04em] text-[#2a2a56]">
                    Email
                  </span>
                  <span className="flex h-12 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#fafafb] px-3 text-[15px] text-[#5b5b99]">
                    <FiMail className="h-4 w-4 text-[#6b6b90]" />
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full bg-transparent outline-none"
                    />
                  </span>
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-[22px] font-semibold uppercase tracking-[0.04em] text-[#2a2a56]">
                  Contact
                </span>
                <span className="flex h-12 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#fafafb] px-3 text-[15px] text-[#5b5b99]">
                  <FiPhone className="h-4 w-4 text-[#6b6b90]" />
                  <input
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    className="w-full bg-transparent outline-none"
                  />
                </span>
              </label>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-lg border border-[#d1d5db] bg-white px-4 text-[14px] font-semibold text-[#6b7280]"
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-lg bg-[#20242b] px-4 text-[14px] font-semibold text-white"
            >
              Save
            </button>
          </div>
        </div>
      </article>

      <article className="mt-4 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white">
        <div className="border-b border-[#eceef2] px-5 py-4">
          <h2 className="text-[34px] font-bold leading-none text-[#20242b]">Password settings</h2>
          <p className="mt-2 text-[22px] text-[#5b5b99]">
            Keep your account secure with a strong password
          </p>
        </div>

        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[22px] font-semibold text-[#20242b]">Password</p>
            <p className="text-[20px] text-[#5b5b99]">Last changed 4 months ago</p>
          </div>
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-lg border border-[#d1d5db] bg-white px-4 text-[14px] font-semibold text-[#5b5b99]"
          >
            Update Password
          </button>
        </div>
      </article>
    </AdminSettingsLayout>
  );
}
