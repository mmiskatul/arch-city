"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiSearch, FiStar } from "react-icons/fi";

import { ParentShell } from "@/components/parent/parent-shell";
import {
  parentBookingStudents,
  parentTutorDefaultFilters,
  parentTutorFilterOptions,
  parentTutorResults,
} from "@/lib/parent/find-tutors-data";
import { PARENT_FIND_TUTORS_ROUTE } from "@/lib/routes";

type FilterState = {
  bookingFor: string;
  subject: string;
  gradeLevel: string;
  sessionType: string;
  maxRate: number;
  search: string;
};

const initialAppliedFilters: FilterState = {
  bookingFor: parentTutorDefaultFilters.bookingFor,
  subject: parentTutorDefaultFilters.subject,
  gradeLevel: parentTutorDefaultFilters.gradeLevel,
  sessionType: parentTutorDefaultFilters.sessionType,
  maxRate: parentTutorDefaultFilters.maxRate,
  search: parentTutorDefaultFilters.search,
};

function FilterOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block text-left text-[14px] transition ${
        active ? "font-semibold text-[#374151]" : "text-[#4b5563] hover:text-[#20242b]"
      }`}
    >
      {label}
    </button>
  );
}

export function ParentFindTutorsPage() {
  const [draftFilters, setDraftFilters] = useState<FilterState>(initialAppliedFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialAppliedFilters);

  const filteredTutors = useMemo(() => {
    const search = appliedFilters.search.trim().toLowerCase();

    return parentTutorResults.filter((tutor) => {
      const matchesBookingStudent = appliedFilters.bookingFor.length > 0;
      const matchesSubject =
        !appliedFilters.subject || tutor.subjects.includes(appliedFilters.subject);
      const matchesGrade =
        !appliedFilters.gradeLevel || tutor.gradeLevels.includes(appliedFilters.gradeLevel);
      const matchesSessionType =
        !appliedFilters.sessionType || tutor.sessionTypes.includes(appliedFilters.sessionType as "Virtual" | "In-Person");
      const matchesRate = tutor.price60 <= appliedFilters.maxRate;
      const matchesSearch =
        search.length === 0 ||
        tutor.name.toLowerCase().includes(search) ||
        tutor.title.toLowerCase().includes(search) ||
        tutor.subjects.some((subject) => subject.toLowerCase().includes(search));

      return (
        matchesBookingStudent &&
        matchesSubject &&
        matchesGrade &&
        matchesSessionType &&
        matchesRate &&
        matchesSearch
      );
    });
  }, [appliedFilters]);

  function applyFilters() {
    setAppliedFilters(draftFilters);
  }

  function resetFilters() {
    setDraftFilters(initialAppliedFilters);
    setAppliedFilters(initialAppliedFilters);
  }

  return (
    <ParentShell>
      <div className="w-full">
        <div className="border-b border-[#eceef2] bg-white px-4 py-4 sm:px-5 lg:px-6">
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Find Tutors</h1>
        </div>

        <div className="grid bg-white lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="border-r border-[#eceef2] px-4 py-4 sm:px-5 lg:px-4">
            <h2 className="text-[16px] font-bold text-[#20242b]">Filters</h2>

            <div className="mt-4 border-b border-[#eceef2] pb-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">
                Booking For
              </p>
              <select
                value={draftFilters.bookingFor}
                onChange={(event) =>
                  setDraftFilters((current) => ({ ...current, bookingFor: event.target.value }))
                }
                className="mt-3 h-8 w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 text-[13px] text-[#4b5563] outline-none"
              >
                {parentBookingStudents.map((student) => (
                  <option key={student} value={student}>
                    {student}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-b border-[#eceef2] py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">
                Subject
              </p>
              <div className="mt-3 space-y-2">
                {parentTutorFilterOptions.subjects.map((item) => (
                  <FilterOption
                    key={item}
                    label={item}
                    active={draftFilters.subject === item}
                    onClick={() =>
                      setDraftFilters((current) => ({
                        ...current,
                        subject: current.subject === item ? "" : item,
                      }))
                    }
                  />
                ))}
              </div>
            </div>

            <div className="border-b border-[#eceef2] py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">
                Grade Level
              </p>
              <select
                value={draftFilters.gradeLevel}
                onChange={(event) =>
                  setDraftFilters((current) => ({ ...current, gradeLevel: event.target.value }))
                }
                className="mt-3 h-8 w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 text-[13px] text-[#4b5563] outline-none"
              >
                <option value="">Any grade</option>
                {parentTutorFilterOptions.gradeLevels.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-b border-[#eceef2] py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">
                Session Type
              </p>
              <div className="mt-3 space-y-2">
                {parentTutorFilterOptions.sessionTypes.map((item) => (
                  <FilterOption
                    key={item}
                    label={item}
                    active={draftFilters.sessionType === item}
                    onClick={() =>
                      setDraftFilters((current) => ({
                        ...current,
                        sessionType: current.sessionType === item ? "" : item,
                      }))
                    }
                  />
                ))}
              </div>
            </div>

            <div className="py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">
                Max Rate (Per Session)
              </p>
              <input
                type="range"
                min={parentTutorFilterOptions.minRate}
                max={parentTutorFilterOptions.maxRate}
                step={5}
                value={draftFilters.maxRate}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    maxRate: Number(event.target.value),
                  }))
                }
                className="mt-3 h-10 w-full accent-[#d61c3f]"
              />
              <div className="mt-1 flex items-center justify-between text-[12px] font-semibold text-[#6b7280]">
                <span>${parentTutorFilterOptions.minRate}</span>
                <span>${draftFilters.maxRate}</span>
                <span>${parentTutorFilterOptions.maxRate}</span>
              </div>
              <button
                type="button"
                onClick={applyFilters}
                className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#d61c3f] px-4 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-full border border-[#d61c3f] px-4 text-[13px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          <section className="px-4 py-4 sm:px-5 lg:px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-[18px] font-medium text-[#4b5563]">
                <span className="font-bold text-[#20242b]">
                  {filteredTutors.length} tutor{filteredTutors.length === 1 ? "" : "s"} found
                </span>{" "}
                for {appliedFilters.bookingFor} — {appliedFilters.subject || "All Subjects"}
              </p>

              <div className="relative w-full max-w-[220px]">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  type="text"
                  value={draftFilters.search}
                  onChange={(event) =>
                    setDraftFilters((current) => ({ ...current, search: event.target.value }))
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      applyFilters();
                    }
                  }}
                  placeholder="Search tutors..."
                  className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] pl-11 pr-4 text-[14px] outline-none placeholder:text-[#9ca3af]"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-3">
              {filteredTutors.map((tutor) => (
                <article
                  key={tutor.id}
                  className="rounded-[16px] bg-[#f9fafb] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffe7eb] text-[18px] font-bold text-[#d94a62]">
                      {tutor.initials}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[14px] font-bold text-[#20242b]">{tutor.name}</h3>
                      <p className="text-[13px] text-[#6b7280]">{tutor.title}</p>
                      <div className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-[#b58112]">
                        <FiStar className="h-3.5 w-3.5 fill-current" />
                        <span>{tutor.rating.toFixed(1)}</span>
                        <span className="text-[#8a7a38]">· {tutor.sessions} sessions</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {tutor.subjects.slice(0, 3).map((subject, index) => (
                      <span
                        key={subject}
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          index === 0
                            ? "bg-[#ffecef] text-[#d94a62]"
                            : "bg-[#f0f1f3] text-[#6b7280]"
                        }`}
                      >
                        {subject}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 text-[13px] text-[#6b7280]">
                    {tutor.sessionTypes.join(" · ")} · {tutor.location}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-[14px] font-bold text-[#20242b]">${tutor.price60} / 60 min</p>
                    <span className="inline-flex rounded-full bg-[#daf2e8] px-2.5 py-1 text-[11px] font-semibold text-[#33976d]">
                      Available
                    </span>
                  </div>

                  <Link
                    href={`${PARENT_FIND_TUTORS_ROUTE}/${tutor.id}`}
                    className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#d61c3f] px-4 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
                  >
                    View Profile
                  </Link>
                </article>
              ))}
            </div>

            {filteredTutors.length === 0 ? (
              <div className="mt-6 rounded-[14px] border border-[#eceef2] bg-white px-5 py-8 text-center text-[14px] text-[#6b7280]">
                No tutors match the selected filters.
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </ParentShell>
  );
}
