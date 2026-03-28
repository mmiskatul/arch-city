export type TutorMessageThread = {
  id: string;
  sessionId: string;
  studentInitials: string;
  studentName: string;
  subject: string;
  dateLabel: string;
  preview: string;
  timestampLabel: string;
  unreadCount: number;
  messages: Array<{
    id: string;
    sender: "tutor" | "student";
    message: string;
    timestamp: string;
  }>;
};

export const tutorMessageThreads: TutorMessageThread[] = [
  {
    id: "thread-ts1",
    sessionId: "ts1",
    studentInitials: "JD",
    studentName: "Jordan Davis",
    subject: "Algebra II",
    dateLabel: "Mar 30",
    preview: "Can we start with polynomial factoring?",
    timestampLabel: "Mon 11:05 AM",
    unreadCount: 0,
    messages: [
      {
        id: "tmsg-1",
        sender: "tutor",
        message: "Hi Jordan! Looking forward to our session. Any specific topics for Algebra II?",
        timestamp: "Mon 10:22 AM",
      },
      {
        id: "tmsg-2",
        sender: "student",
        message: "Can we start with polynomial factoring?",
        timestamp: "Mon 11:05 AM",
      },
      {
        id: "tmsg-3",
        sender: "tutor",
        message: "Absolutely! I'll prep some examples. See you Monday at 4 PM.",
        timestamp: "Mon 11:30 AM",
      },
    ],
  },
  {
    id: "thread-ts2",
    sessionId: "ts2",
    studentInitials: "AL",
    studentName: "Aisha Lawson",
    subject: "Algebra I",
    dateLabel: "Mar 31",
    preview: "Hi! Will we cover inequalities this session?",
    timestampLabel: "Today 8:30 AM",
    unreadCount: 1,
    messages: [
      {
        id: "tmsg-4",
        sender: "student",
        message: "Hi! Will we cover inequalities this session?",
        timestamp: "Today 8:30 AM",
      },
    ],
  },
  {
    id: "thread-ts3",
    sessionId: "ts3",
    studentInitials: "TM",
    studentName: "Tyler Martin",
    subject: "Pre-Calculus",
    dateLabel: "Apr 1",
    preview: "Just wanted to confirm our session tomorrow",
    timestampLabel: "Yesterday 7:00 PM",
    unreadCount: 2,
    messages: [
      {
        id: "tmsg-5",
        sender: "student",
        message: "Just wanted to confirm our session tomorrow",
        timestamp: "Yesterday 7:00 PM",
      },
      {
        id: "tmsg-6",
        sender: "student",
        message: "I'm bringing my chapter review sheet too.",
        timestamp: "Yesterday 7:02 PM",
      },
    ],
  },
  {
    id: "thread-ts4",
    sessionId: "ts4",
    studentInitials: "PR",
    studentName: "Priya Ramos",
    subject: "Geometry",
    dateLabel: "Apr 2",
    preview: "Thanks, see you Thursday!",
    timestampLabel: "Mar 25",
    unreadCount: 0,
    messages: [
      {
        id: "tmsg-7",
        sender: "student",
        message: "Thanks, see you Thursday!",
        timestamp: "Mar 25",
      },
    ],
  },
];

export const tutorMessagesUnreadCount = tutorMessageThreads.reduce(
  (total, thread) => total + thread.unreadCount,
  0,
);
