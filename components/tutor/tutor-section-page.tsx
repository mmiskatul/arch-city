import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import { TutorShell } from "@/components/tutor/tutor-shell";
import { TUTOR_DASHBOARD_ROUTE } from "@/lib/routes";

type TutorSectionPageProps = {
  title: string;
  description: string;
};

export function TutorSectionPage({ title, description }: TutorSectionPageProps) {
  return (
    <TutorShell>
      <div className="w-full">
        <div className="rounded-[16px] border border-[#eceef2] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9ca3af]">
            Tutor Portal
          </p>
          <h1 className="mt-3 text-[24px] font-bold text-[#20242b]">{title}</h1>
          <p className="mt-2 max-w-2xl text-[14px] leading-7 text-[#6b7280]">{description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={TUTOR_DASHBOARD_ROUTE}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#d61c3f] px-5 text-[14px] font-semibold text-white transition hover:bg-[#be1837]"
            >
              Back to dashboard
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </TutorShell>
  );
}
