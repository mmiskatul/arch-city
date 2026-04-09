import Link from "next/link";
import { FiBriefcase, FiCalendar, FiClock, FiStar, FiUser } from "react-icons/fi";

import { StudentShell } from "@/components/student/student-shell";
import { STUDENT_FIND_TUTORS_ROUTE } from "@/lib/routes";
import type { StudentTutor } from "@/lib/student/tutors-data";

function RatingStars({ rating }: { rating: number }) {
  const normalized = Math.max(0, Math.min(5, rating));
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => {
        const value = index + 1;
        const difference = normalized - index;
        const isFull = difference >= 1;
        const isHalf = difference >= 0.5 && difference < 1;

        return (
          <span key={value} className="relative inline-flex h-3.5 w-3.5 items-center justify-center">
            <FiStar className={`absolute h-3.5 w-3.5 ${isFull || isHalf ? "text-[#f4b400]" : "text-[#d1d5db]"}`} />
            {isFull ? <FiStar className="absolute h-3.5 w-3.5 fill-[#f4b400] text-[#f4b400]" /> : null}
            {isHalf ? (
              <>
                <FiStar className="absolute h-3.5 w-3.5 fill-[#f4b400] text-[#f4b400]" />
                <span className="absolute right-0 top-0 h-full w-1/2 bg-white" />
              </>
            ) : null}
          </span>
        );
      })}
    </span>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <h2 className="text-[13px] font-bold text-[#20242b]">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function StudentTutorProfilePage({ tutor }: { tutor: StudentTutor }) {
  return (
    <StudentShell>
      <div className="w-full">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[12px] text-[#6b7280]">
              <Link href={STUDENT_FIND_TUTORS_ROUTE} className="hover:text-[#20242b]">
                &#8592; Back to tutors
              </Link>
              <span className="font-semibold text-[#20242b]">Tutor Profile</span>
            </div>

            <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ffe7eb] text-[16px] font-bold text-[#d61c3f]">
                  {tutor.initials}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-[18px] font-bold text-[#20242b]">{tutor.name}</h1>
                    <span className="rounded-full bg-[#ffecef] px-2 py-0.5 text-[10px] font-medium text-[#d94a62]">
                      {tutor.mode}
                    </span>
                    <span className="rounded-full bg-[#eaf7ef] px-2 py-0.5 text-[10px] font-medium text-[#2d8f5f]">
                      {tutor.certification}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[12px] text-[#f4b400]">
                    <RatingStars rating={tutor.rating} />
                    <span className="font-semibold">{tutor.rating.toFixed(1)}</span>
                    <span className="text-[#6b7280]">({tutor.reviews} reviews)</span>
                  </div>
                  <p className="mt-2 text-[12px] text-[#6b7280]">
                    {tutor.district} · {tutor.location}
                  </p>
                </div>
              </div>
            </section>

            <InfoCard title="About">
              <p className="text-[12px] leading-6 text-[#4b5563]">{tutor.about}</p>
            </InfoCard>

            <InfoCard title="Education">
              <div className="space-y-3">
                {tutor.education.map((item) => (
                  <div key={item.degree} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#fff4f6] text-[#d61c3f]">
                      <FiUser className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="text-[12px] font-semibold text-[#20242b]">{item.degree}</p>
                      <p className="text-[11px] text-[#6b7280]">
                        {item.school} · {item.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </InfoCard>

            <InfoCard title="Work Experience">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#f7f7f8] text-[#6b7280]">
                  <FiBriefcase className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[12px] font-semibold text-[#20242b]">{tutor.experience.title}</p>
                  <p className="text-[11px] text-[#6b7280]">
                    {tutor.experience.organization} · {tutor.experience.years}
                  </p>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="Subjects & Grade Levels">
              <div className="flex flex-wrap gap-2">
                {tutor.subjectTags.map((subject, index) => (
                  <span
                    key={subject}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                      index < 4
                        ? "border border-[#f6c5cf] bg-[#fff4f6] text-[#d61c3f]"
                        : "border border-[#e5e7eb] bg-[#f8fafc] text-[#6b7280]"
                    }`}
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </InfoCard>
          </div>

          <aside className="space-y-4">
            <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h2 className="text-[13px] font-bold text-[#20242b]">Session Rates</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-[#fafafb] p-3 text-center">
                  <p className="text-[10px] uppercase tracking-[0.04em] text-[#6b7280]">
                    {tutor.mode === "In-Person" ? "In-Person 45min" : "Virtual 45min"}
                  </p>
                  <p className="mt-1 text-[22px] font-bold text-[#d61c3f]">${tutor.price45}</p>
                </div>
                <div className="rounded-lg bg-[#fafafb] p-3 text-center">
                  <p className="text-[10px] uppercase tracking-[0.04em] text-[#6b7280]">
                    {tutor.mode === "In-Person" ? "In-Person 60min" : "Virtual 60min"}
                  </p>
                  <p className="mt-1 text-[22px] font-bold text-[#d61c3f]">${tutor.price60}</p>
                </div>
              </div>
              <p className="mt-3 text-center text-[11px] text-[#6b7280]">
                {tutor.inPersonAvailable ? "In-person available" : "In-person not available"}
              </p>
            </section>

            <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h2 className="text-[13px] font-bold text-[#20242b]">Next Available Slots</h2>
              <div className="mt-3 space-y-2">
                {tutor.availability.map((slot) => (
                  <div
                    key={`${slot.day}-${slot.time}`}
                    className="flex items-center justify-between rounded-lg bg-[#fafafb] px-3 py-3"
                  >
                    <div className="flex items-start gap-2">
                      <FiCalendar className="mt-0.5 h-3.5 w-3.5 text-[#6b7280]" />
                      <div>
                        <p className="text-[12px] font-semibold text-[#20242b]">{slot.day}</p>
                        <p className="text-[11px] text-[#6b7280]">{slot.time}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#fff6de] px-2.5 py-1 text-[10px] font-medium text-[#b58112]">
                      Open
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <div className="rounded-[10px] border border-[#f4d7dd] bg-[#fff5f6] px-3 py-3 text-[11px] text-[#7c5b61]">
              Requires 24 hours notice for bookings. Max 3 sessions/day.
            </div>

            <Link
              href={`${STUDENT_FIND_TUTORS_ROUTE}/${tutor.id}/book-session`}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
            >
              <FiClock className="h-4 w-4" />
              <span>Book a Session</span>
            </Link>

            <p className="text-center text-[11px] text-[#6b7280]">$5 scheduling fee charged at booking</p>
          </aside>
        </div>
      </div>
    </StudentShell>
  );
}
