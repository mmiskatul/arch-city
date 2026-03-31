export type TutorDashboardSession = {
  id: string;
  studentInitials: string;
  studentName: string;
  grade: string;
  date: string;
  time: string;
  duration: string;
  type: "Virtual" | "In-Person";
  rate: string;
};
export type TutorApplicationStatus = "pending" | "approved";

export const tutorDashboardSessions: TutorDashboardSession[] = [
  {
    id: "ts1",
    studentInitials: "JD",
    studentName: "Jordan Davis",
    grade: "10th Grade",
    date: "Mon, Mar 30",
    time: "4:00 PM",
    duration: "60 min",
    type: "Virtual",
    rate: "$45",
  },
  {
    id: "ts2",
    studentInitials: "AL",
    studentName: "Aisha Lawson",
    grade: "8th Grade",
    date: "Tue, Mar 31",
    time: "3:30 PM",
    duration: "45 min",
    type: "Virtual",
    rate: "$35",
  },
  {
    id: "ts3",
    studentInitials: "TM",
    studentName: "Tyler Martin",
    grade: "11th Grade",
    date: "Wed, Apr 1",
    time: "5:00 PM",
    duration: "60 min",
    type: "Virtual",
    rate: "$45",
  },
  {
    id: "ts4",
    studentInitials: "PR",
    studentName: "Priya Ramos",
    grade: "9th Grade",
    date: "Thu, Apr 2",
    time: "4:15 PM",
    duration: "45 min",
    type: "Virtual",
    rate: "$35",
  },
  {
    id: "ts5",
    studentInitials: "BK",
    studentName: "Blake Kim",
    grade: "7th Grade",
    date: "Fri, Apr 3",
    time: "3:00 PM",
    duration: "60 min",
    type: "Virtual",
    rate: "$45",
  },
];

export const tutorApplicationStatus: TutorApplicationStatus = "pending";
export const tutorPendingBanner =
  "Your application is in pending, admin will review the document that you send";
