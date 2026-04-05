import { notFound, redirect } from "next/navigation";

import { AdminTutorDetailPage } from "@/components/admin/admin-tutor-detail-page";
import { apiGet } from "@/lib/api/api-client";
import type { AdminTutorDetail } from "@/lib/admin/tutors-data";

type TutorApiStatus = "approved" | "unverified" | "suspended";

type TutorDetailApiResponse = {
  item: {
    tutor_id: string;
    name: string;
    email: string;
    status: TutorApiStatus;
    application_id?: string | null;
    rating: string;
    total_sessions: number;
    total_sessions_delta: string;
    active_students: number;
    families_count: number;
    earned_mtd: string;
    standard_rate: string;
    review_count: number;
    personal_information: {
      full_name: string;
      email: string;
      phone: string;
      district: string;
      joined: string;
    };
    subject_levels: Array<{
      subject: string;
      grade_range: string;
      level: "primary" | "secondary";
    }>;
    bio: string;
    rates: {
      standard_rate: string;
      sat_prep_rate: string;
      group_rate: string;
    };
    locations: string[];
    disabled_locations: string[];
    education: Array<{
      degree: string;
      school: string;
      years: string;
    }>;
    work_experience: Array<{
      role: string;
      organization: string;
      years: string;
      focus: string;
      icon_style: "rose" | "amber" | "slate";
    }>;
    current_students: Array<{
      initials: string;
      name: string;
      subject: string;
      schedule: string;
    }>;
    recent_sessions: Array<{
      date: string;
      student: string;
      subject: string;
      duration: string;
      earned: string;
      status: "completed" | "no_show";
    }>;
  };
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "TU";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function initialsClassFromName(name: string) {
  const first = name.toLowerCase().charCodeAt(0) || 0;
  const classes = [
    "bg-[#ffe7eb] text-[#d94a62]",
    "bg-[#f1f1f1] text-[#6b7280]",
    "bg-[#ebf7ef] text-[#239157]",
    "bg-[#fff6de] text-[#b58112]",
  ];
  return classes[first % classes.length];
}

function toUiStatus(status: TutorApiStatus): "Approved" | "Unverified" | "Suspended" {
  if (status === "approved") return "Approved";
  if (status === "unverified") return "Unverified";
  return "Suspended";
}

function iconClassName(style: "rose" | "amber" | "slate") {
  if (style === "rose") return "bg-[#ffecef] text-[#d94a62]";
  if (style === "amber") return "bg-[#fff6de] text-[#b58112]";
  return "bg-[#f1f1f1] text-[#6b7280]";
}

function toUiModel(payload: TutorDetailApiResponse): AdminTutorDetail {
  const item = payload.item;
  const initials = initialsFromName(item.name);

  return {
    id: item.tutor_id,
    initials,
    initialsClassName: initialsClassFromName(item.name),
    name: item.name,
    email: item.email,
    status: toUiStatus(item.status),
    applicationId: item.application_id || undefined,
    rating: item.rating,
    totalSessions: item.total_sessions,
    totalSessionsDelta: item.total_sessions_delta,
    activeStudents: item.active_students,
    familiesCount: item.families_count,
    earnedMtd: item.earned_mtd,
    standardRate: item.standard_rate,
    reviewCount: item.review_count,
    personalInformation: {
      fullName: item.personal_information.full_name,
      email: item.personal_information.email,
      phone: item.personal_information.phone,
      district: item.personal_information.district,
      joined: item.personal_information.joined,
    },
    subjectLevels: item.subject_levels.map((entry) => ({
      subject: entry.subject,
      gradeRange: entry.grade_range,
      level: entry.level === "primary" ? "Primary" : "Secondary",
    })),
    bio: item.bio,
    rates: {
      standardRate: item.rates.standard_rate,
      satPrepRate: item.rates.sat_prep_rate,
      groupRate: item.rates.group_rate,
    },
    locations: item.locations,
    disabledLocations: item.disabled_locations,
    education: item.education.map((entry) => ({
      degree: entry.degree,
      school: entry.school,
      years: entry.years,
    })),
    workExperience: item.work_experience.map((entry) => ({
      role: entry.role,
      organization: entry.organization,
      years: entry.years,
      focus: entry.focus,
      iconClassName: iconClassName(entry.icon_style),
    })),
    currentStudents: item.current_students.map((entry) => ({
      initials: entry.initials,
      initialsClassName: initialsClassFromName(entry.name),
      name: entry.name,
      subject: entry.subject,
      schedule: entry.schedule,
    })),
    recentSessions: item.recent_sessions.map((entry) => ({
      date: entry.date,
      student: entry.student,
      subject: entry.subject,
      duration: entry.duration,
      earned: entry.earned,
      status: entry.status === "completed" ? "Completed" : "No-Show",
    })),
  };
}

export default async function AdminTutorDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let payload: TutorDetailApiResponse;
  try {
    payload = await apiGet<TutorDetailApiResponse>(`/admin-dashboard/tutors/${encodeURIComponent(id)}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("(401)") || message.includes("(403)")) {
      redirect("/login");
    }

    notFound();
  }
  if (!payload?.item) {
    notFound();
  }

  return <AdminTutorDetailPage tutor={toUiModel(payload)} />;
}
