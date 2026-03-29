import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiCheck } from "react-icons/fi";

import { ParentShell } from "@/components/parent/parent-shell";
import type { ParentTutorCard } from "@/lib/parent/find-tutors-data";
import { PARENT_FIND_TUTORS_ROUTE } from "@/lib/routes";

const students = [
  { initials: "JW", name: "Jordan Wilson", grade: "11th Grade", selected: true },
  { initials: "MW", name: "Maya Wilson", grade: "8th Grade", selected: false },
];

const dates = [
  { day: "Su", value: "1" },
  { day: "Mo", value: "2", active: true },
  { day: "Tu", value: "3" },
  { day: "We", value: "4" },
  { day: "Th", value: "5" },
  { day: "Fr", value: "6" },
  { day: "Sa", value: "7" },
  { day: "", value: "8" },
  { day: "", value: "9" },
  { day: "", value: "10" },
  { day: "", value: "11" },
  { day: "", value: "12" },
  { day: "", value: "13" },
  { day: "", value: "14" },
];

const availableTimes = [
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
];

function Step({
  number,
  label,
  active,
}: {
  number: number;
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-bold ${
          active ? "bg-[#d61c3f] text-white" : "bg-[#e9ecef] text-[#6b7280]"
        }`}
      >
        {number}
      </span>
      <span className={`text-[14px] font-semibold ${active ? "text-[#d61c3f]" : "text-[#6b7280]"}`}>
        {label}
      </span>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  placeholder,
}: {
  label: string;
  value?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[14px] font-medium text-[#4b5563]">{label}</label>
      <input
        type="text"
        readOnly
        value={value ?? ""}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-white px-4 text-[14px] text-[#4b5563] outline-none placeholder:text-[#9ca3af]"
      />
    </div>
  );
}

export function ParentBookSessionPage({ tutor }: { tutor: ParentTutorCard }) {
  const subjectValue = tutor.subjects.find((subject) => !["Math", "Science", "English", "History"].includes(subject)) ?? tutor.subjects[0];

  return (
    <ParentShell>
      <div className="w-full">
        <div className="flex items-center gap-4 border-b border-[#eceef2] bg-white px-4 py-4 sm:px-5 lg:px-6">
          <Link
            href={`${PARENT_FIND_TUTORS_ROUTE}/${tutor.id}`}
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
              <Step number={1} label="Student" active />
              <div className="h-px w-12 bg-[#d61c3f]" />
              <Step number={2} label="Session" active />
              <div className="h-px w-12 bg-[#d1d5db]" />
              <Step number={3} label="Schedule" />
              <div className="h-px w-12 bg-[#d1d5db]" />
              <Step number={4} label="Confirm" />
            </div>

            <section className="mt-6 rounded-[16px] bg-[#f9fafb] p-4">
              <h2 className="text-[17px] font-bold text-[#20242b]">Step 1 — Select Student</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {students.map((student) => (
                  <button
                    key={student.name}
                    type="button"
                    className={`flex items-center justify-between rounded-[12px] border px-4 py-4 text-left transition ${
                      student.selected
                        ? "border-[#ef6b7a] bg-[#fff0f3]"
                        : "border-[#e5e7eb] bg-white"
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
                    {student.selected ? <FiCheck className="h-5 w-5 text-[#d61c3f]" /> : null}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-4 rounded-[16px] bg-[#f9fafb] p-4">
              <h2 className="text-[17px] font-bold text-[#20242b]">Step 2 — Session Details</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <LabeledInput label="Subject" value={subjectValue} />
                <LabeledInput label="Session Type" value="Virtual" />
                <LabeledInput label="Duration" value="60 minutes" />
                <LabeledInput label="Notes for Tutor (optional)" placeholder="e.g. Focus on polynomial factoring" />
              </div>
            </section>

            <section className="mt-4 rounded-[16px] bg-[#f9fafb] p-4">
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
                    <span className="text-[18px] font-bold text-[#374151]">March 2026</span>
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
                    {dates.map((date, index) => (
                      <span
                        key={`${date.value}-${index}`}
                        className={`flex h-8 items-center justify-center rounded-lg text-[13px] ${
                          date.active ? "bg-[#ffecef] font-semibold text-[#d61c3f]" : "text-[#9ca3af]"
                        }`}
                      >
                        {date.value}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[16px] font-semibold text-[#374151]">Available Times — Mon, Mar 2</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        type="button"
                        className={`inline-flex h-10 items-center justify-center rounded-lg border text-[14px] font-semibold transition ${
                          time === "4:00 PM"
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

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-6 text-[15px] font-semibold text-white transition hover:bg-[#be1837]"
              >
                Continue to Confirm →
              </button>
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
              <div className="flex items-center justify-between py-1"><span>Student</span><span className="font-medium text-[#20242b]">Jordan Wilson</span></div>
              <div className="flex items-center justify-between py-1"><span>Subject</span><span className="font-medium text-[#20242b]">{subjectValue}</span></div>
              <div className="flex items-center justify-between py-1"><span>Date</span><span className="font-medium text-[#20242b]">Mon, Mar 2</span></div>
              <div className="flex items-center justify-between py-1"><span>Time</span><span className="font-medium text-[#20242b]">4:00 PM</span></div>
              <div className="flex items-center justify-between py-1"><span>Duration</span><span className="font-medium text-[#20242b]">60 minutes</span></div>
              <div className="flex items-center justify-between py-1"><span>Type</span><span className="font-medium text-[#20242b]">Virtual</span></div>
            </div>

            <div className="mt-4 border-t border-[#eceef2] pt-4">
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-bold text-[#374151]">Total Due</span>
                <span className="text-[18px] font-bold text-[#d61c3f]">${tutor.price60}</span>
              </div>
              <p className="mt-2 text-[13px] text-[#6b7280]">Paid directly to tutor after session</p>
            </div>
          </aside>
        </div>
      </div>
    </ParentShell>
  );
}
