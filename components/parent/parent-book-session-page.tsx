"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiCheck, FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { ParentShell } from "@/components/parent/parent-shell";
import type { ParentTutorCard } from "@/lib/parent/find-tutors-data";
import { PARENT_FIND_TUTORS_ROUTE } from "@/lib/routes";

export type ParentBookingStep = "student" | "session" | "schedule" | "confirm";

const students = [
  { key: "jordan", initials: "JW", name: "Jordan Wilson", grade: "11th Grade" },
  { key: "maya", initials: "MW", name: "Maya Wilson", grade: "8th Grade" },
];

const dates = [
  { value: "1" },
  { value: "2" },
  { value: "3" },
  { value: "4" },
  { value: "5" },
  { value: "6" },
  { value: "7" },
  { value: "8" },
  { value: "9" },
  { value: "10" },
  { value: "11" },
  { value: "12" },
  { value: "13" },
  { value: "14" },
];

const scheduleDates = [
  "Sun, Mar 1",
  "Mon, Mar 2",
  "Tue, Mar 3",
  "Wed, Mar 4",
  "Thu, Mar 5",
  "Fri, Mar 6",
  "Sat, Mar 7",
];

const availableTimes = ["3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"];

const stepMeta: {
  key: ParentBookingStep;
  number: number;
  label: string;
}[] = [
  { key: "student", number: 1, label: "Student" },
  { key: "session", number: 2, label: "Session" },
  { key: "schedule", number: 3, label: "Schedule" },
  { key: "confirm", number: 4, label: "Confirm" },
];

function getStepHref(tutorId: string, step: ParentBookingStep) {
  return `${PARENT_FIND_TUTORS_ROUTE}/${tutorId}/book-session/${step}`;
}

function getNextStep(step: ParentBookingStep): ParentBookingStep | null {
  switch (step) {
    case "student":
      return "session";
    case "session":
      return "schedule";
    case "schedule":
      return "confirm";
    default:
      return null;
  }
}

function getPreviousStep(step: ParentBookingStep): ParentBookingStep | null {
  switch (step) {
    case "session":
      return "student";
    case "schedule":
      return "session";
    case "confirm":
      return "schedule";
    default:
      return null;
  }
}

function formatMonthLabel(dateValue: string) {
  const [, month] = dateValue.split(", ");
  return month ? month.replace(/\s+\d+$/, "") + " 2026" : "March 2026";
}

export function ParentBookSessionPage({
  tutor,
  step,
}: {
  tutor: ParentTutorCard;
  step: ParentBookingStep;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const subjectOptions = tutor.subjects.filter(
    (subject) => !["Math", "Science", "English", "History"].includes(subject),
  );
  const selectedStudent = searchParams.get("student") ?? "jordan";
  const selectedSubject = searchParams.get("subject") ?? subjectOptions[0] ?? tutor.subjects[0];
  const selectedSessionType =
    searchParams.get("type") ?? (tutor.sessionTypes.includes("Virtual") ? "Virtual" : tutor.sessionTypes[0]);
  const selectedDuration = searchParams.get("duration") ?? "60";
  const selectedDate = searchParams.get("date") ?? "Mon, Mar 2";
  const selectedTime = searchParams.get("time") ?? "4:00 PM";
  const notes = searchParams.get("notes") ?? "";
  const confirmed = searchParams.get("confirmed") === "1";
  const selectedStudentData =
    students.find((student) => student.key === selectedStudent) ?? students[0];
  const totalDue =
    selectedSessionType === "In-Person"
      ? selectedDuration === "45"
        ? tutor.inPerson45
        : tutor.inPerson60
      : selectedDuration === "45"
        ? tutor.price45
        : tutor.price60;
  const nextStep = getNextStep(step);
  const previousStep = getPreviousStep(step);

  function withParams(
    targetStep: ParentBookingStep,
    updates?: Record<string, string | null>,
  ) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates ?? {}).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const query = params.toString();
    return `${getStepHref(tutor.id, targetStep)}${query ? `?${query}` : ""}`;
  }

  function updateCurrentStep(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }

  function handleConfirmBooking() {
    setShowConfirmModal(true);
  }

  function handleApproveBooking() {
    setShowConfirmModal(false);
    updateCurrentStep({ confirmed: "1" });
  }

  return (
    <ParentShell>
      <div className="w-full">
        {showConfirmModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 px-4">
            <div className="w-full max-w-[440px] rounded-[20px] bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.25)]">
              <h2 className="text-[22px] font-bold text-[#20242b]">Confirm Booking</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#4b5563]">
                Confirm booking for {selectedStudentData.name} with {tutor.name} on {selectedDate} at{" "}
                {selectedTime}?
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="inline-flex h-11 items-center rounded-full border border-[#d61c3f] px-5 text-[14px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApproveBooking}
                  className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex items-center gap-4 border-b border-[#eceef2] bg-white px-4 py-4 sm:px-5 lg:px-6">
          <Link
            href={
              previousStep
                ? withParams(previousStep)
                : `${PARENT_FIND_TUTORS_ROUTE}/${tutor.id}`
            }
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#6b7280]"
          >
            <FiChevronLeft className="h-4 w-4" />
            Back
          </Link>
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Book a Session</h1>
        </div>

        <div className="grid bg-white lg:grid-cols-[minmax(0,1fr)_260px]">
          <section className="border-r border-[#eceef2] px-4 py-5 sm:px-5 lg:px-6">
            <div className="flex flex-wrap items-center gap-4">
              {stepMeta.map((item, index) => {
                const currentIndex = stepMeta.findIndex((meta) => meta.key === step);
                const stepIndex = stepMeta.findIndex((meta) => meta.key === item.key);
                const active = step === item.key;
                const completed = stepIndex < currentIndex;

                return (
                  <div key={item.key} className="flex items-center gap-4">
                    <Link href={withParams(item.key)} className="flex items-center gap-3">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-bold ${
                          active || completed
                            ? "bg-[#d61c3f] text-white"
                            : "bg-[#e9ecef] text-[#6b7280]"
                        }`}
                      >
                        {item.number}
                      </span>
                      <span
                        className={`text-[14px] font-semibold ${
                          active || completed ? "text-[#d61c3f]" : "text-[#6b7280]"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>

                    {index < stepMeta.length - 1 ? (
                      <div className={`h-px w-12 ${index < currentIndex ? "bg-[#d61c3f]" : "bg-[#d1d5db]"}`} />
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              {step === "student" ? (
                <section className="rounded-[16px] bg-[#f9fafb] p-4">
                  <h2 className="text-[17px] font-bold text-[#20242b]">Step 1 — Select Student</h2>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {students.map((student) => {
                      const selected = student.key === selectedStudent;

                      return (
                        <button
                          key={student.key}
                          type="button"
                          onClick={() => updateCurrentStep({ student: student.key })}
                          className={`flex items-center justify-between rounded-[12px] border px-4 py-4 text-left transition ${
                            selected ? "border-[#ef6b7a] bg-[#fff0f3]" : "border-[#e5e7eb] bg-white"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe7eb] text-[16px] font-bold text-[#d94a62]">
                              {student.initials}
                            </span>
                            <span>
                              <span className="block text-[16px] font-semibold text-[#20242b]">{student.name}</span>
                              <span className="block text-[13px] text-[#6b7280]">{student.grade}</span>
                            </span>
                          </span>
                          {selected ? <FiCheck className="h-5 w-5 text-[#d61c3f]" /> : null}
                        </button>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {step === "session" ? (
                <section className="rounded-[16px] bg-[#f9fafb] p-4">
                  <h2 className="text-[17px] font-bold text-[#20242b]">Step 2 — Session Details</h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[14px] font-medium text-[#4b5563]">Subject</label>
                      <select
                        value={selectedSubject}
                        onChange={(event) => updateCurrentStep({ subject: event.target.value })}
                        className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-white px-4 text-[14px] text-[#4b5563] outline-none"
                      >
                        {subjectOptions.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-[14px] font-medium text-[#4b5563]">Session Type</label>
                      <select
                        value={selectedSessionType}
                        onChange={(event) => updateCurrentStep({ type: event.target.value })}
                        className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-white px-4 text-[14px] text-[#4b5563] outline-none"
                      >
                        {tutor.sessionTypes.map((sessionType) => (
                          <option key={sessionType} value={sessionType}>
                            {sessionType}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-[14px] font-medium text-[#4b5563]">Duration</label>
                      <select
                        value={selectedDuration}
                        onChange={(event) => updateCurrentStep({ duration: event.target.value })}
                        className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-white px-4 text-[14px] text-[#4b5563] outline-none"
                      >
                        <option value="45">45 minutes</option>
                        <option value="60">60 minutes</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-[14px] font-medium text-[#4b5563]">Notes for Tutor (optional)</label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(event) => updateCurrentStep({ notes: event.target.value })}
                        placeholder="e.g. Focus on polynomial factoring"
                        className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-white px-4 text-[14px] text-[#4b5563] outline-none placeholder:text-[#9ca3af]"
                      />
                    </div>
                  </div>
                </section>
              ) : null}

              {step === "schedule" ? (
                <section className="rounded-[16px] bg-[#f9fafb] p-4">
                  <h2 className="text-[17px] font-bold text-[#20242b]">Step 3 — Choose a Date & Time</h2>
                  <div className="mt-4 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                    <div>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-white"
                        >
                          <FiChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-[18px] font-bold text-[#374151]">
                          {formatMonthLabel(selectedDate)}
                        </span>
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-white"
                        >
                          <FiChevronRight className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[12px] font-medium text-[#6b7280]">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                          <span key={day}>{day}</span>
                        ))}
                        {dates.map((date, index) => {
                          const dateValue = scheduleDates[index] ?? selectedDate;
                          const selected = selectedDate === dateValue;

                          return (
                            <button
                              key={`${date.value}-${index}`}
                              type="button"
                              onClick={() => updateCurrentStep({ date: dateValue })}
                              className={`flex h-8 items-center justify-center rounded-lg text-[13px] ${
                                selected
                                  ? "bg-[#ffecef] font-semibold text-[#d61c3f]"
                                  : "text-[#9ca3af] hover:bg-white"
                              }`}
                            >
                              {date.value}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-[16px] font-semibold text-[#374151]">
                        Available Times — {selectedDate}
                      </p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {availableTimes.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => updateCurrentStep({ time })}
                            className={`inline-flex h-10 items-center justify-center rounded-lg border text-[14px] font-semibold transition ${
                              selectedTime === time
                                ? "border-[#d61c3f] bg-[#d61c3f] text-white"
                                : "border-[#e5e7eb] bg-white text-[#6b7280] hover:border-[#d1d5db]"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              ) : null}

              {step === "confirm" ? (
                <section className="rounded-[16px] bg-[#f9fafb] p-4">
                  <h2 className="text-[17px] font-bold text-[#20242b]">Step 4 — Confirm Booking</h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-[12px] border border-[#e5e7eb] bg-white p-4">
                      <p className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">Student</p>
                      <p className="mt-2 text-[16px] font-semibold text-[#20242b]">{selectedStudentData.name}</p>
                      <p className="text-[13px] text-[#6b7280]">{selectedStudentData.grade}</p>
                    </div>
                    <div className="rounded-[12px] border border-[#e5e7eb] bg-white p-4">
                      <p className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">Tutor</p>
                      <p className="mt-2 text-[16px] font-semibold text-[#20242b]">{tutor.name}</p>
                      <p className="text-[13px] text-[#6b7280]">{tutor.title}</p>
                    </div>
                    <div className="rounded-[12px] border border-[#e5e7eb] bg-white p-4">
                      <p className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">Session</p>
                      <p className="mt-2 text-[16px] font-semibold text-[#20242b]">{selectedSubject}</p>
                      <p className="text-[13px] text-[#6b7280]">
                        {selectedSessionType} · {selectedDuration} minutes
                      </p>
                    </div>
                    <div className="rounded-[12px] border border-[#e5e7eb] bg-white p-4">
                      <p className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">Schedule</p>
                      <p className="mt-2 text-[16px] font-semibold text-[#20242b]">{selectedDate}</p>
                      <p className="text-[13px] text-[#6b7280]">{selectedTime}</p>
                    </div>
                  </div>

                  {notes ? (
                    <div className="mt-4 rounded-[12px] border border-[#e5e7eb] bg-white p-4">
                      <p className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">Notes for Tutor</p>
                      <p className="mt-2 text-[14px] text-[#4b5563]">{notes}</p>
                    </div>
                  ) : null}

                  {confirmed ? (
                    <div className="mt-4 rounded-[12px] border border-[#cde8da] bg-[#edf8f1] px-4 py-3 text-[14px] font-medium text-[#2e8b61]">
                      Booking confirmed for {selectedStudentData.name}.
                    </div>
                  ) : null}
                </section>
              ) : null}
            </div>

            <div className="mt-4 flex items-center justify-between">
              {previousStep ? (
                <Link
                  href={withParams(previousStep)}
                  className="inline-flex h-11 items-center rounded-full border border-[#d61c3f] px-6 text-[15px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
                >
                  Back
                </Link>
              ) : (
                <span />
              )}

              {nextStep ? (
                <Link
                  href={withParams(nextStep)}
                  className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-6 text-[15px] font-semibold text-white transition hover:bg-[#be1837]"
                >
                  Continue to {stepMeta.find((item) => item.key === nextStep)?.label} →
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className={`inline-flex h-11 items-center rounded-full px-6 text-[15px] font-semibold text-white transition ${
                    confirmed ? "bg-[#2e8b61]" : "bg-[#d61c3f] hover:bg-[#be1837]"
                  }`}
                >
                  {confirmed ? "Confirmed" : "Confirm Booking"}
                </button>
              )}
            </div>
          </section>

          <aside className="px-4 py-5 sm:px-5 lg:px-5">
            <h2 className="text-[20px] font-bold text-[#20242b]">Order Summary</h2>

            <div className="mt-5 flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe7eb] text-[18px] font-bold text-[#d94a62]">
                {tutor.initials}
              </span>
              <div>
                <p className="text-[16px] font-semibold text-[#20242b]">{tutor.name}</p>
                <p className="text-[13px] text-[#6b7280]">{tutor.title}</p>
              </div>
            </div>

            <div className="mt-4 border-t border-[#eceef2] pt-4 text-[14px] text-[#4b5563]">
              <div className="flex items-center justify-between py-1"><span>Student</span><span className="font-medium text-[#20242b]">{selectedStudentData.name}</span></div>
              <div className="flex items-center justify-between py-1"><span>Subject</span><span className="font-medium text-[#20242b]">{selectedSubject}</span></div>
              <div className="flex items-center justify-between py-1"><span>Date</span><span className="font-medium text-[#20242b]">{selectedDate}</span></div>
              <div className="flex items-center justify-between py-1"><span>Time</span><span className="font-medium text-[#20242b]">{selectedTime}</span></div>
              <div className="flex items-center justify-between py-1"><span>Duration</span><span className="font-medium text-[#20242b]">{selectedDuration} minutes</span></div>
              <div className="flex items-center justify-between py-1"><span>Type</span><span className="font-medium text-[#20242b]">{selectedSessionType}</span></div>
            </div>

            <div className="mt-4 border-t border-[#eceef2] pt-4">
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-bold text-[#374151]">Total Due</span>
                <span className="text-[18px] font-bold text-[#d61c3f]">${totalDue}</span>
              </div>
              <p className="mt-2 text-[13px] text-[#6b7280]">Paid directly to tutor after session</p>
            </div>
          </aside>
        </div>
      </div>
    </ParentShell>
  );
}
