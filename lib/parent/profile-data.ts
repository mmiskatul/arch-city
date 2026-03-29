export const parentProfile = {
  initials: "SW",
  firstName: "Sarah",
  lastName: "Wilson",
  title: "Parent Account",
  status: "Active",
  email: "sarah@email.com",
  phone: "(314) 555-0187",
  streetAddress: "7240 Forsyth Blvd",
  city: "Clayton",
  state: "",
  zipCode: "63105",
};

export const parentPlan = {
  name: "Parent Plan",
  summary: "Up to 3 students - Unlimited sessions",
  enrolledStudents: 2,
  memberSince: "January 2024",
  currentTierId: "plan-2",
};

export const parentPlanOptions = [
  {
    id: "plan-1",
    name: "Parent Plan",
    price: "$10.0/mo",
    studentLimitLabel: "1 student profile",
    actionLabel: "Downgrade",
  },
  {
    id: "plan-2",
    name: "Parent Plan",
    price: "$17.50/mo",
    studentLimitLabel: "Up to 2 student profiles",
    actionLabel: "Current Plan",
  },
  {
    id: "plan-3",
    name: "Parent Plan",
    price: "$22.50/mo",
    studentLimitLabel: "Up to 3 student profiles",
    actionLabel: "Upgrade",
  },
  {
    id: "plan-4",
    name: "Parent Plan",
    price: "$25.00/mo",
    studentLimitLabel: "Up to 4 student profiles",
    actionLabel: "Upgrade",
  },
];

export const parentBillingHistory = [
  {
    id: "pb1",
    date: "Mar 1, 2026",
    description: "Monthly parent subscription",
    amount: "$17.50",
    status: "Paid",
  },
  {
    id: "pb2",
    date: "Feb 1, 2026",
    description: "Monthly parent subscription",
    amount: "$17.50",
    status: "Paid",
  },
  {
    id: "pb3",
    date: "Jan 1, 2026",
    description: "Monthly parent subscription",
    amount: "$17.50",
    status: "Paid",
  },
];

export type ParentProfileHistoryItem = {
  id: string;
  monthLabel: string;
  student: "Jordan" | "Maya";
  studentInitials: "JW" | "MW";
  tutorName: string;
  tutorInitials: string;
  subject: string;
  dateLabel: string;
  status: "Completed" | "Cancelled";
  duration: string;
  type: "In-Person" | "Virtual";
  amount: string;
};

export const parentProfileHistoryItems: ParentProfileHistoryItem[] = [
  {
    id: "phh1",
    monthLabel: "March 2026",
    student: "Jordan",
    studentInitials: "JW",
    tutorName: "Marcus Reynolds",
    tutorInitials: "MR",
    subject: "Algebra II",
    dateLabel: "Sat, Mar 22 - 2:00 PM",
    status: "Completed",
    duration: "60 min",
    type: "In-Person",
    amount: "$45.00",
  },
  {
    id: "phh2",
    monthLabel: "March 2026",
    student: "Maya",
    studentInitials: "MW",
    tutorName: "Lisa Davis",
    tutorInitials: "LD",
    subject: "Reading Comprehension",
    dateLabel: "Tue, Mar 18 - 4:00 PM",
    status: "Completed",
    duration: "45 min",
    type: "Virtual",
    amount: "$32.50",
  },
  {
    id: "phh3",
    monthLabel: "March 2026",
    student: "Jordan",
    studentInitials: "JW",
    tutorName: "Marcus Reynolds",
    tutorInitials: "MR",
    subject: "Algebra II",
    dateLabel: "Sat, Mar 15 - 10:00 AM",
    status: "Cancelled",
    duration: "60 min",
    type: "In-Person",
    amount: "—",
  },
  {
    id: "phh4",
    monthLabel: "February 2026",
    student: "Maya",
    studentInitials: "MW",
    tutorName: "Lisa Davis",
    tutorInitials: "LD",
    subject: "Reading Comprehension",
    dateLabel: "Thu, Feb 27 - 3:30 PM",
    status: "Completed",
    duration: "45 min",
    type: "Virtual",
    amount: "$32.50",
  },
];
