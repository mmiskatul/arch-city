export type ParentSessionHistoryItem = {
  id: string;
  studentInitials: string;
  studentName: string;
  studentFullName: string;
  studentGrade: string;
  tutorInitials: string;
  tutorName: string;
  tutorFullName: string;
  tutorTitle: string;
  tutorRating: string;
  date: string;
  fullDate: string;
  time: string;
  endTime: string;
  subject: string;
  duration: string;
  type: "Virtual" | "In-Person";
  rate: string;
  status: "Completed" | "Upcoming";
  messages: Array<{
    sender: "tutor" | "student";
    text: string;
    time: string;
    senderLabel: string;
  }>;
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
    studentFullName: "Jordan Wilson",
    studentGrade: "11th Grade",
    tutorInitials: "MT",
    tutorName: "Marcus T.",
    tutorFullName: "Marcus Thompson",
    tutorTitle: "Mathematics Specialist",
    tutorRating: "4.9",
    date: "Mon, Mar 30",
    fullDate: "Monday, March 30, 2026",
    time: "4:00 PM",
    endTime: "5:00 PM",
    subject: "Pre-Calculus",
    duration: "60 min",
    type: "Virtual",
    rate: "$45",
    status: "Upcoming",
    messages: [
      {
        sender: "tutor",
        text: "Hi Jordan! Looking forward to our session on Monday. Do you have any specific topics you'd like to focus on in Pre-Calculus?",
        time: "Mon 10:22 AM",
        senderLabel: "Marcus",
      },
      {
        sender: "student",
        text: "Can we start with limits and continuity? I'm having trouble with those.",
        time: "Mon 11:05 AM",
        senderLabel: "Jordan",
      },
      {
        sender: "tutor",
        text: "Absolutely! I'll prep some examples. See you Monday at 4 PM.",
        time: "Mon 11:30 AM",
        senderLabel: "Marcus",
      },
    ],
  },
  {
    id: "ph2",
    studentInitials: "JW",
    studentName: "Jordan",
    studentFullName: "Jordan Wilson",
    studentGrade: "11th Grade",
    tutorInitials: "MT",
    tutorName: "Marcus T.",
    tutorFullName: "Marcus Thompson",
    tutorTitle: "Mathematics Specialist",
    tutorRating: "4.9",
    date: "Sat, Mar 22",
    fullDate: "Saturday, March 22, 2026",
    time: "4:00 PM",
    endTime: "5:00 PM",
    subject: "Pre-Calculus",
    duration: "60 min",
    type: "Virtual",
    rate: "$45",
    status: "Completed",
    messages: [],
  },
  {
    id: "ph3",
    studentInitials: "JW",
    studentName: "Jordan",
    studentFullName: "Jordan Wilson",
    studentGrade: "11th Grade",
    tutorInitials: "MT",
    tutorName: "Marcus T.",
    tutorFullName: "Marcus Thompson",
    tutorTitle: "Mathematics Specialist",
    tutorRating: "4.9",
    date: "Sat, Mar 15",
    fullDate: "Saturday, March 15, 2026",
    time: "4:00 PM",
    endTime: "5:00 PM",
    subject: "Pre-Calculus",
    duration: "60 min",
    type: "Virtual",
    rate: "$45",
    status: "Completed",
    messages: [],
  },
  {
    id: "ph4",
    studentInitials: "JW",
    studentName: "Jordan",
    studentFullName: "Jordan Wilson",
    studentGrade: "11th Grade",
    tutorInitials: "MT",
    tutorName: "Marcus T.",
    tutorFullName: "Marcus Thompson",
    tutorTitle: "Mathematics Specialist",
    tutorRating: "4.9",
    date: "Sat, Mar 8",
    fullDate: "Saturday, March 8, 2026",
    time: "4:00 PM",
    endTime: "5:00 PM",
    subject: "Pre-Calculus",
    duration: "60 min",
    type: "Virtual",
    rate: "$45",
    status: "Completed",
    messages: [],
  },
  {
    id: "ph5",
    studentInitials: "MW",
    studentName: "Maya",
    studentFullName: "Maya Wilson",
    studentGrade: "8th Grade",
    tutorInitials: "AP",
    tutorName: "Dr. Patel",
    tutorFullName: "Dr. Aisha Patel",
    tutorTitle: "STEM Educator",
    tutorRating: "5.0",
    date: "Thu, Mar 20",
    fullDate: "Thursday, March 20, 2026",
    time: "5:00 PM",
    endTime: "5:45 PM",
    subject: "Science",
    duration: "45 min",
    type: "Virtual",
    rate: "$55",
    status: "Completed",
    messages: [],
  },
];

export function getParentSessionById(id: string) {
  return parentSessionHistoryItems.find((session) => session.id === id);
}
