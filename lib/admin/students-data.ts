export type AdminStudentStatus = "Active" | "Inactive";

export type AdminStudentRow = {
  id: string;
  initials: string;
  initialsClassName: string;
  name: string;
  email: string;
  grade: string;
  guardian: string;
  sessions: number;
  lastSession: string;
  subjects: string[];
  status: AdminStudentStatus;
};

export type AdminUpcomingScheduleItem = {
  month: string;
  day: string;
  subject: string;
  tutor: string;
  time: string;
  mode: string;
  status: "Confirmed" | "Pending";
};

export type AdminSessionHistoryItem = {
  date: string;
  subject: string;
  tutor: string;
  duration: string;
  status: "Completed" | "No-Show";
};

export type AdminStudentDetail = {
  id: string;
  initials: string;
  initialsClassName: string;
  name: string;
  email: string;
  grade: string;
  status: AdminStudentStatus;
  totalSessions: number;
  totalSessionsDelta: string;
  currentPlanName: string;
  currentPlanMeta: string;
  currentPlanPrice: string;
  memberSince: string;
  memberSinceDelta: string;
  studentInformation: {
    fullName: string;
    email: string;
    grade: string;
    school: string;
    dateOfBirth: string;
  };
  parentGuardian: {
    name: string;
    email: string;
    phone: string;
  };
  planBilling: {
    name: string;
    status: "Active" | "Inactive";
    sessionsPerMonth: string;
    amount: string;
    nextBillingDate: string;
    usedSessions: string;
  };
  activeLesson: {
    subject: string;
    status: "Ongoing" | "Upcoming";
    tutor: string;
    tutorRating: string;
    dayTime: string;
    duration: string;
    location: string;
    rate: string;
    nextSession: string;
  };
  upcomingSchedule: AdminUpcomingScheduleItem[];
  sessionHistory: AdminSessionHistoryItem[];
};

export const adminStudents: AdminStudentRow[] = [
  {
    id: "ST-1001",
    initials: "JW",
    initialsClassName: "bg-[#ffe7eb] text-[#d94a62]",
    name: "Jordan Wilson",
    email: "jordan.wilson@email.com",
    grade: "11th Grade",
    guardian: "Sarah Wilson",
    sessions: 24,
    lastSession: "Mar 22, 2026",
    subjects: ["Algebra II"],
    status: "Active",
  },
  {
    id: "ST-1002",
    initials: "MW",
    initialsClassName: "bg-[#f1f1f1] text-[#6b7280]",
    name: "Maya Wilson",
    email: "maya.wilson@email.com",
    grade: "8th Grade",
    guardian: "Sarah Wilson",
    sessions: 16,
    lastSession: "Mar 18, 2026",
    subjects: ["Reading"],
    status: "Active",
  },
  {
    id: "ST-1003",
    initials: "AT",
    initialsClassName: "bg-[#ffe7eb] text-[#d94a62]",
    name: "Alex Thompson",
    email: "alex.t@email.com",
    grade: "12th Grade",
    guardian: "Michael Thompson",
    sessions: 38,
    lastSession: "Mar 20, 2026",
    subjects: ["SAT Prep"],
    status: "Active",
  },
  {
    id: "ST-1004",
    initials: "SL",
    initialsClassName: "bg-[#ebf7ef] text-[#239157]",
    name: "Sophie Lee",
    email: "sophie.lee@email.com",
    grade: "10th Grade",
    guardian: "James Lee",
    sessions: 12,
    lastSession: "Mar 19, 2026",
    subjects: ["Chemistry"],
    status: "Active",
  },
  {
    id: "ST-1005",
    initials: "RJ",
    initialsClassName: "bg-[#ffecef] text-[#d94a62]",
    name: "Ryan Johnson",
    email: "ryan.j@email.com",
    grade: "9th Grade",
    guardian: "Patricia Johnson",
    sessions: 7,
    lastSession: "Mar 15, 2026",
    subjects: ["Geometry"],
    status: "Inactive",
  },
  {
    id: "ST-1006",
    initials: "EC",
    initialsClassName: "bg-[#fff6de] text-[#b58112]",
    name: "Emma Carter",
    email: "emma.carter@email.com",
    grade: "7th Grade",
    guardian: "Linda Carter",
    sessions: 5,
    lastSession: "Mar 10, 2026",
    subjects: ["Pre-Algebra"],
    status: "Active",
  },
  {
    id: "ST-1007",
    initials: "NB",
    initialsClassName: "bg-[#ebf7ef] text-[#239157]",
    name: "Noah Baker",
    email: "noah.baker@email.com",
    grade: "5th Grade",
    guardian: "Tom Baker",
    sessions: 9,
    lastSession: "Mar 17, 2026",
    subjects: ["Math"],
    status: "Active",
  },
  {
    id: "ST-1008",
    initials: "LH",
    initialsClassName: "bg-[#f1f1f1] text-[#6b7280]",
    name: "Liam Harris",
    email: "liam.harris@email.com",
    grade: "6th Grade",
    guardian: "Monica Harris",
    sessions: 11,
    lastSession: "Mar 14, 2026",
    subjects: ["Science"],
    status: "Active",
  },
  {
    id: "ST-1009",
    initials: "OC",
    initialsClassName: "bg-[#ffecef] text-[#d94a62]",
    name: "Olivia Clark",
    email: "olivia.clark@email.com",
    grade: "9th Grade",
    guardian: "David Clark",
    sessions: 14,
    lastSession: "Mar 21, 2026",
    subjects: ["English"],
    status: "Active",
  },
  {
    id: "ST-1010",
    initials: "EM",
    initialsClassName: "bg-[#fff6de] text-[#b58112]",
    name: "Ethan Moore",
    email: "ethan.moore@email.com",
    grade: "8th Grade",
    guardian: "Rachel Moore",
    sessions: 6,
    lastSession: "Mar 11, 2026",
    subjects: ["Reading"],
    status: "Inactive",
  },
];

function defaultStudentDetail(student: AdminStudentRow): AdminStudentDetail {
  return {
    id: student.id,
    initials: student.initials,
    initialsClassName: student.initialsClassName,
    name: student.name,
    email: student.email,
    grade: student.grade,
    status: student.status,
    totalSessions: student.sessions,
    totalSessionsDelta: "+3 this month",
    currentPlanName: "Growth",
    currentPlanMeta: "8 sessions/mo",
    currentPlanPrice: "$320/mo",
    memberSince: "Sep 2025",
    memberSinceDelta: "~7 months",
    studentInformation: {
      fullName: student.name,
      email: student.email,
      grade: student.grade,
      school: "Kirkwood High School",
      dateOfBirth: "Oct 14, 2007",
    },
    parentGuardian: {
      name: student.guardian,
      email: `${student.guardian.toLowerCase().replace(" ", ".")}@email.com`,
      phone: "(314) 555-0142",
    },
    planBilling: {
      name: "Growth Plan",
      status: student.status === "Active" ? "Active" : "Inactive",
      sessionsPerMonth: "8 sessions per month",
      amount: "$320/month",
      nextBillingDate: "Apr 1, 2026",
      usedSessions: "4 of 8",
    },
    activeLesson: {
      subject: student.subjects[0] ?? "General Tutoring",
      status: "Ongoing",
      tutor: "David Kim",
      tutorRating: "4.9",
      dayTime: "Tuesday - 4:00 PM",
      duration: "60 min",
      location: "Online (Zoom)",
      rate: "$55/hr",
      nextSession: "Tuesday, Apr 1, 2026 - 4:00 PM",
    },
    upcomingSchedule: [
      {
        month: "APR",
        day: "1",
        subject: student.subjects[0] ?? "Tutoring",
        tutor: "David Kim",
        time: "4:00-5:00 PM",
        mode: "Online",
        status: "Confirmed",
      },
      {
        month: "APR",
        day: "8",
        subject: student.subjects[0] ?? "Tutoring",
        tutor: "David Kim",
        time: "4:00-5:00 PM",
        mode: "Online",
        status: "Confirmed",
      },
      {
        month: "APR",
        day: "15",
        subject: student.subjects[0] ?? "Tutoring",
        tutor: "David Kim",
        time: "4:00-5:00 PM",
        mode: "Online",
        status: "Confirmed",
      },
    ],
    sessionHistory: [
      {
        date: "Mar 25, 2026",
        subject: student.subjects[0] ?? "Tutoring",
        tutor: "David Kim",
        duration: "60 min",
        status: "Completed",
      },
      {
        date: "Mar 18, 2026",
        subject: student.subjects[0] ?? "Tutoring",
        tutor: "David Kim",
        duration: "60 min",
        status: "Completed",
      },
      {
        date: "Mar 11, 2026",
        subject: student.subjects[0] ?? "Tutoring",
        tutor: "David Kim",
        duration: "60 min",
        status: "Completed",
      },
      {
        date: "Mar 4, 2026",
        subject: student.subjects[0] ?? "Tutoring",
        tutor: "David Kim",
        duration: "60 min",
        status: "Completed",
      },
      {
        date: "Feb 25, 2026",
        subject: student.subjects[0] ?? "Tutoring",
        tutor: "David Kim",
        duration: "—",
        status: "No-Show",
      },
      {
        date: "Feb 18, 2026",
        subject: student.subjects[0] ?? "Tutoring",
        tutor: "David Kim",
        duration: "60 min",
        status: "Completed",
      },
    ],
  };
}

const alexThompsonOverride: Partial<AdminStudentDetail> = {
  currentPlanName: "Growth",
  currentPlanMeta: "8 sessions/mo",
  currentPlanPrice: "$320/mo",
  memberSince: "Sep 2025",
  memberSinceDelta: "~7 months",
  totalSessionsDelta: "+4 this month",
  studentInformation: {
    fullName: "Alex Thompson",
    email: "alex.t@email.com",
    grade: "12th Grade",
    school: "Kirkwood High School",
    dateOfBirth: "Oct 14, 2007",
  },
};

export function getAdminStudentById(id: string) {
  return adminStudents.find((student) => student.id === id);
}

export function getAdminStudentDetailById(id: string): AdminStudentDetail | undefined {
  const base = adminStudents.find((student) => student.id === id);

  if (!base) {
    return undefined;
  }

  const detail = defaultStudentDetail(base);

  if (id === "ST-1003") {
    return {
      ...detail,
      ...alexThompsonOverride,
      studentInformation: alexThompsonOverride.studentInformation ?? detail.studentInformation,
    };
  }

  return detail;
}
