import { notFound, redirect } from "next/navigation";

import { AdminStudentDetailPage } from "@/components/admin/admin-student-detail-page";
import { apiGet } from "@/lib/api/api-client";
import type { AdminStudentDetail } from "@/lib/admin/students-data";

type LegacyStudentDetailApiItem = {
  student_id: string;
  name: string;
  email: string;
  grade: string;
  guardian: string;
  sessions: number;
  last_session: string;
  subjects: string[];
  status: "active" | "inactive";
  is_suspended?: boolean;
};

type RichStudentDetailApiItem = {
  student_id: string;
  name: string;
  email: string;
  grade: string;
  guardian: string;
  status: "active" | "inactive";
  is_suspended?: boolean;
  total_sessions: number;
  total_sessions_delta: string;
  current_plan_name: string;
  current_plan_meta: string;
  current_plan_price: string;
  member_since: string;
  member_since_delta: string;
  student_information: {
    full_name: string;
    email: string;
    grade: string;
    school: string;
    date_of_birth: string;
  };
  parent_guardian: {
    name: string;
    email: string;
    phone: string;
  };
  plan_billing: {
    name: string;
    status: "active" | "inactive";
    sessions_per_month: string;
    amount: string;
    next_billing_date: string;
    used_sessions: string;
  };
  active_lesson: {
    subject: string;
    status: "ongoing" | "upcoming";
    tutor: string;
    tutor_rating: string;
    day_time: string;
    duration: string;
    location: string;
    rate: string;
    next_session: string;
  };
  upcoming_schedule: Array<{
    month: string;
    day: string;
    subject: string;
    tutor: string;
    time: string;
    mode: string;
    status: "confirmed" | "pending";
  }>;
  session_history: Array<{
    date: string;
    subject: string;
    tutor: string;
    duration: string;
    status: "completed" | "no_show";
  }>;
};

type StudentDetailApiItem = LegacyStudentDetailApiItem | RichStudentDetailApiItem;

type StudentDetailApiResponse = {
  item: StudentDetailApiItem;
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "ST";
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

function toUiStatus(status: "active" | "inactive") {
  return status === "active" ? "Active" : "Inactive";
}

function toUiLessonStatus(status: "ongoing" | "upcoming") {
  return status === "ongoing" ? "Ongoing" : "Upcoming";
}

function toUiScheduleStatus(status: "confirmed" | "pending") {
  return status === "confirmed" ? "Confirmed" : "Pending";
}

function toUiHistoryStatus(status: "completed" | "no_show") {
  return status === "completed" ? "Completed" : "No-Show";
}

function isRichItem(item: StudentDetailApiItem): item is RichStudentDetailApiItem {
  return "student_information" in item && "active_lesson" in item && "plan_billing" in item;
}

function toDetailModel(item: StudentDetailApiItem): AdminStudentDetail {
  const uiStatus = toUiStatus(item.status);
  const initials = initialsFromName(item.name);
  const isSuspended = Boolean(item.is_suspended ?? false);

  if (!isRichItem(item)) {
    return {
      id: item.student_id,
      initials,
      initialsClassName: initialsClassFromName(item.name),
      name: item.name,
      email: item.email,
      grade: item.grade,
      status: uiStatus,
      isSuspended,
      totalSessions: item.sessions,
      totalSessionsDelta: "+0 this month",
      currentPlanName: "Student Plan",
      currentPlanMeta: "N/A",
      currentPlanPrice: "$0/mo",
      memberSince: "N/A",
      memberSinceDelta: "-",
      studentInformation: {
        fullName: item.name,
        email: item.email,
        grade: item.grade,
        school: "Not provided",
        dateOfBirth: "Not provided",
      },
      parentGuardian: {
        name: item.guardian || "Not assigned",
        email: "Not provided",
        phone: "Not provided",
      },
      planBilling: {
        name: "Student Plan",
        status: uiStatus,
        sessionsPerMonth: "N/A",
        amount: "$0/month",
        nextBillingDate: "Not scheduled",
        usedSessions: `${item.sessions} total`,
      },
      activeLesson: {
        subject: item.subjects[0] || "No active lesson",
        status: "Upcoming",
        tutor: "Not assigned",
        tutorRating: "-",
        dayTime: "Not scheduled",
        duration: "-",
        location: "-",
        rate: "-",
        nextSession: "Not scheduled",
      },
      upcomingSchedule: [],
      sessionHistory: [],
    };
  }

  return {
    id: item.student_id,
    initials,
    initialsClassName: initialsClassFromName(item.name),
    name: item.name,
    email: item.email,
    grade: item.grade,
    status: uiStatus,
    isSuspended,
    totalSessions: item.total_sessions,
    totalSessionsDelta: item.total_sessions_delta,
    currentPlanName: item.current_plan_name,
    currentPlanMeta: item.current_plan_meta,
    currentPlanPrice: item.current_plan_price,
    memberSince: item.member_since,
    memberSinceDelta: item.member_since_delta,
    studentInformation: {
      fullName: item.student_information.full_name,
      email: item.student_information.email,
      grade: item.student_information.grade,
      school: item.student_information.school,
      dateOfBirth: item.student_information.date_of_birth,
    },
    parentGuardian: {
      name: item.parent_guardian.name,
      email: item.parent_guardian.email,
      phone: item.parent_guardian.phone,
    },
    planBilling: {
      name: item.plan_billing.name,
      status: toUiStatus(item.plan_billing.status),
      sessionsPerMonth: item.plan_billing.sessions_per_month,
      amount: item.plan_billing.amount,
      nextBillingDate: item.plan_billing.next_billing_date,
      usedSessions: item.plan_billing.used_sessions,
    },
    activeLesson: {
      subject: item.active_lesson.subject,
      status: toUiLessonStatus(item.active_lesson.status),
      tutor: item.active_lesson.tutor,
      tutorRating: item.active_lesson.tutor_rating,
      dayTime: item.active_lesson.day_time,
      duration: item.active_lesson.duration,
      location: item.active_lesson.location,
      rate: item.active_lesson.rate,
      nextSession: item.active_lesson.next_session,
    },
    upcomingSchedule: item.upcoming_schedule.map((schedule) => ({
      month: schedule.month,
      day: schedule.day,
      subject: schedule.subject,
      tutor: schedule.tutor,
      time: schedule.time,
      mode: schedule.mode,
      status: toUiScheduleStatus(schedule.status),
    })),
    sessionHistory: item.session_history.map((session) => ({
      date: session.date,
      subject: session.subject,
      tutor: session.tutor,
      duration: session.duration,
      status: toUiHistoryStatus(session.status),
    })),
  };
}

export default async function AdminStudentDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let payload: StudentDetailApiResponse;
  try {
    payload = await apiGet<StudentDetailApiResponse>(`/admin-dashboard/students/${encodeURIComponent(id)}`);
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

  return <AdminStudentDetailPage student={toDetailModel(payload.item)} />;
}
