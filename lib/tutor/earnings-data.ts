export type TutorEarningRow = {
  id: string;
  studentInitials: string;
  studentName: string;
  date: string;
  subject: string;
  duration: string;
  type: "Virtual" | "In-Person";
  rate: string;
  status: "Paid" | "Pending";
};

export const tutorEarningsSummary = {
  thisMonth: "$360",
  thisMonthLabel: "March 2026",
  sessionsCompletedThisMonth: "9",
  allTimeTotal: "$2,115",
  allTimeSessions: "47",
};

export const tutorEarningsRows: TutorEarningRow[] = [
  {
    id: "earn-1",
    studentInitials: "DL",
    studentName: "Derek Lewis",
    date: "Sat, Mar 22",
    subject: "Statistics",
    duration: "60 min",
    type: "Virtual",
    rate: "$45",
    status: "Paid",
  },
  {
    id: "earn-2",
    studentInitials: "AL",
    studentName: "Aisha Lawson",
    date: "Tue, Mar 18",
    subject: "Algebra I",
    duration: "45 min",
    type: "Virtual",
    rate: "$35",
    status: "Paid",
  },
  {
    id: "earn-3",
    studentInitials: "JD",
    studentName: "Jordan Davis",
    date: "Tue, Mar 18",
    subject: "Algebra II",
    duration: "60 min",
    type: "Virtual",
    rate: "$45",
    status: "Paid",
  },
  {
    id: "earn-4",
    studentInitials: "TM",
    studentName: "Tyler Martin",
    date: "Thu, Mar 13",
    subject: "Pre-Calculus",
    duration: "60 min",
    type: "Virtual",
    rate: "$45",
    status: "Paid",
  },
  {
    id: "earn-5",
    studentInitials: "PR",
    studentName: "Priya Ramos",
    date: "Mon, Mar 10",
    subject: "Geometry",
    duration: "45 min",
    type: "Virtual",
    rate: "$35",
    status: "Pending",
  },
];
