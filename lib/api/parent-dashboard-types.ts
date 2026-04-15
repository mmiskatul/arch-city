export type ParentDashboardState = "empty" | "active";

export type ParentStudentChip = {
  initials: string;
  name: string;
  active?: boolean;
};

export type ParentSummaryCard = {
  title: string;
  value?: string;
  subtitle: string;
  extra?: string;
  tone: "red" | "green" | "gold";
};

export type ParentSessionRowApi = {
  id: string;
  tutor_initials: string;
  tutor_name: string;
  date: string;
  time: string;
  subject: string;
  duration: string;
  type: string;
  status: string;
};

export type ParentSessionRow = {
  id: string;
  tutorInitials: string;
  tutorName: string;
  date: string;
  time: string;
  subject: string;
  duration: string;
  type: string;
  status: string;
};

export type ParentDashboardOverviewApiResponse = {
  state: ParentDashboardState;
  students: ParentStudentChip[];
  summary_cards: ParentSummaryCard[];
  upcoming_sessions: ParentSessionRowApi[];
};

export type ParentDashboardOverview = {
  state: ParentDashboardState;
  students: ParentStudentChip[];
  summaryCards: ParentSummaryCard[];
  upcomingSessions: ParentSessionRow[];
};

function mapParentSessionRow(item: ParentSessionRowApi): ParentSessionRow {
  return {
    id: item.id,
    tutorInitials: item.tutor_initials,
    tutorName: item.tutor_name,
    date: item.date,
    time: item.time,
    subject: item.subject,
    duration: item.duration,
    type: item.type,
    status: item.status,
  };
}

export function mapParentDashboardOverview(data: ParentDashboardOverviewApiResponse): ParentDashboardOverview {
  return {
    state: data.state || "empty",
    students: data.students || [],
    summaryCards: data.summary_cards || [],
    upcomingSessions: (data.upcoming_sessions || []).map(mapParentSessionRow),
  };
}
