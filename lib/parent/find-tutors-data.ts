export type ParentTutorCard = {
  id: string;
  initials: string;
  name: string;
  title: string;
  rating: number;
  sessions: number;
  subjects: string[];
  gradeLevels: string[];
  sessionTypes: ("Virtual" | "In-Person")[];
  location: string;
  price60: number;
};

export const parentBookingStudents = ["Jordan Wilson", "Maya Wilson"] as const;

export const parentTutorFilterOptions = {
  subjects: ["Math", "Science", "English", "History"] as const,
  gradeLevels: ["8th Grade", "10th Grade", "11th Grade", "12th Grade"] as const,
  sessionTypes: ["Virtual", "In-Person"] as const,
  minRate: 30,
  maxRate: 100,
};

export const parentTutorDefaultFilters = {
  bookingFor: "Jordan Wilson",
  subject: "Math",
  gradeLevel: "11th Grade",
  sessionType: "",
  maxRate: 60,
  search: "",
};

export const parentTutorResults: ParentTutorCard[] = [
  {
    id: "201",
    initials: "MT",
    name: "Marcus Thompson",
    title: "Mathematics Specialist",
    rating: 4.9,
    sessions: 47,
    subjects: ["Pre-Calculus", "Algebra II", "Statistics", "Math"],
    gradeLevels: ["10th Grade", "11th Grade", "12th Grade"],
    sessionTypes: ["Virtual", "In-Person"],
    location: "St. Louis, MO",
    price60: 45,
  },
  {
    id: "202",
    initials: "AP",
    name: "Dr. Aisha Patel",
    title: "STEM Educator",
    rating: 5.0,
    sessions: 62,
    subjects: ["Calculus", "Physics", "Chemistry", "Science", "Math"],
    gradeLevels: ["11th Grade", "12th Grade"],
    sessionTypes: ["Virtual"],
    location: "St. Louis, MO",
    price60: 55,
  },
  {
    id: "203",
    initials: "JR",
    name: "James Rivera",
    title: "English & Writing",
    rating: 4.8,
    sessions: 31,
    subjects: ["SAT Prep", "Essay Writing", "Literature", "English", "History"],
    gradeLevels: ["10th Grade", "11th Grade", "12th Grade"],
    sessionTypes: ["Virtual", "In-Person"],
    location: "St. Louis, MO",
    price60: 40,
  },
];
