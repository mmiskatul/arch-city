"use client";

import { useEffect, useState } from "react";

import { ParentShell } from "@/components/parent/parent-shell";
import { useDashboardAuth } from "@/components/auth/dashboard-auth-context";
import { NOTIFICATIONS_UPDATED_EVENT } from "@/lib/notifications-store";
import {
  getParentStudents,
  inviteParentStudent,
  searchParentStudents,
  type ParentStudentListItem,
  type ParentStudentSearchItem,
} from "@/lib/api/parent-students-api";
import { getAdminPreviewParentStudents } from "@/lib/admin-preview-data";

function normalizeStudentDisplayName(value: string) {
  return String(value || "")
    .replace(/\s+update'?s?\s*$/i, "")
    .trim();
}

function InviteStudentModal({
  open,
  searchValue,
  onSearchValueChange,
  inviteMessage,
  onInviteMessageChange,
  results,
  searching,
  actionError,
  invitingEmail,
  onClose,
  onInvite,
}: {
  open: boolean;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  inviteMessage: string;
  onInviteMessageChange: (value: string) => void;
  results: ParentStudentSearchItem[];
  searching: boolean;
  actionError: string;
  invitingEmail: string;
  onClose: () => void;
  onInvite: (email: string) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 px-4">
      <div className="w-full max-w-[980px] rounded-[20px] bg-white p-5 shadow-[0_22px_70px_rgba(15,23,42,0.28)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-bold text-[#20242b]">Invite a Student</h2>
            <p className="mt-1 text-[14px] text-[#6b7280]">
              Search by student username or email, then send an invitation from the parent dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center rounded-full border border-[#d1d5db] px-4 text-[14px] font-semibold text-[#4b5563] transition hover:bg-[#f9fafb]"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.45fr_0.95fr]">
          <div className="rounded-[16px] border border-[#e5e7eb] bg-[#fcfcfd] p-4">
            <label className="mb-2 block text-[13px] font-semibold text-[#374151]">Search student</label>
            <input
              type="text"
              value={searchValue}
              onChange={(event) => onSearchValueChange(event.target.value)}
              placeholder="Search by username or email"
              className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-white px-4 text-[14px] outline-none placeholder:text-[#9ca3af]"
            />

            <div className="mt-4 overflow-hidden rounded-[14px] border border-[#eceef2] bg-white">
              <div className="hidden grid-cols-[1.6fr_0.9fr_1fr_0.9fr] gap-3 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280] md:grid">
                <span>Student</span>
                <span>Grade</span>
                <span>School</span>
                <span>Action</span>
              </div>

              <div className="divide-y divide-[#eceef2]">
                {searching ? (
                  <div className="px-4 py-5 text-[14px] text-[#6b7280]">Searching students...</div>
                ) : results.length > 0 ? (
                  results.map((student) => {
                    const disabled = student.already_linked || student.has_pending_invite || invitingEmail === student.email;
                    let label = "Invite";
                    if (invitingEmail === student.email) label = "Sending...";
                    if (student.already_linked) label = "Added";
                    if (student.has_pending_invite) label = "Pending";

                    return (
                      <div
                        key={student.email}
                        className="grid gap-3 px-4 py-3 md:grid-cols-[1.6fr_0.9fr_1fr_0.9fr] md:items-center"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe7eb] text-[14px] font-bold text-[#d94a62]">
                            {student.initials}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-semibold text-[#20242b]">{student.name}</p>
                            <p className="truncate text-[12px] text-[#6b7280]">{student.email}</p>
                          </div>
                        </div>
                        <div className="text-[14px] text-[#4b5563]">{student.grade}</div>
                        <div className="text-[14px] text-[#4b5563]">{student.school}</div>
                        <div>
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => onInvite(student.email)}
                            className={`inline-flex h-9 items-center rounded-full px-4 text-[13px] font-semibold transition ${
                              disabled
                                ? "cursor-not-allowed bg-[#f3f4f6] text-[#9ca3af]"
                                : "bg-[#d61c3f] text-white hover:bg-[#be1837]"
                            }`}
                          >
                            {label}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-5 text-[14px] text-[#6b7280]">
                    {searchValue.trim().length < 2
                      ? "Type at least 2 characters to search students."
                      : "No matching students found."}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[16px] border border-[#e5e7eb] bg-[#fff8f9] p-4">
            <label className="mb-2 block text-[13px] font-semibold text-[#374151]">Parent message</label>
            <textarea
              value={inviteMessage}
              onChange={(event) => onInviteMessageChange(event.target.value)}
              placeholder="Hi, I'd like to connect your student account to my parent dashboard."
              className="min-h-[220px] w-full rounded-xl border border-[#f1d7db] bg-white px-4 py-3 text-[14px] leading-6 outline-none placeholder:text-[#9ca3af]"
            />
            <p className="mt-3 text-[12px] leading-5 text-[#6b7280]">
              The student will see this message inside their notifications page and can accept or decline it.
            </p>
            {actionError ? (
              <div className="mt-4 rounded-xl border border-[#f1c2c7] bg-[#fff4f6] px-4 py-3 text-[13px] text-[#b91c1c]">
                {actionError}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentsTableSkeleton() {
  return (
    <div className="divide-y divide-[#eceef2]">
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <div
          key={`parent-students-skeleton-${rowIndex}`}
          className="grid gap-4 px-4 py-3.5 md:grid-cols-[1.7fr_0.9fr_1.1fr_0.95fr_1.1fr_0.7fr] md:items-center"
        >
          <div className="contents animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#eef1f4]" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-36 rounded bg-[#eef1f4]" />
                <div className="h-3 w-44 rounded bg-[#eef1f4]" />
              </div>
            </div>
            <div className="h-4 w-16 rounded bg-[#eef1f4]" />
            <div className="h-4 w-28 rounded bg-[#eef1f4]" />
            <div className="h-6 w-[76px] rounded-full bg-[#eef1f4]" />
            <div className="flex items-center gap-2">
              <div className="h-3 w-7 rounded bg-[#eef1f4]" />
              <div className="h-4 w-24 rounded bg-[#eef1f4]" />
            </div>
            <div className="h-4 w-10 rounded bg-[#eef1f4]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ParentStudentsPage() {
  const { isPreviewSession, previewTargetId } = useDashboardAuth();
  const resolvedPreviewTargetId = previewTargetId ?? undefined;
  const [students, setStudents] = useState<ParentStudentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [inviteMessage, setInviteMessage] = useState(
    "Hi, I'd like to add you to my parent dashboard so I can manage your tutoring schedule and progress.",
  );
  const [searchResults, setSearchResults] = useState<ParentStudentSearchItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [actionError, setActionError] = useState("");
  const [invitingEmail, setInvitingEmail] = useState("");

  function normalizeStudents(items: ParentStudentListItem[]) {
    return items.map((student) => ({
      ...student,
      name: normalizeStudentDisplayName(student.name),
    }));
  }

  function normalizeSearchResults(items: ParentStudentSearchItem[]) {
    return items.map((student) => ({
      ...student,
      name: normalizeStudentDisplayName(student.name),
    }));
  }

  useEffect(() => {
    async function loadStudents() {
      if (isPreviewSession) {
        setStudents(normalizeStudents(getAdminPreviewParentStudents(resolvedPreviewTargetId)));
        setLoadError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError("");
      try {
        const response = await getParentStudents();
        setStudents(normalizeStudents(response.items || []));
      } catch (error) {
        setStudents([]);
        setLoadError(error instanceof Error ? error.message : "Unable to load students.");
      } finally {
        setLoading(false);
      }
    }

    void loadStudents();
    const refresh = () => void loadStudents();
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
  }, [isPreviewSession, resolvedPreviewTargetId]);

  useEffect(() => {
    if (!showModal) return;
    if (searchValue.trim().length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setSearching(true);
      try {
        const response = await searchParentStudents(searchValue.trim());
        setSearchResults(normalizeSearchResults(response.items || []));
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchValue, showModal]);

  function closeModal() {
    setShowModal(false);
    setSearchValue("");
    setSearchResults([]);
    setActionError("");
    setInvitingEmail("");
  }

  async function handleInvite(studentEmail: string) {
    setInvitingEmail(studentEmail);
    setActionError("");
    try {
      await inviteParentStudent({
        student_email: studentEmail,
        message: inviteMessage.trim(),
      });
      window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
      const refreshed = await getParentStudents();
      setStudents(normalizeStudents(refreshed.items || []));
      setSearchResults((current) =>
        current.map((item) => (item.email === studentEmail ? { ...item, has_pending_invite: true } : item)),
      );
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to send invitation.");
    } finally {
      setInvitingEmail("");
    }
  }

  return (
    <ParentShell>
      <InviteStudentModal
        open={showModal}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        inviteMessage={inviteMessage}
        onInviteMessageChange={setInviteMessage}
        results={searchResults}
        searching={searching}
        actionError={actionError}
        invitingEmail={invitingEmail}
        onClose={closeModal}
        onInvite={(email) => void handleInvite(email)}
      />

      <div className="w-full">
        <div className="flex items-center justify-between gap-4 border-b border-[#eceef2] bg-white px-4 py-4 sm:px-5 lg:px-6">
          <div>
            <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Students</h1>
            <p className="mt-1 text-[13px] text-[#6b7280]">
              Manage linked students and send invitations from the parent dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex h-10 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
          >
            + Add Student
          </button>
        </div>

        <div className="bg-white px-4 py-5 sm:px-5 lg:px-6">
          {loadError ? (
            <div className="mb-4 rounded-xl border border-[#f1c2c7] bg-[#fff4f6] px-4 py-3 text-[13px] text-[#b91c1c]">
              {loadError}
            </div>
          ) : null}

          <section className="overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="hidden grid-cols-[1.7fr_0.9fr_1.1fr_0.95fr_1.1fr_0.7fr] gap-4 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280] md:grid">
              <span>Name</span>
              <span>Grade</span>
              <span>School</span>
              <span>Status</span>
              <span>Active Tutor</span>
              <span>Sessions</span>
            </div>

            <div className="divide-y divide-[#eceef2]">
              {loading ? (
                <StudentsTableSkeleton />
              ) : students.length > 0 ? (
                students.map((student) => (
                  <div
                    key={student.id}
                    className="grid gap-4 px-4 py-3.5 md:grid-cols-[1.7fr_0.9fr_1.1fr_0.95fr_1.1fr_0.7fr] md:items-center"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffe7eb] text-[14px] font-bold text-[#d94a62]">
                        {student.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-semibold leading-5 text-[#20242b]">{student.name}</p>
                        <p className="truncate text-[12px] leading-5 text-[#6b7280]">
                          {student.email} | {student.added_label}
                        </p>
                      </div>
                    </div>

                    <div className="text-[15px] text-[#4b5563]">{student.grade}</div>
                    <div className="text-[15px] text-[#4b5563]">{student.school}</div>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          student.status === "active"
                            ? "bg-[#ebf7ef] text-[#239157]"
                            : "bg-[#fff1f4] text-[#d61c3f]"
                        }`}
                      >
                        {student.status === "active" ? "Linked" : "Pending"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[15px] text-[#4b5563]">
                      <span className="text-[10px] font-bold text-[#d94a62]">{student.active_tutor_initials}</span>
                      <span>{student.active_tutor_name}</span>
                    </div>

                    <div className="text-[15px] font-semibold text-[#4b5563]">{student.sessions_total}</div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-5 text-[14px] text-[#6b7280]">
                  No students linked yet. Use the add student button to send an invitation.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </ParentShell>
  );
}
