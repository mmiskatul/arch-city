import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";

import { ParentShell } from "@/components/parent/parent-shell";
import type { ParentStudentRecord } from "@/lib/parent/students-data";
import { PARENT_STUDENTS_ROUTE } from "@/lib/routes";

export function ParentStudentEditPage({
  student,
}: {
  student: ParentStudentRecord;
}) {
  const [firstName = "", lastName = ""] = student.name.split(" ");

  return (
    <ParentShell>
      <div className="w-full">
        <div className="flex items-center gap-4 border-b border-[#eceef2] bg-white px-4 py-4 sm:px-5 lg:px-6">
          <Link
            href={PARENT_STUDENTS_ROUTE}
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#6b7280]"
          >
            <FiChevronLeft className="h-4 w-4" />
            Back to Students
          </Link>
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Edit Student</h1>
        </div>

        <div className="bg-white px-4 py-5 sm:px-5 lg:px-6">
          <div className="max-w-[760px] rounded-[18px] border border-[#e7e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-[18px] font-bold text-[#20242b]">Student Information</h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#374151]">First Name</label>
                <input
                  type="text"
                  defaultValue={firstName}
                  className="h-11 w-full rounded-xl border border-[#e5e7eb] px-4 text-[14px] outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#374151]">Last Name</label>
                <input
                  type="text"
                  defaultValue={lastName}
                  className="h-11 w-full rounded-xl border border-[#e5e7eb] px-4 text-[14px] outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#374151]">Grade</label>
                <input
                  type="text"
                  defaultValue={student.grade}
                  className="h-11 w-full rounded-xl border border-[#e5e7eb] px-4 text-[14px] outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#374151]">School Name</label>
                <input
                  type="text"
                  defaultValue={student.school}
                  className="h-11 w-full rounded-xl border border-[#e5e7eb] px-4 text-[14px] outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-[14px] font-medium text-[#374151]">
                Focus Areas / Notes
              </label>
              <input
                type="text"
                defaultValue={student.focusAreas.join(", ")}
                className="h-11 w-full rounded-xl border border-[#e5e7eb] px-4 text-[14px] outline-none"
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <Link
                href={PARENT_STUDENTS_ROUTE}
                className="inline-flex h-10 items-center rounded-full border border-[#d61c3f] px-5 text-[14px] font-semibold text-[#d61c3f] transition hover:bg-[#fff4f6]"
              >
                Cancel
              </Link>
              <button
                type="button"
                className="inline-flex h-10 items-center rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </ParentShell>
  );
}
