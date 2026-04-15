import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { ParentStudentSchedulePage } from "@/components/parent/parent-student-schedule-page";
import { fetchParentScheduleItems } from "@/lib/api/parent-schedule-api";
import type { ParentSessionHistoryItem } from "@/lib/api/parent-schedule-types";
import { ADMIN_PREVIEW_ROLE_COOKIE } from "@/lib/admin-preview";
import { parentUpcomingSessions } from "@/lib/parent/dashboard-data";
import { getParentStudentById } from "@/lib/parent/students-data";

export default async function ParentStudentScheduleRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = getParentStudentById(id);

  if (!student) {
    notFound();
  }

  const cookieStore = await cookies();
  const role = cookieStore.get("arch_user_role")?.value ?? null;
  const previewRole = cookieStore.get(ADMIN_PREVIEW_ROLE_COOKIE)?.value ?? null;
  const isAdminParentPreview = role === "admin" && previewRole === "parent";
  const previewItems: ParentSessionHistoryItem[] = parentUpcomingSessions.map((item, index) => ({
    id: item.id,
    studentEmail: `${student.name.toLowerCase().replace(/\s+/g, ".")}@email.com`,
    studentInitials: student.initials,
    studentName: student.name,
    studentGrade: student.grade,
    tutorId: `tutor-${index + 1}`,
    tutorInitials: item.tutorInitials,
    tutorName: item.tutorName,
    subject: item.subject,
    date: item.date,
    fullDate: `Monday, March ${30 + index}, 2026`,
    time: item.time,
    endTime: "",
    duration: item.duration,
    type: item.type === "In-Person" ? "In-Person" : "Virtual",
    rate: "$45",
    status: item.status === "Cancelled" ? "Cancelled" : "Upcoming",
    sessionDate: `2026-03-${String(30 + index).padStart(2, "0")}`,
    sessionTime: item.time,
    durationMinutes: Number.parseInt(item.duration, 10) || 60,
    amount: "$45",
    currency: "USD",
    checkoutId: `preview-checkout-${index + 1}`,
    createdAt: `2026-03-${String(30 + index).padStart(2, "0")}T09:00:00.000Z`,
    details: {},
    messages: [],
  }));
  const schedule = isAdminParentPreview
    ? {
        items: previewItems,
      }
    : await fetchParentScheduleItems().catch(() => ({ items: [] }));
  const sessions = schedule.items.filter((item) => item.studentName === student.name);

  return <ParentStudentSchedulePage student={student} sessions={sessions} />;
}
