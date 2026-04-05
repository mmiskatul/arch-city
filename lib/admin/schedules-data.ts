export type AdminScheduleStatus = "Upcoming" | "Completion Requested" | "Completed" | "Cancelled";
export type AdminScheduleType = "In-Person" | "Virtual";

export type AdminScheduleRow = {
  sessionId: string;
  studentInitials: string;
  studentInitialsClassName: string;
  student: string;
  tutor: string;
  subject: string;
  sessionDate?: string;
  sessionTime?: string;
  dateTime: string;
  meetingLocation?: string;
  duration: string;
  type: AdminScheduleType;
  status: AdminScheduleStatus;
  fee: string;
};

export type AdminScheduleTimelineItem = {
  title: string;
  meta: string;
};

export type AdminScheduleDetail = {
  sessionId: string;
  status: AdminScheduleStatus;
  subject: string;
  dateLabel: string;
  timeRange: string;
  sessionType: AdminScheduleType;
  meetingLocation: string;
  overview: {
    date: string;
    duration: string;
    platform: string;
  };
  payment: {
    sessionRate: string;
    durationHours: string;
    subtotal: string;
    platformFee: string;
    totalCharged: string;
    tutorPayout: string;
    method: string;
    paidAt: string;
  };
  student: {
    studentId: string;
    initials: string;
    initialsClassName: string;
    name: string;
    gradeSchool: string;
    parentPhone: string;
    email: string;
    plan: string;
    sessionsUsed: string;
    totalSessions: string;
  };
  tutor: {
    tutorId: string;
    initials: string;
    initialsClassName: string;
    name: string;
    title: string;
    ratingAndSessions: string;
    email: string;
    phone: string;
    rateApplied: string;
    status: string;
  };
  sessionNotes: string;
  notes: string;
  notesMeta: string;
  timeline: AdminScheduleTimelineItem[];
};
