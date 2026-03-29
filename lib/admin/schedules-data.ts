export type AdminScheduleStatus = "Upcoming" | "Completed" | "Cancelled";
export type AdminScheduleType = "In-Person" | "Virtual";

export type AdminScheduleRow = {
  sessionId: string;
  studentInitials: string;
  studentInitialsClassName: string;
  student: string;
  tutor: string;
  subject: string;
  dateTime: string;
  duration: string;
  type: AdminScheduleType;
  status: AdminScheduleStatus;
  fee: string;
};

export type AdminScheduleTimelineItem = {
  title: string;
  meta: string;
};

export type AdminScheduleDetail = {
  sessionId: string;
  status: AdminScheduleStatus;
  subject: string;
  dateLabel: string;
  timeRange: string;
  sessionType: AdminScheduleType;
  overview: {
    date: string;
    duration: string;
    platform: string;
  };
  payment: {
    sessionRate: string;
    durationHours: string;
    subtotal: string;
    platformFee: string;
    totalCharged: string;
    tutorPayout: string;
    method: string;
    paidAt: string;
  };
  student: {
    initials: string;
    initialsClassName: string;
    name: string;
    gradeSchool: string;
    parentPhone: string;
    email: string;
    plan: string;
    sessionsUsed: string;
    totalSessions: string;
  };
  tutor: {
    initials: string;
    initialsClassName: string;
    name: string;
    title: string;
    ratingAndSessions: string;
    email: string;
    phone: string;
    rateApplied: string;
    status: string;
  };
  notes: string;
  notesMeta: string;
  timeline: AdminScheduleTimelineItem[];
};

export const adminScheduleRows: AdminScheduleRow[] = [
  {
    sessionId: "SS-2043",
    studentInitials: "JW",
    studentInitialsClassName: "bg-[#ffe7eb] text-[#d94a62]",
    student: "Jordan Wilson",
    tutor: "Marcus Reynolds",
    subject: "Algebra II",
    dateTime: "Mar 20 · 2:00 PM",
    duration: "60 min",
    type: "In-Person",
    status: "Upcoming",
    fee: "$45.00",
  },
  {
    sessionId: "SS-2042",
    studentInitials: "MW",
    studentInitialsClassName: "bg-[#f1f1f1] text-[#6b7280]",
    student: "Maya Wilson",
    tutor: "Lisa Davis",
    subject: "Reading",
    dateTime: "Mar 20 · 3:30 PM",
    duration: "45 min",
    type: "Virtual",
    status: "Upcoming",
    fee: "$30.00",
  },
  {
    sessionId: "SS-2041",
    studentInitials: "AT",
    studentInitialsClassName: "bg-[#ffe7eb] text-[#d94a62]",
    student: "Alex Thompson",
    tutor: "David Kim",
    subject: "SAT Prep",
    dateTime: "Mar 20 · 10:00 AM",
    duration: "90 min",
    type: "Virtual",
    status: "Completed",
    fee: "$82.50",
  },
  {
    sessionId: "SS-2040",
    studentInitials: "SL",
    studentInitialsClassName: "bg-[#ebf7ef] text-[#239157]",
    student: "Sophie Lee",
    tutor: "Priya Patel",
    subject: "Chemistry",
    dateTime: "Mar 19 · 5:00 PM",
    duration: "60 min",
    type: "In-Person",
    status: "Completed",
    fee: "$50.00",
  },
  {
    sessionId: "SS-2039",
    studentInitials: "RJ",
    studentInitialsClassName: "bg-[#ffecef] text-[#d94a62]",
    student: "Ryan Johnson",
    tutor: "Marcus Reynolds",
    subject: "Geometry",
    dateTime: "Mar 19 · 1:00 PM",
    duration: "60 min",
    type: "In-Person",
    status: "Cancelled",
    fee: "—",
  },
  {
    sessionId: "SS-2038",
    studentInitials: "EC",
    studentInitialsClassName: "bg-[#fff6de] text-[#b58112]",
    student: "Emma Carter",
    tutor: "Lisa Davis",
    subject: "Pre-Algebra",
    dateTime: "Mar 19 · 4:00 PM",
    duration: "45 min",
    type: "Virtual",
    status: "Completed",
    fee: "$30.00",
  },
];

export function getAdminScheduleDetailById(sessionId: string): AdminScheduleDetail | undefined {
  const row = adminScheduleRows.find((item) => item.sessionId === sessionId);

  if (!row) {
    return undefined;
  }

  const base: AdminScheduleDetail = {
    sessionId: row.sessionId,
    status: row.status,
    subject: row.subject,
    dateLabel: "Mar 20, 2026",
    timeRange: "10:00-11:30 AM",
    sessionType: row.type,
    overview: {
      date: "Thursday, Mar 20, 2026",
      duration: "90 minutes",
      platform: "Zoom",
    },
    payment: {
      sessionRate: "$55.00/hr",
      durationHours: "1.5 hrs",
      subtotal: "$82.50",
      platformFee: "-$8.25",
      totalCharged: "$82.50",
      tutorPayout: "$74.25",
      method: "Visa",
      paidAt: "Mar 20, 2026 · 11:32 AM",
    },
    student: {
      initials: row.studentInitials,
      initialsClassName: row.studentInitialsClassName,
      name: row.student,
      gradeSchool: "12th Grade · Kirkwood High School",
      parentPhone: "Parent: Michael Thompson · (314) 555-0142",
      email: "alex.t@email.com",
      plan: "Growth · 8 sessions/mo",
      sessionsUsed: "4 of 8",
      totalSessions: "38 all-time",
    },
    tutor: {
      initials: "DK",
      initialsClassName: "bg-[#ebf7ef] text-[#239157]",
      name: row.tutor,
      title: "SAT Prep · Math",
      ratingAndSessions: "★ 4.9 · 210 sessions",
      email: "d.kim@email.com",
      phone: "(314) 555-0194",
      rateApplied: "$55/hr (SAT rate)",
      status: "Approved",
    },
    notes:
      "Focused on Math section, specifically functions and data analysis. Alex showed strong improvement on linear equations. Assigned practice problems for College Board test #5. Next session will cover Evidence-Based Reading strategies.",
    notesMeta: "Added by David Kim · Mar 20, 2026 at 11:45 AM",
    timeline: [
      { title: "Session booked", meta: "Mar 14, 2026 · 9:12 AM · by Michael Thompson" },
      { title: "Tutor confirmed", meta: "Mar 14, 2026 · 10:05 AM · by David Kim" },
      { title: "Reminder sent", meta: "Mar 19, 2026 · 10:00 AM · automated" },
      { title: "Session started", meta: "Mar 20, 2026 · 10:02 AM" },
      { title: "Session completed", meta: "Mar 20, 2026 · 11:30 AM · 88 min logged" },
      { title: "Payment processed", meta: "Mar 20, 2026 · 11:32 AM · $82.50 charged" },
    ],
  };

  if (row.sessionId === "SS-2043") {
    return {
      ...base,
      status: "Upcoming",
      timeRange: "2:00-3:00 PM",
      overview: {
        ...base.overview,
        duration: "60 minutes",
      },
      payment: {
        ...base.payment,
        subtotal: "$45.00",
        totalCharged: "$45.00",
        tutorPayout: "$40.50",
      },
    };
  }

  return base;
}
