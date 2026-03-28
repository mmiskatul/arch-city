import Link from "next/link";
import {
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiStar,
  FiUser,
} from "react-icons/fi";

import { StudentShell } from "@/components/student/student-shell";
import { STUDENT_FIND_TUTORS_ROUTE } from "@/lib/routes";

const tutor = {
  initials: "MT",
  name: "Marcus Thompson",
  modality: "Virtual",
  certification: "Missouri Certified",
  district: "Clayton School District",
  location: "St. Louis, MO",
};

const education = [
  {
    degree: "B.S. Mathematics Education",
    school: "University of Missouri",
    year: "2015",
  },
  {
    degree: "M.Ed. Curriculum & Instruction",
    school: "Washington University in St. Louis",
    year: "2018",
  },
];

const availability = [
  { day: "Mon, Mar 30", time: "4:00 PM - 5:00 PM" },
  { day: "Wed, Apr 1", time: "3:30 PM - 5:00 PM" },
  { day: "Thu, Apr 2", time: "5:00 PM - 6:00 PM" },
];

const subjects = ["Algebra II", "Pre-Calculus", "Geometry", "Algebra I", "Grades 6-8", "Grades 9-12"];

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

export function StudentTutorProfilePage() {
  return (
    <StudentShell>
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[12px] text-[#6b7280]">
              <Link href={STUDENT_FIND_TUTORS_ROUTE} className="hover:text-[#20242b]">
                &#8592; Back to tutors
              </Link>
              <span className="text-[#20242b] font-semibold">Tutor Profile</span>
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
                      {tutor.modality}
                    </span>
                    <span className="rounded-full bg-[#eaf7ef] px-2 py-0.5 text-[10px] font-medium text-[#2d8f5f]">
                      {tutor.certification}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[12px] text-[#f4b400]">
                    <FiStar className="h-3.5 w-3.5 fill-current" />
                    <span className="font-semibold">4.8</span>
                    <span className="text-[#6b7280]">(48 reviews)</span>
                  </div>
                  <p className="mt-2 text-[12px] text-[#6b7280]">
                    {tutor.district} · {tutor.location}
                  </p>
                </div>
              </div>
            </section>

            <InfoCard title="About">
              <p className="text-[12px] leading-6 text-[#4b5563]">
                I am a Missouri-certified mathematics teacher with 8 years of classroom and
                tutoring experience. I specialize in helping middle and high school students build
                confidence in Algebra, and Pre-Calculus. My approach focuses on conceptual
                understanding before procedural fluency, so students truly grasp the &quot;why&quot;
                behind the math.
              </p>
            </InfoCard>

            <InfoCard title="Education">
              <div className="space-y-3">
                {education.map((item) => (
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
                  <p className="text-[12px] font-semibold text-[#20242b]">8th Grade Math Teacher</p>
                  <p className="text-[11px] text-[#6b7280]">
                    Clayton Middle School · 2016 - Present
                  </p>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="Subjects & Grade Levels">
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject, index) => (
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
                    Virtual 45min
                  </p>
                  <p className="mt-1 text-[22px] font-bold text-[#d61c3f]">$35</p>
                </div>
                <div className="rounded-lg bg-[#fafafb] p-3 text-center">
                  <p className="text-[10px] uppercase tracking-[0.04em] text-[#6b7280]">
                    Virtual 60min
                  </p>
                  <p className="mt-1 text-[22px] font-bold text-[#d61c3f]">$45</p>
                </div>
              </div>
              <p className="mt-3 text-center text-[11px] text-[#6b7280]">In-person not available</p>
            </section>

            <section className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h2 className="text-[13px] font-bold text-[#20242b]">Next Available Slots</h2>
              <div className="mt-3 space-y-2">
                {availability.map((slot) => (
                  <div key={slot.day} className="flex items-center justify-between rounded-lg bg-[#fafafb] px-3 py-3">
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
              href="#"
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
