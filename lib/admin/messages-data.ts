export type AdminConversationMessage = {
  id: string;
  senderRole: "tutor" | "student" | "admin";
  senderName: string;
  senderInitials: string;
  text: string;
  time: string;
};

export type AdminConversation = {
  id: string;
  initials: string;
  initialsClassName: string;
  title: string;
  subtitle: string;
  preview: string;
  timeLabel: string;
  unreadCount: number;
  flagged: boolean;
  messages: AdminConversationMessage[];
};

export const adminConversations: AdminConversation[] = [
  {
    id: "conv-1001",
    initials: "MR",
    initialsClassName: "bg-[#ffe7eb] text-[#d94a62]",
    title: "Marcus Reynolds <-> Jordan Wilson",
    subtitle: "Session: Algebra II - Sat Mar 22, 2:00 PM",
    preview: "Hi, can we reschedule Saturday's session?",
    timeLabel: "2:14 PM",
    unreadCount: 0,
    flagged: false,
    messages: [
      {
        id: "m1",
        senderRole: "tutor",
        senderName: "Marcus Reynolds",
        senderInitials: "MR",
        text: "Hi Jordan, I need to reschedule our Saturday session. Would Sunday at 2 PM work for you?",
        time: "2:10 PM",
      },
      {
        id: "m2",
        senderRole: "student",
        senderName: "Jordan Wilson",
        senderInitials: "JW",
        text: "Hi Mr. Reynolds! Sunday works for me. Same location?",
        time: "2:12 PM",
      },
      {
        id: "m3",
        senderRole: "tutor",
        senderName: "Marcus Reynolds",
        senderInitials: "MR",
        text: "Yes, same location at the library. See you then!",
        time: "2:14 PM",
      },
    ],
  },
  {
    id: "conv-1002",
    initials: "LD",
    initialsClassName: "bg-[#ffe7eb] text-[#d94a62]",
    title: "Lisa Davis <-> Maya Wilson",
    subtitle: "Session: Reading - Thu Mar 21, 3:30 PM",
    preview: "Great session today! See you Thursday",
    timeLabel: "11:30 AM",
    unreadCount: 0,
    flagged: false,
    messages: [
      {
        id: "m1",
        senderRole: "tutor",
        senderName: "Lisa Davis",
        senderInitials: "LD",
        text: "Great session today! See you Thursday.",
        time: "11:30 AM",
      },
    ],
  },
  {
    id: "conv-1003",
    initials: "DK",
    initialsClassName: "bg-[#ebf7ef] text-[#239157]",
    title: "David Kim <-> Alex T",
    subtitle: "Session: SAT Prep - Wed Mar 20, 10:00 AM",
    preview: "I've sent the practice test materials.",
    timeLabel: "10:05 AM",
    unreadCount: 5,
    flagged: false,
    messages: [
      {
        id: "m1",
        senderRole: "tutor",
        senderName: "David Kim",
        senderInitials: "DK",
        text: "I've sent the practice test materials.",
        time: "10:05 AM",
      },
    ],
  },
  {
    id: "conv-1004",
    initials: "PP",
    initialsClassName: "bg-[#fff6de] text-[#b58112]",
    title: "Priya Patel <-> Sophie L",
    subtitle: "Session: Chemistry - Tue Mar 19, 5:00 PM",
    preview: "Please bring your chemistry textbook next time.",
    timeLabel: "Yesterday",
    unreadCount: 5,
    flagged: true,
    messages: [
      {
        id: "m1",
        senderRole: "tutor",
        senderName: "Priya Patel",
        senderInitials: "PP",
        text: "Please bring your chemistry textbook next time.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "conv-1005",
    initials: "JM",
    initialsClassName: "bg-[#ffecef] text-[#d94a62]",
    title: "James Miller <-> Admin",
    subtitle: "Application Follow-up",
    preview: "When will my application be reviewed?",
    timeLabel: "Mar 19",
    unreadCount: 0,
    flagged: false,
    messages: [
      {
        id: "m1",
        senderRole: "tutor",
        senderName: "James Miller",
        senderInitials: "JM",
        text: "When will my application be reviewed?",
        time: "Mar 19",
      },
    ],
  },
  {
    id: "conv-1006",
    initials: "AR",
    initialsClassName: "bg-[#ffecef] text-[#d94a62]",
    title: "Alicia Ruiz <-> Admin",
    subtitle: "Credential Submission",
    preview: "I uploaded my credentials - please review.",
    timeLabel: "Mar 18",
    unreadCount: 0,
    flagged: false,
    messages: [
      {
        id: "m1",
        senderRole: "tutor",
        senderName: "Alicia Ruiz",
        senderInitials: "AR",
        text: "I uploaded my credentials - please review.",
        time: "Mar 18",
      },
    ],
  },
];

export function getAdminConversationById(id: string) {
  return adminConversations.find((item) => item.id === id);
}
