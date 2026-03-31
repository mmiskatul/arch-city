export type ApplicationStatus = "Pending" | "Approved" | "Rejected";

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

export const adminTutorApplications: TutorApplication[] = [];

export function getTutorApplicationById(id: string): TutorApplication | undefined {
  return adminTutorApplications.find((application) => application.id === id);
}
