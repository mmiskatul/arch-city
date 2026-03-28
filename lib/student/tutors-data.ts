export type StudentTutor = {
  slug: string;
  initials: string;
  name: string;
  reviews: number;
  rating: number;
  mode: "Virtual" | "In-Person" | "Both";
  certification: string;
  district: string;
  location: string;
  grades: string;
  gradeGroup: "Kindergarten" | "Grades 1-5" | "Grades 6-8" | "Grades 9-12" | "College-Aged";
  subjects: string[];
  subjectTags: string[];
  about: string;
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  experience: {
    title: string;
    organization: string;
    years: string;
  };
  availability: Array<{
    day: string;
    time: string;
  }>;
  price45: number;
  price60: number;
  inPersonAvailable: boolean;
};

export const studentTutors: StudentTutor[] = [
  {
    slug: "marcus-thompson",
    initials: "MT",
    name: "Marcus Thompson",
    reviews: 48,
    rating: 4.8,
    mode: "Virtual",
    certification: "Missouri Certified",
    district: "Clayton School District",
    location: "St. Louis, MO",
    grades: "Grades 6-12",
    gradeGroup: "Grades 6-8",
    subjects: ["Math", "Algebra II", "Pre-Calculus", "Geometry"],
    subjectTags: ["Algebra II", "Pre-Calculus", "Geometry", "Algebra I", "Grades 6-8", "Grades 9-12"],
    about:
      'I am a Missouri-certified mathematics teacher with 8 years of classroom and tutoring experience. I specialize in helping middle and high school students build confidence in Algebra, Geometry, and Pre-Calculus. My approach focuses on conceptual understanding before procedural fluency, so students truly grasp the "why" behind the math.',
    education: [
      { degree: "B.S. Mathematics Education", school: "University of Missouri", year: "2015" },
      {
        degree: "M.Ed. Curriculum & Instruction",
        school: "Washington University in St. Louis",
        year: "2018",
      },
    ],
    experience: {
      title: "8th Grade Math Teacher",
      organization: "Clayton Middle School",
      years: "2016 - Present",
    },
    availability: [
      { day: "Mon, Mar 30", time: "4:00 PM - 5:00 PM" },
      { day: "Wed, Apr 1", time: "3:30 PM - 5:00 PM" },
      { day: "Thu, Apr 2", time: "5:00 PM - 6:00 PM" },
    ],
    price45: 35,
    price60: 45,
    inPersonAvailable: false,
  },
  {
    slug: "sandra-avery",
    initials: "SA",
    name: "Sandra Avery",
    reviews: 31,
    rating: 4.9,
    mode: "In-Person",
    certification: "English Specialist",
    district: "Ladue School District",
    location: "St. Louis, MO",
    grades: "Grades 5-12",
    gradeGroup: "Grades 9-12",
    subjects: ["English", "Literature", "Writing"],
    subjectTags: ["English", "Literature", "Writing", "Essay Coaching", "Grades 5-8", "Grades 9-12"],
    about:
      "I help students become more confident readers and writers through close reading, structure practice, and targeted revision. My sessions are especially useful for literary analysis, essays, and middle-to-high-school English support.",
    education: [
      { degree: "B.A. English", school: "Saint Louis University", year: "2012" },
      {
        degree: "M.A. Secondary Education",
        school: "University of Missouri - St. Louis",
        year: "2016",
      },
    ],
    experience: {
      title: "High School English Teacher",
      organization: "Ladue Horton Watkins High School",
      years: "2015 - Present",
    },
    availability: [
      { day: "Tue, Mar 31", time: "5:00 PM - 5:45 PM" },
      { day: "Thu, Apr 2", time: "4:30 PM - 5:15 PM" },
      { day: "Sat, Apr 4", time: "10:00 AM - 11:00 AM" },
    ],
    price45: 40,
    price60: 50,
    inPersonAvailable: true,
  },
  {
    slug: "rebecca-jones",
    initials: "RJ",
    name: "Rebecca Jones",
    reviews: 22,
    rating: 4.4,
    mode: "Virtual",
    certification: "Science Certified",
    district: "Kirkwood School District",
    location: "St. Louis, MO",
    grades: "Grades 7-College",
    gradeGroup: "College-Aged",
    subjects: ["Science", "Biology", "Chemistry", "Earth Science"],
    subjectTags: ["Biology", "Chemistry", "Earth Science", "Lab Reports", "Grades 7-12", "College"],
    about:
      "My science tutoring is built around diagrams, active recall, and problem breakdowns that make dense topics easier to retain. I work with both school coursework and exam prep, especially in biology and chemistry.",
    education: [
      { degree: "B.S. Biology", school: "University of Illinois", year: "2014" },
      { degree: "M.S. Science Education", school: "Webster University", year: "2019" },
    ],
    experience: {
      title: "Science Department Tutor",
      organization: "Kirkwood Learning Center",
      years: "2018 - Present",
    },
    availability: [
      { day: "Mon, Mar 30", time: "6:00 PM - 7:00 PM" },
      { day: "Wed, Apr 1", time: "6:30 PM - 7:30 PM" },
      { day: "Fri, Apr 3", time: "5:00 PM - 6:00 PM" },
    ],
    price45: 30,
    price60: 40,
    inPersonAvailable: false,
  },
  {
    slug: "derek-lewis",
    initials: "DL",
    name: "Derek Lewis",
    reviews: 56,
    rating: 4.9,
    mode: "Both",
    certification: "Test Prep Specialist",
    district: "Webster Groves",
    location: "St. Louis, MO",
    grades: "Grades 9-College",
    gradeGroup: "College-Aged",
    subjects: ["Math", "Statistics", "ACT/SAT Prep"],
    subjectTags: ["Math", "Statistics", "ACT/SAT Prep", "College Algebra", "Grades 9-12", "College"],
    about:
      "I focus on score growth and confidence for students balancing school math with standardized test prep. Sessions are structured, data-driven, and designed to help students identify where points are being lost.",
    education: [
      { degree: "B.S. Applied Mathematics", school: "Missouri State University", year: "2011" },
      { degree: "M.S. Statistics", school: "University of Missouri", year: "2014" },
    ],
    experience: {
      title: "Math and Test Prep Tutor",
      organization: "Webster Groves Academic Center",
      years: "2014 - Present",
    },
    availability: [
      { day: "Tue, Mar 31", time: "7:00 PM - 8:00 PM" },
      { day: "Thu, Apr 2", time: "6:00 PM - 7:00 PM" },
      { day: "Sun, Apr 5", time: "11:00 AM - 12:00 PM" },
    ],
    price45: 45,
    price60: 55,
    inPersonAvailable: true,
  },
  {
    slug: "karen-wright",
    initials: "KW",
    name: "Karen Wright",
    reviews: 18,
    rating: 4.2,
    mode: "In-Person",
    certification: "Early Literacy",
    district: "Ferguson-Florissant",
    location: "St. Louis, MO",
    grades: "Kindergarten-Grade 5",
    gradeGroup: "Kindergarten",
    subjects: ["Reading", "Phonics", "Literacy"],
    subjectTags: ["Reading", "Phonics", "Literacy", "Fluency", "Kindergarten", "Grades 1-5"],
    about:
      "I work with younger learners on phonics, reading confidence, and foundational literacy habits. Sessions are paced with patience and repetition so students can build consistent momentum at home and in school.",
    education: [
      { degree: "B.S. Elementary Education", school: "Truman State University", year: "2010" },
      {
        degree: "Reading Specialist Certification",
        school: "Maryville University",
        year: "2017",
      },
    ],
    experience: {
      title: "Elementary Reading Interventionist",
      organization: "Ferguson-Florissant School District",
      years: "2013 - Present",
    },
    availability: [
      { day: "Mon, Mar 30", time: "3:30 PM - 4:15 PM" },
      { day: "Wed, Apr 1", time: "4:00 PM - 4:45 PM" },
      { day: "Fri, Apr 3", time: "3:30 PM - 4:15 PM" },
    ],
    price45: 28,
    price60: 35,
    inPersonAvailable: true,
  },
  {
    slug: "james-morgan",
    initials: "JM",
    name: "James Morgan",
    reviews: 40,
    rating: 4.7,
    mode: "Virtual",
    certification: "History & Civics",
    district: "Rockwood School District",
    location: "St. Louis, MO",
    grades: "Grades 6-College",
    gradeGroup: "Grades 6-8",
    subjects: ["History", "U.S. History", "Civics", "AP History"],
    subjectTags: ["U.S. History", "Civics", "AP History", "Essay Writing", "Grades 6-8", "Grades 9-12"],
    about:
      "I help students organize historical arguments, understand context, and improve document-based writing. My sessions are strong for both general social studies support and AP-level history preparation.",
    education: [
      { degree: "B.A. History", school: "University of Kansas", year: "2013" },
      { degree: "M.A. American Studies", school: "Saint Louis University", year: "2018" },
    ],
    experience: {
      title: "Social Studies Teacher",
      organization: "Rockwood School District",
      years: "2016 - Present",
    },
    availability: [
      { day: "Tue, Mar 31", time: "5:30 PM - 6:30 PM" },
      { day: "Thu, Apr 2", time: "5:00 PM - 6:00 PM" },
      { day: "Sat, Apr 4", time: "1:00 PM - 2:00 PM" },
    ],
    price45: 32,
    price60: 42,
    inPersonAvailable: false,
  },
];

export function getStudentTutorBySlug(slug: string) {
  return studentTutors.find((tutor) => tutor.slug === slug);
}
