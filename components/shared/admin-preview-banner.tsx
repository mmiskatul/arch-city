"use client";

import Link from "next/link";

import { clearAdminPreviewRoleCookie } from "@/lib/admin-preview";
import { ADMIN_DASHBOARD_ROUTE } from "@/lib/routes";

export function AdminPreviewBanner({ label }: { label: string }) {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-[14px] border border-[#f3d3da] bg-[#fff4f6] px-4 py-3 text-[#5f1f2c] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#d61c3f]">Admin Preview Mode</p>
        <p className="mt-1 text-[13px] text-[#5b6270]">You are previewing the {label} dashboard as an admin.</p>
      </div>

      <Link
        href={ADMIN_DASHBOARD_ROUTE}
        onClick={() => clearAdminPreviewRoleCookie()}
        className="inline-flex h-10 items-center justify-center rounded-full bg-[#d61c3f] px-4 text-[13px] font-semibold text-white transition hover:bg-[#be1837]"
      >
        Back to Admin
      </Link>
    </div>
  );
}
