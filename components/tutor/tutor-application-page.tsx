"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";

import { TutorShell } from "@/components/tutor/tutor-shell";

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-[#eceef2] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <h2 className="text-[18px] font-bold text-[#20242b]">{title}</h2>
      <div className="mt-4 border-t border-[#eceef2] pt-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-semibold text-[#4b5563]">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-4 text-[14px] outline-none placeholder:text-[#b4bcc8]"
      />
    </div>
  );
}

function YesNoField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: "yes" | "no";
  onChange: (value: "yes" | "no") => void;
}) {
  return (
    <div>
      <p className="mb-3 text-[13px] font-semibold text-[#4b5563]">{label}</p>
      <div className="flex items-center gap-5 text-[14px] text-[#4b5563]">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={label}
            checked={value === "yes"}
            onChange={() => onChange("yes")}
          />
          <span>Yes</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={label}
            checked={value === "no"}
            onChange={() => onChange("no")}
          />
          <span>No</span>
        </label>
      </div>
    </div>
  );
}

export function TutorApplicationPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobilePhone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    degree: "",
    certification: "",
    tutoringMode: "",
    inPersonLocation: "",
    remoteTools: "",
    tutoringDaysPerMonth: "",
    gradeLevels: "",
    subjects: "",
    teachingApproach: "",
    engagementMethods: "",
    sessionStructure: "",
    customizationApproach: "",
    ssn: "",
  });
  const [hasOffenses, setHasOffenses] = useState<"yes" | "no">("no");
  const [isCertified, setIsCertified] = useState<"yes" | "no">("no");
  const [isEmployedTeacher, setIsEmployedTeacher] = useState<"yes" | "no">("no");
  const [isWorkingTowardExtraCerts, setIsWorkingTowardExtraCerts] = useState<"yes" | "no">("no");
  const [approved, setApproved] = useState(false);

  function updateField(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <TutorShell>
      <div className="w-full">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[#20242b] sm:text-[24px]">Apply as a Tutor</h1>
            <p className="mt-2 text-[15px] text-[#6b7280]">Fill out the form below to apply to become a tutor:</p>
          </div>

          <button
            type="button"
            disabled={!approved}
            className={`inline-flex h-11 items-center gap-2 rounded-xl px-5 text-[14px] font-semibold ${
              approved
                ? "bg-[#d61c3f] text-white"
                : "bg-[#d9dde5] text-white"
            }`}
          >
            Submit
            <FiArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <div className="space-y-4">
            <SectionCard title="Tutor Profile">
              <div className="grid gap-4">
                <Field label="First name" placeholder="Enter your first name" value={form.firstName} onChange={(value) => updateField("firstName", value)} />
                <Field label="Last name" placeholder="Enter your last name" value={form.lastName} onChange={(value) => updateField("lastName", value)} />
                <Field label="Email address" placeholder="Enter your email address" value={form.email} onChange={(value) => updateField("email", value)} />
                <YesNoField
                  label="Have you ever been convicted of any sexual or criminal offenses?"
                  value={hasOffenses}
                  onChange={setHasOffenses}
                />
              </div>
            </SectionCard>

            <SectionCard title="Teaching Experience">
              <div className="grid gap-6">
                <YesNoField
                  label="Are you a certified teacher in the state of Missouri?"
                  value={isCertified}
                  onChange={setIsCertified}
                />
                <YesNoField
                  label="Are you currently employed as a teacher?"
                  value={isEmployedTeacher}
                  onChange={setIsEmployedTeacher}
                />
              </div>
            </SectionCard>

            <SectionCard title="Tutoring Preferences">
              <div className="grid gap-4">
                <Field label="Do you prefer to tutor in-person or remotely?" placeholder="Please enter..." value={form.tutoringMode} onChange={(value) => updateField("tutoringMode", value)} />
                <Field label="If you prefer tutoring in-person, where do you prefer meeting students?" placeholder="Please enter..." value={form.inPersonLocation} onChange={(value) => updateField("inPersonLocation", value)} />
                <Field label="If you prefer tutoring remotely, do you have a video conference subscription (i.e., Zoom, WebEx, Microsoft Teams, GoToMeeting)" placeholder="Please enter..." value={form.remoteTools} onChange={(value) => updateField("remoteTools", value)} />
                <Field label="Generally speaking, how many days per month do you plan to tutor?" placeholder="Please enter..." value={form.tutoringDaysPerMonth} onChange={(value) => updateField("tutoringDaysPerMonth", value)} />
              </div>
            </SectionCard>

            <SectionCard title="Tutoring Sessions">
              <div className="grid gap-4">
                <Field label="What grade level(s) will you provide tutoring services for?" placeholder="Please enter..." value={form.gradeLevels} onChange={(value) => updateField("gradeLevels", value)} />
                <Field label="What subjects will you provide tutoring services for?" placeholder="Please enter..." value={form.subjects} onChange={(value) => updateField("subjects", value)} />
                <Field label="How do you approach tutoring and adapting to different learning/teaching styles?" placeholder="Please enter..." value={form.teachingApproach} onChange={(value) => updateField("teachingApproach", value)} />
                <Field label="What methods do you use to make lessons engaging and effective?" placeholder="Please enter..." value={form.engagementMethods} onChange={(value) => updateField("engagementMethods", value)} />
                <Field label="How will you plan and structure tutoring sessions?" placeholder="Please enter..." value={form.sessionStructure} onChange={(value) => updateField("sessionStructure", value)} />
                <Field label="How will you customize a lesson to fit a student's specific needs and learning style?" placeholder="Please enter..." value={form.customizationApproach} onChange={(value) => updateField("customizationApproach", value)} />
              </div>
            </SectionCard>
          </div>

          <div className="space-y-4">
            <SectionCard title="Tutor Contact Information">
              <div className="grid gap-4">
                <Field label="Mobile phone number" placeholder="Enter your mobile phone number" value={form.mobilePhone} onChange={(value) => updateField("mobilePhone", value)} />
                <Field label="Address" placeholder="Enter your address" value={form.address} onChange={(value) => updateField("address", value)} />
                <Field label="City" placeholder="Enter your city" value={form.city} onChange={(value) => updateField("city", value)} />
                <Field label="State" placeholder="Enter your state" value={form.state} onChange={(value) => updateField("state", value)} />
                <Field label="Postal code" placeholder="Enter your postal code" value={form.postalCode} onChange={(value) => updateField("postalCode", value)} />
              </div>
            </SectionCard>

            <SectionCard title="Qualifications and Expertise">
              <div className="grid gap-4">
                <Field label="What degree(s) do you currently hold?" placeholder="Please enter..." value={form.degree} onChange={(value) => updateField("degree", value)} />
                <Field label="What certification(s) do you currently hold?" placeholder="Please enter..." value={form.certification} onChange={(value) => updateField("certification", value)} />
                <YesNoField
                  label="Are you currently working towards any additional degree(s)/certification(s)?"
                  value={isWorkingTowardExtraCerts}
                  onChange={setIsWorkingTowardExtraCerts}
                />
              </div>
            </SectionCard>

            <SectionCard title="Legal Information">
              <div className="grid gap-4">
                <Field label="Social security number (optional)" placeholder="XXX-XX-XXXX" value={form.ssn} onChange={(value) => updateField("ssn", value)} />

                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-[#4b5563]">
                    State or federally issued identification (required)
                  </label>
                  <input
                    type="file"
                    className="block w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-4 py-3 text-[14px] text-[#4b5563] file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-2 file:text-[13px] file:font-medium"
                  />
                </div>

                <div className="text-[14px] leading-7 text-[#20242b]">
                  <p>
                    <span className="font-bold text-[#d61c3f]">***</span> I hereby authorize STL Tutoring Solutions, LLC d/b/a Arch City Tutors (&quot;Arch City&quot;) to investigate my background and qualifications for purposes of evaluating me for the membership for which I am applying. I understand, and I specifically authorize such an investigation by information services and outside entities, at any time and from time to time, including, without limitation, consumer or credit report requests, investigation into any criminal convictions and/or investigations and any inquiry appropriate and/or necessary in Arch City&apos;s discretion to verify or confirm the information I have provided. I also understand that I may withhold my permission, but in that case, no such investigation will be done, and my application for membership will not be processed further, and the same shall be deemed rejected by Arch City.
                  </p>
                </div>

                <label className="flex items-center gap-3 text-[14px] text-[#20242b]">
                  <input
                    type="checkbox"
                    checked={approved}
                    onChange={(event) => setApproved(event.target.checked)}
                  />
                  <span>I approve</span>
                </label>

                <p className="text-[13px] text-[#6b7280]">
                  You can submit your application by scrolling to the top of the page and clicking
                  &quot;Submit&quot;
                </p>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </TutorShell>
  );
}
