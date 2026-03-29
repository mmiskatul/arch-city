"use client";

import Link from "next/link";
import { useState } from "react";

import { ParentShell } from "@/components/parent/parent-shell";
import { parentStudentsData, type ParentStudentRecord } from "@/lib/parent/students-data";

type StudentFormState = {
  firstName: string;
  lastName: string;
  grade: string;
  school: string;
  focusNotes: string;
};

const emptyForm: StudentFormState = {
  firstName: "",
  lastName: "",
  grade: "",
  school: "",
  focusNotes: "",
};

function toInitials(firstName: string, lastName: string) {
  return `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase();
}

export function ParentStudentsPage() {
  const [students, setStudents] = useState<ParentStudentRecord[]>(parentStudentsData);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<StudentFormState>(emptyForm);

  function closeModal() {
    setShowModal(false);
    setForm(emptyForm);
  }

  function handleAddStudent() {
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const grade = form.grade.trim();
    const school = form.school.trim();
    const focus = form.focusNotes.trim();

    if (!firstName || !lastName || !grade || !school) {
      return;
    }

    const newStudent: ParentStudentRecord = {
      id: `stu${students.length + 1}`,
      initials: toInitials(firstName, lastName),
      name: `${firstName} ${lastName}`,
      addedLabel: "Added just now",
      grade,
      school,
      focusAreas: focus ? [focus] : ["General Support"],
      activeTutorInitials: "--",
      activeTutorName: "Not assigned",
      sessionsTotal: 0,
    };

    setStudents((current) => [newStudent, ...current]);
    closeModal();
  }

  return (
    <ParentShell>
      <div className="w-full">
        {showModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 px-4">
            <div className="w-full max-w-[760px] rounded-[18px] bg-white p-5 shadow-[0_22px_70px_rgba(15,23,42,0.28)]">
              <h2 className="text-[18px] font-bold text-[#20242b]">Add a Student</h2>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#374151]">First Name</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
                    placeholder="First name"
                    className="h-11 w-full rounded-xl border border-[#e5e7eb] px-4 text-[14px] outline-none placeholder:text-[#9ca3af]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#374151]">Last Name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
                    placeholder="Last name"
                    className="h-11 w-full rounded-xl border border-[#e5e7eb] px-4 text-[14px] outline-none placeholder:text-[#9ca3af]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#374151]">Grade</label>
                  <input
                    type="text"
                    value={form.grade}
                    onChange={(event) => setForm((current) => ({ ...current, grade: event.target.value }))}
                    placeholder="Grade"
                    className="h-11 w-full rounded-xl border border-[#e5e7eb] px-4 text-[14px] outline-none placeholder:text-[#9ca3af]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#374151]">School Name</label>
                  <input
                    type="text"
                    value={form.school}
                    onChange={(event) => setForm((current) => ({ ...current, school: event.target.value }))}
                    placeholder="e.g. Parkway North High"
                    className="h-11 w-full rounded-xl border border-[#e5e7eb] px-4 text-[14px] outline-none placeholder:text-[#9ca3af]"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-[14px] font-medium text-[#374151]">
                  Focus Areas / Notes (optional)
                </label>
                <input
                  type="text"
                  value={form.focusNotes}
                  onChange={(event) => setForm((current) => ({ ...current, focusNotes: event.target.value }))}
                  placeholder="e.g. Needs help with algebra and test prep"
                  className="h-11 w-full rounded-xl border border-[#e5e7eb] px-4 text-[14px] outline-none placeholder:text-[#9ca3af]"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-10 items-center rounded-full border border-[#d61c3f] px-5 text-[14px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddStudent}
                  className="inline-flex h-10 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
                >
                  Add Student
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-4 border-b border-[#eceef2] bg-white px-4 py-4 sm:px-5 lg:px-6">
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Students</h1>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex h-10 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
          >
            + Add Student
          </button>
        </div>

        <div className="bg-white px-4 py-5 sm:px-5 lg:px-6">
          <section className="overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="hidden grid-cols-[1.65fr_0.9fr_1.35fr_1.65fr_1fr_0.7fr_1fr] gap-4 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280] md:grid">
              <span>Name</span>
              <span>Grade</span>
              <span>School</span>
              <span>Focus Areas</span>
              <span>Active Tutor</span>
              <span>Sessions</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-[#eceef2]">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="grid gap-4 px-4 py-3.5 md:grid-cols-[1.65fr_0.9fr_1.35fr_1.65fr_1fr_0.7fr_1fr] md:items-center"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffe7eb] text-[14px] font-bold text-[#d94a62]">
                      {student.initials}
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold leading-5 text-[#20242b]">{student.name}</p>
                      <p className="text-[12px] leading-5 text-[#6b7280]">{student.addedLabel}</p>
                    </div>
                  </div>

                  <div className="text-[15px] text-[#4b5563]">{student.grade}</div>
                  <div className="text-[15px] text-[#4b5563]">{student.school}</div>

                  <div className="flex flex-wrap gap-2">
                    {student.focusAreas.map((focus, index) => (
                      <span
                        key={focus}
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${
                          index === 0
                            ? "bg-[#ffecef] text-[#d94a62]"
                            : "bg-[#f0f1f3] text-[#6b7280]"
                        }`}
                      >
                        {focus}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-[15px] text-[#4b5563]">
                    <span className="text-[10px] font-bold text-[#d94a62]">{student.activeTutorInitials}</span>
                    <span>{student.activeTutorName}</span>
                  </div>

                  <div className="text-[15px] font-semibold text-[#4b5563]">
                    {student.sessionsTotal} <span className="text-[12px] font-medium text-[#6b7280]">total</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Link
                      href={`/parent-dashboard/students/${student.id}/schedule`}
                      className="inline-flex h-8 items-center rounded-full border border-[#d61c3f] px-4 text-[13px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
                    >
                      Schedule
                    </Link>
                    <Link
                      href={`/parent-dashboard/students/${student.id}/edit`}
                      className="inline-flex h-8 items-center rounded-full border border-[#d61c3f] px-4 text-[13px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </ParentShell>
  );
}
