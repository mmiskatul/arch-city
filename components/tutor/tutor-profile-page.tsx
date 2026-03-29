"use client";

import { useState } from "react";
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

export function TutorProfilePage() {
  const [activeTab, setActiveTab] = useState<TutorProfileTab>("Personal Info");
  const [bio, setBio] = useState("");
  const [schoolDistrict, setSchoolDistrict] = useState("Kirkwood School District");
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
                        Optional — Enter if you currently teach in a school district.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 rounded-[12px] border border-[#f3cfd6] bg-[#fff7f8] px-4 py-4 text-[13px] text-[#6b7280]">
                      <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#e25b70]" />
                      <p>
                        Your school district is only shown on your profile if you have entered it.
                        Leave blank to hide it.
                      </p>
                    </div>
                  </div>
                </section>
              ) : null}
              {activeTab === "Education" ? (
                <section className="rounded-[12px] bg-white p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-[18px] font-bold text-[#20242b]">Education</h3>
                    <button
                      type="button"
                      className="inline-flex h-10 items-center gap-2 rounded-full bg-[#d61c3f] px-4 text-[13px] font-semibold text-white"
                    >
                      <FiPlus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    {tutorEducationEntries.map((entry, index) => (
                      <div
                        key={entry.id}
                        className="flex items-start justify-between gap-4 rounded-[16px] border border-[#eceef2] bg-white px-4 py-5 shadow-[0_4px_14px_rgba(15,23,42,0.05)]"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffe7eb] text-[#d61c3f]">
                            <span className="text-[16px] font-bold">{index === 0 ? "✏" : "▣"}</span>
                          </div>
                          <div>
                            <p className="text-[16px] font-bold leading-6 text-[#20242b]">{entry.title}</p>
                            <p className="text-[14px] text-[#6b7280]">{entry.organization}</p>
                            <p className="text-[14px] text-[#6b7280]">{entry.period}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-[#9ca3af]">
                          <button type="button" aria-label="Edit education entry">
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button type="button" aria-label="Delete education entry">
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
                      className="inline-flex h-10 items-center gap-2 rounded-full bg-[#d61c3f] px-4 text-[13px] font-semibold text-white"
                    >
                      <FiPlus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    {tutorWorkExperienceEntries.map((entry) => (
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
                            <p className="text-[14px] text-[#6b7280]">{entry.period}</p>
                            <p className="mt-2 text-[14px] leading-7 text-[#4b5563]">{entry.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-[#9ca3af]">
                          <button type="button" aria-label="Edit work experience entry">
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button type="button" aria-label="Delete work experience entry">
                            <FiTrash2 className="h-4 w-4 text-[#f08a9c]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
              {activeTab === "Subjects & Grades" ? (
                <section className="rounded-[12px] bg-white p-5">
                  <h3 className="text-[18px] font-bold text-[#20242b]">Subjects & Grades</h3>

                  <div className="mt-6">
                    <p className="text-[16px] font-semibold text-[#20242b]">Subjects You Teach</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {subjectOptions.map((subject) => {
                        const active = selectedSubjects.includes(subject);

                        return (
                          <button
                            key={subject}
                            type="button"
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
                    <div className="mt-4 flex flex-wrap gap-2">
                      {gradeOptions.map((grade) => {
                        const active = selectedGrades.includes(grade);

                        return (
                          <button
                            key={grade}
                            type="button"
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
                </section>
              ) : null}
              {activeTab === "Rates" ? (
                <section className="rounded-[12px] bg-white p-5">
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
                            onChange={(event) => setVirtual45Rate(event.target.value)}
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
                            onChange={(event) => setVirtual60Rate(event.target.value)}
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
                            onChange={(event) => setInPerson45Rate(event.target.value)}
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
                            onChange={(event) => setInPerson60Rate(event.target.value)}
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
                  </div>
                </section>
              ) : null}
              {activeTab === "Preferences" ? (
                <section className="rounded-[12px] bg-white p-5">
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
                            onToggle: () => setIsClassroomTeacher((current) => !current),
                          },
                          {
                            title: "Offer virtual tutoring",
                            description: "Available for video sessions",
                            enabled: offersVirtual,
                            onToggle: () => setOffersVirtual((current) => !current),
                          },
                          {
                            title: "Offer in-person tutoring",
                            description: "Meet at a physical location",
                            enabled: offersInPerson,
                            onToggle: () => setOffersInPerson((current) => !current),
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
                              onClick={() => setAdvanceNotice(option.label)}
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
                                •
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
                            onClick={() => setMaxSessionsPerDay((current) => Math.max(1, current - 1))}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e5e7eb] text-[#6b7280]"
                          >
                            -
                          </button>
                          <span className="w-4 text-center text-[18px] font-bold text-[#20242b]">
                            {maxSessionsPerDay}
                          </span>
                          <button
                            type="button"
                            onClick={() => setMaxSessionsPerDay((current) => current + 1)}
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
                            Hides your profile from student searches. No need to re-register —
                            just toggle back on when ready.
                          </p>
                        </div>
                        <Toggle enabled={pauseAccount} onToggle={() => setPauseAccount((current) => !current)} />
                      </div>
                    </div>
                  </div>
                </section>
              ) : null}
              {activeTab === "Location" ? (
                <section className="rounded-[12px] bg-white p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-[18px] font-bold text-[#20242b]">Location</h3>
                    <button
                      type="button"
                      className="inline-flex h-10 items-center gap-2 rounded-full bg-[#d61c3f] px-4 text-[13px] font-semibold text-white"
                    >
                      <FiPlus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="mt-5 max-w-[520px] space-y-4">
                    {tutorLocationEntries.map((entry) => (
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
                              <p className="text-[13px] text-[#6b7280]">{entry.addressLine1}</p>
                              <p className="text-[13px] text-[#6b7280]">{entry.addressLine2}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-[#9ca3af]">
                            <button type="button" aria-label="Edit location entry">
                              <FiEdit2 className="h-4 w-4" />
                            </button>
                            <button type="button" aria-label="Delete location entry">
                              <FiTrash2 className="h-4 w-4 text-[#f08a9c]" />
                            </button>
                          </div>
                        </div>

                        {entry.showMapPreview ? (
                          <div className="mt-4 rounded-[12px] bg-[#eceef2] px-4 py-8 text-center text-[13px] text-[#6b7280]">
                            <span className="inline-flex items-center gap-2">
                              <FiMapPin className="h-4 w-4" />
                              <span>Map Preview</span>
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="mt-4 text-[12px] font-semibold text-[#d61c3f]"
                          >
                            Set as preferred
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
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
                  className="inline-flex h-11 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
                >
                  {activeTab === "Bio & School District" ||
                  activeTab === "Subjects & Grades" ||
                  activeTab === "Preferences" ||
                  activeTab === "Rates"
                    ? "Save"
                    : "Save Personal Info"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </TutorShell>
  );
}
