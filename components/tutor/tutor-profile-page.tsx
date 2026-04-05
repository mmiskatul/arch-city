"use client";

import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiBriefcase,
  FiCheckCircle,
  FiEdit2,
  FiMail,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiVideo,
  FiTrash2,
} from "react-icons/fi";

import { TutorShell } from "@/components/tutor/tutor-shell";
import { useDashboardAuth } from "@/components/auth/dashboard-auth-context";
import {
  requestTutorBioSchoolDistrictWithFallback,
  requestTutorEducationWithFallback,
  requestTutorLocationWithFallback,
  requestTutorPreferencesWithFallback,
  requestTutorProfileWithFallback,
  requestTutorRatesWithFallback,
  requestTutorSubjectsGradesWithFallback,
  requestTutorWorkExperienceWithFallback,
} from "@/lib/api/tutor-profile-api";
import {
  tutorEducationEntries,
  tutorLocationEntries,
  tutorProfile,
  tutorWorkExperienceEntries,
} from "@/lib/tutor/profile-data";

type TutorProfileTab =
  | "Personal Info"
  | "Bio & School District"
  | "Education"
  | "Work Experience"
  | "Subjects & Grades"
  | "Rates"
  | "Preferences"
  | "Location";

const profileTabs: TutorProfileTab[] = [
  "Personal Info",
  "Bio & School District",
  "Education",
  "Work Experience",
  "Subjects & Grades",
  "Rates",
  "Preferences",
  "Location",
];

const subjectOptions = [
  "Algebra I",
  "Algebra II",
  "Pre-Calculus",
  "Calculus",
  "Geometry",
  "Trigonometry",
  "Statistics",
  "SAT Math",
  "ACT Math",
  "AP Calculus AB",
  "AP Calculus BC",
  "AP Statistics",
  "Physics",
  "Chemistry",
];

const gradeOptions = [
  "8th Grade",
  "4th Grade",
  "12th Grade",
  "Kindergarten",
  "9th Grade",
  "5th Grade",
  "College-Aged",
  "1st Grade",
  "6th Grade",
  "10th Grade",
  "Adult",
  "2nd Grade",
  "7th Grade",
  "11th Grade",
  "3rd Grade",
];

type RecommendationItem = {
  value: string;
  count: number;
};

function RecommendationChips({
  title,
  items,
  selectedValues,
  onToggle,
}: {
  title: string;
  items: RecommendationItem[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}) {
  if (!items.length) return null;

  return (
    <div className="mt-4 rounded-[14px] border border-dashed border-[#e8ecf2] bg-[#fcfcfd] p-4">
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => {
          const active = selectedValues.some((selected) => selected.toLowerCase() === item.value.toLowerCase());
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onToggle(item.value)}
              className={`rounded-full border px-3 py-2 text-[13px] font-semibold transition ${
                active
                  ? "border-[#f191a5] bg-[#fff1f4] text-[#d61c3f]"
                  : "border-[#e5e7eb] bg-white text-[#6b7280]"
              }`}
            >
              {item.value}
              <span className="ml-2 text-[11px] font-medium text-[#9ca3af]">{item.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}


type TutorProfileApiModel = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  initials: string;
  title: string;
  status: string;
  location: string;
  background_check: string;
  date_of_birth?: string;
  gender?: string;
  bio?: string;
  school_district?: string;
};

type TutorEducationApiItem = {
  id: string;
  title: string;
  organization: string;
  period: string;
};

type TutorEducationListApiModel = {
  items?: TutorEducationApiItem[];
};

type TutorWorkExperienceApiItem = {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  from_date?: string;
  to_date?: string;
};

type TutorWorkExperienceListApiModel = {
  items?: TutorWorkExperienceApiItem[];
};

type TutorSubjectsGradesApiModel = {
  subjects?: string[];
  grades?: string[];
  recommendations?: {
    subjects?: { value: string; count: number }[];
    grades?: { value: string; count: number }[];
  };
};

type TutorRatesApiModel = {
  virtual_45_rate?: string;
  virtual_60_rate?: string;
  in_person_45_rate?: string;
  in_person_60_rate?: string;
};

type TutorPreferencesApiModel = {
  is_classroom_teacher?: boolean;
  offers_virtual?: boolean;
  offers_in_person?: boolean;
  advance_notice?: string;
  max_sessions_per_day?: number;
  pause_account?: boolean;
};

type TutorLocationApiItem = {
  id: string;
  name: string;
  address_line_1: string;
  address_line_2: string;
  preferred?: boolean;
  show_map_preview?: boolean;
};

type TutorLocationListApiModel = {
  items?: TutorLocationApiItem[];
};
export type TutorProfileData = typeof tutorProfile;

type TutorProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  dateOfBirth: string;
  gender: string;
};

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const encodedName = `${encodeURIComponent(name)}=`;
  const parts = document.cookie.split(";");
  for (const part of parts) {
    const cookie = part.trim();
    if (cookie.startsWith(encodedName)) {
      return decodeURIComponent(cookie.slice(encodedName.length));
    }
  }
  return null;
}



function formatWorkMonthYear(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function calculateWorkDurationLabel(fromDate: string, toDate?: string): string {
  const from = new Date(fromDate);
  if (Number.isNaN(from.getTime())) return "";

  const end = toDate ? new Date(toDate) : new Date();
  if (Number.isNaN(end.getTime()) || end < from) return "";

  const yearDiff = end.getFullYear() - from.getFullYear();
  const monthDiff = end.getMonth() - from.getMonth();
  let totalMonths = yearDiff * 12 + monthDiff;

  if (end.getDate() < from.getDate()) {
    totalMonths -= 1;
  }
  if (totalMonths < 0) totalMonths = 0;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years > 0 && months > 0) {
    return `${years} yr${years > 1 ? "s" : ""} ${months} mo`;
  }
  if (years > 0) {
    return `${years} yr${years > 1 ? "s" : ""}`;
  }
  return `${months} mo`;
}

function buildWorkPeriodLabel(fromDate: string, toDate?: string): string {
  const fromLabel = formatWorkMonthYear(fromDate);
  if (!fromLabel) return "";

  const toLabel = toDate ? formatWorkMonthYear(toDate) : "Present";
  const duration = calculateWorkDurationLabel(fromDate, toDate);
  return duration ? `${fromLabel} - ${toLabel} - ${duration}` : `${fromLabel} - ${toLabel}`;
}

function getWorkPeriodForDisplay(entry: TutorWorkExperienceApiItem): string {
  if (entry.from_date) {
    return buildWorkPeriodLabel(entry.from_date, entry.to_date || "") || entry.period;
  }
  return entry.period;
}
function mapTutorProfileApiToUi(data: TutorProfileApiModel): TutorProfileData {
  return {
    ...tutorProfile,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    phone: data.phone_number,
    streetAddress: data.street_address,
    city: data.city,
    state: data.state,
    zipCode: data.zip_code,
    emergencyContactName: data.emergency_contact_name,
    emergencyContactPhone: data.emergency_contact_phone,
    initials: data.initials || tutorProfile.initials,
    title: data.title || tutorProfile.title,
    status: data.status || tutorProfile.status,
    location: data.location || tutorProfile.location,
    backgroundCheck: data.background_check || tutorProfile.backgroundCheck,
    dateOfBirth: data.date_of_birth || tutorProfile.dateOfBirth || "",
    gender: data.gender || tutorProfile.gender || "",
    bio: data.bio || tutorProfile.bio || "",
    schoolDistrict: data.school_district || tutorProfile.schoolDistrict || "",
  };
}

async function fetchTutorProfile(token?: string): Promise<TutorProfileData> {
  const response = await requestTutorProfileWithFallback({
    method: "GET",
    token,
  });

  if (!response || !response.ok) {
    throw new Error(`Failed to load profile (${response?.status ?? "no-response"}).`);
  }

  return mapTutorProfileApiToUi((await response.json()) as TutorProfileApiModel);
}

async function saveTutorProfile(token: string, form: TutorProfileForm) {
  const response = await requestTutorProfileWithFallback({
    method: "PUT",
    token,
    body: JSON.stringify({
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      phone_number: form.phone.trim(),
      street_address: form.streetAddress.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      zip_code: form.zipCode.trim(),
      emergency_contact_name: form.emergencyContactName.trim(),
      emergency_contact_phone: form.emergencyContactPhone.trim(),
      date_of_birth: form.dateOfBirth,
      gender: form.gender.trim(),
    }),
  });

  if (!response || !response.ok) {
    let detail: string | undefined;
    try {
      const data = (await response?.json()) as { detail?: string };
      detail = data.detail;
    } catch {
      // Ignore non-JSON errors.
    }
    throw new Error(detail ?? `Failed to save profile (${response?.status ?? "no-response"}).`);
  }

  return mapTutorProfileApiToUi((await response.json()) as TutorProfileApiModel);
}
type TutorBioSchoolDistrictApiModel = {
  bio?: string;
  school_district?: string;
};


async function saveTutorBioSchoolDistrict(
  token: string,
  payload: TutorBioSchoolDistrictApiModel,
): Promise<TutorBioSchoolDistrictApiModel> {
  const response = await requestTutorBioSchoolDistrictWithFallback({
    method: "PUT",
    token,
    body: JSON.stringify({
      bio: (payload.bio || "").trim(),
      school_district: (payload.school_district || "").trim(),
    }),
  });

  if (!response || !response.ok) {
    let detail: string | undefined;
    try {
      const data = (await response?.json()) as { detail?: string };
      detail = data.detail;
    } catch {
      // Ignore non-JSON errors.
    }
    throw new Error(detail ?? `Failed to save bio section (${response?.status ?? "no-response"}).`);
  }

  return (await response.json()) as TutorBioSchoolDistrictApiModel;
}
async function fetchTutorEducationEntries(token?: string): Promise<TutorEducationApiItem[]> {
  const response = await requestTutorEducationWithFallback({
    method: "GET",
    token,
  });

  if (!response || !response.ok) {
    throw new Error(`Failed to load education (${response?.status ?? "no-response"}).`);
  }

  const data = (await response.json()) as TutorEducationListApiModel;
  const items = Array.isArray(data.items) ? data.items : [];
  return items.filter((item) => item && item.id && item.title && item.organization && item.period);
}

async function addTutorEducationEntry(
  token: string,
  payload: Omit<TutorEducationApiItem, "id">,
): Promise<TutorEducationApiItem> {
  const response = await requestTutorEducationWithFallback({
    method: "POST",
    token,
    body: JSON.stringify({
      title: payload.title.trim(),
      organization: payload.organization.trim(),
      period: payload.period.trim(),
    }),
  });

  if (!response || !response.ok) {
    let detail: string | undefined;
    try {
      const data = (await response?.json()) as { detail?: string };
      detail = data.detail;
    } catch {
      // Ignore non-JSON errors.
    }
    throw new Error(detail ?? `Failed to add education (${response?.status ?? "no-response"}).`);
  }

  return (await response.json()) as TutorEducationApiItem;
}
async function updateTutorEducationEntry(
  token: string,
  educationId: string,
  payload: Omit<TutorEducationApiItem, "id" | "user_id">,
): Promise<TutorEducationApiItem> {
  const response = await requestTutorEducationWithFallback({
    method: "PUT",
    token,
    educationId,
    body: JSON.stringify({
      title: payload.title.trim(),
      organization: payload.organization.trim(),
      period: payload.period.trim(),
    }),
  });

  if (!response || !response.ok) {
    let detail: string | undefined;
    try {
      const data = (await response?.json()) as { detail?: string };
      detail = data.detail;
    } catch {
      // Ignore non-JSON errors.
    }
    throw new Error(detail ?? `Failed to update education (${response?.status ?? "no-response"}).`);
  }

  return (await response.json()) as TutorEducationApiItem;
}

async function deleteTutorEducationEntry(token: string, educationId: string): Promise<void> {
  const response = await requestTutorEducationWithFallback({
    method: "DELETE",
    token,
    educationId,
  });

  if (!response || !response.ok) {
    let detail: string | undefined;
    try {
      const data = (await response?.json()) as { detail?: string };
      detail = data.detail;
    } catch {
      // Ignore non-JSON errors.
    }
    throw new Error(detail ?? `Failed to delete education (${response?.status ?? "no-response"}).`);
  }
}

async function fetchTutorWorkExperienceEntries(token?: string): Promise<TutorWorkExperienceApiItem[]> {
  const response = await requestTutorWorkExperienceWithFallback({
    method: "GET",
    token,
  });

  if (!response || !response.ok) {
    throw new Error(`Failed to load work experience (${response?.status ?? "no-response"}).`);
  }

  const data = (await response.json()) as TutorWorkExperienceListApiModel;
  const items = Array.isArray(data.items) ? data.items : [];
  return items.filter((item) => item && item.id && item.title && item.organization && item.period);
}

async function addTutorWorkExperienceEntry(
  token: string,
  payload: Omit<TutorWorkExperienceApiItem, "id">,
): Promise<TutorWorkExperienceApiItem> {
  const response = await requestTutorWorkExperienceWithFallback({
    method: "POST",
    token,
    body: JSON.stringify({
      title: payload.title.trim(),
      organization: payload.organization.trim(),
      period: payload.period.trim(),
      description: payload.description.trim(),
      from_date: (payload.from_date || "").trim(),
      to_date: (payload.to_date || "").trim(),
    }),
  });

  if (!response || !response.ok) {
    let detail: string | undefined;
    try {
      const data = (await response?.json()) as { detail?: string };
      detail = data.detail;
    } catch {
      // Ignore non-JSON errors.
    }
    throw new Error(detail ?? `Failed to add work experience (${response?.status ?? "no-response"}).`);
  }

  return (await response.json()) as TutorWorkExperienceApiItem;
}

async function updateTutorWorkExperienceEntry(
  token: string,
  workExperienceId: string,
  payload: Omit<TutorWorkExperienceApiItem, "id" | "user_id">,
): Promise<TutorWorkExperienceApiItem> {
  const response = await requestTutorWorkExperienceWithFallback({
    method: "PUT",
    token,
    workExperienceId,
    body: JSON.stringify({
      title: payload.title.trim(),
      organization: payload.organization.trim(),
      period: payload.period.trim(),
      description: payload.description.trim(),
      from_date: (payload.from_date || "").trim(),
      to_date: (payload.to_date || "").trim(),
    }),
  });

  if (!response || !response.ok) {
    let detail: string | undefined;
    try {
      const data = (await response?.json()) as { detail?: string };
      detail = data.detail;
    } catch {
      // Ignore non-JSON errors.
    }
    throw new Error(detail ?? `Failed to update work experience (${response?.status ?? "no-response"}).`);
  }

  return (await response.json()) as TutorWorkExperienceApiItem;
}
async function fetchTutorSubjectsGrades(token?: string): Promise<TutorSubjectsGradesApiModel> {
  const response = await requestTutorSubjectsGradesWithFallback({
    method: "GET",
    token,
  });

  if (!response || !response.ok) {
    throw new Error(`Failed to load subjects & grades (${response?.status ?? "no-response"}).`);
  }

  const data = (await response.json()) as TutorSubjectsGradesApiModel;
  return {
    subjects: Array.isArray(data.subjects) ? data.subjects.map((item) => String(item).trim()).filter(Boolean) : [],
    grades: Array.isArray(data.grades) ? data.grades.map((item) => String(item).trim()).filter(Boolean) : [],
    recommendations: {
      subjects: Array.isArray(data.recommendations?.subjects)
        ? data.recommendations.subjects
            .map((item) => ({
              value: String(item?.value ?? "").trim(),
              count: Number(item?.count ?? 0) || 0,
            }))
            .filter((item) => item.value)
        : [],
      grades: Array.isArray(data.recommendations?.grades)
        ? data.recommendations.grades
            .map((item) => ({
              value: String(item?.value ?? "").trim(),
              count: Number(item?.count ?? 0) || 0,
            }))
            .filter((item) => item.value)
        : [],
    },
  };
}

async function saveTutorSubjectsGrades(
  token: string,
  payload: TutorSubjectsGradesApiModel,
): Promise<TutorSubjectsGradesApiModel> {
  const response = await requestTutorSubjectsGradesWithFallback({
    method: "PUT",
    token,
    body: JSON.stringify({
      subjects: Array.isArray(payload.subjects)
        ? payload.subjects.map((item) => String(item).trim()).filter(Boolean)
        : [],
      grades: Array.isArray(payload.grades)
        ? payload.grades.map((item) => String(item).trim()).filter(Boolean)
        : [],
    }),
  });

  if (!response || !response.ok) {
    let detail: string | undefined;
    try {
      const data = (await response?.json()) as { detail?: string };
      detail = data.detail;
    } catch {
      // Ignore non-JSON errors.
    }
    throw new Error(detail ?? `Failed to save subjects & grades (${response?.status ?? "no-response"}).`);
  }

  const data = (await response.json()) as TutorSubjectsGradesApiModel;
  return {
    subjects: Array.isArray(data.subjects) ? data.subjects.map((item) => String(item).trim()).filter(Boolean) : [],
    grades: Array.isArray(data.grades) ? data.grades.map((item) => String(item).trim()).filter(Boolean) : [],
  };
}

async function fetchTutorRates(token?: string): Promise<TutorRatesApiModel> {
  const response = await requestTutorRatesWithFallback({
    method: "GET",
    token,
  });

  if (!response || !response.ok) {
    throw new Error(`Failed to load rates (${response?.status ?? "no-response"}).`);
  }

  const data = (await response.json()) as TutorRatesApiModel;
  return {
    virtual_45_rate: String(data.virtual_45_rate ?? "").trim(),
    virtual_60_rate: String(data.virtual_60_rate ?? "").trim(),
    in_person_45_rate: String(data.in_person_45_rate ?? "").trim(),
    in_person_60_rate: String(data.in_person_60_rate ?? "").trim(),
  };
}

async function saveTutorRates(token: string, payload: TutorRatesApiModel): Promise<TutorRatesApiModel> {
  const response = await requestTutorRatesWithFallback({
    method: "PUT",
    token,
    body: JSON.stringify({
      virtual_45_rate: String(payload.virtual_45_rate ?? "").trim(),
      virtual_60_rate: String(payload.virtual_60_rate ?? "").trim(),
      in_person_45_rate: String(payload.in_person_45_rate ?? "").trim(),
      in_person_60_rate: String(payload.in_person_60_rate ?? "").trim(),
    }),
  });

  if (!response || !response.ok) {
    let detail: string | undefined;
    try {
      const data = (await response?.json()) as { detail?: string };
      detail = data.detail;
    } catch {
      // Ignore non-JSON errors.
    }
    throw new Error(detail ?? `Failed to save rates (${response?.status ?? "no-response"}).`);
  }

  const data = (await response.json()) as TutorRatesApiModel;
  return {
    virtual_45_rate: String(data.virtual_45_rate ?? "").trim(),
    virtual_60_rate: String(data.virtual_60_rate ?? "").trim(),
    in_person_45_rate: String(data.in_person_45_rate ?? "").trim(),
    in_person_60_rate: String(data.in_person_60_rate ?? "").trim(),
  };
}

async function fetchTutorPreferences(token?: string): Promise<TutorPreferencesApiModel> {
  const response = await requestTutorPreferencesWithFallback({
    method: "GET",
    token,
  });

  if (!response || !response.ok) {
    throw new Error(`Failed to load preferences (${response?.status ?? "no-response"}).`);
  }

  const data = (await response.json()) as TutorPreferencesApiModel;
  return {
    is_classroom_teacher: Boolean(data.is_classroom_teacher),
    offers_virtual: Boolean(data.offers_virtual),
    offers_in_person: Boolean(data.offers_in_person),
    advance_notice: String(data.advance_notice ?? "24 hours"),
    max_sessions_per_day: Math.max(1, Number(data.max_sessions_per_day ?? 3)),
    pause_account: Boolean(data.pause_account),
  };
}

async function saveTutorPreferences(token: string, payload: TutorPreferencesApiModel): Promise<TutorPreferencesApiModel> {
  const response = await requestTutorPreferencesWithFallback({
    method: "PUT",
    token,
    body: JSON.stringify({
      is_classroom_teacher: Boolean(payload.is_classroom_teacher),
      offers_virtual: Boolean(payload.offers_virtual),
      offers_in_person: Boolean(payload.offers_in_person),
      advance_notice: String(payload.advance_notice ?? "24 hours").trim(),
      max_sessions_per_day: Math.max(1, Number(payload.max_sessions_per_day ?? 3)),
      pause_account: Boolean(payload.pause_account),
    }),
  });

  if (!response || !response.ok) {
    let detail: string | undefined;
    try {
      const data = (await response?.json()) as { detail?: string };
      detail = data.detail;
    } catch {
      // Ignore non-JSON errors.
    }
    throw new Error(detail ?? `Failed to save preferences (${response?.status ?? "no-response"}).`);
  }

  const data = (await response.json()) as TutorPreferencesApiModel;
  return {
    is_classroom_teacher: Boolean(data.is_classroom_teacher),
    offers_virtual: Boolean(data.offers_virtual),
    offers_in_person: Boolean(data.offers_in_person),
    advance_notice: String(data.advance_notice ?? "24 hours"),
    max_sessions_per_day: Math.max(1, Number(data.max_sessions_per_day ?? 3)),
    pause_account: Boolean(data.pause_account),
  };
}

function normalizeTutorLocationItem(item: TutorLocationApiItem): TutorLocationApiItem {
  return {
    id: String(item.id || ""),
    name: String(item.name || "").trim(),
    address_line_1: String(item.address_line_1 || "").trim(),
    address_line_2: String(item.address_line_2 || "").trim(),
    preferred: Boolean(item.preferred),
    show_map_preview: Boolean(item.show_map_preview),
  };
}

async function fetchTutorLocations(token?: string): Promise<TutorLocationApiItem[]> {
  const response = await requestTutorLocationWithFallback({ method: "GET", token });

  if (!response || !response.ok) {
    throw new Error(`Failed to load locations (${response?.status ?? "no-response"}).`);
  }

  const data = (await response.json()) as TutorLocationListApiModel;
  const items = Array.isArray(data.items) ? data.items : [];
  return items.map(normalizeTutorLocationItem).filter((item) => item.id && item.name);
}

async function addTutorLocation(token: string, payload: Omit<TutorLocationApiItem, "id">): Promise<TutorLocationApiItem> {
  const response = await requestTutorLocationWithFallback({
    method: "POST",
    token,
    body: JSON.stringify({
      name: payload.name.trim(),
      address_line_1: payload.address_line_1.trim(),
      address_line_2: payload.address_line_2.trim(),
      preferred: Boolean(payload.preferred),
      show_map_preview: Boolean(payload.show_map_preview),
    }),
  });

  if (!response || !response.ok) {
    let detail: string | undefined;
    try {
      const data = (await response?.json()) as { detail?: string };
      detail = data.detail;
    } catch {
      // Ignore non-JSON errors.
    }
    throw new Error(detail ?? `Failed to add location (${response?.status ?? "no-response"}).`);
  }

  return normalizeTutorLocationItem((await response.json()) as TutorLocationApiItem);
}

async function updateTutorLocation(token: string, locationId: string, payload: Omit<TutorLocationApiItem, "id">): Promise<TutorLocationApiItem> {
  const response = await requestTutorLocationWithFallback({
    method: "PUT",
    token,
    locationId,
    body: JSON.stringify({
      name: payload.name.trim(),
      address_line_1: payload.address_line_1.trim(),
      address_line_2: payload.address_line_2.trim(),
      preferred: Boolean(payload.preferred),
      show_map_preview: Boolean(payload.show_map_preview),
    }),
  });

  if (!response || !response.ok) {
    let detail: string | undefined;
    try {
      const data = (await response?.json()) as { detail?: string };
      detail = data.detail;
    } catch {
      // Ignore non-JSON errors.
    }
    throw new Error(detail ?? `Failed to update location (${response?.status ?? "no-response"}).`);
  }

  return normalizeTutorLocationItem((await response.json()) as TutorLocationApiItem);
}

async function setPreferredTutorLocation(token: string, locationId: string): Promise<TutorLocationApiItem> {
  const response = await requestTutorLocationWithFallback({ method: "PREFER", token, locationId });

  if (!response || !response.ok) {
    let detail: string | undefined;
    try {
      const data = (await response?.json()) as { detail?: string };
      detail = data.detail;
    } catch {
      // Ignore non-JSON errors.
    }
    throw new Error(detail ?? `Failed to set preferred location (${response?.status ?? "no-response"}).`);
  }

  return normalizeTutorLocationItem((await response.json()) as TutorLocationApiItem);
}

async function deleteTutorLocation(token: string, locationId: string): Promise<void> {
  const response = await requestTutorLocationWithFallback({ method: "DELETE", token, locationId });

  if (!response || !response.ok) {
    let detail: string | undefined;
    try {
      const data = (await response?.json()) as { detail?: string };
      detail = data.detail;
    } catch {
      // Ignore non-JSON errors.
    }
    throw new Error(detail ?? `Failed to delete location (${response?.status ?? "no-response"}).`);
  }
}

async function deleteTutorWorkExperienceEntry(token: string, workExperienceId: string): Promise<void> {
  const response = await requestTutorWorkExperienceWithFallback({
    method: "DELETE",
    token,
    workExperienceId,
  });

  if (!response || !response.ok) {
    let detail: string | undefined;
    try {
      const data = (await response?.json()) as { detail?: string };
      detail = data.detail;
    } catch {
      // Ignore non-JSON errors.
    }
    throw new Error(detail ?? `Failed to delete work experience (${response?.status ?? "no-response"}).`);
  }
}
function ReadOnlyField({ label, value, onChange, readOnly = true, placeholder }: { label: string; value: string; onChange?: (value: string) => void; readOnly?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">{label}</label>
      <input
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className={`h-11 w-full rounded-lg border border-[#e5e7eb] px-4 text-[14px] ${
          readOnly ? "bg-[#fafafa] text-[#6b7280]" : "bg-white text-[#20242b]"
        }`}
      />
    </div>
  );
}

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-10 items-center rounded-full transition ${
        enabled ? "bg-[#d61c3f]" : "bg-[#e5e7eb]"
      }`}
      aria-pressed={enabled}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transition ${
          enabled ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function PersonalInfoSection({
  profile,
  values,
  onChange,
  saveError,
  saveSuccess,
  lastSavedAt,
}: {
  profile: TutorProfileData;
  values: TutorProfileForm;
  onChange: (field: keyof TutorProfileForm, value: string) => void;
  saveError: string | null;
  saveSuccess: string | null;
  lastSavedAt: string | null;
}) {
  return (
    <section className="rounded-[12px] bg-white p-5">
      <h3 className="text-[18px] font-bold text-[#20242b]">Personal Information</h3>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <ReadOnlyField label="First Name" value={values.firstName} readOnly={false} onChange={(value) => onChange("firstName", value)} />
        <ReadOnlyField label="Last Name" value={values.lastName} readOnly={false} onChange={(value) => onChange("lastName", value)} />
        <ReadOnlyField label="Email Address" value={values.email} />
        <ReadOnlyField label="Phone Number" value={values.phone} readOnly={false} placeholder="Enter phone number" onChange={(value) => onChange("phone", value)} />

        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">Date of Birth</label>
          <input
            type="date"
            value={values.dateOfBirth}
            onChange={(event) => onChange("dateOfBirth", event.target.value)}
            placeholder="Select date of birth"
            className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-white px-4 text-[14px] text-[#20242b]"
          />
        </div>

        <div>
          <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">Gender</label>
          <div className="flex h-11 items-center gap-4 rounded-lg border border-[#e5e7eb] bg-white px-4 text-[14px] text-[#20242b]">
            {(["Male", "Female", "Other"] as const).map((genderOption) => (
              <label key={genderOption} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="tutor-gender"
                  value={genderOption}
                  checked={values.gender === genderOption}
                  onChange={(event) => onChange("gender", event.target.value)}
                  className="h-4 w-4"
                />
                <span>{genderOption}</span>
              </label>
            ))}
          </div>
          {!values.gender ? <p className="mt-1 text-[12px] text-[#9ca3af]">Select gender</p> : null}
        </div>

        <div className="md:col-span-2">
          <ReadOnlyField label="Street Address" value={values.streetAddress} readOnly={false} placeholder="Enter street address" onChange={(value) => onChange("streetAddress", value)} />
        </div>
        <ReadOnlyField label="City" value={values.city} readOnly={false} placeholder="Enter city" onChange={(value) => onChange("city", value)} />
        <ReadOnlyField label="State" value={values.state} readOnly={false} placeholder="Enter state" onChange={(value) => onChange("state", value)} />
        <ReadOnlyField label="ZIP Code" value={values.zipCode} readOnly={false} placeholder="Enter ZIP code" onChange={(value) => onChange("zipCode", value)} />
        <ReadOnlyField label="Emergency Contact Name" value={values.emergencyContactName} readOnly={false} placeholder="Enter emergency contact name" onChange={(value) => onChange("emergencyContactName", value)} />
        <ReadOnlyField label="Emergency Contact Phone" value={values.emergencyContactPhone} readOnly={false} placeholder="Enter emergency contact phone" onChange={(value) => onChange("emergencyContactPhone", value)} />
      </div>

      {saveError ? <p className="mt-4 text-[13px] text-[#d61c3f]">{saveError}</p> : null}
      {saveSuccess ? <p className="mt-4 text-[13px] text-[#1b8a5a]">{saveSuccess}</p> : null}
      {lastSavedAt ? (
        <p className="mt-2 text-[12px] text-[#6b7280]">Last saved at {lastSavedAt}</p>
      ) : null}

      <div className="mt-6 flex items-center justify-between rounded-[12px] bg-[#f8faf8] px-4 py-4">
        <div className="flex items-start gap-3">
          <FiCheckCircle className="mt-0.5 h-5 w-5 text-[#64b486]" />
          <div>
            <p className="text-[14px] font-semibold text-[#20242b]">Background Check</p>
            <p className="text-[12px] text-[#6b7280]">{profile.backgroundCheck}</p>
          </div>
        </div>
        <span className="inline-flex rounded-full bg-[#dff2e5] px-3 py-1 text-[11px] font-semibold text-[#3d9b68]">
          Verified
        </span>
      </div>
    </section>
  );
}

export function TutorProfilePage({ initialProfile }: { initialProfile?: TutorProfileData }) {
  const [activeTab, setActiveTab] = useState<TutorProfileTab>("Personal Info");
  const [bio, setBio] = useState((initialProfile ?? tutorProfile).bio || "");
  const [schoolDistrict, setSchoolDistrict] = useState((initialProfile ?? tutorProfile).schoolDistrict || "");
  const [isClassroomTeacher, setIsClassroomTeacher] = useState(true);
  const [offersVirtual, setOffersVirtual] = useState(true);
  const [offersInPerson, setOffersInPerson] = useState(true);
  const [advanceNotice, setAdvanceNotice] = useState("24 hours");
  const [maxSessionsPerDay, setMaxSessionsPerDay] = useState(3);
  const [pauseAccount, setPauseAccount] = useState(false);
  const [virtual45Rate, setVirtual45Rate] = useState("$ 45");
  const [virtual60Rate, setVirtual60Rate] = useState("$ 58");
  const [inPerson45Rate, setInPerson45Rate] = useState("$ 55");
  const [inPerson60Rate, setInPerson60Rate] = useState("$ 70");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    "Algebra I",
    "Algebra II",
    "Pre-Calculus",
    "Calculus",
    "Geometry",
  ]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([
    "12th Grade",
    "9th Grade",
    "College-Aged",
    "10th Grade",
    "11th Grade",
  ]);
  const [recommendedSubjects, setRecommendedSubjects] = useState<RecommendationItem[]>([]);
  const [recommendedGrades, setRecommendedGrades] = useState<RecommendationItem[]>([]);
  const [educationEntries, setEducationEntries] = useState<TutorEducationApiItem[]>(
    tutorEducationEntries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      organization: entry.organization,
      period: entry.period,
    })),
  );
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [educationMode, setEducationMode] = useState<"add" | "edit">("add");
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [educationForm, setEducationForm] = useState({
    title: "",
    organization: "",
    period: "",
  });
  const [educationError, setEducationError] = useState<string | null>(null);
  const [isDeleteEducationConfirmOpen, setIsDeleteEducationConfirmOpen] = useState(false);
  const [deletingEducationId, setDeletingEducationId] = useState<string | null>(null);
  const [isSavingEducation, setIsSavingEducation] = useState(false);
  const [workExperienceEntries, setWorkExperienceEntries] = useState<TutorWorkExperienceApiItem[]>(
    tutorWorkExperienceEntries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      organization: entry.organization,
      period: entry.period,
      description: entry.description ?? "",
      from_date: entry.from_date || "",
      to_date: entry.to_date || "",
    })),
  );
  const [isWorkExperienceModalOpen, setIsWorkExperienceModalOpen] = useState(false);
  const [workExperienceMode, setWorkExperienceMode] = useState<"add" | "edit">("add");
  const [editingWorkExperienceId, setEditingWorkExperienceId] = useState<string | null>(null);
  const [workExperienceForm, setWorkExperienceForm] = useState({
    title: "",
    fromDate: "",
    toDate: "",
    organization: "",
    description: "",
  });
  const [workExperienceError, setWorkExperienceError] = useState<string | null>(null);
  const [isDeleteWorkExperienceConfirmOpen, setIsDeleteWorkExperienceConfirmOpen] = useState(false);
  const [deletingWorkExperienceId, setDeletingWorkExperienceId] = useState<string | null>(null);
  const [isSavingWorkExperience, setIsSavingWorkExperience] = useState(false);
  const [locationEntries, setLocationEntries] = useState<TutorLocationApiItem[]>(
    tutorLocationEntries.map((entry) => ({
      id: entry.id,
      name: entry.name,
      address_line_1: entry.addressLine1,
      address_line_2: entry.addressLine2,
      preferred: entry.preferred,
      show_map_preview: entry.showMapPreview,
    })),
  );
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationMode, setLocationMode] = useState<"add" | "edit">("add");
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [locationForm, setLocationForm] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    preferred: false,
    showMapPreview: false,
  });
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSuccess, setLocationSuccess] = useState<string | null>(null);
  const [isDeleteLocationConfirmOpen, setIsDeleteLocationConfirmOpen] = useState(false);
  const [deletingLocationId, setDeletingLocationId] = useState<string | null>(null);
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const [profile, setProfile] = useState<TutorProfileData>(initialProfile ?? tutorProfile);
  const [profileForm, setProfileForm] = useState<TutorProfileForm>({
    firstName: (initialProfile ?? tutorProfile).firstName,
    lastName: (initialProfile ?? tutorProfile).lastName,
    email: (initialProfile ?? tutorProfile).email,
    phone: (initialProfile ?? tutorProfile).phone,
    streetAddress: (initialProfile ?? tutorProfile).streetAddress,
    city: (initialProfile ?? tutorProfile).city,
    state: (initialProfile ?? tutorProfile).state,
    zipCode: (initialProfile ?? tutorProfile).zipCode,
    emergencyContactName: (initialProfile ?? tutorProfile).emergencyContactName,
    emergencyContactPhone: (initialProfile ?? tutorProfile).emergencyContactPhone,
    dateOfBirth: (initialProfile ?? tutorProfile).dateOfBirth || "",
    gender: (initialProfile ?? tutorProfile).gender || "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const isSavingSubjectsGrades = isSavingProfile && activeTab === "Subjects & Grades";
  const isSavingRates = isSavingProfile && activeTab === "Rates";
  const isSavingPreferences = isSavingProfile && activeTab === "Preferences";
  const { tokenPresent } = useDashboardAuth();

  useEffect(() => {
    if (initialProfile) return;

    if (!tokenPresent) return;

    fetchTutorProfile()
      .then((loadedProfile) => {
        setProfile(loadedProfile);
        setProfileForm({
          firstName: loadedProfile.firstName,
          lastName: loadedProfile.lastName,
          email: loadedProfile.email,
          phone: loadedProfile.phone,
          streetAddress: loadedProfile.streetAddress,
          city: loadedProfile.city,
          state: loadedProfile.state,
          zipCode: loadedProfile.zipCode,
          emergencyContactName: loadedProfile.emergencyContactName,
          emergencyContactPhone: loadedProfile.emergencyContactPhone,
          dateOfBirth: loadedProfile.dateOfBirth || "",
          gender: loadedProfile.gender || "",
        });
        setBio(loadedProfile.bio || "");
        setSchoolDistrict(loadedProfile.schoolDistrict || "");
      })
      .catch(() => {
        // Keep static fallback data.
      });
  }, [initialProfile, tokenPresent]);


  useEffect(() => {
    if (!tokenPresent) return;

    fetchTutorEducationEntries()
      .then((items) => {
        if (items.length > 0) {
          setEducationEntries(items);
        }
      })
      .catch(() => {
        // Keep static fallback entries.
      });
  }, [tokenPresent]);

  useEffect(() => {
    if (!tokenPresent) return;

    fetchTutorWorkExperienceEntries()
      .then((items) => {
        if (items.length > 0) {
          setWorkExperienceEntries(items);
        }
      })
      .catch(() => {
        // Keep static fallback entries.
      });
  }, [tokenPresent]);

  useEffect(() => {
    if (!tokenPresent) return;

    fetchTutorSubjectsGrades()
      .then((data) => {
        setSelectedSubjects(data.subjects || []);
        setSelectedGrades(data.grades || []);
        setRecommendedSubjects(Array.isArray(data.recommendations?.subjects) ? data.recommendations.subjects : []);
        setRecommendedGrades(Array.isArray(data.recommendations?.grades) ? data.recommendations.grades : []);
      })
      .catch(() => {
        // Keep static fallback chips.
      });
  }, [tokenPresent]);

  useEffect(() => {
    if (!tokenPresent) return;

    fetchTutorRates()
      .then((data) => {
        setVirtual45Rate(data.virtual_45_rate || "");
        setVirtual60Rate(data.virtual_60_rate || "");
        setInPerson45Rate(data.in_person_45_rate || "");
        setInPerson60Rate(data.in_person_60_rate || "");
      })
      .catch(() => {
        // Keep static fallback values.
      });
  }, [tokenPresent]);

  useEffect(() => {
    if (!tokenPresent) return;

    fetchTutorPreferences()
      .then((data) => {
        setIsClassroomTeacher(Boolean(data.is_classroom_teacher));
        setOffersVirtual(Boolean(data.offers_virtual));
        setOffersInPerson(Boolean(data.offers_in_person));
        setAdvanceNotice(data.advance_notice || "24 hours");
        setMaxSessionsPerDay(Math.max(1, Number(data.max_sessions_per_day ?? 3)));
        setPauseAccount(Boolean(data.pause_account));
      })
      .catch(() => {
        // Keep static fallback values.
      });
  }, [tokenPresent]);

  useEffect(() => {
    if (!tokenPresent) return;

    fetchTutorLocations()
      .then((items) => {
        setLocationEntries(items);
      })
      .catch(() => {
        // Keep static fallback values.
      });
  }, [tokenPresent]);


  function openEducationModal(entry?: TutorEducationApiItem) {
    if (entry) {
      setEducationMode("edit");
      setEditingEducationId(entry.id);
      setEducationForm({
        title: entry.title,
        organization: entry.organization,
        period: entry.period,
      });
    } else {
      setEducationMode("add");
      setEditingEducationId(null);
      setEducationForm({ title: "", organization: "", period: "" });
    }
    setEducationError(null);
    setIsEducationModalOpen(true);
  }

  function closeEducationModal() {
    if (isSavingEducation) return;
    setIsEducationModalOpen(false);
    setEducationMode("add");
    setEditingEducationId(null);
    setEducationError(null);
  }

  function openDeleteEducationConfirm(educationId: string) {
    setDeletingEducationId(educationId);
    setEducationError(null);
    setIsDeleteEducationConfirmOpen(true);
  }

  function closeDeleteEducationConfirm() {
    if (isSavingEducation) return;
    setIsDeleteEducationConfirmOpen(false);
    setDeletingEducationId(null);
    setEducationError(null);
  }

  async function handleSaveEducation() {
    const title = educationForm.title.trim();
    const organization = educationForm.organization.trim();
    const period = educationForm.period.trim();

    if (!title || !organization || !period) {
      setEducationError("Title, organization, and period are required.");
      return;
    }

    const token = readCookie("arch_access_token");
    if (!token) {
      setEducationError("Authentication required. Please login again.");
      return;
    }

    setIsSavingEducation(true);
    setEducationError(null);

    try {
      if (educationMode === "edit") {
        if (!editingEducationId) {
          throw new Error("Education id is missing.");
        }

        const item = await updateTutorEducationEntry(token, editingEducationId, {
          title,
          organization,
          period,
        });

        setEducationEntries((current) =>
          current.map((entry) => (entry.id === editingEducationId ? item : entry)),
        );
      } else {
        const item = await addTutorEducationEntry(token, { title, organization, period });
        setEducationEntries((current) => [item, ...current]);
      }

      setIsEducationModalOpen(false);
      setEducationMode("add");
      setEditingEducationId(null);
      setEducationForm({ title: "", organization: "", period: "" });
    } catch (error) {
      setEducationError(
        error instanceof Error
          ? error.message
          : educationMode === "edit"
            ? "Failed to update education."
            : "Failed to add education.",
      );
    } finally {
      setIsSavingEducation(false);
    }
  }

  async function handleDeleteEducationConfirm() {
    if (!deletingEducationId) return;

    const token = readCookie("arch_access_token");
    if (!token) {
      setEducationError("Authentication required. Please login again.");
      return;
    }

    setIsSavingEducation(true);
    setEducationError(null);

    try {
      await deleteTutorEducationEntry(token, deletingEducationId);
      setEducationEntries((current) => current.filter((entry) => entry.id !== deletingEducationId));
      setIsDeleteEducationConfirmOpen(false);
      setDeletingEducationId(null);
    } catch (error) {
      setEducationError(error instanceof Error ? error.message : "Failed to delete education.");
    } finally {
      setIsSavingEducation(false);
    }
  }

  function openWorkExperienceModal(entry?: TutorWorkExperienceApiItem) {
    if (entry) {
      setWorkExperienceMode("edit");
      setEditingWorkExperienceId(entry.id);
      setWorkExperienceForm({
        title: entry.title,
        fromDate: entry.from_date || "",
        toDate: entry.to_date || "",
        organization: entry.organization,
        description: entry.description,
      });
    } else {
      setWorkExperienceMode("add");
      setEditingWorkExperienceId(null);
      setWorkExperienceForm({ title: "", fromDate: "", toDate: "", organization: "", description: "" });
    }
    setWorkExperienceError(null);
    setIsWorkExperienceModalOpen(true);
  }

  function closeWorkExperienceModal() {
    if (isSavingWorkExperience) return;
    setIsWorkExperienceModalOpen(false);
    setWorkExperienceMode("add");
    setEditingWorkExperienceId(null);
    setWorkExperienceError(null);
  }

  function openDeleteWorkExperienceConfirm(workExperienceId: string) {
    setDeletingWorkExperienceId(workExperienceId);
    setWorkExperienceError(null);
    setIsDeleteWorkExperienceConfirmOpen(true);
  }

  function closeDeleteWorkExperienceConfirm() {
    if (isSavingWorkExperience) return;
    setIsDeleteWorkExperienceConfirmOpen(false);
    setDeletingWorkExperienceId(null);
    setWorkExperienceError(null);
  }

  async function handleSaveWorkExperience() {
    const title = workExperienceForm.title.trim();
    const organization = workExperienceForm.organization.trim();
    const fromDate = workExperienceForm.fromDate;
    const toDate = workExperienceForm.toDate;
    const description = workExperienceForm.description.trim();

    if (!title || !organization || !fromDate) {
      setWorkExperienceError("Title, organization, and start date are required.");
      return;
    }

    if (toDate && new Date(toDate) < new Date(fromDate)) {
      setWorkExperienceError("End date cannot be earlier than start date.");
      return;
    }

    const period = buildWorkPeriodLabel(fromDate, toDate);
    if (!period) {
      setWorkExperienceError("Please provide valid start/end dates.");
      return;
    }

    const token = readCookie("arch_access_token");
    if (!token) {
      setWorkExperienceError("Authentication required. Please login again.");
      return;
    }

    setIsSavingWorkExperience(true);
    setWorkExperienceError(null);

    try {
      if (workExperienceMode === "edit") {
        if (!editingWorkExperienceId) {
          throw new Error("Work experience id is missing.");
        }

        const item = await updateTutorWorkExperienceEntry(token, editingWorkExperienceId, {
          title,
          organization,
          period,
          description,
          from_date: fromDate,
          to_date: toDate,
        });

        setWorkExperienceEntries((current) =>
          current.map((entry) => (entry.id === editingWorkExperienceId ? item : entry)),
        );
      } else {
        const item = await addTutorWorkExperienceEntry(token, {
          title,
          organization,
          period,
          description,
          from_date: fromDate,
          to_date: toDate,
        });
        setWorkExperienceEntries((current) => [item, ...current]);
      }

      setIsWorkExperienceModalOpen(false);
      setWorkExperienceMode("add");
      setEditingWorkExperienceId(null);
      setWorkExperienceForm({ title: "", fromDate: "", toDate: "", organization: "", description: "" });
    } catch (error) {
      setWorkExperienceError(
        error instanceof Error
          ? error.message
          : workExperienceMode === "edit"
            ? "Failed to update work experience."
            : "Failed to add work experience.",
      );
    } finally {
      setIsSavingWorkExperience(false);
    }
  }

  async function handleDeleteWorkExperienceConfirm() {
    if (!deletingWorkExperienceId) return;

    const token = readCookie("arch_access_token");
    if (!token) {
      setWorkExperienceError("Authentication required. Please login again.");
      return;
    }

    setIsSavingWorkExperience(true);
    setWorkExperienceError(null);

    try {
      await deleteTutorWorkExperienceEntry(token, deletingWorkExperienceId);
      setWorkExperienceEntries((current) => current.filter((entry) => entry.id !== deletingWorkExperienceId));
      setIsDeleteWorkExperienceConfirmOpen(false);
      setDeletingWorkExperienceId(null);
    } catch (error) {
      setWorkExperienceError(
        error instanceof Error ? error.message : "Failed to delete work experience.",
      );
    } finally {
      setIsSavingWorkExperience(false);
    }
  }
  function openLocationModal(entry?: TutorLocationApiItem) {
    if (entry) {
      setLocationMode("edit");
      setEditingLocationId(entry.id);
      setLocationForm({
        name: entry.name,
        addressLine1: entry.address_line_1,
        addressLine2: entry.address_line_2,
        preferred: Boolean(entry.preferred),
        showMapPreview: Boolean(entry.show_map_preview),
      });
    } else {
      setLocationMode("add");
      setEditingLocationId(null);
      setLocationForm({
        name: "",
        addressLine1: "",
        addressLine2: "",
        preferred: false,
        showMapPreview: false,
      });
    }

    setLocationError(null);
    setLocationSuccess(null);
    setIsLocationModalOpen(true);
  }

  function closeLocationModal() {
    if (isSavingLocation) return;
    setIsLocationModalOpen(false);
    setLocationMode("add");
    setEditingLocationId(null);
    setLocationError(null);
  }

  function openDeleteLocationConfirm(locationId: string) {
    setDeletingLocationId(locationId);
    setLocationError(null);
    setLocationSuccess(null);
    setIsDeleteLocationConfirmOpen(true);
  }

  function closeDeleteLocationConfirm() {
    if (isSavingLocation) return;
    setIsDeleteLocationConfirmOpen(false);
    setDeletingLocationId(null);
    setLocationError(null);
  }

  async function handleSaveLocation() {
    const name = locationForm.name.trim();
    const addressLine1 = locationForm.addressLine1.trim();
    const addressLine2 = locationForm.addressLine2.trim();

    if (!name || !addressLine1 || !addressLine2) {
      setLocationError("Name and address fields are required.");
      return;
    }

    const token = readCookie("arch_access_token");
    if (!token) {
      setLocationError("Authentication required. Please login again.");
      return;
    }

    setIsSavingLocation(true);
    setLocationError(null);
    setLocationSuccess(null);

    try {
      const payload = {
        name,
        address_line_1: addressLine1,
        address_line_2: addressLine2,
        preferred: locationForm.preferred,
        show_map_preview: locationForm.showMapPreview,
      };

      if (locationMode === "edit") {
        if (!editingLocationId) {
          throw new Error("Location id is missing.");
        }

        const item = await updateTutorLocation(token, editingLocationId, payload);
        setLocationEntries((current) => {
          const next = current.map((entry) => (entry.id === editingLocationId ? item : entry));
          return item.preferred ? next.map((entry) => ({ ...entry, preferred: entry.id === item.id })) : next;
        });
        setLocationSuccess("Location updated successfully.");
      } else {
        const item = await addTutorLocation(token, payload);
        setLocationEntries((current) => {
          const next = [item, ...current];
          return item.preferred ? next.map((entry) => ({ ...entry, preferred: entry.id === item.id })) : next;
        });
        setLocationSuccess("Location added successfully.");
      }

      setIsLocationModalOpen(false);
      setLocationMode("add");
      setEditingLocationId(null);
      setLocationForm({
        name: "",
        addressLine1: "",
        addressLine2: "",
        preferred: false,
        showMapPreview: false,
      });
    } catch (error) {
      setLocationError(
        error instanceof Error
          ? error.message
          : locationMode === "edit"
            ? "Failed to update location."
            : "Failed to add location.",
      );
    } finally {
      setIsSavingLocation(false);
    }
  }

  async function handleDeleteLocationConfirm() {
    if (!deletingLocationId) return;

    const token = readCookie("arch_access_token");
    if (!token) {
      setLocationError("Authentication required. Please login again.");
      return;
    }

    setIsSavingLocation(true);
    setLocationError(null);
    setLocationSuccess(null);

    try {
      await deleteTutorLocation(token, deletingLocationId);
      setLocationEntries((current) => current.filter((entry) => entry.id !== deletingLocationId));
      setIsDeleteLocationConfirmOpen(false);
      setDeletingLocationId(null);
      setLocationSuccess("Location deleted successfully.");
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : "Failed to delete location.");
    } finally {
      setIsSavingLocation(false);
    }
  }

  async function handleSetPreferredLocation(locationId: string) {
    const token = readCookie("arch_access_token");
    if (!token) {
      setLocationError("Authentication required. Please login again.");
      return;
    }

    setIsSavingLocation(true);
    setLocationError(null);
    setLocationSuccess(null);

    try {
      const preferred = await setPreferredTutorLocation(token, locationId);
      setLocationEntries((current) =>
        current.map((entry) => ({
          ...entry,
          preferred: entry.id === preferred.id,
        })),
      );
      setLocationSuccess("Preferred location updated.");
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : "Failed to set preferred location.");
    } finally {
      setIsSavingLocation(false);
    }
  }

  function handleProfileFieldChange(field: keyof TutorProfileForm, value: string) {
    setProfileForm((previous) => ({ ...previous, [field]: value }));
    setSaveError(null);
    setSaveSuccess(null);
  }

  async function handleProfileSave() {
    if (
      activeTab !== "Personal Info" &&
      activeTab !== "Bio & School District" &&
      activeTab !== "Subjects & Grades" &&
      activeTab !== "Rates" &&
      activeTab !== "Preferences"
    ) {
      return;
    }

    const token = readCookie("arch_access_token");
    if (!token) {
      setSaveError("Authentication required. Please login again.");
      setSaveSuccess(null);
      return;
    }

    setIsSavingProfile(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      if (activeTab === "Personal Info") {
        const updatedProfile = await saveTutorProfile(token, profileForm);
        setProfile(updatedProfile);
        setProfileForm({
          firstName: updatedProfile.firstName,
          lastName: updatedProfile.lastName,
          email: updatedProfile.email,
          phone: updatedProfile.phone,
          streetAddress: updatedProfile.streetAddress,
          city: updatedProfile.city,
          state: updatedProfile.state,
          zipCode: updatedProfile.zipCode,
          emergencyContactName: updatedProfile.emergencyContactName,
          emergencyContactPhone: updatedProfile.emergencyContactPhone,
          dateOfBirth: updatedProfile.dateOfBirth || "",
          gender: updatedProfile.gender || "",
        });
        setBio(updatedProfile.bio || "");
        setSchoolDistrict(updatedProfile.schoolDistrict || "");
        setSaveSuccess("Profile updated successfully.");
        window.dispatchEvent(
          new CustomEvent("arch-profile-updated", {
            detail: {
              role: "tutor",
              firstName: updatedProfile.firstName,
              lastName: updatedProfile.lastName,
              email: updatedProfile.email,
              initials: updatedProfile.initials,
            },
          }),
        );
      } else if (activeTab === "Bio & School District") {
        const updatedBio = await saveTutorBioSchoolDistrict(token, {
          bio,
          school_district: schoolDistrict,
        });

        const nextBio = updatedBio.bio || "";
        const nextDistrict = updatedBio.school_district || "";

        setBio(nextBio);
        setSchoolDistrict(nextDistrict);
        setProfile((current) => ({
          ...current,
          bio: nextBio,
          schoolDistrict: nextDistrict,
        }));
        setSaveSuccess("Bio & school district updated successfully.");
      } else if (activeTab === "Subjects & Grades") {
        const updated = await saveTutorSubjectsGrades(token, {
          subjects: selectedSubjects,
          grades: selectedGrades,
        });

        setSelectedSubjects(updated.subjects || []);
        setSelectedGrades(updated.grades || []);
        setSaveSuccess("Subjects & grades updated successfully.");
      } else if (activeTab === "Rates") {
        const updatedRates = await saveTutorRates(token, {
          virtual_45_rate: virtual45Rate,
          virtual_60_rate: virtual60Rate,
          in_person_45_rate: inPerson45Rate,
          in_person_60_rate: inPerson60Rate,
        });

        setVirtual45Rate(updatedRates.virtual_45_rate || "");
        setVirtual60Rate(updatedRates.virtual_60_rate || "");
        setInPerson45Rate(updatedRates.in_person_45_rate || "");
        setInPerson60Rate(updatedRates.in_person_60_rate || "");
        setSaveSuccess("Rates updated successfully.");
      } else {
        const updatedPrefs = await saveTutorPreferences(token, {
          is_classroom_teacher: isClassroomTeacher,
          offers_virtual: offersVirtual,
          offers_in_person: offersInPerson,
          advance_notice: advanceNotice,
          max_sessions_per_day: maxSessionsPerDay,
          pause_account: pauseAccount,
        });

        setIsClassroomTeacher(Boolean(updatedPrefs.is_classroom_teacher));
        setOffersVirtual(Boolean(updatedPrefs.offers_virtual));
        setOffersInPerson(Boolean(updatedPrefs.offers_in_person));
        setAdvanceNotice(updatedPrefs.advance_notice || "24 hours");
        setMaxSessionsPerDay(Math.max(1, Number(updatedPrefs.max_sessions_per_day ?? 3)));
        setPauseAccount(Boolean(updatedPrefs.pause_account));
        setSaveSuccess("Preferences updated successfully.");
      }

      setLastSavedAt(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save profile.");
      setSaveSuccess(null);
    } finally {
      setIsSavingProfile(false);
    }
  }

  function toggleChip(value: string, currentValues: string[], setter: (values: string[]) => void) {
    setter(
      currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value],
    );
  }

  return (
    <TutorShell>
      <div className="w-full">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">My Profile</h1>
          <button
            type="button"
            onClick={handleProfileSave}
            disabled={(activeTab !== "Personal Info" && activeTab !== "Bio & School District" && activeTab !== "Subjects & Grades" && activeTab !== "Rates" && activeTab !== "Preferences") || isSavingProfile}
            className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingProfile && (activeTab === "Personal Info" || activeTab === "Bio & School District" || activeTab === "Subjects & Grades" || activeTab === "Rates" || activeTab === "Preferences") ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="mt-5 grid gap-0 rounded-[12px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="border-b border-[#eceef2] p-4 xl:border-r xl:border-b-0">
            <div className="flex flex-col items-center border-b border-[#eceef2] pb-4 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#ffe7eb] text-[40px] font-bold text-[#d61c3f]">
                {profile.initials}
              </div>
              <h2 className="mt-5 text-[18px] font-bold text-[#20242b]">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-[14px] text-[#6b7280]">{profile.title}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex rounded-full bg-[#dff2e5] px-3 py-1 text-[11px] font-semibold text-[#3d9b68]">
                  {profile.status}
                </span>
                <span className="text-[12px] text-[#6b7280]">{profile.since}</span>
              </div>
            </div>

            <div className="space-y-3 border-b border-[#eceef2] py-4 text-[13px] text-[#4b5563]">
              <div className="flex items-center gap-2">
                <FiMail className="h-4 w-4 text-[#6b7280]" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="h-4 w-4 text-[#6b7280]" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="h-4 w-4 text-[#6b7280]" />
                <span>{profile.location}</span>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">Quick Stats</p>
              <div className="mt-3 space-y-2 text-[14px]">
                {[
                  { label: "Total Sessions", value: profile.totalSessions, valueClassName: "text-[#20242b]" },
                  { label: "Avg Rating", value: `${profile.avgRating} ★`, valueClassName: "text-[#20242b]" },
                  { label: "Active Students", value: profile.activeStudents, valueClassName: "text-[#20242b]" },
                  { label: "All-Time Earnings", value: profile.allTimeEarnings, valueClassName: "text-[#1b8a5a]" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between gap-4">
                    <span className="text-[#6b7280]">{stat.label}</span>
                    <span className={`font-semibold ${stat.valueClassName}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="border-b border-[#eceef2] px-4">
              <div className="flex flex-wrap items-center gap-7 overflow-x-auto">
                {profileTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`border-b-2 pb-3 pt-4 text-[13px] font-semibold whitespace-nowrap ${
                      activeTab === tab
                        ? "border-[#d61c3f] text-[#d61c3f]"
                        : "border-transparent text-[#6b7280]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-4">
              {activeTab === "Personal Info" ? (
                <PersonalInfoSection
                  profile={profile}
                  values={profileForm}
                  onChange={handleProfileFieldChange}
                  saveError={saveError}
                  saveSuccess={saveSuccess}
                  lastSavedAt={lastSavedAt}
                />
              ) : null}
              {activeTab === "Bio & School District" ? (
                <section className="rounded-[12px] bg-white p-5">
                  <h3 className="text-[18px] font-bold text-[#20242b]">Bio & School District</h3>

                  <div className="mt-5 space-y-5">
                    <div>
                      <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">Bio</label>
                      <textarea
                        value={bio}
                        onChange={(event) => setBio(event.target.value)}
                        className="min-h-[116px] w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 py-3 text-[14px] text-[#4b5563] outline-none"
                      />
                      <p className="mt-2 text-[12px] text-[#9ca3af]">
                        This appears on your public profile for students to read.
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">
                        School District (Optional)
                      </label>
                      <input
                        type="text"
                        value={schoolDistrict}
                        onChange={(event) => setSchoolDistrict(event.target.value)}
                        className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] text-[#4b5563] outline-none"
                      />
                      <p className="mt-2 text-[12px] text-[#9ca3af]">
                        Enter if you currently teach in a school district.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 rounded-[12px] border border-[#f3cfd6] bg-[#fff7f8] px-4 py-4 text-[13px] text-[#6b7280]">
                      <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#e25b70]" />
                      <p>
                        Your school district is only shown on your profile if you have entered it.
                        Leave blank to hide it.
                      </p>
                    </div>

                    {saveError ? <p className="text-[13px] text-[#d61c3f]">{saveError}</p> : null}
                    {saveSuccess ? <p className="text-[13px] text-[#1b8a5a]">{saveSuccess}</p> : null}
                    {lastSavedAt ? (
                      <p className="text-[12px] text-[#6b7280]">Last saved at {lastSavedAt}</p>
                    ) : null}
                  </div>
                </section>
              ) : null}
              {activeTab === "Education" ? (
                <section className="rounded-[12px] bg-white p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-[18px] font-bold text-[#20242b]">Education</h3>
                    <button
                      type="button"
                      onClick={() => openEducationModal()}
                      className="inline-flex h-10 items-center gap-2 rounded-full bg-[#d61c3f] px-4 text-[13px] font-semibold text-white"
                    >
                      <FiPlus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    {educationEntries.map((entry, index) => (
                      <div
                        key={entry.id}
                        className="flex items-start justify-between gap-4 rounded-[16px] border border-[#eceef2] bg-white px-4 py-5 shadow-[0_4px_14px_rgba(15,23,42,0.05)]"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffe7eb] text-[#d61c3f]">
                            <span className="text-[16px] font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-[16px] font-bold leading-6 text-[#20242b]">{entry.title}</p>
                            <p className="text-[14px] text-[#6b7280]">{entry.organization}</p>
                            <p className="text-[14px] text-[#6b7280]">{entry.period}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-[#9ca3af]">
                          <button type="button" onClick={() => openEducationModal(entry)} aria-label="Edit education entry">
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => openDeleteEducationConfirm(entry.id)} aria-label="Delete education entry">
                            <FiTrash2 className="h-4 w-4 text-[#f08a9c]" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-start gap-3 rounded-[12px] border border-[#f3cfd6] bg-[#fff7f8] px-4 py-4 text-[13px] text-[#6b7280]">
                      <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#e25b70]" />
                      <p>
                        Adding your education and certifications builds trust with students and
                        parents browsing your profile.
                      </p>
                    </div>
                  </div>
                </section>
              ) : null}
              {activeTab === "Work Experience" ? (
                <section className="rounded-[12px] bg-white p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-[18px] font-bold text-[#20242b]">Work Experience</h3>
                    <button
                      type="button"
                      onClick={() => openWorkExperienceModal()}
                      className="inline-flex h-10 items-center gap-2 rounded-full bg-[#d61c3f] px-4 text-[13px] font-semibold text-white"
                    >
                      <FiPlus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    {workExperienceEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-start justify-between gap-4 rounded-[16px] border border-[#eceef2] bg-white px-4 py-5 shadow-[0_4px_14px_rgba(15,23,42,0.05)]"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffe7eb] text-[#d61c3f]">
                            <FiBriefcase className="h-4 w-4" />
                          </div>
                          <div className="max-w-[520px]">
                            <p className="text-[16px] font-bold leading-6 text-[#20242b]">{entry.title}</p>
                            <p className="text-[14px] text-[#6b7280]">{entry.organization}</p>
                            <p className="text-[14px] text-[#6b7280]">{getWorkPeriodForDisplay(entry)}</p>
                            <p className="mt-2 text-[14px] leading-7 text-[#4b5563]">{entry.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-[#9ca3af]">
                          <button type="button" onClick={() => openWorkExperienceModal(entry)} aria-label="Edit work experience entry">
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => openDeleteWorkExperienceConfirm(entry.id)} aria-label="Delete work experience entry">
                            <FiTrash2 className="h-4 w-4 text-[#f08a9c]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
              {activeTab === "Subjects & Grades" ? (
                <section className="relative rounded-[12px] bg-white p-5">
                  <h3 className="text-[18px] font-bold text-[#20242b]">Subjects & Grades</h3>

                  <div className="mt-6">
                    <p className="text-[16px] font-semibold text-[#20242b]">Subjects You Teach</p>
                    <RecommendationChips
                      title="Recommended subjects on the system"
                      items={recommendedSubjects}
                      selectedValues={selectedSubjects}
                      onToggle={(value) => toggleChip(value, selectedSubjects, setSelectedSubjects)}
                    />
                    <div className="mt-4 flex flex-wrap gap-2">
                      {subjectOptions.map((subject) => {
                        const active = selectedSubjects.includes(subject);

                        return (
                          <button
                            key={subject}
                            type="button"
                            disabled={isSavingSubjectsGrades}
                            onClick={() => toggleChip(subject, selectedSubjects, setSelectedSubjects)}
                            className={`rounded-full border px-3 py-2 text-[13px] font-semibold transition ${
                              active
                                ? "border-[#f191a5] bg-[#fff1f4] text-[#d61c3f]"
                                : "border-[#e5e7eb] bg-[#fafafa] text-[#6b7280]"
                            }`}
                          >
                            {subject}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-3 text-[12px] text-[#9ca3af]">Tap to add or remove subjects.</p>
                  </div>

                  <div className="mt-5 border-t border-[#eceef2] pt-5">
                    <p className="text-[16px] font-semibold text-[#20242b]">Grade Levels</p>
                    <RecommendationChips
                      title="Recommended grade levels on the system"
                      items={recommendedGrades}
                      selectedValues={selectedGrades}
                      onToggle={(value) => toggleChip(value, selectedGrades, setSelectedGrades)}
                    />
                    <div className="mt-4 flex flex-wrap gap-2">
                      {gradeOptions.map((grade) => {
                        const active = selectedGrades.includes(grade);

                        return (
                          <button
                            key={grade}
                            type="button"
                            disabled={isSavingSubjectsGrades}
                            onClick={() => toggleChip(grade, selectedGrades, setSelectedGrades)}
                            className={`rounded-full border px-3 py-2 text-[13px] font-semibold transition ${
                              active
                                ? "border-[#f191a5] bg-[#fff1f4] text-[#d61c3f]"
                                : "border-[#e5e7eb] bg-[#fafafa] text-[#6b7280]"
                            }`}
                          >
                            {grade}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {isSavingSubjectsGrades ? (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[12px] bg-white/70 backdrop-blur-[1px]">
                      <div className="flex items-center gap-3 rounded-full border border-[#f3cfd6] bg-white px-4 py-2 text-[13px] font-semibold text-[#d61c3f]">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#f3cfd6] border-t-[#d61c3f]" />
                        <span>Saving...</span>
                      </div>
                    </div>
                  ) : null}
                </section>
              ) : null}
              {activeTab === "Rates" ? (
                <section className="relative rounded-[12px] bg-white p-5">
                  <h3 className="text-[18px] font-bold text-[#20242b]">Rates</h3>

                  <div className="mt-6 max-w-[420px] space-y-6">
                    <div>
                      <div className="flex items-center gap-2 text-[14px] font-semibold text-[#20242b]">
                        <FiVideo className="h-4 w-4 text-[#d61c3f]" />
                        <span>Virtual Rates</span>
                      </div>

                      <div className="mt-3 space-y-4">
                        <div>
                          <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">
                            45-minute session
                          </label>
                          <input
                            type="text"
                            value={virtual45Rate}
                            onChange={(event) => { setVirtual45Rate(event.target.value); setSaveError(null); setSaveSuccess(null); }}
                            className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] text-[#4b5563] outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">
                            60-minute session
                          </label>
                          <input
                            type="text"
                            value={virtual60Rate}
                            onChange={(event) => { setVirtual60Rate(event.target.value); setSaveError(null); setSaveSuccess(null); }}
                            className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] text-[#4b5563] outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[#eceef2] pt-5">
                      <div className="flex items-center gap-2 text-[14px] font-semibold text-[#20242b]">
                        <FiMapPin className="h-4 w-4 text-[#d61c3f]" />
                        <span>In-Person Rates</span>
                      </div>

                      <div className="mt-3 space-y-4">
                        <div>
                          <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">
                            45-minute session
                          </label>
                          <input
                            type="text"
                            value={inPerson45Rate}
                            onChange={(event) => { setInPerson45Rate(event.target.value); setSaveError(null); setSaveSuccess(null); }}
                            className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] text-[#4b5563] outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">
                            60-minute session
                          </label>
                          <input
                            type="text"
                            value={inPerson60Rate}
                            onChange={(event) => { setInPerson60Rate(event.target.value); setSaveError(null); setSaveSuccess(null); }}
                            className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] text-[#4b5563] outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-[12px] border border-[#f3cfd6] bg-[#fff7f8] px-4 py-4 text-[13px] text-[#6b7280]">
                      <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#e25b70]" />
                      <p>
                        Students pay you directly after each session via cash, check, Venmo, or
                        PayPal. Arch City Tutors only collects the $5 scheduling fee.
                      </p>
                    </div>

                    {saveError ? <p className="text-[13px] text-[#d61c3f]">{saveError}</p> : null}
                    {saveSuccess ? <p className="text-[13px] text-[#1b8a5a]">{saveSuccess}</p> : null}
                    {lastSavedAt ? (
                      <p className="text-[12px] text-[#6b7280]">Last saved at {lastSavedAt}</p>
                    ) : null}
                  </div>
                  {isSavingRates ? (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[12px] bg-white/70 backdrop-blur-[1px]">
                      <div className="flex items-center gap-3 rounded-full border border-[#f3cfd6] bg-white px-4 py-2 text-[13px] font-semibold text-[#d61c3f]">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#f3cfd6] border-t-[#d61c3f]" />
                        <span>Saving...</span>
                      </div>
                    </div>
                  ) : null}
                </section>
              ) : null}
              {activeTab === "Preferences" ? (
                <section className="relative rounded-[12px] bg-white p-5">
                  <h3 className="text-[18px] font-bold text-[#20242b]">Preferences</h3>

                  <div className="mt-6 space-y-6">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">
                        Tutoring Preferences
                      </p>

                      <div className="mt-3 divide-y divide-[#eceef2]">
                        {[
                          {
                            title: "Currently teaching in classroom",
                            description: "Active classroom teacher",
                            enabled: isClassroomTeacher,
                            onToggle: () => {
                              setIsClassroomTeacher((current) => !current);
                              setSaveError(null);
                              setSaveSuccess(null);
                            },
                          },
                          {
                            title: "Offer virtual tutoring",
                            description: "Available for video sessions",
                            enabled: offersVirtual,
                            onToggle: () => {
                              setOffersVirtual((current) => !current);
                              setSaveError(null);
                              setSaveSuccess(null);
                            },
                          },
                          {
                            title: "Offer in-person tutoring",
                            description: "Meet at a physical location",
                            enabled: offersInPerson,
                            onToggle: () => {
                              setOffersInPerson((current) => !current);
                              setSaveError(null);
                              setSaveSuccess(null);
                            },
                          },
                        ].map((item) => (
                          <div key={item.title} className="flex items-center justify-between gap-4 py-3">
                            <div>
                              <p className="text-[14px] font-semibold text-[#20242b]">{item.title}</p>
                              <p className="mt-1 text-[12px] text-[#9ca3af]">{item.description}</p>
                            </div>
                            <Toggle enabled={item.enabled} onToggle={item.onToggle} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">
                        Advance Notice Required
                      </p>

                      <div className="mt-3 space-y-2">
                        {[
                          {
                            label: "24 hours",
                            description: "Students must book at least 24 hours in advance",
                          },
                          {
                            label: "12 hours",
                            description: "Students must book at least 12 hours in advance",
                          },
                          {
                            label: "6 hours",
                            description: "Students must book at least 6 hours in advance",
                          },
                        ].map((option) => {
                          const active = advanceNotice === option.label;

                          return (
                            <button
                              key={option.label}
                              type="button"
                              onClick={() => {
                                setAdvanceNotice(option.label);
                                setSaveError(null);
                                setSaveSuccess(null);
                              }}
                              className={`flex w-full items-start gap-3 rounded-[12px] border px-4 py-3 text-left transition ${
                                active
                                  ? "border-[#f191a5] bg-[#fff7f8]"
                                  : "border-[#e5e7eb] bg-white"
                              }`}
                            >
                              <span
                                className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${
                                  active
                                    ? "border-[#f191a5] text-[#d61c3f]"
                                    : "border-[#d8dde6] text-transparent"
                                }`}
                              >
                                {"✓"}
                              </span>
                              <span>
                                <span className="block text-[14px] font-semibold text-[#20242b]">
                                  {option.label}
                                </span>
                                <span className="block text-[12px] text-[#9ca3af]">
                                  {option.description}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">
                        Capacity
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[14px] font-semibold text-[#20242b]">Max Sessions Per Day</p>
                          <p className="mt-1 text-[12px] text-[#9ca3af]">
                            Synced with Availability settings
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setMaxSessionsPerDay((current) => Math.max(1, current - 1));
                              setSaveError(null);
                              setSaveSuccess(null);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e5e7eb] text-[#6b7280]"
                          >
                            -
                          </button>
                          <span className="w-4 text-center text-[18px] font-bold text-[#20242b]">
                            {maxSessionsPerDay}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setMaxSessionsPerDay((current) => current + 1);
                              setSaveError(null);
                              setSaveSuccess(null);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d61c3f] text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">
                        Account Status
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[14px] font-semibold text-[#20242b]">Pause Account</p>
                          <p className="mt-1 text-[12px] text-[#9ca3af]">
                            Hides your profile from student searches. No need to re-register; just toggle back on when ready.
                          </p>
                        </div>
                        <Toggle
                          enabled={pauseAccount}
                          onToggle={() => {
                            setPauseAccount((current) => !current);
                            setSaveError(null);
                            setSaveSuccess(null);
                          }}
                        />
                      </div>
                    </div>

                    {saveError ? <p className="text-[13px] text-[#d61c3f]">{saveError}</p> : null}
                    {saveSuccess ? <p className="text-[13px] text-[#1b8a5a]">{saveSuccess}</p> : null}
                    {lastSavedAt ? (
                      <p className="text-[12px] text-[#6b7280]">Last saved at {lastSavedAt}</p>
                    ) : null}
                  </div>

                  {isSavingPreferences ? (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[12px] bg-white/70 backdrop-blur-[1px]">
                      <div className="flex items-center gap-3 rounded-full border border-[#f3cfd6] bg-white px-4 py-2 text-[13px] font-semibold text-[#d61c3f]">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#f3cfd6] border-t-[#d61c3f]" />
                        <span>Saving...</span>
                      </div>
                    </div>
                  ) : null}
                </section>
              ) : null}
              {activeTab === "Location" ? (
                <section className="relative rounded-[12px] bg-white p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-[18px] font-bold text-[#20242b]">Location</h3>
                    <button
                      type="button"
                      onClick={() => openLocationModal()}
                      className="inline-flex h-10 items-center gap-2 rounded-full bg-[#d61c3f] px-4 text-[13px] font-semibold text-white"
                    >
                      <FiPlus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="mt-5 max-w-[520px] space-y-4">
                    {locationEntries.length === 0 ? (
                      <div className="rounded-[16px] border border-dashed border-[#f3cfd6] bg-[#fff7f8] px-4 py-6 text-[13px] text-[#6b7280]">
                        No locations added yet. Click Add to create your first tutoring location.
                      </div>
                    ) : null}

                    {locationEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className={`rounded-[16px] border bg-white px-4 py-4 shadow-[0_4px_14px_rgba(15,23,42,0.05)] ${
                          entry.preferred ? "border-[#f191a5]" : "border-[#eceef2]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffe7eb] text-[#d61c3f]">
                              <FiMapPin className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-[16px] font-bold text-[#20242b]">{entry.name}</p>
                                {entry.preferred ? (
                                  <span className="rounded-full bg-[#d61c3f] px-2 py-0.5 text-[10px] font-semibold text-white">
                                    Preferred
                                  </span>
                                ) : null}
                              </div>
                              <p className="text-[13px] text-[#6b7280]">{entry.address_line_1}</p>
                              <p className="text-[13px] text-[#6b7280]">{entry.address_line_2}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-[#9ca3af]">
                            <button
                              type="button"
                              onClick={() => openLocationModal(entry)}
                              aria-label="Edit location entry"
                              disabled={isSavingLocation}
                            >
                              <FiEdit2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openDeleteLocationConfirm(entry.id)}
                              aria-label="Delete location entry"
                              disabled={isSavingLocation}
                            >
                              <FiTrash2 className="h-4 w-4 text-[#f08a9c]" />
                            </button>
                          </div>
                        </div>

                        {entry.show_map_preview ? (
                          <div className="mt-4 rounded-[12px] bg-[#eceef2] px-4 py-8 text-center text-[13px] text-[#6b7280]">
                            <span className="inline-flex items-center gap-2">
                              <FiMapPin className="h-4 w-4" />
                              <span>Map Preview</span>
                            </span>
                          </div>
                        ) : null}

                        {!entry.preferred ? (
                          <button
                            type="button"
                            onClick={() => handleSetPreferredLocation(entry.id)}
                            disabled={isSavingLocation}
                            className="mt-4 text-[12px] font-semibold text-[#d61c3f] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Set as preferred
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>

                  {locationError ? <p className="mt-4 text-[13px] text-[#d61c3f]">{locationError}</p> : null}
                  {locationSuccess ? <p className="mt-2 text-[13px] text-[#1b8a5a]">{locationSuccess}</p> : null}

                  {isSavingLocation ? (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[12px] bg-white/70 backdrop-blur-[1px]">
                      <div className="flex items-center gap-3 rounded-full border border-[#f3cfd6] bg-white px-4 py-2 text-[13px] font-semibold text-[#d61c3f]">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#f3cfd6] border-t-[#d61c3f]" />
                        <span>Saving...</span>
                      </div>
                    </div>
                  ) : null}
                </section>
              ) : null}


              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="inline-flex h-11 items-center rounded-full border border-[#d61c3f] px-5 text-[14px] font-semibold text-[#d61c3f]"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleProfileSave}
                  disabled={(activeTab !== "Personal Info" && activeTab !== "Bio & School District" && activeTab !== "Subjects & Grades" && activeTab !== "Rates" && activeTab !== "Preferences") || isSavingProfile}
                  className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {activeTab === "Personal Info"
                    ? isSavingProfile
                      ? "Saving..."
                      : "Save Personal Info"
                    : activeTab === "Bio & School District" ? isSavingProfile ? "Saving..." : "Save Bio & School District" : activeTab === "Subjects & Grades" ? isSavingProfile ? "Saving..." : "Save Subjects & Grades" : activeTab === "Rates" ? isSavingProfile ? "Saving..." : "Save Rates" : activeTab === "Preferences" ? isSavingProfile ? "Saving..." : "Save Preferences" : "Save"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {isEducationModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[520px] rounded-[16px] bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.28)]">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-[20px] font-bold text-[#20242b]">{educationMode === "edit" ? "Edit Education" : "Add Education"}</h3>
              <button
                type="button"
                onClick={closeEducationModal}
                className="rounded-full border border-[#e5e7eb] px-3 py-1 text-[12px] font-semibold text-[#6b7280]"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">Title</label>
                <input
                  type="text"
                  value={educationForm.title}
                  onChange={(event) => {
                    setEducationForm((current) => ({ ...current, title: event.target.value }));
                    setEducationError(null);
                  }}
                  placeholder="e.g., B.S. Mathematics Education"
                  className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] text-[#4b5563] outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">Organization</label>
                <input
                  type="text"
                  value={educationForm.organization}
                  onChange={(event) => {
                    setEducationForm((current) => ({ ...current, organization: event.target.value }));
                    setEducationError(null);
                  }}
                  placeholder="e.g., University of Missouri"
                  className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] text-[#4b5563] outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">Period</label>
                <input
                  type="text"
                  value={educationForm.period}
                  onChange={(event) => {
                    setEducationForm((current) => ({ ...current, period: event.target.value }));
                    setEducationError(null);
                  }}
                  placeholder="e.g., 2019 - 2023"
                  className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] text-[#4b5563] outline-none"
                />
              </div>
              {educationError ? <p className="text-[13px] text-[#d61c3f]">{educationError}</p> : null}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeEducationModal}
                className="inline-flex h-10 items-center rounded-full border border-[#d61c3f] px-5 text-[13px] font-semibold text-[#d61c3f]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEducation}
                disabled={isSavingEducation}
                className="inline-flex h-10 items-center rounded-full bg-[#d61c3f] px-5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingEducation ? "Saving..." : educationMode === "edit" ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isDeleteEducationConfirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[440px] rounded-[16px] bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.28)]">
            <h3 className="text-[20px] font-bold text-[#20242b]">Delete Education</h3>
            <p className="mt-3 text-[14px] text-[#6b7280]">Are you sure you want to delete this education entry?</p>
            {educationError ? <p className="mt-3 text-[13px] text-[#d61c3f]">{educationError}</p> : null}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteEducationConfirm}
                className="inline-flex h-10 items-center rounded-full border border-[#d61c3f] px-5 text-[13px] font-semibold text-[#d61c3f]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteEducationConfirm}
                disabled={isSavingEducation}
                className="inline-flex h-10 items-center rounded-full bg-[#d61c3f] px-5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingEducation ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isWorkExperienceModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[520px] rounded-[16px] bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.28)]">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-[20px] font-bold text-[#20242b]">{workExperienceMode === "edit" ? "Edit Work Experience" : "Add Work Experience"}</h3>
              <button
                type="button"
                onClick={closeWorkExperienceModal}
                className="rounded-full border border-[#e5e7eb] px-3 py-1 text-[12px] font-semibold text-[#6b7280]"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">Title</label>
                <input
                  type="text"
                  value={workExperienceForm.title}
                  onChange={(event) => {
                    setWorkExperienceForm((current) => ({ ...current, title: event.target.value }));
                    setWorkExperienceError(null);
                  }}
                  placeholder="e.g., Algebra II Teacher"
                  className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] text-[#4b5563] outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">Organization</label>
                <input
                  type="text"
                  value={workExperienceForm.organization}
                  onChange={(event) => {
                    setWorkExperienceForm((current) => ({ ...current, organization: event.target.value }));
                    setWorkExperienceError(null);
                  }}
                  placeholder="e.g., Kirkwood School District"
                  className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] text-[#4b5563] outline-none"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">From</label>
                  <input
                    type="date"
                    value={workExperienceForm.fromDate}
                    onChange={(event) => {
                      setWorkExperienceForm((current) => ({ ...current, fromDate: event.target.value }));
                      setWorkExperienceError(null);
                    }}
                    className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] text-[#4b5563] outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">To (Optional)</label>
                  <input
                    type="date"
                    value={workExperienceForm.toDate}
                    onChange={(event) => {
                      setWorkExperienceForm((current) => ({ ...current, toDate: event.target.value }));
                      setWorkExperienceError(null);
                    }}
                    className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] text-[#4b5563] outline-none"
                  />
                </div>
              </div>

              {workExperienceForm.fromDate ? (
                <p className="text-[12px] text-[#6b7280]">
                  Duration: {buildWorkPeriodLabel(workExperienceForm.fromDate, workExperienceForm.toDate) || "Invalid dates"}
                </p>
              ) : null}

              <div>
                <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">Description</label>
                <textarea
                  value={workExperienceForm.description}
                  onChange={(event) => {
                    setWorkExperienceForm((current) => ({ ...current, description: event.target.value }));
                    setWorkExperienceError(null);
                  }}
                  placeholder="Briefly describe responsibilities and impact"
                  className="min-h-[100px] w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 py-3 text-[14px] text-[#4b5563] outline-none"
                />
              </div>

              {workExperienceError ? <p className="text-[13px] text-[#d61c3f]">{workExperienceError}</p> : null}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeWorkExperienceModal}
                className="inline-flex h-10 items-center rounded-full border border-[#d61c3f] px-5 text-[13px] font-semibold text-[#d61c3f]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveWorkExperience}
                disabled={isSavingWorkExperience}
                className="inline-flex h-10 items-center rounded-full bg-[#d61c3f] px-5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingWorkExperience ? "Saving..." : workExperienceMode === "edit" ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isDeleteWorkExperienceConfirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[440px] rounded-[16px] bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.28)]">
            <h3 className="text-[20px] font-bold text-[#20242b]">Delete Work Experience</h3>
            <p className="mt-3 text-[14px] text-[#6b7280]">Are you sure you want to delete this work experience entry?</p>
            {workExperienceError ? <p className="mt-3 text-[13px] text-[#d61c3f]">{workExperienceError}</p> : null}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteWorkExperienceConfirm}
                className="inline-flex h-10 items-center rounded-full border border-[#d61c3f] px-5 text-[13px] font-semibold text-[#d61c3f]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteWorkExperienceConfirm}
                disabled={isSavingWorkExperience}
                className="inline-flex h-10 items-center rounded-full bg-[#d61c3f] px-5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingWorkExperience ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isLocationModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[520px] rounded-[16px] bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.28)]">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-[20px] font-bold text-[#20242b]">{locationMode === "edit" ? "Edit Location" : "Add Location"}</h3>
              <button
                type="button"
                onClick={closeLocationModal}
                className="rounded-full border border-[#e5e7eb] px-3 py-1 text-[12px] font-semibold text-[#6b7280]"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">Location Name</label>
                <input
                  type="text"
                  value={locationForm.name}
                  onChange={(event) => {
                    setLocationForm((current) => ({ ...current, name: event.target.value }));
                    setLocationError(null);
                  }}
                  placeholder="e.g., Main Tutoring Office"
                  className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] text-[#4b5563] outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">Address Line 1</label>
                <input
                  type="text"
                  value={locationForm.addressLine1}
                  onChange={(event) => {
                    setLocationForm((current) => ({ ...current, addressLine1: event.target.value }));
                    setLocationError(null);
                  }}
                  placeholder="Street address"
                  className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] text-[#4b5563] outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">Address Line 2</label>
                <input
                  type="text"
                  value={locationForm.addressLine2}
                  onChange={(event) => {
                    setLocationForm((current) => ({ ...current, addressLine2: event.target.value }));
                    setLocationError(null);
                  }}
                  placeholder="City, state ZIP"
                  className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] text-[#4b5563] outline-none"
                />
              </div>

              <label className="flex items-center gap-2 text-[13px] text-[#4b5563]">
                <input
                  type="checkbox"
                  checked={locationForm.preferred}
                  onChange={(event) => {
                    setLocationForm((current) => ({ ...current, preferred: event.target.checked }));
                    setLocationError(null);
                  }}
                />
                <span>Set as preferred location</span>
              </label>

              <label className="flex items-center gap-2 text-[13px] text-[#4b5563]">
                <input
                  type="checkbox"
                  checked={locationForm.showMapPreview}
                  onChange={(event) => {
                    setLocationForm((current) => ({ ...current, showMapPreview: event.target.checked }));
                    setLocationError(null);
                  }}
                />
                <span>Show map preview</span>
              </label>

              {locationError ? <p className="text-[13px] text-[#d61c3f]">{locationError}</p> : null}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeLocationModal}
                className="inline-flex h-10 items-center rounded-full border border-[#d61c3f] px-5 text-[13px] font-semibold text-[#d61c3f]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveLocation}
                disabled={isSavingLocation}
                className="inline-flex h-10 items-center rounded-full bg-[#d61c3f] px-5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingLocation ? "Saving..." : locationMode === "edit" ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isDeleteLocationConfirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[440px] rounded-[16px] bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.28)]">
            <h3 className="text-[20px] font-bold text-[#20242b]">Delete Location</h3>
            <p className="mt-3 text-[14px] text-[#6b7280]">Are you sure you want to delete this location entry?</p>
            {locationError ? <p className="mt-3 text-[13px] text-[#d61c3f]">{locationError}</p> : null}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteLocationConfirm}
                className="inline-flex h-10 items-center rounded-full border border-[#d61c3f] px-5 text-[13px] font-semibold text-[#d61c3f]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteLocationConfirm}
                disabled={isSavingLocation}
                className="inline-flex h-10 items-center rounded-full bg-[#d61c3f] px-5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingLocation ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}


    </TutorShell>
  );
}







































































