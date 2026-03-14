export type ApplicationStatus = "pending" | "approved" | "rejected";

export type ApplicationRow = {
  id: string;
  submittedOn: string;
  status: ApplicationStatus;
  name: string;
};

export type ApplicationSectionField =
  | { label: string; value: string; type?: "text" }
  | { label: string; value: boolean; type: "boolean" }
  | { label: string; value: string; type: "attachment" };

export type ApplicationSection = {
  title: string;
  fields: ApplicationSectionField[];
};

export type ApplicationDetail = ApplicationRow & {
  heading: string;
  sections: ApplicationSection[];
};

export const applicationRows: ApplicationRow[] = [
  { id: "1", submittedOn: "3-14-2026", status: "pending", name: "Justin Noel" },
  { id: "2", submittedOn: "3-13-2026", status: "pending", name: "Joshua Perry" },
  { id: "3", submittedOn: "3-12-2026", status: "pending", name: "Vanessa Cross" },
  { id: "4", submittedOn: "3-11-2026", status: "pending", name: "Ethan Morales" },
  { id: "5", submittedOn: "3-10-2026", status: "pending", name: "Brooklyn Silva" },
  { id: "6", submittedOn: "2-22-2026", status: "approved", name: "Melanie Wittman" },
  { id: "7", submittedOn: "2-22-2026", status: "approved", name: "Corinne Drozkowski" },
  { id: "8", submittedOn: "2-19-2026", status: "approved", name: "Stephanie Baker" },
  { id: "9", submittedOn: "2-9-2026", status: "approved", name: "Bria Howard" },
  { id: "10", submittedOn: "2-1-2026", status: "approved", name: "Ashley Bryant" },
  { id: "11", submittedOn: "1-21-2026", status: "approved", name: "Matthew Barbier" },
  { id: "12", submittedOn: "12-10-2025", status: "approved", name: "Tiffany Peeler" },
  { id: "13", submittedOn: "12-9-2025", status: "approved", name: "Adrienne Davich" },
  { id: "14", submittedOn: "11-29-2025", status: "approved", name: "Laura Link" },
  { id: "15", submittedOn: "11-25-2025", status: "approved", name: "Stacey King" },
  { id: "16", submittedOn: "11-24-2025", status: "approved", name: "Kathy Ecker" },
  { id: "17", submittedOn: "11-23-2025", status: "approved", name: "Stephanie Bess" },
  { id: "18", submittedOn: "1-10-2026", status: "rejected", name: "Jaclyn Wallace" },
  { id: "19", submittedOn: "11-22-2025", status: "rejected", name: "Test Account31" },
  { id: "20", submittedOn: "11-22-2025", status: "rejected", name: "Test Tutor" },
  { id: "21", submittedOn: "10-7-2025", status: "rejected", name: "Carolann James" },
  { id: "22", submittedOn: "9-22-2025", status: "rejected", name: "Lydia Poole" },
  { id: "23", submittedOn: "9-9-2025", status: "rejected", name: "Raymond Taddeo" },
  { id: "24", submittedOn: "9-2-2025", status: "rejected", name: "Melissa Yates" },
  { id: "25", submittedOn: "8-28-2025", status: "rejected", name: "Richard Harmon" },
  { id: "26", submittedOn: "8-15-2025", status: "rejected", name: "Amanda Fritz" },
  { id: "27", submittedOn: "8-3-2025", status: "rejected", name: "Jordan Dunn" },
];

export const applicationDetails: Record<string, ApplicationDetail> = {
  "1": {
    id: "1",
    submittedOn: "3-14-2026",
    status: "pending",
    name: "Justin Noel",
    heading: "Application",
    sections: [
      {
        title: "Tutor Profile",
        fields: [
          { label: "First name", value: "Justin" },
          { label: "Last name", value: "Noel" },
          { label: "Email address", value: "nightlifter@gmail.com" },
          { label: "Have you ever been convicted of any sexual or criminal offenses?", value: false, type: "boolean" },
        ],
      },
      {
        title: "Tutor Contact Information",
        fields: [
          { label: "Mobile phone number", value: "sbv sdgvbs" },
          { label: "Address", value: "svsfdv" },
          { label: "City", value: "svsd" },
          { label: "State", value: "vsdsdv" },
          { label: "Postal code", value: "sdvss" },
        ],
      },
      {
        title: "Teaching Experience",
        fields: [
          { label: "Are you a certified teacher in the state of Missouri?", value: false, type: "boolean" },
          { label: "Are you currently employed as a teacher?", value: false, type: "boolean" },
        ],
      },
      {
        title: "Qualifications and Expertise",
        fields: [
          { label: "What degree(s) do you currently hold?", value: "dsvsd" },
          { label: "What certification(s) do you currently hold?", value: "sfdvwr" },
          { label: "Are you currently working towards any additional degree(s)/certification(s)?", value: false, type: "boolean" },
        ],
      },
      {
        title: "Tutoring Preferences",
        fields: [
          { label: "Do you prefer to tutor in-person or remotely?", value: "vgdsf" },
          { label: "If you prefer tutoring in-person, where do you prefer meeting students?", value: "dsvgb" },
          { label: "If you prefer tutoring remotely, do you have a video conference subscription (i.e., Zoom, WebEx, Microsoft Teams, GoToMeeting)", value: "sdfvb" },
          { label: "Generally speaking, how many days per month do you plan to tutor?", value: "sfvs" },
        ],
      },
      {
        title: "Legal Information",
        fields: [
          { label: "Social security number (optional)", value: "svwervcwqreevds" },
          { label: "State or federally issued identification", value: "Attachment 1", type: "attachment" },
        ],
      },
      {
        title: "Tutoring Sessions",
        fields: [
          { label: "What grade level(s) will you provide tutoring services for?", value: "sfvsf" },
          { label: "What subjects will you provide tutoring services for?", value: "svs" },
          { label: "How do you approach tutoring and adapting to different learning/teaching styles?", value: "sbvdbvgs" },
          { label: "What methods do you use to make lessons engaging and effective?", value: "svb dsbv" },
          { label: "How will you plan and structure tutoring sessions?", value: "svsdvs" },
          { label: "How will you customize a lesson to fit a student's specific needs and learning style?", value: "svdvsg" },
        ],
      },
    ],
  },
};

export function getApplicationDetail(id: string) {
  return applicationDetails[id] ?? null;
}
