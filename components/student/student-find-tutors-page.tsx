import Link from "next/link";
import { FiArrowRight, FiMapPin, FiStar } from "react-icons/fi";

import { StudentShell } from "@/components/student/student-shell";
import { STUDENT_FIND_TUTORS_ROUTE } from "@/lib/routes";

const tutors = [
  {
    slug: "marcus-thompson",
    initials: "MT",
    name: "Marcus Thompson",
    modality: "Virtual",
    certification: "Missouri Certified",
    district: "Clayton School District",
    location: "St. Louis, MO",
    subjects: ["Algebra II", "Pre-Calculus", "Geometry"],
    rating: "4.8",
    reviews: 48,
  },
  {
    slug: "sandra-avery",
    initials: "SA",
    name: "Sandra Avery",
    modality: "In-Person",
    certification: "English Specialist",
    district: "Ladue School District",
    location: "St. Louis, MO",
    subjects: ["English Literature", "Essay Writing", "Reading"],
    rating: "4.9",
    reviews: 32,
  },
  {
    slug: "rebecca-jones",
    initials: "RJ",
    name: "Rebecca Jones",
    modality: "Virtual",
    certification: "Science Certified",
    district: "Parkway School District",
    location: "Chesterfield, MO",
    subjects: ["Biology", "Chemistry", "ACT Science"],
    rating: "4.7",
    reviews: 29,
  },
];

export function StudentFindTutorsPage() {
  return (
    <StudentShell>
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-2">
          <h1 className="text-[22px] font-bold text-[#20242b]">Find Tutors</h1>
          <p className="text-[14px] text-[#6b7280]">
            Browse recommended tutors and open a profile to review rates, credentials, and
            availability.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {tutors.map((tutor) => (
            <article
              key={tutor.slug}
              className="rounded-[14px] border border-[#e7e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ffe7eb] text-[16px] font-bold text-[#d61c3f]">
                  {tutor.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-[18px] font-bold text-[#20242b]">{tutor.name}</h2>
                    <span className="rounded-full bg-[#ffecef] px-2 py-0.5 text-[10px] font-medium text-[#d94a62]">
                      {tutor.modality}
                    </span>
                    <span className="rounded-full bg-[#eaf7ef] px-2 py-0.5 text-[10px] font-medium text-[#2d8f5f]">
                      {tutor.certification}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[#f4b400]">
                    <FiStar className="h-3.5 w-3.5 fill-current" />
                    <span className="font-semibold">
                      {tutor.rating} ({tutor.reviews} reviews)
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[#6b7280]">
                    <FiMapPin className="h-3.5 w-3.5" />
                    <span>
                      {tutor.district} · {tutor.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {tutor.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="rounded-md border border-[#f6c5cf] bg-[#fff4f6] px-2.5 py-1 text-[11px] font-medium text-[#d61c3f]"
                  >
                    {subject}
                  </span>
                ))}
              </div>

              <Link
                href={`${STUDENT_FIND_TUTORS_ROUTE}/${tutor.slug}`}
                className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-[#d61c3f]"
              >
                Open profile
                <FiArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </StudentShell>
  );
}
