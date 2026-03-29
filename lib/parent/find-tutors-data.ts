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
  price45: number;
  price60: number;
  inPerson45: number;
  inPerson60: number;
  about: string;
  education: string[];
  availability: string[];
  verified?: boolean;
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
    subjects: ["Math", "Algebra I", "Algebra II", "Pre-Calculus", "Geometry", "Statistics", "ACT Math Prep"],
    gradeLevels: ["10th Grade", "11th Grade", "12th Grade"],
    sessionTypes: ["Virtual", "In-Person"],
    location: "St. Louis, MO",
    price45: 35,
    price60: 45,
    inPerson45: 40,
    inPerson60: 50,
    about:
      "I'm a Missouri-certified mathematics teacher with over 6 years of classroom experience and 3 years of private tutoring. I specialize in helping high school students build strong foundational skills in algebra, pre-calculus, and statistics. My sessions are structured but flexible - I meet students where they are and move at their pace.",
    education: [
      "B.S. Mathematics Education - University of Missouri",
      "2014-2018",
      "Missouri Teaching Certification - Mathematics (6-12)",
      "Issued 2018 - Active",
    ],
    availability: ["Mon - Wed - Fri 3:00 PM - 7:00 PM", "Saturday 9:00 AM - 2:00 PM"],
    verified: true,
  },
  {
    id: "202",
    initials: "AP",
    name: "Dr. Aisha Patel",
    title: "STEM Educator",
    rating: 5.0,
    sessions: 62,
    subjects: ["Math", "Calculus", "Physics", "Chemistry", "Biology", "Science"],
    gradeLevels: ["11th Grade", "12th Grade"],
    sessionTypes: ["Virtual"],
    location: "St. Louis, MO",
    price45: 45,
    price60: 55,
    inPerson45: 0,
    inPerson60: 0,
    about:
      "I help students make complex STEM topics easier to understand with visual explanations, guided practice, and exam-focused review. My background includes classroom teaching and curriculum design for advanced science and math learners.",
    education: [
      "Ph.D. Science Education - Washington University in St. Louis",
      "2012-2018",
      "Missouri Teaching Certification - Science (9-12)",
      "Issued 2019 - Active",
    ],
    availability: ["Tue - Thu 4:00 PM - 8:00 PM", "Sunday 10:00 AM - 1:00 PM"],
    verified: true,
  },
  {
    id: "203",
    initials: "JR",
    name: "James Rivera",
    title: "SAT Math & Writing Coach",
    rating: 4.8,
    sessions: 31,
    subjects: ["Math", "SAT Prep", "SAT Math", "Essay Writing", "English"],
    gradeLevels: ["10th Grade", "11th Grade", "12th Grade"],
    sessionTypes: ["Virtual", "In-Person"],
    location: "St. Louis, MO",
    price45: 30,
    price60: 40,
    inPerson45: 35,
    inPerson60: 45,
    about:
      "I help students raise scores in SAT Math, algebra, and academic writing with focused practice, clear strategy, and targeted review. My sessions balance confidence-building with concrete skill work students can use right away.",
    education: [
      "M.A. Education - Saint Louis University",
      "2015-2017",
      "Secondary Math & English Certification - Missouri",
      "Issued 2018 - Active",
    ],
    availability: ["Mon - Thu 5:00 PM - 8:00 PM", "Saturday 11:00 AM - 3:00 PM"],
    verified: true,
  },
];

export function getParentTutorById(id: string) {
  return parentTutorResults.find((tutor) => tutor.id === id);
}
