"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiStar } from "react-icons/fi";

import { ParentShell } from "@/components/parent/parent-shell";
import { fetchAvailableParentTutors } from "@/lib/api/public-tutors-api";
import { getParentStudents, type ParentStudentListItem } from "@/lib/api/parent-students-api";
import { parentTutorResults, type ParentTutorCard } from "@/lib/parent/find-tutors-data";
import { PARENT_FIND_TUTORS_ROUTE } from "@/lib/routes";

type FilterState = {
  bookingFor: string;
  subject: string;
  gradeLevel: string;
  sessionType: string;
  maxRate: number;
  search: string;
};

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
            <FiStar className={`absolute h-3.5 w-3.5 ${isFull || isHalf ? "text-[#f3b300]" : "text-[#d1d5db]"}`} />
            {isFull ? <FiStar className="absolute h-3.5 w-3.5 fill-[#f3b300] text-[#f3b300]" /> : null}
            {isHalf ? (
              <>
                <FiStar className="absolute h-3.5 w-3.5 fill-[#f3b300] text-[#f3b300]" />
                <span className="absolute right-0 top-0 h-full w-1/2 bg-white" />
              </>
            ) : null}
          </span>
        );
      })}
    </span>
  );
}

function normalizeGrade(value: string) {
  return value.trim().toLowerCase();
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function extractGradeNumbers(value: string) {
  return Array.from(value.matchAll(/\d+/g), (match) => Number(match[0])).filter((number) => !Number.isNaN(number));
}

function matchesSubjectFilter(tutor: ParentTutorCard, filterSubject: string) {
  if (!filterSubject) return true;

  const normalizedFilter = normalizeText(filterSubject);
  return tutor.subjects.some((subject) => {
    const normalizedSubject = normalizeText(subject);
    return normalizedSubject === normalizedFilter || normalizedSubject.includes(normalizedFilter);
  });
}

function matchesGradeFilter(tutor: ParentTutorCard, filterGrade: string) {
  if (!filterGrade) return true;

  const normalizedFilter = normalizeGrade(filterGrade);
  const filterNumbers = extractGradeNumbers(filterGrade);

  return tutor.gradeLevels.some((grade) => {
    const normalizedGrade = normalizeGrade(grade);
    if (normalizedGrade === normalizedFilter || normalizedGrade.includes(normalizedFilter)) {
      return true;
    }

    const gradeNumbers = extractGradeNumbers(grade);
    if (filterNumbers.length === 0 || gradeNumbers.length === 0) {
      return false;
    }

    if (gradeNumbers.length === 1) {
      return gradeNumbers[0] === filterNumbers[0];
    }

    const filterValue = filterNumbers[0];
    const minGrade = Math.min(...gradeNumbers);
    const maxGrade = Math.max(...gradeNumbers);
    return filterValue >= minGrade && filterValue <= maxGrade;
  });
}

function getTutorRatesForFilter(tutor: ParentTutorCard, sessionType: string) {
  if (sessionType === "Virtual") {
    return [tutor.price45, tutor.price60].filter((rate) => rate > 0);
  }

  if (sessionType === "In-Person") {
    return [tutor.inPerson45, tutor.inPerson60].filter((rate) => rate > 0);
  }

  return [tutor.price45, tutor.price60, tutor.inPerson45, tutor.inPerson60].filter((rate) => rate > 0);
}

function sortText(values: string[]) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function buildInitialFilters(students: ParentStudentListItem[], tutors: ParentTutorCard[]): FilterState {
  const maxRate =
    tutors.length > 0 ? Math.max(...tutors.map((tutor) => Math.max(tutor.price60 || 0, tutor.inPerson60 || 0))) : 100;

  return {
    bookingFor: "",
    subject: "",
    gradeLevel: "",
    sessionType: "",
    maxRate: Math.max(30, Math.ceil(maxRate / 5) * 5),
    search: "",
  };
}

export function ParentFindTutorsPage() {
  const [filters, setFilters] = useState<FilterState>({
    bookingFor: "",
    subject: "",
    gradeLevel: "",
    sessionType: "",
    maxRate: 100,
    search: "",
  });
  const [tutors, setTutors] = useState<ParentTutorCard[]>(parentTutorResults);
  const [students, setStudents] = useState<ParentStudentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoadError(null);
        const [liveTutors, parentStudentsResponse] = await Promise.all([
          fetchAvailableParentTutors(),
          getParentStudents(),
        ]);
        if (!mounted) return;

        const activeStudents = (parentStudentsResponse.items || []).filter((student) => student.status === "active");
        const nextTutors = liveTutors.length > 0 ? liveTutors : parentTutorResults;
        const nextFilters = buildInitialFilters(activeStudents, nextTutors);

        setTutors(nextTutors);
        setStudents(activeStudents);
        setFilters(nextFilters);
      } catch (error) {
        if (!mounted) return;
        setTutors(parentTutorResults);
        setStudents([]);
        const nextFilters = buildInitialFilters([], parentTutorResults);
        setFilters(nextFilters);
        setLoadError(error instanceof Error ? error.message : "Unable to load live tutor data.");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const selectedStudent = useMemo(
    () => students.find((student) => student.email === filters.bookingFor) ?? null,
    [students, filters.bookingFor],
  );

  const subjectOptions = useMemo(() => {
    const values = new Set<string>();
    tutors.forEach((tutor) => {
      tutor.subjects.forEach((subject) => {
        const normalized = subject.trim();
        if (normalized) values.add(normalized);
      });
    });
    return sortText(Array.from(values));
  }, [tutors]);

  const gradeOptions = useMemo(() => {
    const values = new Set<string>();
    tutors.forEach((tutor) => {
      tutor.gradeLevels.forEach((grade) => {
        const normalized = grade.trim();
        if (normalized) values.add(normalized);
      });
    });
    return sortText(Array.from(values));
  }, [tutors]);

  const sessionTypeOptions = useMemo(() => {
    const values = new Set<"Virtual" | "In-Person">();
    tutors.forEach((tutor) => {
      tutor.sessionTypes.forEach((type) => values.add(type));
    });
    return Array.from(values);
  }, [tutors]);

  const rateBounds = useMemo(() => {
    const allRates = tutors.flatMap((tutor) => [tutor.price60 || 0, tutor.inPerson60 || 0]).filter((rate) => rate > 0);
    const maxRate = allRates.length > 0 ? Math.max(...allRates) : 100;
    return {
      min: 30,
      max: Math.max(30, Math.ceil(maxRate / 5) * 5),
    };
  }, [tutors]);

  const filteredTutors = useMemo(() => {
    const search = normalizeText(filters.search);

    return tutors.filter((tutor) => {
      const matchesSubject = matchesSubjectFilter(tutor, filters.subject);
      const matchesGrade = matchesGradeFilter(tutor, filters.gradeLevel);
      const matchesSessionType =
        !filters.sessionType ||
        tutor.sessionTypes.includes(filters.sessionType as "Virtual" | "In-Person");
      const comparableRates = getTutorRatesForFilter(tutor, filters.sessionType);
      const matchesRate = comparableRates.length > 0 && comparableRates.some((rate) => rate <= filters.maxRate);
      const matchesSearch =
        search.length === 0 ||
        normalizeText(tutor.name).includes(search) ||
        normalizeText(tutor.title).includes(search) ||
        tutor.subjects.some((subject) => normalizeText(subject).includes(search)) ||
        tutor.gradeLevels.some((grade) => normalizeText(grade).includes(search)) ||
        tutor.sessionTypes.some((type) => normalizeText(type).includes(search)) ||
        normalizeText(tutor.location).includes(search);

      return matchesSubject && matchesGrade && matchesSessionType && matchesRate && matchesSearch;
    });
  }, [filters, tutors]);

  function resetFilters() {
    const nextFilters = buildInitialFilters(students, tutors);
    setFilters(nextFilters);
  }

  function handleBookingForChange(value: string) {
    setFilters((current) => ({
      ...current,
      bookingFor: value,
    }));
  }

  function buildTutorHref(tutorId: string) {
    const params = new URLSearchParams();
    if (filters.bookingFor) {
      params.set("bookingFor", filters.bookingFor);
    }
    if (selectedStudent?.name) {
      params.set("bookingForLabel", selectedStudent.name);
    }
    if (filters.subject) {
      params.set("subject", filters.subject);
    }
    if (filters.gradeLevel) {
      params.set("gradeLevel", filters.gradeLevel);
    }
    if (filters.sessionType) {
      params.set("sessionType", filters.sessionType);
    }
    if (filters.search) {
      params.set("search", filters.search);
    }
    params.set("maxRate", String(filters.maxRate));
    const query = params.toString();
    return `${PARENT_FIND_TUTORS_ROUTE}/${tutorId}${query ? `?${query}` : ""}`;
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
              <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">Booking For</p>
              <select
                value={filters.bookingFor}
                onChange={(event) => handleBookingForChange(event.target.value)}
                className="mt-3 h-10 w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 text-[13px] text-[#4b5563] outline-none"
              >
                <option value="">None selected</option>
                {students.map((student) => (
                  <option key={student.email} value={student.email}>
                    {student.name}
                  </option>
                ))}
              </select>
              {students.length > 0 && filters.bookingFor ? (
                <p className="mt-2 text-[12px] text-[#6b7280]">
                  Student grade: {students.find((student) => student.email === filters.bookingFor)?.grade || "Not set"}
                </p>
              ) : null}
            </div>

            <div className="border-b border-[#eceef2] py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">Subject</p>
              <select
                value={filters.subject}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, subject: event.target.value }))
                }
                className="mt-3 h-10 w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 text-[13px] text-[#4b5563] outline-none"
              >
                <option value="">All subjects</option>
                {subjectOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-b border-[#eceef2] py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">Grade Level</p>
              <select
                value={filters.gradeLevel}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, gradeLevel: event.target.value }))
                }
                className="mt-3 h-10 w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 text-[13px] text-[#4b5563] outline-none"
              >
                <option value="">Any grade</option>
                {gradeOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-b border-[#eceef2] py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">Session Type</p>
              <select
                value={filters.sessionType}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, sessionType: event.target.value }))
                }
                className="mt-3 h-10 w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 text-[13px] text-[#4b5563] outline-none"
              >
                <option value="">All session types</option>
                {sessionTypeOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">Max Rate (Per Session)</p>
              <input
                type="range"
                min={rateBounds.min}
                max={rateBounds.max}
                step={5}
                value={Math.min(Math.max(filters.maxRate, rateBounds.min), rateBounds.max)}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    maxRate: Number(event.target.value),
                  }))
                }
                className="mt-3 h-10 w-full accent-[#d61c3f]"
              />
              <div className="mt-1 flex items-center justify-between text-[12px] font-semibold text-[#6b7280]">
                <span>${rateBounds.min}</span>
                <span>${filters.maxRate}</span>
                <span>${rateBounds.max}</span>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full border border-[#d61c3f] px-4 text-[13px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          <section className="px-4 py-4 sm:px-5 lg:px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-[18px] font-medium text-[#4b5563]">
                <span className="font-bold text-[#20242b]">
                  {isLoading ? "Loading tutors..." : `${filteredTutors.length} tutor${filteredTutors.length === 1 ? "" : "s"} found`}
                </span>{" "}
                {selectedStudent ? `for ${selectedStudent.name}` : "across all available tutors"}
                {filters.subject ? ` - ${filters.subject}` : ""}
              </p>

              <div className="relative w-full max-w-[220px]">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, search: event.target.value }))
                  }
                  placeholder="Search tutors..."
                  className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] pl-11 pr-4 text-[14px] outline-none placeholder:text-[#9ca3af]"
                />
              </div>
            </div>

            {selectedStudent ? (
              <div className="mt-3 rounded-[12px] border border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[13px] text-[#4b5563]">
                Booking is selected for <span className="font-semibold text-[#20242b]">{selectedStudent.name}</span>
                {selectedStudent.grade ? ` (${selectedStudent.grade})` : ""}.
              </div>
            ) : students.length > 0 ? (
              <div className="mt-3 rounded-[12px] border border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[13px] text-[#4b5563]">
                No student selected. Showing all available tutors by default.
              </div>
            ) : null}

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
                        <RatingStars rating={tutor.rating} />
                        <span>{tutor.rating.toFixed(1)}</span>
                        <span className="text-[#8a7a38]">| {tutor.sessions} sessions</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {tutor.subjects.slice(0, 3).map((subject, index) => (
                      <span
                        key={subject}
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          index === 0 ? "bg-[#ffecef] text-[#d94a62]" : "bg-[#f0f1f3] text-[#6b7280]"
                        }`}
                      >
                        {subject}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 text-[13px] text-[#6b7280]">
                    {tutor.sessionTypes.join(" | ")} | {tutor.location}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-[14px] font-bold text-[#20242b]">${tutor.price60} / 60 min</p>
                    <span className="inline-flex rounded-full bg-[#daf2e8] px-2.5 py-1 text-[11px] font-semibold text-[#33976d]">
                      Available
                    </span>
                  </div>

                  <Link
                    href={buildTutorHref(tutor.id)}
                    className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#d61c3f] px-4 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
                  >
                    View Profile
                  </Link>
                </article>
              ))}
            </div>

            {loadError ? <p className="mt-4 text-[12px] text-[#8a5b00]">{loadError}</p> : null}

            {!isLoading && filteredTutors.length === 0 ? (
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
