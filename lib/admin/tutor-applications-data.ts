export type ApplicationStatus = "Pending" | "Confirmed" | "Cancelled";

export type TutorApplication = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  submittedOn: string;
  subjects: string[];
  experience: string;
  education: string;
  availability: string;
  hourlyRate: string;
  location: string;
  bio: string;
  certifications: string[];
  documents: string[];
  status: ApplicationStatus;
};

export const adminTutorApplications: TutorApplication[] = [
  {
    id: "TA-1024",
    fullName: "Marcus Reynolds",
    email: "marcus.reynolds@email.com",
    phone: "+1 (314) 555-0193",
    submittedOn: "March 19, 2026",
    subjects: ["Algebra", "Geometry", "Pre-Calculus"],
    experience: "6 years private tutoring + 2 years classroom support",
    education: "B.S. in Mathematics, University of Missouri",
    availability: "Weekdays 4:00 PM - 9:00 PM, Saturday mornings",
    hourlyRate: "$45/hr",
    location: "St. Louis, MO (Virtual + In-Person)",
    bio: "I help middle and high school students build confidence in math with step-by-step problem solving and exam-focused practice.",
    certifications: ["Background Check Cleared", "State Tutor Eligibility"],
    documents: ["Resume.pdf", "Teaching Certificate.pdf", "ID Verification.pdf"],
    status: "Pending",
  },
  {
    id: "TA-1025",
    fullName: "Lisa Davis",
    email: "lisa.davis@email.com",
    phone: "+1 (314) 555-0147",
    submittedOn: "March 20, 2026",
    subjects: ["Reading", "Writing", "English"],
    experience: "5 years literacy coaching and one-on-one tutoring",
    education: "M.Ed. in Curriculum and Instruction, Saint Louis University",
    availability: "Mon-Fri 3:00 PM - 8:00 PM",
    hourlyRate: "$40/hr",
    location: "St. Louis, MO (Virtual only)",
    bio: "I specialize in reading comprehension, essay writing, and helping students improve academic communication skills.",
    certifications: ["Background Check Cleared", "TESOL Certification"],
    documents: ["Resume.pdf", "Degree Transcript.pdf", "Background Check.pdf"],
    status: "Pending",
  },
  {
    id: "TA-1026",
    fullName: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (314) 555-0129",
    submittedOn: "March 20, 2026",
    subjects: ["SAT Prep", "Math", "Physics"],
    experience: "7 years test-prep tutoring and AP mentoring",
    education: "B.S. in Physics, Washington University in St. Louis",
    availability: "Weekdays after 5:00 PM, Sunday afternoon",
    hourlyRate: "$50/hr",
    location: "Clayton, MO (Virtual + In-Person)",
    bio: "I focus on score improvement strategies, timed practice, and concept clarity for SAT Math and Physics.",
    certifications: ["Background Check Cleared"],
    documents: ["Resume.pdf", "Score Reports.pdf", "ID Verification.pdf"],
    status: "Pending",
  },
  {
    id: "TA-1027",
    fullName: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "+1 (314) 555-0181",
    submittedOn: "March 21, 2026",
    subjects: ["Chemistry", "Biology", "Science"],
    experience: "4 years science tutoring for grades 8-12",
    education: "M.S. in Biochemistry, University of Missouri",
    availability: "Tue-Thu 4:30 PM - 9:00 PM, Saturday 10:00 AM - 1:00 PM",
    hourlyRate: "$42/hr",
    location: "St. Louis, MO (In-Person preferred)",
    bio: "I simplify complex science topics through visuals, real-world examples, and structured revision plans.",
    certifications: ["Background Check Cleared", "First Aid Certified"],
    documents: ["Resume.pdf", "Degree Certificate.pdf", "Reference Letters.pdf"],
    status: "Pending",
  },
];

export function getTutorApplicationById(id: string): TutorApplication | undefined {
  return adminTutorApplications.find((application) => application.id === id);
}
