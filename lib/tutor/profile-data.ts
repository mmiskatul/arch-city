export const tutorProfile = {
  initials: "MT",
  firstName: "Marcus",
  lastName: "Thompson",
  title: "Mathematics Tutor",
  email: "marcus@email.com",
  phone: "(314) 555-0192",
  location: "St. Louis, MO",
  status: "Active",
  since: "Since Jan 2024",
  totalSessions: "47",
  avgRating: "4.9",
  activeStudents: "5",
  allTimeEarnings: "$2,115",
  streetAddress: "4820 Lindell Blvd, Apt 3B",
  city: "St. Louis",
  state: "MO",
  zipCode: "63108",
  emergencyContactName: "Sandra Thompson",
  emergencyContactPhone: "(314) 555-0144",
  dateOfBirth: "",
  gender: "",
  backgroundCheck: "Verified — Expires Dec 2026",
  bio: "Missouri-certified mathematics tutor with classroom and one-on-one tutoring experience focused on Algebra, Geometry, and Pre-Calculus.",
  schoolDistrict: "Clayton School District",
  education: "B.S. Mathematics Education, University of Missouri",
  workExperience: "8th Grade Math Teacher — Clayton Middle School",
  subjectsAndGrades: "Algebra I, Algebra II, Geometry, Grades 6-12",
  rates: "45 min: $35 · 60 min: $45",
  preferences: "Virtual sessions preferred",
  locationPreference: "St. Louis and nearby districts",
};

export const tutorEducationEntries = [
  {
    id: "edu-1",
    title: "B.S. Mathematics Education",
    organization: "University of Missouri",
    period: "2012 – 2016",
  },
  {
    id: "edu-2",
    title: "Missouri Teaching Certification",
    organization: "Missouri DESE · Mathematics 9–12",
    period: "2016 · Active",
  },
];

export type TutorWorkExperienceEntry = {
  id: string;
  title: string;
  organization: string;
  period: string;
  description?: string;
  from_date?: string;
  to_date?: string;
};

export const tutorWorkExperienceEntries: TutorWorkExperienceEntry[] = [];


export const tutorLocationEntries = [
  {
    id: "loc-1",
    name: "Kirkwood Public Library",
    addressLine1: "140 E Jefferson Ave",
    addressLine2: "Kirkwood, MO 63122",
    preferred: true,
    showMapPreview: true,
  },
  {
    id: "loc-2",
    name: "Starbucks — Manchester Rd",
    addressLine1: "1200 S Manchester Rd",
    addressLine2: "Kirkwood, MO 63122",
    preferred: false,
    showMapPreview: false,
  },
];

