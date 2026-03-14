"use client";

import { useMemo, useState } from "react";
import { FiDownload, FiEye } from "react-icons/fi";

import type { UserListRow, UserSourceStat } from "@/lib/admin/users-data";

type Props = {
  sources: UserSourceStat[];
  users: UserListRow[];
};

const typeFilters: UserListRow["type"][] = ["Student", "Parent", "Tutor"];

export function AdminUsersPage({ sources, users }: Props) {
  const [selectedType, setSelectedType] = useState<UserListRow["type"]>("Student");
  const [statusFilter, setStatusFilter] = useState<"All" | "Subscribed">("All");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesType = user.type === selectedType;
      const matchesStatus = statusFilter === "All" ? true : user.status === "Subscribed";
      return matchesType && matchesStatus;
    });
  }, [users, selectedType, statusFilter]);

  return (
    <div>
      <div className="mt-12">
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#111827]">Users</h1>
        <p className="mt-2 text-lg text-[#6b7280]">Here you can view and manage all users:</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sources.map((source) => {
          const barWidth = Math.min(Math.max(source.percent, 0), 100);
          return (
            <article
              key={source.label}
              className="rounded-[24px] border border-[#ececec] bg-white p-6 shadow-[0_4px_18px_rgba(15,23,42,0.04)]"
            >
              <p className="text-[18px] font-semibold text-[#111827]">{source.label}</p>
              <div className="mt-5 h-3 rounded-full bg-[#f1f2f5]">
                <div
                  className="h-full rounded-full bg-[#ef242a] transition-width"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-[#374151]">
                {`${source.percent.toFixed(2)}%`}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {typeFilters.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setSelectedType(type)}
            className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
              selectedType === type
                ? "bg-[#ef242a] text-white"
                : "border border-[#d6d8df] text-[#374151] hover:border-[#ef242a] hover:text-[#111827]"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-3">
        {["All", "Subscribed"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setStatusFilter(option as "All" | "Subscribed")}
            className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
              statusFilter === option
                ? "bg-[#ef242a] text-white"
                : "border border-[#d6d8df] text-[#374151] hover:border-[#ef242a] hover:text-[#111827]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-[28px] border border-[#ececec] bg-white shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#f0f0f0] bg-[#f8f8f9] text-sm font-semibold text-[#6b7280]">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Heard from</th>
              <th className="px-6 py-4">Wants to receive texts</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f4f6]">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="bg-white">
                <td className="px-6 py-5 text-lg font-medium text-[#111827]">{user.name}</td>
                <td className="px-6 py-5 text-sm font-medium text-[#6b7280]">{user.heardFrom}</td>
                <td className={`px-6 py-5 text-sm ${user.wantsTexts ? "text-[#16a34a]" : "text-[#6b7280]"}`}>
                  {user.wantsTexts ? "Yes" : "No"}
                </td>
                <td className={`px-6 py-5 text-sm font-semibold ${user.status === "Subscribed" ? "text-[#16a34a]" : "text-[#6b7280]"}`}>
                  {user.status}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button className="rounded-full bg-[#16a34a] px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_10px_rgba(22,163,74,0.35)]">
                      Log in
                    </button>
                    <button className="rounded-full bg-[#dc2626] px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_10px_rgba(220,38,38,0.35)]">
                      Block
                    </button>
                    <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ececec] text-[#8f949e] transition hover:border-[#ef242a] hover:text-[#111827]">
                      <FiDownload className="h-5 w-5" />
                    </button>
                    <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ececec] text-[#8f949e] transition hover:border-[#ef242a] hover:text-[#111827]">
                      <FiEye className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
