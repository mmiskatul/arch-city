export type ParentSessionHistoryItem = {
  id: string;
  studentInitials: string;
  studentName: string;
  tutorName: string;
  date: string;
  subject: string;
  duration: string;
  type: "Virtual" | "In-Person";
  rate: string;
  status: "Completed";
};

export const parentScheduleSummary = {
  totalSessions: 12,
  jordanSessions: 8,
  mayaSessions: 4,
};

export const parentSessionHistoryItems: ParentSessionHistoryItem[] = [
  {
    id: "ph1",
    studentInitials: "JW",
    studentName: "Jordan",
    tutorName: "Marcus T.",
    date: "Sat, Mar 22",
    subject: "Pre-Calculus",
    duration: "60 min",
    type: "Virtual",
    rate: "$45",
    status: "Completed",
  },
  {
    id: "ph2",
    studentInitials: "JW",
    studentName: "Jordan",
    tutorName: "Marcus T.",
    date: "Sat, Mar 15",
    subject: "Pre-Calculus",
    duration: "60 min",
    type: "Virtual",
    rate: "$45",
    status: "Completed",
  },
  {
    id: "ph3",
    studentInitials: "JW",
    studentName: "Jordan",
    tutorName: "Marcus T.",
    date: "Sat, Mar 8",
    subject: "Pre-Calculus",
    duration: "60 min",
    type: "Virtual",
    rate: "$45",
    status: "Completed",
  },
  {
    id: "ph4",
    studentInitials: "JW",
    studentName: "Jordan",
    tutorName: "Marcus T.",
    date: "Sat, Mar 1",
    subject: "Pre-Calculus",
    duration: "60 min",
    type: "Virtual",
    rate: "$45",
    status: "Completed",
  },
  {
    id: "ph5",
    studentInitials: "MW",
    studentName: "Maya",
    tutorName: "Dr. Patel",
    date: "Thu, Mar 20",
    subject: "Science",
    duration: "45 min",
    type: "Virtual",
    rate: "$55",
    status: "Completed",
  },
];
