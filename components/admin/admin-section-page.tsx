import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

import { AdminShell } from "@/components/admin/admin-shell";
import { ADMIN_DASHBOARD_ROUTE } from "@/lib/routes";

type AdminSectionPageProps = {
  title: string;
  description: string;
};

export function AdminSectionPage({ title, description }: AdminSectionPageProps) {
  return (
    <AdminShell>
      <div className="w-full">
        <div className="rounded-[16px] border border-[#e7e7eb] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9ca3af]">
            Admin Portal
          </p>
          <h1 className="mt-3 text-[24px] font-bold text-[#20242b]">{title}</h1>
          <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#6b7280]">{description}</p>

          <div className="mt-6">
            <Link
              href={ADMIN_DASHBOARD_ROUTE}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[#d1d5db] bg-white px-5 text-[14px] font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
