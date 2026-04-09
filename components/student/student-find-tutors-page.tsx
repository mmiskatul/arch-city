"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiChevronDown, FiStar } from "react-icons/fi";

import { StudentShell } from "@/components/student/student-shell";
import { STUDENT_FIND_TUTORS_ROUTE } from "@/lib/routes";
import { fetchAvailableStudentTutors } from "@/lib/api/public-tutors-api";
import { studentTutors, type StudentTutor } from "@/lib/student/tutors-data";

type SortOption = "featured" | "rating" | "price-low" | "price-high";

const filterOptions = {
  subject: ["Math", "English", "Science", "Reading", "History"],
  gradeLevel: ["Kindergarten", "Grades 1-5", "Grades 6-8", "Grades 9-12", "College-Aged"],
  tutoringMode: ["Virtual", "In-Person"],
  minRating: ["Any", "3+ star", "4+ star", "4.5+ star"],
} as const;

function ratingThreshold(option: string) {
  switch (option) {
    case "3+ star":
      return 3;
    case "4+ star":
      return 4;
    case "4.5+ star":
      return 4.5;
    default:
      return 0;
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text: string, query: string) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return text;

  const pattern = new RegExp(`(${escapeRegExp(trimmedQuery)})`, "ig");
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (part.toLowerCase() === trimmedQuery.toLowerCase()) {
      return (
        <mark key={`${part}-${index}`} className="rounded bg-[#fff2a8] px-0.5 text-inherit">
          {part}
        </mark>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function FilterGroup({
  title,
  items,
  selected,
  onSelect,
}: {
  title: string;
  items: readonly string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}) {
  return (
    <div className="border-b border-[#eceef2] pb-4 last:border-b-0">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.map((item) => {
          const active = selected === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onSelect(active ? null : item)}
              className={`block rounded-md px-1 text-left text-[14px] transition ${
                active ? "font-semibold text-[#d61c3f]" : "text-[#4b5563] hover:text-[#20242b]"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

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
          <span key={value} className="relative inline-flex h-3 w-3 items-center justify-center">
            <FiStar className={`absolute h-3 w-3 ${isFull || isHalf ? "text-[#f3b300]" : "text-[#d1d5db]"}`} />
            {isFull ? <FiStar className="absolute h-3 w-3 fill-[#f3b300] text-[#f3b300]" /> : null}
            {isHalf ? (
              <>
                <FiStar className="absolute h-3 w-3 fill-[#f3b300] text-[#f3b300]" />
                <span className="absolute right-0 top-0 h-full w-1/2 bg-white" />
              </>
            ) : null}
          </span>
        );
      })}
    </span>
  );
}

function TutorCardView({ tutor, searchQuery }: { tutor: StudentTutor; searchQuery: string }) {
  const nextSlot = tutor.availability[0];
  const openSlotCount = tutor.availability.length;

  return (
    <Link
      href={`${STUDENT_FIND_TUTORS_ROUTE}/${tutor.id}`}
      className="block rounded-[14px] border border-[#eceef2] bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition hover:border-[#e4e7ec] hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ffe7eb] text-[16px] font-bold text-[#d61c3f]">
          {tutor.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-bold text-[#20242b]">{highlightText(tutor.name, searchQuery)}</h2>
              <div className="mt-1 flex items-center gap-1 text-[12px] text-[#f3b300]">
                <RatingStars rating={tutor.rating} />
                <span className="ml-1 font-semibold text-[#6b7280]">
                  {tutor.rating > 0 ? `(${tutor.rating.toFixed(1)} - ${tutor.reviews} reviews)` : "(New tutor)"}
                </span>
              </div>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                tutor.mode === "In-Person" ? "bg-[#f1f1f1] text-[#6b7280]" : "bg-[#ffecef] text-[#d94a62]"
              }`}
            >
              {tutor.mode}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tutor.subjects.slice(0, 3).map((subject) => (
          <span
            key={subject}
            className="rounded-md border border-[#e5e7eb] bg-[#f8fafc] px-2 py-1 text-[11px] font-medium text-[#6b7280]"
          >
            {highlightText(subject, searchQuery)}
          </span>
        ))}
      </div>

      <p className="mt-3 text-[13px] text-[#6b7280]">
        {highlightText(tutor.grades, searchQuery)} - {tutor.district}
      </p>

      <div className="mt-3 rounded-[12px] border border-[#eceef2] bg-[#fafbfc] px-3 py-2 text-[12px] text-[#4b5563]">
        <div className="flex items-center justify-between gap-3">
          <span className="font-semibold text-[#20242b]">{openSlotCount} open slot{openSlotCount === 1 ? "" : "s"}</span>
          <span className="rounded-full bg-[#fff6de] px-2 py-0.5 text-[10px] font-medium text-[#b58112]">
            Available
          </span>
        </div>
        {nextSlot ? <p className="mt-1 text-[12px] text-[#6b7280]">{highlightText(`${nextSlot.day} - ${nextSlot.time}`, searchQuery)}</p> : null}
      </div>

      <div className="mt-3 border-t border-[#eceef2] pt-3 text-[13px] text-[#6b7280]">
        <div className="flex items-center justify-between gap-3">
          <span>
            {tutor.mode === "In-Person" ? "In-Person" : "Virtual"}:{" "}
            <span className="font-bold text-[#20242b]">
              {tutor.price45 > 0 ? `$${tutor.price45}/45min` : "Contact"}
            </span>
          </span>
          <span>{tutor.price60 > 0 ? `$${tutor.price60}/60min` : "Contact"}</span>
        </div>
      </div>
    </Link>
  );
}

function TutorCardSkeleton() {
  return (
    <div className="block rounded-[14px] border border-[#eceef2] bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <div className="animate-pulse">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-full bg-[#eef1f4]" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-[#eef1f4]" />
                <div className="h-3 w-28 rounded bg-[#eef1f4]" />
              </div>
              <div className="h-6 w-16 rounded-full bg-[#eef1f4]" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <div className="h-6 w-20 rounded-md bg-[#eef1f4]" />
          <div className="h-6 w-24 rounded-md bg-[#eef1f4]" />
          <div className="h-6 w-16 rounded-md bg-[#eef1f4]" />
        </div>

        <div className="mt-3 h-4 w-3/4 rounded bg-[#eef1f4]" />

        <div className="mt-3 rounded-[12px] border border-[#eceef2] bg-[#fafbfc] px-3 py-2">
          <div className="flex items-center justify-between gap-3">
            <div className="h-4 w-24 rounded bg-[#eef1f4]" />
            <div className="h-5 w-16 rounded-full bg-[#eef1f4]" />
          </div>
          <div className="mt-2 h-3 w-32 rounded bg-[#eef1f4]" />
        </div>

        <div className="mt-3 border-t border-[#eceef2] pt-3">
          <div className="flex items-center justify-between gap-3">
            <div className="h-3.5 w-24 rounded bg-[#eef1f4]" />
            <div className="h-3.5 w-16 rounded bg-[#eef1f4]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StudentFindTutorsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string | null>(null);
  const [selectedTutoringMode, setSelectedTutoringMode] = useState<string | null>(null);
  const [selectedMinRating, setSelectedMinRating] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [tutors, setTutors] = useState<StudentTutor[]>(studentTutors);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadTutors() {
      try {
        setLoadError(null);
        const liveTutors = await fetchAvailableStudentTutors();
        if (mounted) {
          setTutors(liveTutors);
        }
      } catch (error) {
        if (mounted) {
          setTutors(studentTutors);
          setLoadError(error instanceof Error ? error.message : "Unable to load live tutor availability.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadTutors();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredTutors = useMemo(() => {
    const filtered = tutors.filter((tutor) => {
      const matchesSearch =
        !searchQuery ||
        [tutor.name, tutor.grades, ...tutor.subjects]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery);
      const matchesSubject = !selectedSubject || tutor.subjects.includes(selectedSubject);
      const matchesGrade = !selectedGradeLevel || tutor.gradeGroup === selectedGradeLevel;
      const matchesMode =
        !selectedTutoringMode ||
        tutor.mode === selectedTutoringMode ||
        (selectedTutoringMode === "Virtual" && tutor.mode === "Both") ||
        (selectedTutoringMode === "In-Person" && tutor.mode === "Both");
      const matchesRating = tutor.rating >= ratingThreshold(selectedMinRating ?? "Any");

      return matchesSearch && matchesSubject && matchesGrade && matchesMode && matchesRating;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price-low":
          return a.price45 - b.price45;
        case "price-high":
          return b.price45 - a.price45;
        default:
          return b.availability.length - a.availability.length || b.rating - a.rating || a.name.localeCompare(b.name);
      }
    });
  }, [searchQuery, selectedGradeLevel, selectedMinRating, selectedSubject, selectedTutoringMode, sortBy, tutors]);

  function resetFilters() {
    setSelectedSubject(null);
    setSelectedGradeLevel(null);
    setSelectedTutoringMode(null);
    setSelectedMinRating(null);
    setSortBy("featured");
  }

  return (
    <StudentShell>
      <div className="w-full">
        <div className="grid gap-0 xl:grid-cols-[204px_minmax(0,1fr)]">
          <aside className="border-b border-[#eceef2] pb-6 xl:border-r xl:border-b-0 xl:pb-0 xl:pr-4">
            <div className="pr-4">
              <h1 className="text-[18px] font-bold text-[#20242b]">Filters</h1>
              <div className="mt-4 space-y-4">
                <FilterGroup
                  title="Subject"
                  items={filterOptions.subject}
                  selected={selectedSubject}
                  onSelect={setSelectedSubject}
                />
                <FilterGroup
                  title="Grade Level"
                  items={filterOptions.gradeLevel}
                  selected={selectedGradeLevel}
                  onSelect={setSelectedGradeLevel}
                />
                <FilterGroup
                  title="Tutoring Mode"
                  items={filterOptions.tutoringMode}
                  selected={selectedTutoringMode}
                  onSelect={setSelectedTutoringMode}
                />
                <FilterGroup
                  title="Min Rating"
                  items={filterOptions.minRating}
                  selected={selectedMinRating}
                  onSelect={setSelectedMinRating}
                />
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 inline-flex h-8 w-full items-center justify-center rounded-full border border-[#d61c3f] px-4 text-[14px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          <section className="pt-6 xl:pl-4 xl:pt-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-[#20242b]">
                  {isLoading ? "Loading tutors..." : `${filteredTutors.length} tutor${filteredTutors.length === 1 ? "" : "s"} found`}
                </h2>
                {!isLoading && searchQuery ? (
                  <p className="mt-1 text-[12px] text-[#6b7280]">
                    Showing results for <span className="font-semibold text-[#20242b]">&quot;{searchQuery}&quot;</span>
                  </p>
                ) : null}
                {loadError ? <p className="mt-1 text-[12px] text-[#8a5b00]">{loadError}</p> : null}
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <label htmlFor="sort-by" className="text-[13px] font-medium text-[#6b7280]">
                  Sort by:
                </label>
                <div className="relative">
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortOption)}
                    className="h-8 appearance-none rounded-lg border border-[#e5e7eb] bg-[#fafafa] pl-3 pr-8 text-[13px] text-[#4b5563] outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="rating">Top rated</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <TutorCardSkeleton key={`tutor-skeleton-${index}`} />
                ))}
              </div>
            ) : (
              <>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                  {filteredTutors.map((tutor) => (
                    <TutorCardView key={tutor.id} tutor={tutor} searchQuery={searchQuery} />
                  ))}
                </div>

                {filteredTutors.length === 0 ? (
                  <div className="mt-8 rounded-[14px] border border-[#eceef2] bg-white px-5 py-8 text-center text-[14px] text-[#6b7280]">
                    No tutors match the selected filters.
                  </div>
                ) : null}
              </>
            )}
          </section>
        </div>
      </div>
    </StudentShell>
  );
}
