export type ParentDashboardState = "empty" | "active";

export const parentDashboardState: ParentDashboardState = "active";

export type ParentStudentChip = {
  initials: string;
  name: string;
  active?: boolean;
};

export type ParentSummaryCard = {
  title: string;
  value?: string;
  subtitle: string;
  extra?: string;
  tone: "red" | "green" | "gold";
};

export type ParentSessionRow = {
  id: string;
  tutorInitials: string;
  tutorName: string;
  date: string;
  time: string;
  subject: string;
  duration: string;
  type: string;
  status: string;
};

export const parentStudents: ParentStudentChip[] = [
  { initials: "JW", name: "Jordan Wilson", active: true },
  { initials: "MW", name: "Maya Wilson" },
];

export const parentSummaryCards: ParentSummaryCard[] = [
  {
    title: "Upcoming Sessions",
    value: "3",
    subtitle: "Next: Mon, Mar 30",
    tone: "red",
  },
  {
    title: "Sessions This Month",
    value: "5",
    subtitle: "March 2026",
    tone: "green",
  },
  {
    title: "Active Tutor",
    extra: "Marcus T.",
    subtitle: "Pre-Calculus · Virtual",
    tone: "gold",
  },
];

export const parentUpcomingSessions: ParentSessionRow[] = [
  {
    id: "ps1",
    tutorInitials: "MT",
    tutorName: "Marcus Thompson",
    date: "Mon, Mar 30",
    time: "4:00 PM",
    subject: "Pre-Calculus",
    duration: "60 min",
    type: "Virtual",
    status: "Upcoming",
  },
  {
    id: "ps2",
    tutorInitials: "MT",
    tutorName: "Marcus Thompson",
    date: "Wed, Apr 1",
    time: "4:00 PM",
    subject: "Pre-Calculus",
    duration: "60 min",
    type: "Virtual",
    status: "Upcoming",
  },
  {
    id: "ps3",
    tutorInitials: "MT",
    tutorName: "Marcus Thompson",
    date: "Fri, Apr 3",
    time: "4:00 PM",
    subject: "Pre-Calculus",
    duration: "60 min",
    type: "Virtual",
    status: "Upcoming",
  },
];

export const parentMessagesUnreadCount =
  parentDashboardState === "active" ? 2 : 0;
