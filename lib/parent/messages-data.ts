export type ParentMessage = {
  sender: "tutor" | "student";
  text: string;
  time: string;
  senderLabel: string;
};

export type ParentMessageThread = {
  id: string;
  tutorInitials: string;
  tutorName: string;
  studentName: string;
  subject: string;
  dateLabel: string;
  preview: string;
  unreadCount: number;
  timestampLabel: string;
  sessionId: string;
  messages: ParentMessage[];
};

export const parentMessageThreads: ParentMessageThread[] = [
  {
    id: "pm1",
    tutorInitials: "MT",
    tutorName: "Marcus Thompson",
    studentName: "Jordan Wilson",
    subject: "Pre-Calculus",
    dateLabel: "Mon, Mar 30 - 4:00 PM",
    preview: "See you Monday at 4 PM!",
    unreadCount: 0,
    timestampLabel: "Mon 11:30 AM",
    sessionId: "ph1",
    messages: [
      {
        sender: "tutor",
        text: "Hi Jordan! Looking forward to our session on Monday. Do you have any specific topics for Pre-Calculus?",
        time: "Mon 10:22 AM",
        senderLabel: "Marcus",
      },
      {
        sender: "student",
        text: "Can we start with limits and continuity?",
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
    id: "pm2",
    tutorInitials: "AP",
    tutorName: "Dr. Aisha Patel",
    studentName: "Maya Wilson",
    subject: "Biology",
    dateLabel: "Thu, Mar 20 - 5:00 PM",
    preview: "Hi! Maya did great today - just a heads up.",
    unreadCount: 2,
    timestampLabel: "Today 9:15 AM",
    sessionId: "ph5",
    messages: [
      {
        sender: "tutor",
        text: "Maya did great today. We covered cell structure and she stayed engaged the whole session.",
        time: "Today 9:05 AM",
        senderLabel: "Dr. Patel",
      },
      {
        sender: "tutor",
        text: "For next time, it would help if she reviews the worksheet we discussed.",
        time: "Today 9:15 AM",
        senderLabel: "Dr. Patel",
      },
    ],
  },
];

export const parentMessagesUnreadCount = parentMessageThreads.reduce(
  (total, thread) => total + thread.unreadCount,
  0,
);
