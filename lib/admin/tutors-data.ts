export type AdminTutorStatus = "Approved" | "Pending" | "Suspended";

export type AdminTutorRow = {
  id: string;
  initials: string;
  initialsClassName: string;
  name: string;
  email: string;
  subjects: string[];
  sessions: number | null;
  rating: string;
  hourlyRate: string;
  earnedMtd: string | null;
  status: AdminTutorStatus;
  applicationId?: string;
};

export type AdminTutorSubjectLevel = {
  subject: string;
  gradeRange: string;
  level: "Primary" | "Secondary";
};

export type AdminTutorEducation = {
  degree: string;
  school: string;
  years: string;
};

export type AdminTutorWorkExperience = {
  role: string;
  organization: string;
  years: string;
  focus: string;
  iconClassName: string;
};

export type AdminTutorCurrentStudent = {
  initials: string;
  initialsClassName: string;
  name: string;
  subject: string;
  schedule: string;
};

export type AdminTutorRecentSession = {
  date: string;
  student: string;
  subject: string;
  duration: string;
  earned: string;
  status: "Completed" | "No-Show";
};

export type AdminTutorDetail = {
  id: string;
  initials: string;
  initialsClassName: string;
  name: string;
  email: string;
  status: AdminTutorStatus;
  applicationId?: string;
  rating: string;
  totalSessions: number;
  totalSessionsDelta: string;
  activeStudents: number;
  familiesCount: number;
  earnedMtd: string;
  standardRate: string;
  reviewCount: number;
  personalInformation: {
    fullName: string;
    email: string;
    phone: string;
    district: string;
    joined: string;
  };
  subjectLevels: AdminTutorSubjectLevel[];
  bio: string;
  rates: {
    standardRate: string;
    satPrepRate: string;
    groupRate: string;
  };
  locations: string[];
  disabledLocations: string[];
  education: AdminTutorEducation[];
  workExperience: AdminTutorWorkExperience[];
  currentStudents: AdminTutorCurrentStudent[];
  recentSessions: AdminTutorRecentSession[];
};

export const adminTutors: AdminTutorRow[] = [
  {
    id: "TU-2001",
    initials: "MR",
    initialsClassName: "bg-[#ffe7eb] text-[#d94a62]",
    name: "Marcus Reynolds",
    email: "m.reynolds@email.com",
    subjects: ["Algebra", "Geometry"],
    sessions: 142,
    rating: "4.9",
    hourlyRate: "$45/hr",
    earnedMtd: "$2,340",
    status: "Approved",
  },
  {
    id: "TU-2002",
    initials: "LD",
    initialsClassName: "bg-[#ffe7eb] text-[#d94a62]",
    name: "Lisa Davis",
    email: "l.davis@email.com",
    subjects: ["Reading", "Writing"],
    sessions: 98,
    rating: "4.8",
    hourlyRate: "$40/hr",
    earnedMtd: "$1,950",
    status: "Approved",
  },
  {
    id: "TU-2003",
    initials: "DK",
    initialsClassName: "bg-[#ebf7ef] text-[#239157]",
    name: "David Kim",
    email: "d.kim@email.com",
    subjects: ["SAT Prep", "Math"],
    sessions: 210,
    rating: "4.9",
    hourlyRate: "$55/hr",
    earnedMtd: "$1,820",
    status: "Approved",
  },
  {
    id: "TU-2004",
    initials: "PP",
    initialsClassName: "bg-[#fff6de] text-[#b58112]",
    name: "Priya Patel",
    email: "p.patel@email.com",
    subjects: ["Chemistry", "Biology"],
    sessions: 74,
    rating: "4.7",
    hourlyRate: "$50/hr",
    earnedMtd: "$1,540",
    status: "Approved",
  },
  {
    id: "TU-2005",
    initials: "JM",
    initialsClassName: "bg-[#f1f1f1] text-[#6b7280]",
    name: "James Miller",
    email: "j.miller@email.com",
    subjects: ["Physics", "Calculus"],
    sessions: null,
    rating: "New",
    hourlyRate: "$60/hr",
    earnedMtd: null,
    status: "Pending",
    applicationId: "TA-1024",
  },
  {
    id: "TU-2006",
    initials: "AR",
    initialsClassName: "bg-[#ffecef] text-[#d94a62]",
    name: "Alicia Ruiz",
    email: "a.ruiz@email.com",
    subjects: ["Spanish", "ESL"],
    sessions: null,
    rating: "New",
    hourlyRate: "$45/hr",
    earnedMtd: null,
    status: "Pending",
    applicationId: "TA-1025",
  },
  {
    id: "TU-2007",
    initials: "TC",
    initialsClassName: "bg-[#f1f1f1] text-[#6b7280]",
    name: "Thomas Clark",
    email: "t.clark@email.com",
    subjects: ["History", "Civics"],
    sessions: 31,
    rating: "4.4",
    hourlyRate: "$35/hr",
    earnedMtd: "$640",
    status: "Suspended",
  },
  {
    id: "TU-2008",
    initials: "NF",
    initialsClassName: "bg-[#ebf7ef] text-[#239157]",
    name: "Nina Foster",
    email: "n.foster@email.com",
    subjects: ["English", "Writing"],
    sessions: 57,
    rating: "4.6",
    hourlyRate: "$42/hr",
    earnedMtd: "$1,140",
    status: "Approved",
  },
  {
    id: "TU-2009",
    initials: "RJ",
    initialsClassName: "bg-[#ffecef] text-[#d94a62]",
    name: "Robert James",
    email: "r.james@email.com",
    subjects: ["Physics"],
    sessions: null,
    rating: "New",
    hourlyRate: "$48/hr",
    earnedMtd: null,
    status: "Pending",
    applicationId: "TA-1027",
  },
  {
    id: "TU-2010",
    initials: "SK",
    initialsClassName: "bg-[#fff6de] text-[#b58112]",
    name: "Sana Khan",
    email: "s.khan@email.com",
    subjects: ["Biology", "Science"],
    sessions: 44,
    rating: "4.5",
    hourlyRate: "$46/hr",
    earnedMtd: "$980",
    status: "Approved",
  },
];

function baseTutorDetail(tutor: AdminTutorRow): AdminTutorDetail {
  return {
    id: tutor.id,
    initials: tutor.initials,
    initialsClassName: tutor.initialsClassName,
    name: tutor.name,
    email: tutor.email,
    status: tutor.status,
    rating: tutor.rating === "New" ? "0.0" : tutor.rating,
    totalSessions: tutor.sessions ?? 0,
    totalSessionsDelta: "+6 this month",
    activeStudents: 5,
    familiesCount: 4,
    earnedMtd: tutor.earnedMtd ?? "$0",
    standardRate: tutor.hourlyRate,
    reviewCount: tutor.rating === "New" ? 0 : 96,
    personalInformation: {
      fullName: tutor.name,
      email: tutor.email,
      phone: "(314) 555-0100",
      district: "St. Louis School District",
      joined: "January 2025",
    },
    subjectLevels: tutor.subjects.map((subject, index) => ({
      subject,
      gradeRange: index === 0 ? "10th - 12th Grade" : "8th - 11th Grade",
      level: index === 0 ? "Primary" : "Secondary",
    })),
    bio: "Dedicated tutor focused on helping students gain confidence through practical, step-by-step learning.",
    rates: {
      standardRate: tutor.hourlyRate,
      satPrepRate: "$60/hr",
      groupRate: "$35/hr",
    },
    locations: ["Online (Zoom)", "Student's home", "Library (Clayton)"],
    disabledLocations: ["Tutor's home"],
    education: [
      {
        degree: "B.S Mathematics",
        school: "Washington University in St. Louis",
        years: "2015 - 2019",
      },
    ],
    workExperience: [
      {
        role: "Independent Tutor",
        organization: "Arch City Tutors",
        years: "Jan 2024 - Present",
        focus: tutor.subjects.join(", "),
        iconClassName: "bg-[#ffecef] text-[#d94a62]",
      },
    ],
    currentStudents: [
      {
        initials: "AT",
        initialsClassName: "bg-[#ffe7eb] text-[#d94a62]",
        name: "Alex Thompson",
        subject: tutor.subjects[0] ?? "Tutoring",
        schedule: "Tuesdays 4:00 PM",
      },
      {
        initials: "SL",
        initialsClassName: "bg-[#fff6de] text-[#b58112]",
        name: "Sophie Lee",
        subject: tutor.subjects[0] ?? "Tutoring",
        schedule: "Thursdays 5:30 PM",
      },
    ],
    recentSessions: [
      {
        date: "Mar 25, 2026",
        student: "Alex Thompson",
        subject: tutor.subjects[0] ?? "Tutoring",
        duration: "60 min",
        earned: "$55",
        status: "Completed",
      },
      {
        date: "Mar 19, 2026",
        student: "Ryan Johnson",
        subject: tutor.subjects[0] ?? "Tutoring",
        duration: "—",
        earned: "—",
        status: "No-Show",
      },
    ],
  };
}

export function getAdminTutorById(id: string) {
  return adminTutors.find((tutor) => tutor.id === id);
}

export function getAdminTutorDetailById(id: string): AdminTutorDetail | undefined {
  const tutor = getAdminTutorById(id);
  if (!tutor) return undefined;

  const detail = baseTutorDetail(tutor);

  if (id === "TU-2003") {
    return {
      ...detail,
      activeStudents: 7,
      familiesCount: 5,
      totalSessionsDelta: "+12 this month",
      reviewCount: 186,
      personalInformation: {
        fullName: "David Kim",
        email: "d.kim@email.com",
        phone: "(314) 555-0194",
        district: "Clayton School District",
        joined: "January 2024",
      },
      subjectLevels: [
        { subject: "SAT Prep", gradeRange: "10th - 12th Grade · High School", level: "Primary" },
        { subject: "Algebra II", gradeRange: "9th - 11th Grade", level: "Secondary" },
        { subject: "Pre-Calculus", gradeRange: "11th - 12th Grade", level: "Secondary" },
        { subject: "General Math", gradeRange: "5th - 9th Grade", level: "Secondary" },
      ],
      bio: "I'm a passionate math and SAT tutor with over 6 years of experience helping students in the St. Louis area build confidence and achieve their academic goals. I specialize in breaking down complex problems into approachable steps.",
      rates: {
        standardRate: "$55/hr",
        satPrepRate: "$60/hr",
        groupRate: "$35/hr",
      },
      education: [
        {
          degree: "B.S Mathematics",
          school: "Washington University in St. Louis",
          years: "2015 - 2019",
        },
        {
          degree: "M.Ed. Education",
          school: "University of Missouri - St. Louis",
          years: "2019 - 2021",
        },
      ],
      workExperience: [
        {
          role: "Independent Tutor",
          organization: "Arch City Tutors",
          years: "Jan 2024 - Present",
          focus: "SAT Prep, Math (Algebra-Calculus)",
          iconClassName: "bg-[#ffecef] text-[#d94a62]",
        },
        {
          role: "Math Teacher",
          organization: "Clayton High School",
          years: "Aug 2021 - Dec 2023",
          focus: "Algebra I & II, Pre-Calculus",
          iconClassName: "bg-[#fff6de] text-[#b58112]",
        },
      ],
      currentStudents: [
        {
          initials: "AT",
          initialsClassName: "bg-[#ffe7eb] text-[#d94a62]",
          name: "Alex Thompson",
          subject: "SAT Prep",
          schedule: "Tuesdays 4:00 PM",
        },
        {
          initials: "SL",
          initialsClassName: "bg-[#fff6de] text-[#b58112]",
          name: "Sophie Lee",
          subject: "Algebra II",
          schedule: "Thursdays 5:30 PM",
        },
        {
          initials: "RJ",
          initialsClassName: "bg-[#ffecef] text-[#d94a62]",
          name: "Ryan Johnson",
          subject: "Pre-Calculus",
          schedule: "Wednesdays 3:00 PM",
        },
        {
          initials: "NB",
          initialsClassName: "bg-[#ebf7ef] text-[#239157]",
          name: "Noah Baker",
          subject: "General Math",
          schedule: "Mondays 4:00 PM",
        },
      ],
      recentSessions: [
        {
          date: "Mar 25, 2026",
          student: "Alex Thompson",
          subject: "SAT Prep",
          duration: "60 min",
          earned: "$55",
          status: "Completed",
        },
        {
          date: "Mar 24, 2026",
          student: "Sophie Lee",
          subject: "Algebra II",
          duration: "60 min",
          earned: "$55",
          status: "Completed",
        },
        {
          date: "Mar 23, 2026",
          student: "Noah Baker",
          subject: "General Math",
          duration: "60 min",
          earned: "$55",
          status: "Completed",
        },
        {
          date: "Mar 19, 2026",
          student: "Ryan Johnson",
          subject: "Pre-Calculus",
          duration: "—",
          earned: "—",
          status: "No-Show",
        },
        {
          date: "Mar 18, 2026",
          student: "Alex Thompson",
          subject: "SAT Prep",
          duration: "60 min",
          earned: "$55",
          status: "Completed",
        },
      ],
    };
  }

  return detail;
}




