"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiCheck, FiChevronLeft } from "react-icons/fi";

import { ParentShell } from "@/components/parent/parent-shell";
import type { ParentTutorCard } from "@/lib/parent/find-tutors-data";
import { getParentStudents, type ParentStudentListItem } from "@/lib/api/parent-students-api";
import { createParentSessionBooking } from "@/lib/api/parent-session-booking-api";
import { PARENT_DASHBOARD_ROUTE, PARENT_FIND_TUTORS_ROUTE } from "@/lib/routes";

export type ParentBookingStep = "student" | "session" | "schedule" | "confirm";

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

function parseAvailabilitySlot(value: string) {
  const label = String(value || "").trim();
  if (!label) {
    return { dateLabel: "Availability pending", timeLabel: "" };
  }

  const match = label.match(/^(.*?)(?=\s\d{1,2}:\d{2}\s*[AP]M\b)/i);
  if (!match) {
    return { dateLabel: label, timeLabel: "" };
  }

  const dateLabel = match[1].replace(/\s*-\s*$/, "").trim();
  const timeLabel = label.slice(match[1].length).trim().replace(/^\-\s*/, "");
  return {
    dateLabel: dateLabel || label,
    timeLabel,
  };
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
  const [students, setStudents] = useState<ParentStudentListItem[]>([]);
  const [bookingError, setBookingError] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const availabilitySlots = tutor.availability.map((slot) => {
    const parsed = parseAvailabilitySlot(slot);
    return {
      value: slot,
      dateLabel: parsed.dateLabel,
      timeLabel: parsed.timeLabel,
    };
  });

  const subjectOptions = tutor.subjects.filter(
    (subject) => !["Math", "Science", "English", "History"].includes(subject),
  );
  const defaultAvailabilitySlot = availabilitySlots[0];
  const selectedStudent = searchParams.get("student") ?? searchParams.get("bookingFor") ?? "";
  const selectedSubject = searchParams.get("subject") ?? subjectOptions[0] ?? tutor.subjects[0];
  const selectedSessionType =
    searchParams.get("type") ?? (tutor.sessionTypes.includes("Virtual") ? "Virtual" : tutor.sessionTypes[0]);
  const selectedDuration = searchParams.get("duration") ?? "60";
  const selectedDate = searchParams.get("date") ?? defaultAvailabilitySlot?.dateLabel ?? "Availability pending";
  const selectedTime = searchParams.get("time") ?? defaultAvailabilitySlot?.timeLabel ?? "";
  const notes = searchParams.get("notes") ?? "";
  const confirmed = searchParams.get("confirmed") === "1";
  const selectedStudentData = students.find((student) => student.email === selectedStudent) ?? students[0] ?? null;
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

  useEffect(() => {
    let mounted = true;

    async function loadStudents() {
      try {
        const response = await getParentStudents();
        if (!mounted) return;
        const activeStudents = (response.items || []).filter((student) => student.status === "active");
        setStudents(activeStudents);
      } catch {
        if (mounted) {
          setStudents([]);
        }
      }
    }

    void loadStudents();
    return () => {
      mounted = false;
    };
  }, []);

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

  function getTutorProfileHref() {
    const query = searchParams.toString();
    return `${PARENT_FIND_TUTORS_ROUTE}/${tutor.id}${query ? `?${query}` : ""}`;
  }

  function handleConfirmBooking() {
    setBookingError("");
    setShowConfirmModal(true);
  }

  async function handleApproveBooking() {
    if (!selectedStudentData?.email) {
      setBookingError("Select a linked student before confirming this booking.");
      return;
    }

    setBookingSubmitting(true);
    setBookingError("");

    try {
      await createParentSessionBooking({
        studentEmail: selectedStudentData.email,
        paymentEmail: "",
        cardholderName: "",
        saveInformation: false,
        tutorId: tutor.id,
        tutorName: tutor.name,
        subject: selectedSubject,
        sessionDate: selectedDate,
        sessionTime: selectedTime || "To be confirmed",
        sessionType: selectedSessionType,
        durationMinutes: Number(selectedDuration) || 60,
        sessionRate: String(totalDue),
        schedulingFee: "0",
        totalAmount: String(totalDue),
        currency: "USD",
        meetingLocation: selectedSessionType === "In-Person" ? tutor.location : "",
        sessionNotes: notes,
      });

      setShowConfirmModal(false);
      updateCurrentStep({ confirmed: "1" });
      router.push(PARENT_DASHBOARD_ROUTE);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "Unable to create booking.");
    } finally {
      setBookingSubmitting(false);
    }
  }

  return (
    <ParentShell>
      <div className="w-full">
        {showConfirmModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 px-4">
            <div className="w-full max-w-[440px] rounded-[20px] bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.25)]">
              <h2 className="text-[22px] font-bold text-[#20242b]">Confirm Booking</h2>
              <p className="mt-3 text-[14px] leading-6 text-[#4b5563]">
                Confirm booking for {selectedStudentData?.name || "the selected student"} with {tutor.name} on {selectedDate} at{" "}
                {selectedTime}?
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={bookingSubmitting}
                  onClick={() => setShowConfirmModal(false)}
                  className="inline-flex h-11 items-center rounded-full border border-[#d61c3f] px-5 text-[14px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApproveBooking}
                  disabled={bookingSubmitting}
                  className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
                >
                  {bookingSubmitting ? "Saving..." : "Confirm"}
                </button>
              </div>
              {bookingError ? <p className="mt-3 text-[13px] text-[#d61c3f]">{bookingError}</p> : null}
            </div>
          </div>
        ) : null}

        <div className="flex items-center gap-4 border-b border-[#eceef2] bg-white px-4 py-4 sm:px-5 lg:px-6">
          <Link
            href={
              previousStep
                ? withParams(previousStep)
                : getTutorProfileHref()
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
                  <h2 className="text-[17px] font-bold text-[#20242b]">Step 1 - Select Student</h2>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {students.map((student) => {
                      const selected = student.email === selectedStudent;

                      return (
                        <button
                          key={student.email}
                          type="button"
                          onClick={() => updateCurrentStep({ student: student.email, bookingFor: student.email, bookingForLabel: student.name })}
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
                    {students.length === 0 ? (
                      <div className="rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-4 text-[14px] text-[#6b7280]">
                        No linked students available for booking yet.
                      </div>
                    ) : null}
                  </div>
                </section>
              ) : null}

              {step === "session" ? (
                <section className="rounded-[16px] bg-[#f9fafb] p-4">
                  <h2 className="text-[17px] font-bold text-[#20242b]">Step 2 - Session Details</h2>
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
                  <h2 className="text-[17px] font-bold text-[#20242b]">Step 3 - Choose a Date & Time</h2>
                  <div className="mt-4">
                    <p className="text-[16px] font-semibold text-[#374151]">Tutor Availability</p>
                    <p className="mt-1 text-[13px] text-[#6b7280]">
                      Select one of the available time windows shared by {tutor.name}.
                    </p>

                    {availabilitySlots.length > 0 ? (
                      <div className="mt-4 grid gap-3">
                        {availabilitySlots.map((slot) => {
                          const selected =
                            selectedDate === slot.dateLabel &&
                            selectedTime === slot.timeLabel;

                          return (
                            <button
                              key={slot.value}
                              type="button"
                              onClick={() =>
                                updateCurrentStep({
                                  date: slot.dateLabel,
                                  time: slot.timeLabel || null,
                                })
                              }
                              className={`flex items-center justify-between rounded-[12px] border px-4 py-4 text-left transition ${
                                selected ? "border-[#ef6b7a] bg-[#fff0f3]" : "border-[#e5e7eb] bg-white"
                              }`}
                            >
                              <span>
                                <span className="block text-[15px] font-semibold text-[#20242b]">{slot.dateLabel}</span>
                                <span className="mt-1 block text-[13px] text-[#6b7280]">
                                  {slot.timeLabel || "Time details will be confirmed with the tutor."}
                                </span>
                              </span>
                              {selected ? <FiCheck className="h-5 w-5 text-[#d61c3f]" /> : null}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-4 text-[14px] text-[#6b7280]">
                        No tutor availability has been added yet.
                      </div>
                    )}
                  </div>
                </section>
              ) : null}

              {step === "confirm" ? (
                <section className="rounded-[16px] bg-[#f9fafb] p-4">
                  <h2 className="text-[17px] font-bold text-[#20242b]">Step 4 - Confirm Booking</h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-[12px] border border-[#e5e7eb] bg-white p-4">
                      <p className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">Student</p>
                      <p className="mt-2 text-[16px] font-semibold text-[#20242b]">{selectedStudentData?.name || "None selected"}</p>
                      <p className="text-[13px] text-[#6b7280]">{selectedStudentData?.grade || "Grade not set"}</p>
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
                        {selectedSessionType} | {selectedDuration} minutes
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
                      Booking confirmed for {selectedStudentData?.name || "the selected student"}.
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
                  Continue to {stepMeta.find((item) => item.key === nextStep)?.label} {"->"}
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
              <div className="flex items-center justify-between py-1"><span>Student</span><span className="font-medium text-[#20242b]">{selectedStudentData?.name || "None selected"}</span></div>
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
