"use client";

import { useMemo, useState } from "react";
import { FiCalendar, FiClock, FiUsers } from "react-icons/fi";

type SessionStatus = "upcoming" | "completed" | "cancelled";

type ScheduleCard = {
  id: string;
  status: SessionStatus;
  student: string;
  tutor: string;
  heardFrom: string;
  price: string;
  date: string;
  time: string;
  duration: string;
  mode: "Virtual" | "In-person";
};

const scheduleData: ScheduleCard[] = [
  {
    id: "#69A9E6FB3CAFE31F950BE9B",
    status: "completed",
    student: "Student T. 2nd",
    tutor: "Arch City T.",
    heardFrom: "Facebook Ad",
    price: "$50",
    date: "03-10-2026",
    time: "6:00 AM",
    duration: "60 mins",
    mode: "Virtual",
  },
  {
    id: "#69A888F52A054D71563E7A58",
    status: "completed",
    student: "Maurice P. null",
    tutor: "Bria H.",
    heardFrom: "Google Search",
    price: "$45",
    date: "03-06-2026",
    time: "9:45 AM",
    duration: "60 mins",
    mode: "In-person",
  },
  {
    id: "#69A2100FC995FCE71CD9D60",
    status: "completed",
    student: "Maurice P. null",
    tutor: "Bria H.",
    heardFrom: "Word of Mouth",
    price: "$45",
    date: "03-03-2026",
    time: "3:30 PM",
    duration: "60 mins",
    mode: "In-person",
  },
  {
    id: "#69A1C1BFAD546592A9B079E8",
    status: "completed",
    student: "Daniel V. 10th",
    tutor: "Mary W.",
    heardFrom: "Indeed",
    price: "$32",
    date: "03-01-2026",
    time: "4:30 PM",
    duration: "60 mins",
    mode: "In-person",
  },
  {
    id: "#699C4F1B7BCEEBD4A0BA235",
    status: "completed",
    student: "Deniyu G. 6th",
    tutor: "Mary W.",
    heardFrom: "Virtual",
    price: "$23",
    date: "02-28-2026",
    time: "1:30 PM",
    duration: "45 mins",
    mode: "Virtual",
  },
  {
    id: "#699F8F52678F0434C408F9184",
    status: "completed",
    student: "Maurice P. null",
    tutor: "Bria H.",
    heardFrom: "Facebook Ad",
    price: "$45",
    date: "02-24-2026",
    time: "3:30 PM",
    duration: "60 mins",
    mode: "In-person",
  },
];

const filters: { label: string; value: SessionStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function AdminSchedulesPage() {
  const [activeFilter, setActiveFilter] = useState<typeof filters[number]["value"]>("all");

  const visibleSessions = useMemo(() => {
    if (activeFilter === "all") {
      return scheduleData;
    }
    return scheduleData.filter((session) => session.status === activeFilter);
  }, [activeFilter]);

  return (
    <div>
      <div className="mt-12 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#111827]">Schedules</h1>
          <p className="text-lg text-[#6b7280]">View upcoming, completed, and cancelled tutoring sessions here:</p>
        </div>
        <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_10px_20px_rgba(0,0,0,0.08)]">
          <FiCalendar className="h-5 w-5 text-[#0d1d57]" />
          <span className="text-sm font-semibold text-[#0d1d57]">Filter</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.label}
            type="button"
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeFilter === filter.value
                ? "bg-[#ef242a] text-white"
                : "border border-[#e5e7eb] text-[#4b5563] hover:border-[#ef242a]/50"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {visibleSessions.map((session) => (
          <article
            key={session.id}
            className="rounded-[28px] border border-[#ececec] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase text-[#6b7280]">{session.id}</p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  session.status === "completed" ? "bg-[#ecfdf3] text-[#15803d]" : "bg-[#fff5f5] text-[#dc2626]"
                }`}
              >
                {session.status}
              </span>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs text-[#6b7280]">Student</p>
                <p className="text-lg font-semibold text-[#111827]">{session.student}</p>
                <p className="text-sm text-[#6b7280]">Heard via {session.heardFrom}</p>
              </div>
              <div>
                <p className="text-xs text-[#6b7280]">Tutor</p>
                <p className="text-lg font-semibold text-[#111827]">{session.tutor}</p>
                <p className="text-sm text-[#6b7280]">{session.mode} • {session.duration}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-6 text-sm text-[#6b7280]">
              <span className="inline-flex items-center gap-1">
                <FiUsers className="h-4 w-4" />
                {session.price}
              </span>
              <span className="inline-flex items-center gap-1">
                <FiCalendar className="h-4 w-4" />
                {session.date}
              </span>
              <span className="inline-flex items-center gap-1">
                <FiClock className="h-4 w-4" />
                {session.time}
              </span>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 rounded-full bg-[#16a34a] px-5 py-2 text-sm font-semibold text-white">Details</button>
              <button className="flex-1 rounded-full border border-[#e5e7eb] px-5 py-2 text-sm font-semibold text-[#111827]">Reschedule</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
