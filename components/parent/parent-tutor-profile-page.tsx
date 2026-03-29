import Link from "next/link";
import { FiChevronLeft, FiMessageSquare, FiStar } from "react-icons/fi";

import { ParentShell } from "@/components/parent/parent-shell";
import type { ParentTutorCard } from "@/lib/parent/find-tutors-data";
import {
  PARENT_FIND_TUTORS_ROUTE,
  PARENT_MESSAGES_ROUTE,
} from "@/lib/routes";

export function ParentTutorProfilePage({ tutor }: { tutor: ParentTutorCard }) {
  return (
    <ParentShell>
      <div className="w-full">
        <div className="flex items-center gap-4 border-b border-[#eceef2] bg-white px-4 py-4 sm:px-5 lg:px-6">
          <Link
            href={PARENT_FIND_TUTORS_ROUTE}
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#6b7280]"
          >
            <FiChevronLeft className="h-4 w-4" />
            Back to Find Tutors
          </Link>
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Tutor Profile</h1>
        </div>

        <div className="grid bg-white lg:grid-cols-[minmax(0,1fr)_286px]">
          <section className="border-r border-[#eceef2] px-4 py-5 sm:px-5 lg:px-6">
            <div className="flex items-start gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ffe7eb] text-[32px] font-bold text-[#d94a62]">
                {tutor.initials}
              </span>
              <div>
                <h2 className="text-[20px] font-bold text-[#20242b]">{tutor.name}</h2>
                <p className="mt-1 text-[16px] text-[#6b7280]">
                  {tutor.title} · {tutor.location}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[14px] font-semibold text-[#b58112]">
                  <span className="inline-flex items-center gap-1">
                    <FiStar className="h-4 w-4 fill-current" />
                    {tutor.rating.toFixed(1)}
                  </span>
                  <span className="text-[#6b7280]">{tutor.sessions} sessions completed</span>
                  {tutor.verified ? (
                    <span className="inline-flex rounded-full bg-[#daf2e8] px-2.5 py-1 text-[11px] font-semibold text-[#33976d]">
                      Verified
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[#eceef2] pt-5">
              <h3 className="text-[16px] font-bold text-[#20242b]">About {tutor.initials === "MT" ? "Marcus" : tutor.name.split(" ")[0]}</h3>
              <p className="mt-3 max-w-[860px] text-[14px] leading-7 text-[#4b5563]">{tutor.about}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-[16px] font-bold text-[#20242b]">Subjects</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {tutor.subjects.map((subject, index) => (
                  <span
                    key={subject}
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      index < 5 ? "bg-[#ffecef] text-[#d94a62]" : "bg-[#f0f1f3] text-[#6b7280]"
                    }`}
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-[16px] font-bold text-[#20242b]">Education</h3>
              <div className="mt-3 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#d61c3f]" />
                  <div>
                    <p className="text-[15px] font-semibold text-[#374151]">{tutor.education[0]}</p>
                    <p className="text-[13px] text-[#6b7280]">{tutor.education[1]}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#d61c3f]" />
                  <div>
                    <p className="text-[15px] font-semibold text-[#374151]">{tutor.education[2]}</p>
                    <p className="text-[13px] text-[#6b7280]">{tutor.education[3]}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="px-4 py-5 sm:px-5 lg:px-5">
            <section className="rounded-[16px] bg-[#f9fafb] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h3 className="text-[16px] font-bold text-[#20242b]">Booking For</h3>
              <div className="mt-3 h-8 rounded-lg border border-[#e5e7eb] bg-white px-3 text-[13px] leading-8 text-[#4b5563]">
                Jordan Wilson
              </div>
            </section>

            <section className="mt-4 rounded-[16px] bg-[#f9fafb] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h3 className="text-[16px] font-bold text-[#20242b]">Session Rates</h3>
              <div className="mt-4 space-y-3 text-[14px] text-[#4b5563]">
                <div className="flex items-center justify-between"><span>Virtual · 45 min</span><span className="font-bold text-[#20242b]">${tutor.price45}</span></div>
                <div className="flex items-center justify-between"><span>Virtual · 60 min</span><span className="font-bold text-[#20242b]">${tutor.price60}</span></div>
                <div className="flex items-center justify-between"><span>In-Person · 45 min</span><span className="font-bold text-[#20242b]">${tutor.inPerson45}</span></div>
                <div className="flex items-center justify-between"><span>In-Person · 60 min</span><span className="font-bold text-[#20242b]">${tutor.inPerson60}</span></div>
              </div>
              <div className="mt-4 rounded-[14px] border border-[#f3d1d6] bg-[#fff4f6] px-4 py-3 text-[12px] leading-5 text-[#6b7280]">
                Payment collected directly from tutor after each session via cash, Venmo, or PayPal.
              </div>
            </section>

            <section className="mt-4 rounded-[16px] bg-[#f9fafb] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h3 className="text-[16px] font-bold text-[#20242b]">Availability</h3>
              <div className="mt-4 space-y-2">
                {tutor.availability.map((slot) => {
                  const [day, time] = slot.split(/ (.+)/);
                  return (
                    <div key={slot} className="flex items-center justify-between gap-3 text-[14px]">
                      <span className="text-[#6b7280]">{day}</span>
                      <span className="font-semibold text-[#33976d]">{time}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <Link
              href={`${PARENT_FIND_TUTORS_ROUTE}/${tutor.id}/book-session`}
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#d61c3f] px-4 text-[15px] font-semibold text-white transition hover:bg-[#be1837]"
            >
              Book a Session
            </Link>

            <Link
              href={PARENT_MESSAGES_ROUTE}
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#d61c3f] px-4 text-[15px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
            >
              <FiMessageSquare className="h-4 w-4" />
              Send a Message
            </Link>
          </aside>
        </div>
      </div>
    </ParentShell>
  );
}
