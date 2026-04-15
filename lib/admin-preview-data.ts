import type { ParentSessionHistoryItem, ParentSessionHistoryResponse } from "@/lib/api/parent-schedule-types";
import type { ParentStudentListItem } from "@/lib/api/parent-students-api";
import { adminStudents, getAdminStudentDetailById } from "@/lib/admin/students-data";
import { getAdminTutorDetailById } from "@/lib/admin/tutors-data";
import { parentProfile, parentProfileHistoryItems } from "@/lib/parent/profile-data";
import { studentProfile } from "@/lib/student/profile-data";
import type { StudentScheduleItem } from "@/lib/student/schedule-data";
import { studentScheduleItems } from "@/lib/student/schedule-data";
import { tutorProfile } from "@/lib/tutor/profile-data";
import type { TutorScheduleItem } from "@/lib/tutor/schedule-data";
import { tutorScheduleItems } from "@/lib/tutor/schedule-data";

function splitName(value: string) {
  const parts = String(value || "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}

function initialsFromName(value: string, fallback: string) {
  const parts = String(value || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return fallback;
}

function monthTokenToNumber(value: string) {
  const month = String(value || "").trim().slice(0, 3).toLowerCase();
  const map: Record<string, string> = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12",
  };
  return map[month] || "03";
}

function studentScheduleFromDetail(targetId?: string): StudentScheduleItem[] {
  const detail = targetId ? getAdminStudentDetailById(targetId) : undefined;
  if (!detail) return studentScheduleItems;

  const upcoming = detail.upcomingSchedule.map((item, index) => ({
    id: `${detail.id}-upcoming-${index + 1}`,
    tutorId: `${detail.id}-tutor-${index + 1}`,
    tutorInitials: initialsFromName(item.tutor, "TU"),
    tutorName: item.tutor,
    subject: item.subject,
    date: `${item.month}, ${item.day}`,
    time: item.time.split("-")[0]?.trim() || "4:00 PM",
    duration: detail.activeLesson.duration,
    type: item.mode === "Online" ? "Virtual" : "In-Person",
    status: item.status === "Pending" ? "Completion Requested" : "Upcoming",
    fullDate: `${item.month} ${item.day}, 2026`,
    sessionRate: Number.parseInt(detail.activeLesson.rate.replace(/[^0-9]/g, ""), 10) || 55,
    chat: [],
  })) satisfies StudentScheduleItem[];

  const history = detail.sessionHistory.map((item, index) => ({
    id: `${detail.id}-history-${index + 1}`,
    tutorId: `${detail.id}-history-tutor-${index + 1}`,
    tutorInitials: initialsFromName(item.tutor, "TU"),
    tutorName: item.tutor,
    subject: item.subject,
    date: item.date,
    time: "4:00 PM",
    duration: item.duration === "—" || item.duration === "â€”" ? "60 min" : item.duration,
    type: "Virtual",
    status: item.status === "Completed" ? "Completed" : "Cancelled",
    fullDate: item.date,
    sessionRate: Number.parseInt(detail.activeLesson.rate.replace(/[^0-9]/g, ""), 10) || 55,
    chat: [],
  })) satisfies StudentScheduleItem[];

  return [...upcoming, ...history];
}

export function getAdminPreviewStudentProfile(targetId?: string) {
  const detail = targetId ? getAdminStudentDetailById(targetId) : undefined;
  if (!detail) {
    return {
      firstName: studentProfile.firstName,
      lastName: studentProfile.lastName,
      initials: studentProfile.initials,
      email: studentProfile.email,
      gradeLevel: studentProfile.gradeLevel,
      planName: studentProfile.planName,
      planPrice: studentProfile.planPrice,
      renewsOn: studentProfile.renewsOn,
      activePlanLabel: studentProfile.activePlanLabel,
    };
  }

  const { firstName, lastName } = splitName(detail.name);
  return {
    firstName,
    lastName,
    initials: detail.initials,
    email: detail.email,
    gradeLevel: detail.grade,
    planName: detail.currentPlanName,
    planPrice: detail.currentPlanPrice,
    renewsOn: detail.planBilling.nextBillingDate,
    activePlanLabel: `${detail.planBilling.status} Plan - ${detail.currentPlanPrice}`,
  };
}

export function getAdminPreviewStudentSchedule(targetId?: string) {
  return studentScheduleFromDetail(targetId);
}

export function getAdminPreviewStudentSession(targetId: string | undefined, sessionId: string) {
  return studentScheduleFromDetail(targetId).find((item) => item.id === sessionId) ?? null;
}

function familyRowsFromStudent(targetId?: string) {
  const detail = targetId ? getAdminStudentDetailById(targetId) : undefined;
  if (!detail) return [];
  return adminStudents.filter((item) => item.guardian === detail.parentGuardian.name);
}

export function getAdminPreviewParentProfile(targetId?: string) {
  const detail = targetId ? getAdminStudentDetailById(targetId) : undefined;
  if (!detail) return parentProfile;

  const { firstName, lastName } = splitName(detail.parentGuardian.name);
  return {
    ...parentProfile,
    initials: initialsFromName(detail.parentGuardian.name, "PA"),
    firstName: firstName || parentProfile.firstName,
    lastName: lastName || parentProfile.lastName,
    email: detail.parentGuardian.email,
    phone: detail.parentGuardian.phone,
  };
}

export function getAdminPreviewParentStudents(targetId?: string): ParentStudentListItem[] {
  const familyRows = familyRowsFromStudent(targetId);
  if (!familyRows.length) return [];

  return familyRows.map((student) => ({
    id: student.id,
    email: student.email,
    initials: student.initials,
    name: student.name,
    grade: student.grade,
    school: getAdminStudentDetailById(student.id)?.studentInformation.school || "School",
    status: student.status === "Active" ? "active" : "declined",
    added_label: `Added ${getAdminStudentDetailById(student.id)?.memberSince || "Recently"}`,
    active_tutor_initials: initialsFromName(getAdminStudentDetailById(student.id)?.activeLesson.tutor || "", "TU"),
    active_tutor_name: getAdminStudentDetailById(student.id)?.activeLesson.tutor || "Tutor",
    sessions_total: student.sessions,
  }));
}

export function getAdminPreviewParentHistory(targetId?: string): ParentSessionHistoryItem[] {
  const familyRows = familyRowsFromStudent(targetId);
  if (!familyRows.length) {
    return parentProfileHistoryItems.map((item, index) => ({
      id: item.id,
      studentEmail: `${item.student.toLowerCase()}@email.com`,
      studentInitials: item.studentInitials,
      studentName: item.student,
      studentGrade: "",
      tutorId: `preview-parent-${index + 1}`,
      tutorInitials: item.tutorInitials,
      tutorName: item.tutorName,
      subject: item.subject,
      date: item.dateLabel,
      fullDate: item.dateLabel,
      time: item.dateLabel,
      endTime: "",
      duration: item.duration,
      type: item.type,
      rate: item.amount,
      status: item.status,
      sessionDate: item.dateLabel,
      sessionTime: item.dateLabel,
      durationMinutes: Number.parseInt(item.duration, 10) || 60,
      amount: item.amount,
      currency: "USD",
      checkoutId: `preview-parent-${index + 1}`,
      createdAt: `2026-03-${String(index + 1).padStart(2, "0")}T09:00:00.000Z`,
      details: {},
      messages: [],
    }));
  }

  return familyRows.flatMap((row, rowIndex) => {
    const detail = getAdminStudentDetailById(row.id);
    if (!detail) return [];
    return detail.sessionHistory.map((item, index) => ({
      id: `${row.id}-parent-history-${index + 1}`,
      studentEmail: row.email,
      studentInitials: row.initials,
      studentName: row.name,
      studentGrade: row.grade,
      tutorId: `${row.id}-parent-tutor-${index + 1}`,
      tutorInitials: initialsFromName(item.tutor, "TU"),
      tutorName: item.tutor,
      subject: item.subject,
      date: item.date,
      fullDate: item.date,
      time: detail.activeLesson.dayTime,
      endTime: "",
      duration: item.duration === "—" || item.duration === "â€”" ? "60 min" : item.duration,
      type: "Virtual",
      rate: item.status === "Completed" ? detail.activeLesson.rate : "—",
      status: item.status === "Completed" ? "Completed" : "Cancelled",
      sessionDate: `2026-${monthTokenToNumber("Mar")}-${String(index + rowIndex + 1).padStart(2, "0")}`,
      sessionTime: detail.activeLesson.dayTime,
      durationMinutes: 60,
      amount: item.status === "Completed" ? detail.activeLesson.rate : "—",
      currency: "USD",
      checkoutId: `${row.id}-parent-checkout-${index + 1}`,
      createdAt: `2026-03-${String(index + rowIndex + 1).padStart(2, "0")}T09:00:00.000Z`,
      details: {},
      messages: [],
    }));
  });
}

export function getAdminPreviewParentSchedule(targetId?: string): ParentSessionHistoryResponse {
  const students = getAdminPreviewParentStudents(targetId);
  const familyRows = familyRowsFromStudent(targetId);
  const items: ParentSessionHistoryItem[] = familyRows.flatMap((row) => {
    const detail = getAdminStudentDetailById(row.id);
    if (!detail) return [];
    return detail.upcomingSchedule.map((item, index) => ({
      id: `${row.id}-parent-upcoming-${index + 1}`,
      studentEmail: row.email,
      studentInitials: row.initials,
      studentName: row.name,
      studentGrade: row.grade,
      tutorId: `${row.id}-parent-upcoming-tutor-${index + 1}`,
      tutorInitials: initialsFromName(item.tutor, "TU"),
      tutorName: item.tutor,
      subject: item.subject,
      date: `${item.month} ${item.day}`,
      fullDate: `${item.month} ${item.day}, 2026`,
      time: item.time.split("-")[0]?.trim() || "4:00 PM",
      endTime: "",
      duration: detail.activeLesson.duration,
      type: item.mode === "Online" ? "Virtual" : "In-Person",
      rate: detail.activeLesson.rate,
      status: item.status === "Pending" ? "Completion Requested" : "Upcoming",
      sessionDate: `2026-${monthTokenToNumber(item.month)}-${String(item.day).padStart(2, "0")}`,
      sessionTime: item.time,
      durationMinutes: Number.parseInt(detail.activeLesson.duration, 10) || 60,
      amount: detail.activeLesson.rate,
      currency: "USD",
      checkoutId: `${row.id}-parent-upcoming-checkout-${index + 1}`,
      createdAt: `2026-${monthTokenToNumber(item.month)}-${String(item.day).padStart(2, "0")}T09:00:00.000Z`,
      details: {},
      messages: [],
    }));
  });
  return {
    summaryCards: [
      {
        title: "Total Sessions",
        value: String(items.length),
        subtitle: "All linked students",
        badge: "",
        tone: "red",
      },
      ...students.map((student) => ({
        title: student.name,
        value: String(student.sessions_total),
        subtitle: `${student.grade} · ${student.school}`,
        badge: student.active_tutor_name,
        tone: "green" as const,
      })),
    ],
    items,
  };
}

function tutorScheduleFromDetail(targetId?: string): TutorScheduleItem[] {
  const detail = targetId ? getAdminTutorDetailById(targetId) : undefined;
  if (!detail) return tutorScheduleItems;

  const upcoming = detail.currentStudents.map((item, index) => ({
    id: `${detail.id}-upcoming-${index + 1}`,
    studentInitials: item.initials,
    studentName: item.name,
    grade: "10th",
    subject: item.subject,
    date: `Apr ${index + 1}`,
    fullDate: `April ${index + 1}, 2026`,
    time: item.schedule.split(" ").slice(-2).join(" ") || "4:00 PM",
    endTime: "",
    duration: "60 min",
    type: "Virtual",
    rate: detail.standardRate,
    status: "Upcoming",
    sessionLink: "https://meet.google.com/preview-tutor",
    chat: [],
  })) satisfies TutorScheduleItem[];

  const recent = detail.recentSessions.map((item, index) => ({
    id: `${detail.id}-history-${index + 1}`,
    studentInitials: initialsFromName(item.student, "ST"),
    studentName: item.student,
    grade: "10th",
    subject: item.subject,
    date: item.date,
    fullDate: item.date,
    time: "4:00 PM",
    endTime: "",
    duration: item.duration === "—" || item.duration === "â€”" ? "60 min" : item.duration,
    type: "Virtual",
    rate: item.earned === "—" || item.earned === "â€”" ? detail.standardRate : item.earned,
    status: item.status === "Completed" ? "Completed" : "Cancelled",
    sessionLink: "https://meet.google.com/preview-tutor",
    chat: [],
  })) satisfies TutorScheduleItem[];

  return [...upcoming, ...recent];
}

export function getAdminPreviewTutorProfile(targetId?: string) {
  const detail = targetId ? getAdminTutorDetailById(targetId) : undefined;
  if (!detail) return tutorProfile;

  const { firstName, lastName } = splitName(detail.name);
  return {
    ...tutorProfile,
    initials: detail.initials,
    firstName: firstName || tutorProfile.firstName,
    lastName: lastName || tutorProfile.lastName,
    title: detail.subjectLevels[0]?.subject ? `${detail.subjectLevels[0].subject} Tutor` : tutorProfile.title,
    email: detail.email,
    phone: detail.personalInformation.phone,
    location: detail.personalInformation.district,
    status: detail.status,
    since: detail.personalInformation.joined,
    totalSessions: String(detail.totalSessions),
    avgRating: detail.rating,
    activeStudents: String(detail.activeStudents),
    allTimeEarnings: detail.earnedMtd,
    bio: detail.bio,
    subjectsAndGrades: detail.subjectLevels.map((item) => `${item.subject} (${item.gradeRange})`).join(", "),
    rates: detail.standardRate,
  };
}

export function getAdminPreviewTutorSchedule(targetId?: string) {
  return tutorScheduleFromDetail(targetId);
}

export function getAdminPreviewTutorSession(targetId: string | undefined, sessionId: string) {
  return tutorScheduleFromDetail(targetId).find((item) => item.id === sessionId) ?? null;
}
