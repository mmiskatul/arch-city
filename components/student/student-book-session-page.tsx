"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";

import { StudentShell } from "@/components/student/student-shell";
import { STUDENT_FIND_TUTORS_ROUTE } from "@/lib/routes";
import type { StudentTutor } from "@/lib/student/tutors-data";

const dates = [
  { dayLabel: "Sun", day: "30", active: false },
  { dayLabel: "Mon", day: "31", active: true },
  { dayLabel: "Tue", day: "1", active: false },
  { dayLabel: "Wed", day: "2", active: false },
  { dayLabel: "Thu", day: "3", active: false },
  { dayLabel: "Fri", day: "4", active: false },
  { dayLabel: "Sat", day: "5", active: false },
];

const timeSlots = ["3:00 PM", "3:15 PM", "3:30 PM", "3:45 PM", "4:00 PM", "4:15 PM", "4:30 PM", "5:00 PM"];

type SessionType = "Virtual" | "In-Person";
type DurationType = 45 | 60;

function StepItem({
  step,
  label,
  active,
}: {
  step: number;
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold ${
          active ? "bg-[#d61c3f] text-white" : "bg-[#eef1f4] text-[#6b7280]"
        }`}
      >
        {step}
      </span>
      <span className={`text-[14px] ${active ? "font-semibold text-[#d61c3f]" : "text-[#6b7280]"}`}>
        {label}
      </span>
    </div>
  );
}

export function StudentBookSessionPage({ tutor }: { tutor: StudentTutor }) {
  const defaultSessionType: SessionType = tutor.inPersonAvailable && tutor.mode === "In-Person" ? "In-Person" : "Virtual";
  const [selectedTime, setSelectedTime] = useState("3:00 PM");
  const [sessionType, setSessionType] = useState<SessionType>(defaultSessionType);
  const [duration, setDuration] = useState<DurationType>(60);

  const chargedToday = 5;
  const sessionRate = useMemo(() => (duration === 45 ? tutor.price45 : tutor.price60), [duration, tutor.price45, tutor.price60]);

  return (
    <StudentShell>
      <div className="w-full px-2 sm:px-3 lg:px-4">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <div className="flex items-center gap-3 text-[12px] text-[#6b7280]">
              <Link href={`${STUDENT_FIND_TUTORS_ROUTE}/${tutor.id}`} className="hover:text-[#20242b]">
                &#8592; Back to profile
              </Link>
              <span className="font-semibold text-[#20242b]">Book a Session</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 rounded-[12px] border border-[#eceef2] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <StepItem step={1} label="Date & Time" active />
              <div className="h-px w-8 bg-[#e5e7eb]" />
              <StepItem step={2} label="Session Type" />
              <div className="h-px w-8 bg-[#e5e7eb]" />
              <StepItem step={3} label="Duration" />
              <div className="h-px w-8 bg-[#e5e7eb]" />
              <StepItem step={4} label="Confirm & Pay" />
            </div>

            <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h2 className="text-[16px] font-bold text-[#20242b]">Select Date & Time</h2>

              <div className="mt-4 grid grid-cols-7 gap-3 text-center">
                {dates.map((item) => (
                  <div key={`${item.dayLabel}-${item.day}`}>
                    <p className="text-[12px] font-semibold text-[#6b7280]">{item.dayLabel}</p>
                    <button
                      type="button"
                      className={`mt-2 h-7 w-full rounded-md text-[14px] font-semibold ${
                        item.active ? "bg-[#d61c3f] text-white" : item.day === "28" ? "bg-[#ffe8ed] text-[#d61c3f]" : "text-[#6b7280]"
                      }`}
                    >
                      {item.day}
                    </button>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-[14px] font-semibold text-[#20242b]">Available Times — Mon, Mar 31</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`rounded-md border px-4 py-2 text-[14px] font-medium ${
                      selectedTime === time
                        ? "border-[#f2a4b2] bg-[#fff1f4] text-[#d61c3f]"
                        : "border-[#e5e7eb] bg-white text-[#4b5563]"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h2 className="text-[16px] font-bold text-[#20242b]">Session Type</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setSessionType("Virtual")}
                  className={`rounded-[12px] border p-4 text-left ${
                    sessionType === "Virtual"
                      ? "border-[#ef6078] bg-[#fff1f4]"
                      : "border-[#e5e7eb] bg-white"
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
                    sessionType === "In-Person"
                      ? "border-[#ef6078] bg-[#fff1f4]"
                      : "border-[#e5e7eb] bg-white"
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
            </section>

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
            </section>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={`${STUDENT_FIND_TUTORS_ROUTE}/${tutor.id}`}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#d61c3f] px-12 text-[14px] font-semibold text-[#d61c3f]"
              >
                Back
              </Link>
              <Link
                href="#"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-[#d61c3f] px-12 text-[14px] font-semibold text-white"
              >
                Review & Pay
              </Link>
            </div>
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
                  <p className="text-[13px] text-[#6b7280]">{tutor.subjects[1] ?? tutor.subjects[0]}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 border-b border-[#eceef2] pb-4 text-[14px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#6b7280]">Date</span>
                  <span className="font-semibold text-[#20242b]">Mon, Mar 31</span>
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

            <div className="rounded-[12px] border border-[#f2ddb0] bg-[#fff9ed] px-4 py-3 text-[13px] text-[#6b7280]">
              <div className="flex items-start gap-3">
                <FiAlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#c58b13]" />
                <p>Full tutor session rate required if cancelled within 12 hours of the session.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </StudentShell>
  );
}
