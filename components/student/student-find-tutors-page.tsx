"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiChevronDown, FiStar } from "react-icons/fi";

import { StudentShell } from "@/components/student/student-shell";
import { STUDENT_FIND_TUTORS_ROUTE } from "@/lib/routes";
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
      <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#6b7280]">
        {title}
      </h3>
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

function TutorCardView({ tutor }: { tutor: StudentTutor }) {
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
          <h2 className="truncate text-[15px] font-bold text-[#20242b]">{tutor.name}</h2>
          <div className="mt-1 flex items-center gap-1 text-[12px] text-[#f3b300]">
            {[0, 1, 2, 3, 4].map((star) => (
              <FiStar key={star} className="h-3 w-3 fill-current" />
            ))}
            <span className="ml-1 font-semibold text-[#6b7280]">({tutor.reviews})</span>
          </div>
          <div className="mt-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                tutor.mode === "In-Person" ? "bg-[#f1f1f1] text-[#6b7280]" : "bg-[#ffecef] text-[#d94a62]"
              }`}
            >
              {tutor.mode}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tutor.subjects.slice(1).map((subject) => (
          <span
            key={subject}
            className="rounded-md border border-[#e5e7eb] bg-[#f8fafc] px-2 py-1 text-[11px] font-medium text-[#6b7280]"
          >
            {subject}
          </span>
        ))}
      </div>

      <p className="mt-3 text-[13px] text-[#6b7280]">
        {tutor.grades} · {tutor.district}
      </p>

      <div className="mt-3 border-t border-[#eceef2] pt-3 text-[13px] text-[#6b7280]">
        <div className="flex items-center justify-between gap-3">
          <span>
            {tutor.mode === "In-Person" ? "In-Person" : "Virtual"}:{" "}
            <span className="font-bold text-[#20242b]">${tutor.price45}/45min</span>
          </span>
          <span>${tutor.price60}/60min</span>
        </div>
      </div>
    </Link>
  );
}

export function StudentFindTutorsPage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string | null>(null);
  const [selectedTutoringMode, setSelectedTutoringMode] = useState<string | null>(null);
  const [selectedMinRating, setSelectedMinRating] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const filteredTutors = useMemo(() => {
    const filtered = studentTutors.filter((tutor) => {
      const matchesSubject = !selectedSubject || tutor.subjects.includes(selectedSubject);
      const matchesGrade = !selectedGradeLevel || tutor.gradeGroup === selectedGradeLevel;
      const matchesMode =
        !selectedTutoringMode ||
        tutor.mode === selectedTutoringMode ||
        (selectedTutoringMode === "Virtual" && tutor.mode === "Both") ||
        (selectedTutoringMode === "In-Person" && tutor.mode === "Both");
      const matchesRating = tutor.rating >= ratingThreshold(selectedMinRating ?? "Any");

      return matchesSubject && matchesGrade && matchesMode && matchesRating;
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
          return 0;
      }
    });
  }, [selectedGradeLevel, selectedMinRating, selectedSubject, selectedTutoringMode, sortBy]);

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
                <FilterGroup title="Subject" items={filterOptions.subject} selected={selectedSubject} onSelect={setSelectedSubject} />
                <FilterGroup title="Grade Level" items={filterOptions.gradeLevel} selected={selectedGradeLevel} onSelect={setSelectedGradeLevel} />
                <FilterGroup title="Tutoring Mode" items={filterOptions.tutoringMode} selected={selectedTutoringMode} onSelect={setSelectedTutoringMode} />
                <FilterGroup title="Min Rating" items={filterOptions.minRating} selected={selectedMinRating} onSelect={setSelectedMinRating} />
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
              <h2 className="text-[16px] font-bold text-[#20242b]">
                {filteredTutors.length} tutor{filteredTutors.length === 1 ? "" : "s"} found
              </h2>
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

            <div className="mt-5 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {filteredTutors.map((tutor) => (
                <TutorCardView key={tutor.id} tutor={tutor} />
              ))}
            </div>

            {filteredTutors.length === 0 ? (
              <div className="mt-8 rounded-[14px] border border-[#eceef2] bg-white px-5 py-8 text-center text-[14px] text-[#6b7280]">
                No tutors match the selected filters.
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </StudentShell>
  );
}
