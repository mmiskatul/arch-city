import { browserApiRequest } from "@/lib/api/browser-api-client";
import type { ParentTutorCard } from "@/lib/parent/find-tutors-data";
import type { StudentTutor } from "@/lib/student/tutors-data";

type PublicTutorAvailabilityItem = {
  day: string;
  time: string;
  label?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
};

type PublicTutorEducationItem = {
  degree: string;
  school: string;
  year: string;
};

type PublicTutorExperienceItem = {
  title: string;
  organization: string;
  years: string;
};

type PublicTutorItem = {
  id: string;
  slug: string;
  initials: string;
  name: string;
  reviews: number;
  rating: number;
  sessions?: number;
  mode: "Virtual" | "In-Person" | "Both";
  certification: string;
  district: string;
  location: string;
  grades: string;
  grade_group: string;
  subjects: string[];
  subject_tags: string[];
  about: string;
  education: PublicTutorEducationItem[];
  experience: PublicTutorExperienceItem | null;
  availability: PublicTutorAvailabilityItem[];
  price45: number;
  price60: number;
  in_person_price45?: number;
  in_person_price60?: number;
  in_person_available: boolean;
};

type PublicTutorsResponse = {
  total: number;
  items: PublicTutorItem[];
};

function hasCompleteTutorCardData(item: PublicTutorItem) {
  const name = String(item.name || "").trim();
  const grades = String(item.grades || item.grade_group || "").trim();
  const location = String(item.location || "").trim();
  const about = String(item.about || "").trim();
  const subjects = Array.isArray(item.subjects) ? item.subjects.filter((entry) => String(entry || "").trim()) : [];
  const availability = Array.isArray(item.availability) ? item.availability.filter(Boolean) : [];

  if (!item.id || !name || name === "Tutor") return false;
  if (subjects.length === 0) return false;
  if (!grades || grades === "Grades not provided") return false;
  if (availability.length === 0) return false;
  if (!location) return false;
  if (!about || about === "Tutor profile is being updated.") return false;

  const hasVirtualRates = Number(item.price45 || 0) > 0 && Number(item.price60 || 0) > 0;
  const hasInPersonRates = Number(item.in_person_price45 || 0) > 0 && Number(item.in_person_price60 || 0) > 0;

  if (item.mode === "Virtual") return hasVirtualRates;
  if (item.mode === "In-Person") return hasInPersonRates;
  return hasVirtualRates && hasInPersonRates;
}

function normalizeGradeGroup(value?: string, grades?: string): StudentTutor["gradeGroup"] {
  const source = `${value ?? ""} ${grades ?? ""}`.toLowerCase();

  if (source.includes("kindergarten") || source.includes("grade k") || source.includes("k-5")) {
    return "Kindergarten";
  }
  if (source.includes("1-5") || source.includes("grades 1-5")) {
    return "Grades 1-5";
  }
  if (source.includes("6-8") || source.includes("grades 6-8")) {
    return "Grades 6-8";
  }
  if (source.includes("9-12") || source.includes("grades 9-12")) {
    return "Grades 9-12";
  }
  if (source.includes("college") || source.includes("adult")) {
    return "College-Aged";
  }

  return "College-Aged";
}

function formatAvailabilityTime(slot: PublicTutorAvailabilityItem) {
  const raw = slot.label || slot.time || "";
  if (raw) {
    const stripped = raw.replace(/^Available\s+/i, "").trim();
    const spaced = stripped.replace(/\s*-\s*/g, " - ").replace(/\s+([AP]M)\b/gi, " $1");
    if (spaced) {
      return spaced;
    }
  }

  if (slot.start_time && slot.end_time) {
    const start = slot.start_time.replace(/\s+([AP]M)\b/gi, " $1");
    const end = slot.end_time.replace(/\s+([AP]M)\b/gi, " $1");
    return `${start} - ${end}`;
  }

  return "Unavailable";
}

function formatAvailabilityDay(slot: PublicTutorAvailabilityItem) {
  if (slot.date) {
    const parsed = new Date(slot.date);
    if (!Number.isNaN(parsed.getTime())) {
      return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(parsed);
    }
  }

  if (slot.day) {
    const shortDay = slot.day.slice(0, 3);
    return shortDay.charAt(0).toUpperCase() + shortDay.slice(1).toLowerCase();
  }

  return "Available";
}

function mapTutor(item: PublicTutorItem): StudentTutor {
  const subjects = item.subjects.length > 0 ? item.subjects : item.subject_tags.length > 0 ? item.subject_tags.slice(0, 4) : ["General Tutoring"];
  const experience = item.experience ?? { title: "Independent Tutor", organization: "Arch City Tutors", years: "Current" };

  return {
    id: item.id,
    slug: item.slug || item.id,
    initials: item.initials || "TU",
    name: item.name || "Tutor",
    reviews: item.reviews ?? 0,
    rating: item.rating ?? 0,
    mode: item.mode,
    certification: item.certification || "Tutor",
    district: item.district || "Not provided",
    location: item.location || "",
    grades: item.grades || item.grade_group || "Grades not provided",
    gradeGroup: normalizeGradeGroup(item.grade_group, item.grades),
    subjects,
    subjectTags: item.subject_tags.length > 0 ? item.subject_tags : subjects,
    about: item.about || "Tutor profile is being updated.",
    education: (item.education || []).map((entry) => ({
      degree: entry.degree,
      school: entry.school,
      year: entry.year,
    })),
    experience: {
      title: experience.title,
      organization: experience.organization,
      years: experience.years,
    },
    availability: (item.availability || []).map((slot) => ({
      day: formatAvailabilityDay(slot),
      time: formatAvailabilityTime(slot),
      date: slot.date || "",
    })),
    price45: item.price45 ?? 0,
    price60: item.price60 ?? 0,
    inPersonAvailable: Boolean(item.in_person_available),
  };
}

function mapTutorToParentCard(item: PublicTutorItem): ParentTutorCard {
  const subjects = item.subjects.length > 0 ? item.subjects : item.subject_tags.length > 0 ? item.subject_tags.slice(0, 4) : ["General Tutoring"];
  const title = item.certification || item.experience?.title || subjects[0] || "Tutor";
  const sessionTypes: ParentTutorCard["sessionTypes"] =
    item.mode === "Both"
      ? ["Virtual", "In-Person"]
      : [item.mode === "In-Person" ? "In-Person" : "Virtual"];

  return {
    id: item.id,
    initials: item.initials || "TU",
    name: item.name || "Tutor",
    title,
    rating: item.rating ?? 0,
    reviews: item.reviews ?? 0,
    sessions: item.sessions ?? 0,
    subjects,
    gradeLevels: item.grades
      ? item.grades.split(",").map((entry) => entry.trim()).filter(Boolean)
      : item.grade_group
        ? [item.grade_group]
        : [],
    sessionTypes,
    location: item.location || "",
    price45: item.price45 ?? 0,
    price60: item.price60 ?? 0,
    inPerson45: item.in_person_price45 ?? 0,
    inPerson60: item.in_person_price60 ?? 0,
    about: item.about || "Tutor profile is being updated.",
    education: (item.education || []).map((entry) => `${entry.degree} - ${entry.school} (${entry.year})`),
    availability: (item.availability || []).map((slot) => `${slot.day} - ${slot.time}`),
    verified: true,
  };
}

export async function fetchAvailableStudentTutors(): Promise<StudentTutor[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const data = await browserApiRequest<PublicTutorsResponse>({
    url: `${baseUrl}/public/tutors/available`,
    method: "GET",
    includeAuth: false,
    withCredentials: false,
  });

  const items = Array.isArray(data.items) ? data.items.filter(hasCompleteTutorCardData) : [];
  return items.map(mapTutor);
}

export async function fetchAvailableStudentTutorById(id: string): Promise<StudentTutor | null> {
  const tutors = await fetchAvailableStudentTutors();
  return tutors.find((tutor) => tutor.id === id) ?? null;
}

export async function fetchAvailableParentTutors(): Promise<ParentTutorCard[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const data = await browserApiRequest<PublicTutorsResponse>({
    url: `${baseUrl}/public/tutors/available`,
    method: "GET",
    includeAuth: false,
    withCredentials: false,
  });

  const items = Array.isArray(data.items) ? data.items.filter(hasCompleteTutorCardData) : [];
  return items.map(mapTutorToParentCard);
}

export async function fetchAvailableParentTutorById(id: string): Promise<ParentTutorCard | null> {
  const tutors = await fetchAvailableParentTutors();
  return tutors.find((tutor) => tutor.id === id) ?? null;
}
