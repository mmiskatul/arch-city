"use client";

import { FiBold, FiItalic, FiLink2, FiList, FiPaperclip, FiTrash2, FiUnderline } from "react-icons/fi";

import { AdminSettingsLayout } from "@/components/admin/admin-settings-layout";

export function AdminSettingsTermsPage() {
  return (
    <AdminSettingsLayout
      title="Terms & Conditions"
      subtitle="Set terms & conditions of your Saas app"
      rightMeta="Last modified by Admin on Oct 24, 2023"
    >
      <article className="overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white">
        <div className="flex items-center gap-2 border-b border-[#eceef2] bg-[#fafbfc] px-3 py-2">
          <span className="inline-flex h-6 items-center rounded-md border border-[#e5e7eb] bg-white px-2 text-[11px] text-[#6b7280]">
            Paragraph
          </span>
          <button type="button" className="text-[#9ca3af]"><FiBold className="h-3.5 w-3.5" /></button>
          <button type="button" className="text-[#9ca3af]"><FiItalic className="h-3.5 w-3.5" /></button>
          <button type="button" className="text-[#9ca3af]"><FiUnderline className="h-3.5 w-3.5" /></button>
          <span className="h-4 w-px bg-[#e5e7eb]" />
          <button type="button" className="text-[#9ca3af]"><FiLink2 className="h-3.5 w-3.5" /></button>
          <button type="button" className="text-[#9ca3af]"><FiPaperclip className="h-3.5 w-3.5" /></button>
          <button type="button" className="text-[#9ca3af]"><FiList className="h-3.5 w-3.5" /></button>
        </div>
        <textarea
          placeholder="Type here..."
          className="h-[330px] w-full resize-none p-4 text-[14px] text-[#374151] outline-none placeholder:text-[#9ca3af]"
          defaultValue=""
        />
      </article>

      <div className="mt-3 flex items-center justify-end gap-2">
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

      <div className="my-6 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af]">
        <span className="h-px flex-1 bg-[#e5e7eb]" />
        <span>Display On Landing Page</span>
        <span className="h-px flex-1 bg-[#e5e7eb]" />
      </div>

      <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-5">
        <div className="mb-4 flex items-center justify-end gap-3 text-[#6b6b90]">
          <button type="button" aria-label="Edit section">✎</button>
          <button type="button" aria-label="Delete section"><FiTrash2 className="h-4 w-4 text-[#d94a62]" /></button>
        </div>

        <div className="space-y-5 text-[14px] leading-8 text-[#4b5563]">
          <section>
            <h3 className="text-[38px] font-bold leading-none text-[#20242b]">1. Introduction</h3>
            <p className="mt-2">
              Our platform unifies all customer communication channels: WhatsApp, Twilio (SMS), and Gmail into a single shared inbox. Teams can collaborate, assign conversations, and respond to customers without switching tools, making customer support faster, simpler, and more organized.
            </p>
          </section>

          <section>
            <h3 className="text-[38px] font-bold leading-none text-[#20242b]">2. Our Saas Application</h3>
            <p className="mt-2">
              Our platform unifies all customer communication channels: WhatsApp, Twilio (SMS), and Gmail into a single shared inbox. Teams can collaborate, assign conversations, and respond to customers without switching tools, making customer support faster, simpler, and more organized.
            </p>
          </section>

          <section>
            <h3 className="text-[38px] font-bold leading-none text-[#20242b]">3. Our Vision</h3>
            <p className="mt-2">
              Our platform unifies all customer communication channels: WhatsApp, Twilio (SMS), and Gmail into a single shared inbox. Teams can collaborate, assign conversations, and respond to customers without switching tools, making customer support faster, simpler, and more organized.
            </p>
          </section>
        </div>
      </article>
    </AdminSettingsLayout>
  );
}
