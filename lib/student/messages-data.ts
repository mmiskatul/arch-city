export type StudentMessageThread = {
  id: string;
  sessionId: string;
  tutorId: string;
  tutorInitials: string;
  tutorName: string;
  subject: string;
  sessionMeta: string;
  preview: string;
  timestampLabel: string;
  unreadCount: number;
  statusLabel?: string;
  messages: Array<{
    id: string;
    sender: "tutor" | "student";
    message: string;
    timestamp: string;
  }>;
};

export const studentMessageThreads: StudentMessageThread[] = [
  {
    id: "thread-s1",
    sessionId: "s1",
    tutorId: "101",
    tutorInitials: "MT",
    tutorName: "Marcus Thompson",
    subject: "Algebra II",
    sessionMeta: "Algebra II · Mon, Mar 30 · 4:00 PM",
    preview: "See you Monday at 4 PM!",
    timestampLabel: "Mon 11:30 AM",
    unreadCount: 0,
    messages: [
      {
        id: "m1",
        sender: "tutor",
        message:
          "Hi Jordan! Looking forward to our session on Monday. Do you have any specific topics you'd like to focus on in Algebra II?",
        timestamp: "Mon 10:22 AM",
      },
      {
        id: "m2",
        sender: "student",
        message: "Hey! Yes, I'm struggling with polynomial functions and factoring. Can we start there?",
        timestamp: "Mon 11:05 AM",
      },
      {
        id: "m3",
        sender: "tutor",
        message:
          "Absolutely! Polynomial factoring is a great topic to solidify. I'll prepare some examples and practice problems. See you Monday at 4 PM!",
        timestamp: "Mon 11:30 AM",
      },
    ],
  },
  {
    id: "thread-s2",
    sessionId: "s2",
    tutorId: "102",
    tutorInitials: "SA",
    tutorName: "Sandra Avery",
    subject: "English Lit",
    sessionMeta: "English Lit · Apr 1",
    preview: "Quick reminder about our session on Wednesday...",
    timestampLabel: "Today 9:14 AM",
    unreadCount: 1,
    messages: [
      {
        id: "m4",
        sender: "tutor",
        message:
          "Quick reminder about our session on Wednesday. Please bring your thesis draft and the article annotations.",
        timestamp: "Today 8:42 AM",
      },
      {
        id: "m5",
        sender: "student",
        message: "Will do. Should I also bring the revised intro paragraph?",
        timestamp: "Today 8:58 AM",
      },
      {
        id: "m6",
        sender: "tutor",
        message: "Yes, that would help. We can polish the intro first and then move into body paragraph structure.",
        timestamp: "Today 9:14 AM",
      },
    ],
  },
  {
    id: "thread-s3",
    sessionId: "s3",
    tutorId: "103",
    tutorInitials: "RJ",
    tutorName: "Rebecca Jones",
    subject: "Biology",
    sessionMeta: "Biology · Apr 3",
    preview: "Here's some prep material for Friday's session",
    timestampLabel: "Yesterday 6:45 PM",
    unreadCount: 1,
    messages: [
      {
        id: "m7",
        sender: "tutor",
        message:
          "Here's some prep material for Friday's session. Focus on cell transport and membrane structure before we meet.",
        timestamp: "Yesterday 6:10 PM",
      },
      {
        id: "m8",
        sender: "student",
        message: "Thanks! I'll review it tonight. Can we also spend a few minutes on diffusion questions?",
        timestamp: "Yesterday 6:27 PM",
      },
      {
        id: "m9",
        sender: "tutor",
        message: "Definitely. I'll add a short set of diffusion and osmosis practice questions for us.",
        timestamp: "Yesterday 6:45 PM",
      },
    ],
  },
  {
    id: "thread-s4",
    sessionId: "s4",
    tutorId: "104",
    tutorInitials: "DL",
    tutorName: "Derek Lewis",
    subject: "Statistics",
    sessionMeta: "Statistics · Mar 22 (Completed)",
    preview: "Great working with you! Good luck on your exam.",
    timestampLabel: "Mar 20",
    unreadCount: 0,
    statusLabel: "Completed",
    messages: [
      {
        id: "m10",
        sender: "student",
        message: "Thanks again for walking me through standard deviation problems.",
        timestamp: "Mar 20 6:05 PM",
      },
      {
        id: "m11",
        sender: "tutor",
        message:
          "Of course. You were much more confident by the end of the session. Review the final worksheet and you'll be in good shape.",
        timestamp: "Mar 20 6:18 PM",
      },
      {
        id: "m12",
        sender: "tutor",
        message: "Great working with you! Good luck on your exam.",
        timestamp: "Mar 20 6:22 PM",
      },
    ],
  },
  {
    id: "thread-s5",
    sessionId: "s5",
    tutorId: "105",
    tutorInitials: "KW",
    tutorName: "Karen Wright",
    subject: "Reading",
    sessionMeta: "Reading · Mar 18 (Completed)",
    preview: "Jordan read more fluently today. Keep the same pace at home.",
    timestampLabel: "Mar 18",
    unreadCount: 0,
    statusLabel: "Completed",
    messages: [
      {
        id: "m13",
        sender: "tutor",
        message:
          "Jordan read more fluently today. Keep the same pace at home and re-read the highlighted paragraphs once before Friday.",
        timestamp: "Mar 18 4:55 PM",
      },
    ],
  },
  {
    id: "thread-s6",
    sessionId: "s6",
    tutorId: "106",
    tutorInitials: "JM",
    tutorName: "James Morgan",
    subject: "AP History",
    sessionMeta: "AP History · Mar 11 (Completed)",
    preview: "Review the DBQ outline before our next check-in.",
    timestampLabel: "Mar 11",
    unreadCount: 0,
    statusLabel: "Completed",
    messages: [
      {
        id: "m14",
        sender: "tutor",
        message:
          "Review the DBQ outline before our next check-in. Your argument is strong, but your document grouping can still be tighter.",
        timestamp: "Mar 11 2:14 PM",
      },
    ],
  },
];

export const studentMessagesUnreadCount = studentMessageThreads.reduce(
  (total, thread) => total + thread.unreadCount,
  0,
);

export function getStudentMessageThreadById(id: string) {
  return studentMessageThreads.find((thread) => thread.id === id);
}
