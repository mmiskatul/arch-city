export type TutorScheduleStatus = "Upcoming" | "Completed" | "Cancelled";

export type TutorScheduleItem = {
  id: string;
  studentInitials: string;
  studentName: string;
  grade: string;
  subject: string;
  date: string;
  fullDate: string;
  time: string;
  endTime: string;
  duration: string;
  type: "Virtual" | "In-Person";
  rate: string;
  status: TutorScheduleStatus;
  sessionLink: string;
  chat: Array<{
    id: string;
    sender: "tutor" | "student";
    message: string;
    timestamp: string;
  }>;
};

export const tutorScheduleItems: TutorScheduleItem[] = [
  {
    id: "ts1",
    studentInitials: "JD",
    studentName: "Jordan Davis",
    grade: "10th",
    subject: "Algebra II",
    date: "Mon, Mar 30",
    fullDate: "Monday, March 30, 2026",
    time: "4:00 PM",
    endTime: "5:00 PM",
    duration: "60 min",
    type: "Virtual",
    rate: "$45",
    status: "Upcoming",
    sessionLink: "https://meet.google.com/abc-defg",
    chat: [
      {
        id: "tm1",
        sender: "tutor",
        message:
          "Hi Jordan! Looking forward to our session on Monday. Do you have any specific topics you'd like to focus on in Algebra II?",
        timestamp: "Mon 10:22 AM",
      },
      {
        id: "tm2",
        sender: "student",
        message: "Hey! Yes, I'm struggling with polynomial functions and factoring. Can we start there?",
        timestamp: "Mon 11:05 AM",
      },
      {
        id: "tm3",
        sender: "tutor",
        message:
          "Absolutely! Polynomial factoring is a great topic. I'll prepare some examples and practice problems. See you Monday at 4 PM!",
        timestamp: "Mon 11:30 AM",
      },
    ],
  },
  {
    id: "ts2",
    studentInitials: "AL",
    studentName: "Aisha Lawson",
    grade: "8th",
    subject: "Pre-Algebra",
    date: "Tue, Mar 31",
    fullDate: "Tuesday, March 31, 2026",
    time: "3:30 PM",
    endTime: "4:15 PM",
    duration: "45 min",
    type: "Virtual",
    rate: "$35",
    status: "Upcoming",
    sessionLink: "https://meet.google.com/aisha-lawson",
    chat: [],
  },
  {
    id: "ts3",
    studentInitials: "TM",
    studentName: "Tyler Martin",
    grade: "11th",
    subject: "Algebra II",
    date: "Wed, Apr 1",
    fullDate: "Wednesday, April 1, 2026",
    time: "5:00 PM",
    endTime: "6:00 PM",
    duration: "60 min",
    type: "Virtual",
    rate: "$45",
    status: "Upcoming",
    sessionLink: "https://meet.google.com/tyler-martin",
    chat: [],
  },
  {
    id: "ts4",
    studentInitials: "PR",
    studentName: "Priya Ramos",
    grade: "9th",
    subject: "Geometry",
    date: "Thu, Apr 2",
    fullDate: "Thursday, April 2, 2026",
    time: "4:15 PM",
    endTime: "5:00 PM",
    duration: "45 min",
    type: "Virtual",
    rate: "$35",
    status: "Upcoming",
    sessionLink: "https://meet.google.com/priya-ramos",
    chat: [],
  },
  {
    id: "ts5",
    studentInitials: "BK",
    studentName: "Blake Kim",
    grade: "7th",
    subject: "Math Foundations",
    date: "Fri, Apr 3",
    fullDate: "Friday, April 3, 2026",
    time: "3:00 PM",
    endTime: "4:00 PM",
    duration: "60 min",
    type: "Virtual",
    rate: "$45",
    status: "Upcoming",
    sessionLink: "https://meet.google.com/blake-kim",
    chat: [],
  },
  {
    id: "ts6",
    studentInitials: "LM",
    studentName: "Lena Morgan",
    grade: "8th",
    subject: "Pre-Algebra",
    date: "Thu, Mar 26",
    fullDate: "Thursday, March 26, 2026",
    time: "4:30 PM",
    endTime: "5:15 PM",
    duration: "45 min",
    type: "Virtual",
    rate: "$35",
    status: "Completed",
    sessionLink: "https://meet.google.com/lena-morgan",
    chat: [],
  },
  {
    id: "ts7",
    studentInitials: "CR",
    studentName: "Caleb Reed",
    grade: "10th",
    subject: "Algebra II",
    date: "Tue, Mar 24",
    fullDate: "Tuesday, March 24, 2026",
    time: "5:00 PM",
    endTime: "6:00 PM",
    duration: "60 min",
    type: "Virtual",
    rate: "$45",
    status: "Completed",
    sessionLink: "https://meet.google.com/caleb-reed",
    chat: [],
  },
  {
    id: "ts8",
    studentInitials: "NH",
    studentName: "Nora Hill",
    grade: "9th",
    subject: "Geometry",
    date: "Mon, Mar 23",
    fullDate: "Monday, March 23, 2026",
    time: "3:30 PM",
    endTime: "4:15 PM",
    duration: "45 min",
    type: "Virtual",
    rate: "$35",
    status: "Cancelled",
    sessionLink: "https://meet.google.com/nora-hill",
    chat: [],
  },
];

export function getTutorScheduleCounts(): Record<TutorScheduleStatus, number> {
  return tutorScheduleItems.reduce<Record<TutorScheduleStatus, number>>(
    (counts, item) => {
      counts[item.status] += 1;
      return counts;
    },
    {
      Upcoming: 0,
      Completed: 0,
      Cancelled: 0,
    },
  );
}

export function getTutorScheduleItemById(id: string) {
  return tutorScheduleItems.find((item) => item.id === id);
}
