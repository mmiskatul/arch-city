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
  in_person_available: boolean;
};

type PublicTutorsResponse = {
  total: number;
  items: PublicTutorItem[];
};

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function resolveApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url ? normalizeBaseUrl(url) : null;
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
    gradeGroup: item.grade_group || item.grades || "Grades not provided",
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

export async function fetchAvailableStudentTutors(): Promise<StudentTutor[]> {
  const baseUrl = resolveApiBaseUrl();

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const response = await fetch(`${baseUrl}/public/tutors/available`, {
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as PublicTutorsResponse | { detail?: string };
  if (!response.ok) {
    const detail = typeof data?.detail === "string" ? data.detail : `Request failed (${response.status}).`;
    throw new Error(detail);
  }

  const items = Array.isArray((data as PublicTutorsResponse).items) ? (data as PublicTutorsResponse).items : [];
  return items.map(mapTutor);
}

export async function fetchAvailableStudentTutorById(id: string): Promise<StudentTutor | null> {
  const tutors = await fetchAvailableStudentTutors();
  return tutors.find((tutor) => tutor.id === id) ?? null;
}
