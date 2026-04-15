"use client";

import Link from "next/link";

import type { AdminPreviewRole } from "@/lib/admin-preview";
import { setAdminPreviewRoleCookie } from "@/lib/admin-preview";
import { ADMIN_PREVIEW_ROUTE } from "@/lib/routes";

export function AdminPreviewAction({
  role,
  targetId,
  label = "Preview",
  className,
}: {
  role: AdminPreviewRole;
  targetId?: string;
  label?: string;
  className?: string;
}) {
  return (
    <Link
      href={`${ADMIN_PREVIEW_ROUTE}?role=${encodeURIComponent(role)}${targetId ? `&target=${encodeURIComponent(targetId)}` : ""}`}
      onClick={() => setAdminPreviewRoleCookie(role, targetId)}
      className={
        className ||
        "inline-flex h-7 items-center rounded-lg border border-[#d61c3f] bg-[#fff4f6] px-3 text-[12px] font-semibold text-[#d61c3f]"
      }
    >
      {label}
    </Link>
  );
}
