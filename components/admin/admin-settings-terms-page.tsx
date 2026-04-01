"use client";

import { useEffect, useState } from "react";
import { FiBold, FiLink2, FiList, FiPaperclip, FiTrash2, FiUnderline } from "react-icons/fi";

import { AdminSettingsLayout } from "@/components/admin/admin-settings-layout";
import {
  fetchAdminTermsSettings,
  updateAdminTermsSettings,
  type AdminPolicySection,
} from "@/lib/api/admin-settings-api";

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

export function AdminSettingsTermsPage() {
  const [editorContent, setEditorContent] = useState("");
  const [displaySections, setDisplaySections] = useState<AdminPolicySection[]>([]);
  const [title, setTitle] = useState("Terms & Conditions");
  const [initialEditorContent, setInitialEditorContent] = useState("");
  const [initialSections, setInitialSections] = useState<AdminPolicySection[]>([]);
  const [lastModifiedAt, setLastModifiedAt] = useState("");
  const [updatedBy, setUpdatedBy] = useState("Admin");
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
        const response = await fetchAdminTermsSettings();
        if (cancelled) return;

        setTitle(response.page.title);
        setEditorContent(response.page.editor_content);
        setDisplaySections(response.page.display_sections);
        setInitialEditorContent(response.page.editor_content);
        setInitialSections(response.page.display_sections);
        setLastModifiedAt(response.last_modified_at);
        setUpdatedBy(response.updated_by);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load terms settings.");
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

  const onSave = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await updateAdminTermsSettings({
        page: {
          title,
          editor_content: editorContent,
          display_sections: displaySections,
        },
      });
      setTitle(response.page.title);
      setEditorContent(response.page.editor_content);
      setDisplaySections(response.page.display_sections);
      setInitialEditorContent(response.page.editor_content);
      setInitialSections(response.page.display_sections);
      setLastModifiedAt(response.last_modified_at);
      setUpdatedBy(response.updated_by);
      setMessage("Terms saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save terms settings.");
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    setEditorContent(initialEditorContent);
    setDisplaySections(initialSections);
    setMessage(null);
    setError(null);
  };

  const dirty = editorContent !== initialEditorContent || JSON.stringify(displaySections) !== JSON.stringify(initialSections);

  return (
    <AdminSettingsLayout
      title={title}
      subtitle="Set terms & conditions of your SaaS app"
      rightMeta={lastModifiedAt ? formatLastModified(lastModifiedAt, updatedBy) : undefined}
    >
      <article className="overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white">
        <div className="flex items-center gap-2 border-b border-[#eceef2] bg-[#fafbfc] px-3 py-2">
          <span className="inline-flex h-6 items-center rounded-md border border-[#e5e7eb] bg-white px-2 text-[11px] text-[#6b7280]">
            Paragraph
          </span>
          <button type="button" className="text-[#9ca3af]"><FiBold className="h-3.5 w-3.5" /></button>
          <button type="button" className="text-[#9ca3af]"><FiUnderline className="h-3.5 w-3.5" /></button>
          <span className="h-4 w-px bg-[#e5e7eb]" />
          <button type="button" className="text-[#9ca3af]"><FiLink2 className="h-3.5 w-3.5" /></button>
          <button type="button" className="text-[#9ca3af]"><FiPaperclip className="h-3.5 w-3.5" /></button>
          <button type="button" className="text-[#9ca3af]"><FiList className="h-3.5 w-3.5" /></button>
        </div>
        <textarea
          placeholder="Type here..."
          className="h-[330px] w-full resize-none p-4 text-[14px] text-[#374151] outline-none placeholder:text-[#9ca3af]"
          value={editorContent}
          onChange={(event) => setEditorContent(event.target.value)}
          disabled={loading}
        />
      </article>

      <div className="mt-3 flex items-center justify-end gap-2">
        {loading ? <p className="mr-auto text-[14px] text-[#6b7280]">Loading terms settings...</p> : null}
        {error ? <p className="mr-auto rounded-lg bg-[#fff1f2] px-3 py-2 text-[14px] text-[#b91c1c]">{error}</p> : null}
        {message ? <p className="mr-auto rounded-lg bg-[#ecfdf5] px-3 py-2 text-[14px] text-[#047857]">{message}</p> : null}
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
          disabled={loading || saving || !dirty}
          className="inline-flex h-9 items-center rounded-lg bg-[#20242b] px-4 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="my-6 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af]">
        <span className="h-px flex-1 bg-[#e5e7eb]" />
        <span>Display On Landing Page</span>
        <span className="h-px flex-1 bg-[#e5e7eb]" />
      </div>

      <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-5">
        <div className="mb-4 flex items-center justify-end gap-3 text-[#6b6b90]">
          <button type="button" aria-label="Edit section">
            ✎
          </button>
          <button type="button" aria-label="Delete section">
            <FiTrash2 className="h-4 w-4 text-[#d94a62]" />
          </button>
        </div>

        <div className="space-y-5 text-[14px] leading-8 text-[#4b5563]">
          {displaySections.map((section) => (
            <section key={section.heading}>
              <h3 className="text-[38px] font-bold leading-none text-[#20242b]">{section.heading}</h3>
              <p className="mt-2">{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </AdminSettingsLayout>
  );
}
