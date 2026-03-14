"use client";

import Link from "next/link";
import { FiPaperclip } from "react-icons/fi";
import { useState } from "react";

import {
  type ApplicationDetail,
  type ApplicationSectionField,
  type ApplicationStatus,
} from "@/lib/admin/types";
import { AdminShell } from "@/components/admin/admin-shell";

function FieldView({ field }: { field: ApplicationSectionField }) {
  if (field.type === "boolean") {
    return (
      <div>
        <p className="text-[15px] font-medium text-[#4b5563]">{field.label}</p>
        <div className="mt-3 flex items-center gap-5 text-[15px] text-[#374151]">
          <label className="inline-flex items-center gap-2">
            <input type="radio" checked={field.value === true} readOnly className="h-4 w-4 accent-[#ef242a]" />
            <span>Yes</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" checked={field.value === false} readOnly className="h-4 w-4 accent-[#ef242a]" />
            <span>No</span>
          </label>
        </div>
      </div>
    );
  }

  if (field.type === "attachment") {
    return (
      <div>
        <p className="text-[15px] font-medium text-[#4b5563]">{field.label}</p>
        <button
          type="button"
          className="mt-3 inline-flex items-center gap-2 text-[15px] font-medium text-[#ef242a]"
        >
          <FiPaperclip className="h-4 w-4" />
          <span>{field.value}</span>
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[15px] font-medium text-[#4b5563]">{field.label}</p>
      <div className="mt-3 rounded-[16px] border border-[#e9ebef] bg-white px-5 py-4 text-[15px] text-[#111827]">
        {field.value}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  fields,
}: {
  title: string;
  fields: ApplicationDetail["sections"][number]["fields"];
}) {
  return (
    <section className="rounded-[28px] border border-[#ececec] bg-white p-7 shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
      <h2 className="text-[22px] font-semibold text-[#111827]">{title}</h2>
      <div className="my-6 h-px bg-[#ececec]" />
      <div className="space-y-6">
        {fields.map((field) => (
          <FieldView key={field.label} field={field} />
        ))}
      </div>
    </section>
  );
}

export function AdminApplicationDetailPage({ application }: { application: ApplicationDetail | null }) {
  const [currentApplication, setCurrentApplication] = useState<ApplicationDetail | null>(application);
  const [operating, setOperating] = useState(false);

  if (!currentApplication) {
    return (
      <AdminShell breadcrumbLabel="Admin Dashboard">
        <div className="mt-12">
          <h1 className="text-[28px] font-bold text-[#111827]">Application not found</h1>
          <p className="mt-2 text-lg text-[#6b7280]">
            The requested application could not be found.
          </p>
          <Link
            href="/admin-dashboard/applications"
            className="mt-6 inline-flex rounded-xl bg-[#ef242a] px-5 py-3 text-sm font-semibold text-white"
          >
            Back to applications
          </Link>
        </div>
      </AdminShell>
    );
  }

  const sections = currentApplication.sections;
  const leftSections = sections.filter((_, index) => index % 2 === 0);
  const rightSections = sections.filter((_, index) => index % 2 === 1);

  async function handleAction(status: ApplicationStatus) {
    setOperating(true);
    try {
      await fetch("/api/admin/applications/operate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentApplication.id, status }),
      });
      setCurrentApplication({ ...currentApplication, status });
    } finally {
      setOperating(false);
    }
  }

  return (
    <AdminShell breadcrumbLabel="Admin Dashboard">
      <div className="mt-12 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#111827]">{currentApplication.heading}</h1>
          <p className="mt-2 text-lg text-[#6b7280]">View your submitted information:</p>
        </div>
        {currentApplication.status === "pending" ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl bg-[#16a34a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#15803d]"
              onClick={() => handleAction("approved")}
              disabled={operating}
            >
              Approve
            </button>
            <button
              type="button"
              className="rounded-xl bg-[#dc2626] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b91c1c]"
              onClick={() => handleAction("rejected")}
              disabled={operating}
            >
              Reject
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-2">
        <div className="space-y-4">
          {leftSections.map((section) => (
            <SectionCard key={section.title} title={section.title} fields={section.fields} />
          ))}
        </div>
        <div className="space-y-4">
          {rightSections.map((section) => (
            <SectionCard key={section.title} title={section.title} fields={section.fields} />
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
