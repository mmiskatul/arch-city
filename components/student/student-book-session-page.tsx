"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { StudentShell } from "@/components/student/student-shell";
import { createStudentSessionCheckout } from "@/lib/api/student-checkout-api";
import { STUDENT_FIND_TUTORS_ROUTE, STUDENT_SCHEDULE_ROUTE } from "@/lib/routes";
import type { StudentTutor } from "@/lib/student/tutors-data";

type SessionType = "Virtual" | "In-Person";
type DurationType = 45 | 60;
type BookingStep = 1 | 2 | 3 | 4;
type StepStatus = "read" | "current" | "next";

function StepItem({
  step,
  label,
  status,
  href,
}: {
  step: number;
  label: string;
  status: StepStatus;
  href: string;
}) {
  const isCurrent = status === "current";
  const isRead = status === "read";

  return (
    <Link href={href} className="flex items-center gap-3">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold ${
          isCurrent
            ? "bg-[#d61c3f] text-white"
            : isRead
              ? "bg-[#eef1f4] text-[#6b7280]"
              : "bg-[#eef1f4] text-[#6b7280]"
        }`}
      >
        {isRead ? "✓" : step}
      </span>
      <div className="leading-tight">
        <span className={`block text-[14px] ${isCurrent ? "font-semibold text-[#d61c3f]" : isRead ? "font-semibold text-[#6b7280]" : "text-[#6b7280]"}`}>
          {label}
        </span>
      </div>
    </Link>
  );
}

type AvailabilityGroup = {
  value: string;
  label: string;
  slots: StudentTutor["availability"];
};

function groupAvailabilityByDate(availability: StudentTutor["availability"]) {
  const groups = new Map<string, AvailabilityGroup>();

  availability.forEach((slot) => {
    const value = slot.date?.trim() || slot.day?.trim() || "Available";
    const label = slot.day?.trim() || value;
    const group = groups.get(value) ?? {
      value,
      label,
      slots: [],
    };
    group.slots.push(slot);
    groups.set(value, group);
  });

  return [...groups.values()];
}

function formatDateLabel(label: string, index: number) {
  const parsed = new Date(label);
  if (!Number.isNaN(parsed.getTime())) {
    return {
      weekday: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(parsed).toUpperCase(),
      day: new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(parsed),
    };
  }

  const fallback = label.replace(/,/g, " ").trim().split(/\s+/);
  return {
    weekday: fallback[0]?.slice(0, 3).toUpperCase() || "DAY",
    day: fallback[1] || String(index + 1),
  };
}

function SummaryCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <h2 className="text-[16px] font-bold text-[#20242b]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function buildQueryString(values: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      return;
    }
    params.set(key, String(value));
  });

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function StudentBookSessionPage({ tutor }: { tutor: StudentTutor }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const availabilityGroups = useMemo(() => groupAvailabilityByDate(tutor.availability), [tutor.availability]);
  const subjectOptions = useMemo(
    () => (tutor.subjects.length > 0 ? tutor.subjects : ["General Tutoring"]),
    [tutor.subjects],
  );

  const defaultSessionType: SessionType = tutor.inPersonAvailable && tutor.mode === "In-Person" ? "In-Person" : "Virtual";
  const defaultDate = availabilityGroups[0]?.value ?? "Unavailable";
  const defaultTime = availabilityGroups[0]?.slots[0]?.time ?? "Unavailable";
  const initialSubject = searchParams.get("subject") ?? subjectOptions[0] ?? "General Tutoring";
  const initialDateParam = searchParams.get("date");
  const normalizedInitialDate =
    availabilityGroups.find((group) => group.value === initialDateParam)?.value ??
    availabilityGroups.find((group) => group.label === initialDateParam)?.value ??
    defaultDate;

  const [selectedDate, setSelectedDate] = useState(normalizedInitialDate);
  const [selectedTime, setSelectedTime] = useState(searchParams.get("time") || defaultTime);
  const [selectedSubject, setSelectedSubject] = useState(
    subjectOptions.includes(initialSubject) ? initialSubject : subjectOptions[0] || "General Tutoring",
  );
  const [sessionType, setSessionType] = useState<SessionType>(
    (searchParams.get("type") as SessionType | null) ?? defaultSessionType,
  );
  const [duration, setDuration] = useState<DurationType>(
    (Number(searchParams.get("duration")) === 45 ? 45 : 60) as DurationType,
  );
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSubmitting, setCheckoutSubmitting] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const stepParam = searchParams.get("step") || "date-time";
  const activeStep: BookingStep =
    stepParam === "confirm" ? 4 : stepParam === "duration" ? 4 : stepParam === "session" ? 3 : stepParam === "subject" ? 2 : 1;

  const selectedGroup = availabilityGroups.find((group) => group.value === selectedDate) ?? availabilityGroups[0];
  const availableTimes = selectedGroup?.slots ?? [];
  const selectedDateLabel = selectedGroup?.label ?? selectedDate;
  const resolvedMeetingLocation = sessionType === "In-Person" ? tutor.location : "";

  const chargedToday = 5;
  const sessionRate = useMemo(() => (duration === 45 ? tutor.price45 : tutor.price60), [duration, tutor.price45, tutor.price60]);

  const stepRoutes = {
    dateTime: `${STUDENT_FIND_TUTORS_ROUTE}/${tutor.id}/book-session${buildQueryString({ step: "date-time", date: selectedDate, time: selectedTime, subject: selectedSubject, type: sessionType, duration })}`,
    subject: `${STUDENT_FIND_TUTORS_ROUTE}/${tutor.id}/book-session${buildQueryString({ step: "subject", date: selectedDate, time: selectedTime, subject: selectedSubject, type: sessionType, duration })}`,
    sessionType: `${STUDENT_FIND_TUTORS_ROUTE}/${tutor.id}/book-session${buildQueryString({ step: "session", date: selectedDate, time: selectedTime, subject: selectedSubject, type: sessionType, duration })}`,
    duration: `${STUDENT_FIND_TUTORS_ROUTE}/${tutor.id}/book-session${buildQueryString({ step: "duration", date: selectedDate, time: selectedTime, subject: selectedSubject, type: sessionType, duration })}`,
    confirm: `${STUDENT_FIND_TUTORS_ROUTE}/${tutor.id}/book-session${buildQueryString({ step: "confirm", date: selectedDate, time: selectedTime, subject: selectedSubject, type: sessionType, duration })}`,
  };

  const stepStatus = (step: BookingStep): StepStatus => {
    if (step < activeStep) {
      return "read";
    }
    if (step === activeStep) {
      return "current";
    }
    return "next";
  };

  function handleDateChange(dateValue: string) {
    const nextGroup = availabilityGroups.find((group) => group.value === dateValue);
    setSelectedDate(dateValue);
    setSelectedTime(nextGroup?.slots[0]?.time ?? "");
  }

  function isSlotSelected(time: string) {
    return selectedTime === time;
  }

  function closeReviewModal() {
    setIsReviewOpen(false);
    setCheckoutSuccess(false);
    setCheckoutStatus(null);
    setCheckoutError(null);
    setCheckoutSubmitting(false);
  }

  async function handleSessionCheckout() {
    setCheckoutError(null);
    setCheckoutStatus(null);
    setCheckoutSubmitting(true);

    try {
      const result = await createStudentSessionCheckout({
        paymentEmail: "",
        cardholderName: "",
        saveInformation: false,
        tutorId: tutor.id,
        tutorName: tutor.name,
        subject: selectedSubject,
        sessionDate: selectedDate,
        sessionTime: selectedTime,
        sessionType,
        durationMinutes: duration,
        sessionRate: String(sessionRate),
        schedulingFee: String(chargedToday),
        totalAmount: String(sessionRate + chargedToday),
        currency: "USD",
        meetingLocation: resolvedMeetingLocation,
        sessionNotes: "",
      });

      setCheckoutStatus(result.message);
      setCheckoutSuccess(true);
      window.setTimeout(() => {
        router.push(STUDENT_SCHEDULE_ROUTE);
      }, 1200);
    } catch (error) {
      setCheckoutError(error instanceof Error ? "Unable to create session." : "Unable to create session.");
    } finally {
      setCheckoutSubmitting(false);
    }
  }

  return (
    <StudentShell>
      <div className="w-full">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <div className="flex items-center gap-3 text-[12px] text-[#6b7280]">
              <Link href={`${STUDENT_FIND_TUTORS_ROUTE}/${tutor.id}`} className="hover:text-[#20242b]">
                &#8592; Back to profile
              </Link>
              <span className="font-semibold text-[#20242b]">Book a Session</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 rounded-[12px] border border-[#eceef2] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <StepItem step={1} label="Date & Time" status={stepStatus(1)} href={stepRoutes.dateTime} />
              <div className="h-px w-8 bg-[#e5e7eb]" />
              <StepItem step={2} label="Subject" status={stepStatus(2)} href={stepRoutes.subject} />
              <div className="h-px w-8 bg-[#e5e7eb]" />
              <StepItem step={3} label="Session Type" status={stepStatus(3)} href={stepRoutes.sessionType} />
              <div className="h-px w-8 bg-[#e5e7eb]" />
              <StepItem step={4} label="Duration" status={stepStatus(4)} href={stepRoutes.duration} />
            </div>

            {activeStep >= 1 ? (
              activeStep === 1 ? (
                <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  <h2 className="text-[16px] font-bold text-[#20242b]">Select Date & Time</h2>

                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                    {availabilityGroups.map((group, index) => {
                      const active = selectedDate === group.value;
                      const dateLabel = formatDateLabel(group.label, index);

                      return (
                      <button
                          key={group.value}
                          type="button"
                          onClick={() => handleDateChange(group.value)}
                          className={`rounded-[14px] border px-3 py-3 text-left shadow-[0_1px_1px_rgba(15,23,42,0.03)] transition ${
                            active ? "border-[#ef6078] bg-[#fff4f6]" : "border-[#e5e7eb] bg-white hover:border-[#d7dbe0]"
                          }`}
                        >
                          <p className={`text-[11px] font-semibold tracking-[0.08em] ${active ? "text-[#d61c3f]" : "text-[#6b7280]"}`}>
                            {dateLabel.weekday}
                          </p>
                          <p className={`mt-0.5 text-[18px] font-bold leading-none ${active ? "text-[#d61c3f]" : "text-[#20242b]"}`}>
                            {dateLabel.day}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <p className="text-[14px] font-semibold text-[#20242b]">Available Times</p>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {availableTimes.map((slot) => (
                      <button
                        key={`${slot.day}-${slot.time}`}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        className={`flex items-center justify-between rounded-[12px] border px-4 py-3 text-left transition ${
                          isSlotSelected(slot.time)
                            ? "border-[#f2a4b2] bg-[#fff1f4]"
                            : "border-[#e5e7eb] bg-white hover:border-[#d7dbe0]"
                        }`}
                        >
                        <div className="min-w-0">
                          <p className={`text-[13px] font-bold ${isSlotSelected(slot.time) ? "text-[#d61c3f]" : "text-[#20242b]"}`}>
                            {slot.time}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <div className="flex gap-3">
                      <Link
                        href={`${STUDENT_FIND_TUTORS_ROUTE}/${tutor.id}`}
                        className="inline-flex h-10 items-center justify-center rounded-full border border-[#d61c3f] px-5 text-[13px] font-semibold text-[#d61c3f]"
                      >
                        Back
                      </Link>
                      <Link
                        href={stepRoutes.subject}
                        className="inline-flex h-10 items-center justify-center rounded-full bg-[#d61c3f] px-5 text-[13px] font-semibold text-white"
                      >
                        Next
                      </Link>
                    </div>
                  </div>
                </section>
              ) : (
                <SummaryCard title="Date & Time">
                  <div className="flex items-center justify-between rounded-[12px] bg-[#fafafb] px-4 py-3">
                      <div>
                      <p className="text-[12px] font-semibold text-[#20242b]">{selectedDateLabel}</p>
                      <p className="text-[11px] text-[#6b7280]">{selectedTime}</p>
                    </div>
                    <span className="rounded-full bg-[#eef1f4] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">
                      Read
                    </span>
                  </div>
                </SummaryCard>
              )
            ) : null}

            {activeStep >= 2 ? (
              activeStep === 2 ? (
                <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  <h2 className="text-[16px] font-bold text-[#20242b]">Subject</h2>
                  <p className="mt-1 text-[13px] text-[#6b7280]">
                    Choose the subject that best matches what you want help with.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {subjectOptions.map((subject) => {
                      const active = selectedSubject === subject;

                      return (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => setSelectedSubject(subject)}
                          className={`rounded-[12px] border px-4 py-4 text-left transition ${
                            active ? "border-[#ef6078] bg-[#fff1f4]" : "border-[#e5e7eb] bg-white hover:border-[#d7dbe0]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className={`text-[14px] font-semibold ${active ? "text-[#d61c3f]" : "text-[#20242b]"}`}>
                                {subject}
                              </p>
                              <p className="mt-1 text-[12px] text-[#6b7280]">Available with this tutor</p>
                            </div>
                            <span
                              className={`mt-0.5 h-5 w-5 rounded-full border ${
                                active ? "border-[#d61c3f] bg-[#d61c3f]" : "border-[#d1d5db] bg-white"
                              }`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <div className="flex gap-3">
                      <Link
                        href={stepRoutes.dateTime}
                        className="inline-flex h-10 items-center justify-center rounded-full border border-[#d61c3f] px-5 text-[13px] font-semibold text-[#d61c3f]"
                      >
                        Back
                      </Link>
                      <Link
                        href={stepRoutes.sessionType}
                        className="inline-flex h-10 items-center justify-center rounded-full bg-[#d61c3f] px-5 text-[13px] font-semibold text-white"
                      >
                        Next
                      </Link>
                    </div>
                  </div>
                </section>
              ) : (
                <SummaryCard title="Subject">
                  <div className="flex items-center justify-between rounded-[12px] bg-[#fafafb] px-4 py-3">
                    <div>
                      <p className="text-[12px] font-semibold text-[#20242b]">{selectedSubject}</p>
                      <p className="text-[11px] text-[#6b7280]">Tutor subject selection</p>
                    </div>
                    <span className="rounded-full bg-[#eef1f4] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">
                      Read
                    </span>
                  </div>
                </SummaryCard>
              )
            ) : null}

            {activeStep >= 3 ? (
              activeStep === 3 ? (
                <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  <h2 className="text-[16px] font-bold text-[#20242b]">Session Type</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setSessionType("Virtual")}
                      className={`rounded-[12px] border p-4 text-left ${
                        sessionType === "Virtual" ? "border-[#ef6078] bg-[#fff1f4]" : "border-[#e5e7eb] bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-5 w-5 rounded-full border ${sessionType === "Virtual" ? "border-[#d61c3f]" : "border-[#d1d5db]"}`} />
                        <div>
                          <p className="text-[14px] font-semibold text-[#20242b]">Virtual</p>
                          <p className="text-[13px] text-[#6b7280]">Video call session</p>
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => tutor.inPersonAvailable && setSessionType("In-Person")}
                      className={`rounded-[12px] border p-4 text-left ${
                        sessionType === "In-Person" ? "border-[#ef6078] bg-[#fff1f4]" : "border-[#e5e7eb] bg-white"
                      } ${!tutor.inPersonAvailable ? "opacity-55" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-5 w-5 rounded-full border ${sessionType === "In-Person" ? "border-[#d61c3f]" : "border-[#d1d5db]"}`} />
                        <div>
                          <p className="text-[14px] font-semibold text-[#20242b]">In-Person</p>
                          <p className="text-[13px] text-[#6b7280]">
                            {tutor.inPersonAvailable ? "Meet in person" : "Not available for this tutor"}
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <div className="flex gap-3">
                      <Link
                        href={stepRoutes.subject}
                        className="inline-flex h-10 items-center justify-center rounded-full border border-[#d61c3f] px-5 text-[13px] font-semibold text-[#d61c3f]"
                      >
                        Back
                      </Link>
                      <Link
                        href={stepRoutes.duration}
                        className="inline-flex h-10 items-center justify-center rounded-full bg-[#d61c3f] px-5 text-[13px] font-semibold text-white"
                      >
                        Next
                      </Link>
                    </div>
                  </div>
                </section>
              ) : (
                <SummaryCard title="Session Type">
                  <div className="flex items-center justify-between rounded-[12px] bg-[#fafafb] px-4 py-3">
                    <div>
                      <p className="text-[12px] font-semibold text-[#20242b]">{sessionType}</p>
                      <p className="text-[11px] text-[#6b7280]">{sessionType === "Virtual" ? "Video call session" : "In-person session"}</p>
                    </div>
                    <span className="rounded-full bg-[#eef1f4] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">
                      Read
                    </span>
                  </div>
                </SummaryCard>
              )
            ) : null}

            {activeStep >= 4 ? (
              activeStep === 4 ? (
                <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  <h2 className="text-[16px] font-bold text-[#20242b]">Session Duration</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setDuration(45)}
                      className={`rounded-[12px] border p-4 text-left ${
                        duration === 45 ? "border-[#ef6078] bg-[#fff1f4]" : "border-[#e5e7eb] bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-5 w-5 rounded-full border ${duration === 45 ? "border-[#d61c3f]" : "border-[#d1d5db]"}`} />
                        <div>
                          <p className="text-[14px] font-semibold text-[#20242b]">45 Minutes</p>
                          <p className="text-[13px] font-semibold text-[#d61c3f]">${tutor.price45}</p>
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDuration(60)}
                      className={`rounded-[12px] border p-4 text-left ${
                        duration === 60 ? "border-[#ef6078] bg-[#fff1f4]" : "border-[#e5e7eb] bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-5 w-5 rounded-full border ${duration === 60 ? "border-[#d61c3f]" : "border-[#d1d5db]"}`} />
                        <div>
                          <p className="text-[14px] font-semibold text-[#20242b]">60 Minutes</p>
                          <p className="text-[13px] font-semibold text-[#d61c3f]">${tutor.price60}</p>
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <div className="flex gap-3">
                      <Link
                        href={stepRoutes.sessionType}
                        className="inline-flex h-10 items-center justify-center rounded-full border border-[#d61c3f] px-5 text-[13px] font-semibold text-[#d61c3f]"
                      >
                        Back
                      </Link>
                      <button
                        type="button"
                        onClick={() => setIsReviewOpen(true)}
                        className="inline-flex h-10 items-center justify-center rounded-full bg-[#d61c3f] px-5 text-[13px] font-semibold text-white"
                      >
                        Review & Pay
                      </button>
                    </div>
                  </div>
                </section>
              ) : (
                <SummaryCard title="Session Duration">
                  <div className="flex items-center justify-between rounded-[12px] bg-[#fafafb] px-4 py-3">
                    <div>
                      <p className="text-[12px] font-semibold text-[#20242b]">{duration} Minutes</p>
                      <p className="text-[11px] text-[#6b7280]">${duration === 45 ? tutor.price45 : tutor.price60}</p>
                    </div>
                    <span className="rounded-full bg-[#eef1f4] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">
                      Read
                    </span>
                  </div>
                </SummaryCard>
              )
            ) : null}

          </div>

          <aside className="space-y-4">
            <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h2 className="text-[18px] font-bold text-[#20242b]">Booking Summary</h2>
              <div className="mt-4 flex items-center gap-3 border-b border-[#eceef2] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe7eb] text-[14px] font-bold text-[#d61c3f]">
                  {tutor.initials}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#20242b]">{tutor.name}</p>
                  <p className="text-[13px] text-[#6b7280]">{selectedSubject}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 border-b border-[#eceef2] pb-4 text-[14px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#6b7280]">Date</span>
                    <span className="font-semibold text-[#20242b]">{selectedDateLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6b7280]">Time</span>
                  <span className="font-semibold text-[#20242b]">{selectedTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6b7280]">Type</span>
                  <span className="font-semibold text-[#20242b]">{sessionType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6b7280]">Duration</span>
                  <span className="font-semibold text-[#20242b]">{duration} min</span>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-[14px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#6b7280]">Session rate</span>
                  <span className="font-semibold text-[#6b7280]">${sessionRate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6b7280]">Scheduling fee</span>
                  <span className="font-semibold text-[#6b7280]">$5</span>
                </div>
                <div className="flex items-center justify-between text-[16px]">
                  <span className="font-bold text-[#20242b]">Charged today</span>
                  <span className="font-bold text-[#d61c3f]">${chargedToday}</span>
                </div>
                <p className="pt-1 text-[12px] text-[#6b7280]">
                  Session rate of ${sessionRate} paid directly to tutor after session via checkout.
                </p>
              </div>
            </section>

          </aside>
        </div>
      </div>

      {isReviewOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-3 py-3 backdrop-blur-[2px]"
          onClick={closeReviewModal}
          role="presentation"
        >
          <div
            className="relative w-full max-w-[620px] overflow-hidden rounded-[18px] bg-white shadow-[0_20px_70px_rgba(15,23,42,0.3)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative overflow-hidden bg-[linear-gradient(180deg,#2f3647_0%,#3c455a_100%)] px-3 py-3 text-white lg:px-4 lg:py-4">
                <div className="absolute -left-20 top-8 h-44 w-44 rounded-full bg-white/8 blur-3xl" />
                <div className="absolute -bottom-24 right-0 h-56 w-56 rounded-full bg-[#d61c3f]/18 blur-3xl" />

                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">Secure checkout</p>
                    <h3 className="mt-2 text-[19px] font-bold leading-tight">Pay in USD</h3>
                    <p className="mt-2 max-w-[260px] text-[11px] leading-5 text-white/72">
                      Complete this booking with Visa, Mastercard, debit, or credit card.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeReviewModal}
                    className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold text-white/85 transition hover:bg-white/12"
                  >
                    Close
                  </button>
                </div>

                <div className="relative mt-4 rounded-[16px] border border-white/12 bg-white/8 p-3 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/58">Total due today</p>
                    <span className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-white/75">
                      USD
                    </span>
                  </div>
                  <p className="mt-3 text-[24px] font-bold leading-none tracking-[-0.03em]">${sessionRate + chargedToday}</p>
                  <p className="mt-2 text-[10px] leading-5 text-white/70">Session rate plus scheduling fee for the booking today.</p>
                </div>

                <div className="relative mt-3 space-y-1.5">
                  <div className="rounded-[15px] border border-white/12 bg-white/8 px-3.5 py-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[11px] uppercase tracking-[0.12em] text-white/55">Tutor</span>
                      <span className="text-right text-[12px] font-semibold">{tutor.name}</span>
                    </div>
                  </div>
                  <div className="rounded-[15px] border border-white/12 bg-white/8 px-3.5 py-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[11px] uppercase tracking-[0.12em] text-white/55">Subject</span>
                      <span className="text-right text-[12px] font-semibold">{selectedSubject}</span>
                    </div>
                  </div>
                  <div className="rounded-[15px] border border-white/12 bg-white/8 px-3.5 py-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[11px] uppercase tracking-[0.12em] text-white/55">Date & time</span>
                      <span className="text-right text-[12px] font-semibold">
                        {selectedDateLabel}
                          <br />
                          <span className="text-white/72">{selectedTime}</span>
                        </span>
                      </div>
                    </div>
                  <div className="rounded-[15px] border border-white/12 bg-white/8 px-3.5 py-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[11px] uppercase tracking-[0.12em] text-white/55">Session type</span>
                      <span className="text-right text-[12px] font-semibold">{sessionType}</span>
                    </div>
                  </div>
                  {sessionType === "In-Person" ? (
                    <div className="rounded-[15px] border border-white/12 bg-white/8 px-3.5 py-2">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[11px] uppercase tracking-[0.12em] text-white/55">Meeting location</span>
                        <span className="max-w-[180px] text-right text-[12px] font-semibold">
                          {resolvedMeetingLocation || "Not provided"}
                        </span>
                      </div>
                    </div>
                  ) : null}
                  <div className="rounded-[15px] border border-white/12 bg-white/8 px-3.5 py-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[11px] uppercase tracking-[0.12em] text-white/55">Duration</span>
                      <span className="text-right text-[12px] font-semibold">{duration} minutes</span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="bg-[#fbfbfc] px-3 py-3 lg:px-4 lg:py-4">
                <div className="inline-flex h-9 w-full items-center justify-center rounded-[4px] bg-[#00d66b] px-4 text-[12px] font-semibold text-[#13211d] shadow-[0_2px_0_rgba(0,0,0,0.06)]">
                  Payment Complete
                </div>

                <div className="mt-3 text-[10px] text-[#6b7280]">
                  <p className="font-medium">Click payment complete to create the session immediately.</p>
                </div>

                <button
                  type="button"
                  onClick={handleSessionCheckout}
                  disabled={checkoutSubmitting}
                  className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-[8px] bg-[#d61c3f] px-5 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(214,28,63,0.24)] transition hover:bg-[#bf1736] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {checkoutSubmitting ? "Creating..." : "Payment Complete"}
                </button>

                {checkoutError ? (
                  <p className="mt-2 text-[10px] leading-4 text-[#d61c3f]">{checkoutError}</p>
                ) : null}

                {checkoutStatus ? (
                  <p className="mt-2 text-[10px] leading-4 text-[#1f8a43]">{checkoutStatus}</p>
                ) : null}
              </div>
              </div>

              {checkoutSuccess ? (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-4 rounded-[24px] border border-[#e5f3ea] bg-white px-8 py-7 text-center shadow-[0_16px_48px_rgba(15,23,42,0.14)]">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f7ec] text-[30px] text-[#1f8a43] animate-bounce">
                      ✓
                    </div>
                    <div>
                      <p className="text-[16px] font-bold text-[#20242b]">Payment successful</p>
                      <p className="mt-1 text-[12px] text-[#6b7280]">Your session has been added to My Schedule.</p>
                    </div>
                    <div className="h-1.5 w-36 overflow-hidden rounded-full bg-[#eef1f4]">
                      <div className="h-full w-2/3 animate-pulse rounded-full bg-[#1f8a43]" />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
      ) : null}
    </StudentShell>
  );
}

