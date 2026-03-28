"use client";

import { useState } from "react";
import { FiCheckCircle, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

import { TutorShell } from "@/components/tutor/tutor-shell";
import { tutorProfile } from "@/lib/tutor/profile-data";

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

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-semibold text-[#6b7280]">{label}</label>
      <div className="flex min-h-11 items-center rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 py-3 text-[14px] text-[#4b5563]">
        {value}
      </div>
    </div>
  );
}

function PersonalInfoSection() {
  return (
    <section className="rounded-[12px] bg-white p-5">
      <h3 className="text-[18px] font-bold text-[#20242b]">Personal Information</h3>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <ReadOnlyField label="First Name" value={tutorProfile.firstName} />
        <ReadOnlyField label="Last Name" value={tutorProfile.lastName} />
        <ReadOnlyField label="Email Address" value={tutorProfile.email} />
        <ReadOnlyField label="Phone Number" value={tutorProfile.phone} />
        <ReadOnlyField label="Date of Birth" value="" />
        <ReadOnlyField label="Gender" value="" />
        <div className="md:col-span-2">
          <ReadOnlyField label="Street Address" value={tutorProfile.streetAddress} />
        </div>
        <ReadOnlyField label="City" value={tutorProfile.city} />
        <ReadOnlyField label="State" value={tutorProfile.state} />
        <ReadOnlyField label="ZIP Code" value={tutorProfile.zipCode} />
        <ReadOnlyField label="Emergency Contact Name" value={tutorProfile.emergencyContactName} />
        <ReadOnlyField label="Emergency Contact Phone" value={tutorProfile.emergencyContactPhone} />
      </div>

      <div className="mt-6 flex items-center justify-between rounded-[12px] bg-[#f8faf8] px-4 py-4">
        <div className="flex items-start gap-3">
          <FiCheckCircle className="mt-0.5 h-5 w-5 text-[#64b486]" />
          <div>
            <p className="text-[14px] font-semibold text-[#20242b]">Background Check</p>
            <p className="text-[12px] text-[#6b7280]">{tutorProfile.backgroundCheck}</p>
          </div>
        </div>
        <span className="inline-flex rounded-full bg-[#dff2e5] px-3 py-1 text-[11px] font-semibold text-[#3d9b68]">
          Verified
        </span>
      </div>
    </section>
  );
}

function SimpleSection({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-[12px] bg-white p-5">
      <h3 className="text-[18px] font-bold text-[#20242b]">{title}</h3>
      <div className="mt-5">
        <ReadOnlyField label={title} value={value} />
      </div>
    </section>
  );
}

export function TutorProfilePage() {
  const [activeTab, setActiveTab] = useState<TutorProfileTab>("Personal Info");

  return (
    <TutorShell>
      <div className="w-full px-2 sm:px-3 lg:px-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">My Profile</h1>
          <button
            type="button"
            className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
          >
            Save Changes
          </button>
        </div>

        <div className="mt-5 grid gap-0 rounded-[12px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="border-b border-[#eceef2] p-4 xl:border-r xl:border-b-0">
            <div className="flex flex-col items-center border-b border-[#eceef2] pb-4 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#ffe7eb] text-[40px] font-bold text-[#d61c3f]">
                {tutorProfile.initials}
              </div>
              <h2 className="mt-5 text-[18px] font-bold text-[#20242b]">
                {tutorProfile.firstName} {tutorProfile.lastName}
              </h2>
              <p className="text-[14px] text-[#6b7280]">{tutorProfile.title}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex rounded-full bg-[#dff2e5] px-3 py-1 text-[11px] font-semibold text-[#3d9b68]">
                  {tutorProfile.status}
                </span>
                <span className="text-[12px] text-[#6b7280]">{tutorProfile.since}</span>
              </div>
            </div>

            <div className="space-y-3 border-b border-[#eceef2] py-4 text-[13px] text-[#4b5563]">
              <div className="flex items-center gap-2">
                <FiMail className="h-4 w-4 text-[#6b7280]" />
                <span>{tutorProfile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="h-4 w-4 text-[#6b7280]" />
                <span>{tutorProfile.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="h-4 w-4 text-[#6b7280]" />
                <span>{tutorProfile.location}</span>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">Quick Stats</p>
              <div className="mt-3 space-y-2 text-[14px]">
                {[
                  { label: "Total Sessions", value: tutorProfile.totalSessions, valueClassName: "text-[#20242b]" },
                  { label: "Avg Rating", value: `${tutorProfile.avgRating} ★`, valueClassName: "text-[#20242b]" },
                  { label: "Active Students", value: tutorProfile.activeStudents, valueClassName: "text-[#20242b]" },
                  { label: "All-Time Earnings", value: tutorProfile.allTimeEarnings, valueClassName: "text-[#1b8a5a]" },
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
              {activeTab === "Personal Info" ? <PersonalInfoSection /> : null}
              {activeTab === "Bio & School District" ? (
                <SimpleSection
                  title="Bio & School District"
                  value={`${tutorProfile.bio} ${tutorProfile.schoolDistrict}`}
                />
              ) : null}
              {activeTab === "Education" ? (
                <SimpleSection title="Education" value={tutorProfile.education} />
              ) : null}
              {activeTab === "Work Experience" ? (
                <SimpleSection title="Work Experience" value={tutorProfile.workExperience} />
              ) : null}
              {activeTab === "Subjects & Grades" ? (
                <SimpleSection title="Subjects & Grades" value={tutorProfile.subjectsAndGrades} />
              ) : null}
              {activeTab === "Rates" ? <SimpleSection title="Rates" value={tutorProfile.rates} /> : null}
              {activeTab === "Preferences" ? (
                <SimpleSection title="Preferences" value={tutorProfile.preferences} />
              ) : null}
              {activeTab === "Location" ? (
                <SimpleSection title="Location" value={tutorProfile.locationPreference} />
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
                  className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
                >
                  Save Personal Info
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </TutorShell>
  );
}
