"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { setAdminPreviewRoleCookie, type AdminPreviewRole } from "@/lib/admin-preview";
import {
  ADMIN_DASHBOARD_ROUTE,
  PARENT_DASHBOARD_ROUTE,
  STUDENT_DASHBOARD_ROUTE,
  TUTOR_DASHBOARD_ROUTE,
} from "@/lib/routes";

const previewHrefByRole: Record<AdminPreviewRole, string> = {
  student: STUDENT_DASHBOARD_ROUTE,
  parent: PARENT_DASHBOARD_ROUTE,
  tutor: TUTOR_DASHBOARD_ROUTE,
};

function isPreviewRole(value: string | null): value is AdminPreviewRole {
  return value === "student" || value === "parent" || value === "tutor";
}

export default function AdminPreviewRoute() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const target = searchParams.get("target") || undefined;

  useEffect(() => {
    if (!isPreviewRole(role)) {
      window.location.replace(ADMIN_DASHBOARD_ROUTE);
      return;
    }

    setAdminPreviewRoleCookie(role, target);
    window.location.replace(previewHrefByRole[role]);
  }, [role, target]);

  return (
    <AdminShell>
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="flex items-center gap-3 rounded-full border border-[#eceef2] bg-white px-5 py-3 shadow-[0_18px_48px_rgba(15,23,42,0.12)]">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#f3c8d0] border-t-[#d61c3f]" />
          <span className="text-[14px] font-semibold text-[#20242b]">Opening preview...</span>
        </div>
      </div>
    </AdminShell>
  );
}
