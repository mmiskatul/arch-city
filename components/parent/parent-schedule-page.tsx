import Link from "next/link";

import { ParentShell } from "@/components/parent/parent-shell";
import {
  parentScheduleSummary,
  parentSessionHistoryItems,
} from "@/lib/parent/schedule-data";
import { PARENT_SCHEDULE_ROUTE } from "@/lib/routes";

function SummaryCard({
  title,
  value,
  subtitle,
  badge,
  iconClassName,
}: {
  title: string;
  value: string;
  subtitle: string;
  badge: string;
  iconClassName: string;
}) {
  return (
    <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6b7280]">{title}</p>
          <p className="mt-4 text-[22px] font-bold text-[#20242b]">{value}</p>
          <p className="mt-1 text-[14px] text-[#6b7280]">{subtitle}</p>
        </div>
        <span className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[10px] font-bold ${iconClassName}`}>
          {badge}
        </span>
      </div>
    </article>
  );
}

export function ParentSchedulePage() {
  return (
    <ParentShell>
      <div className="w-full">
        <div className="border-b border-[#eceef2] bg-white px-4 py-4 sm:px-5 lg:px-6">
          <h1 className="text-[18px] font-bold text-[#20242b] sm:text-[22px]">Session History</h1>
        </div>

        <div className="bg-white px-4 py-5 sm:px-5 lg:px-6">
          <section className="grid gap-3 lg:grid-cols-3">
            <SummaryCard
              title="Total Sessions"
              value={String(parentScheduleSummary.totalSessions)}
              subtitle="All time"
              badge=""
              iconClassName="bg-[#ffecef] text-[#d61c3f]"
            />
            <SummaryCard
              title="Jordan's Sessions"
              value={String(parentScheduleSummary.jordanSessions)}
              subtitle="With Marcus T."
              badge="JW"
              iconClassName="bg-[#ebf7ef] text-[#d61c3f]"
            />
            <SummaryCard
              title="Maya's Sessions"
              value={String(parentScheduleSummary.mayaSessions)}
              subtitle="With Dr. Patel"
              badge="MW"
              iconClassName="bg-[#fff5d9] text-[#d61c3f]"
            />
          </section>

          <section className="mt-5 flex items-center justify-between gap-4">
            <div className="h-8 w-full max-w-[170px] rounded-lg border border-[#e5e7eb] bg-[#fafafa]" />
            <div className="flex items-center gap-3">
              <div className="h-8 w-[128px] rounded-lg border border-[#e5e7eb] bg-[#fafafa]" />
              <span className="text-[14px] font-medium text-[#6b7280]">to</span>
              <div className="h-8 w-[128px] rounded-lg border border-[#e5e7eb] bg-[#fafafa]" />
            </div>
          </section>

          <section className="mt-3 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="hidden grid-cols-[1fr_1fr_0.9fr_1.1fr_0.8fr_0.8fr_0.8fr_0.9fr_0.7fr] gap-4 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280] md:grid">
              <span>Student</span>
              <span>Tutor</span>
              <span>Date</span>
              <span>Subject</span>
              <span>Duration</span>
              <span>Type</span>
              <span>Rate</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-[#eceef2]">
              {parentSessionHistoryItems.map((session) => (
                <div
                  key={session.id}
                  className="grid gap-4 px-4 py-4 md:grid-cols-[1fr_1fr_0.9fr_1.1fr_0.8fr_0.8fr_0.8fr_0.9fr_0.7fr] md:items-center"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffe7eb] text-[10px] font-bold text-[#d94a62]">
                      {session.studentInitials}
                    </span>
                    <span className="text-[14px] font-medium text-[#374151]">{session.studentName}</span>
                  </div>
                  <div className="text-[14px] text-[#4b5563]">{session.tutorName}</div>
                  <div className="text-[14px] text-[#4b5563]">{session.date}</div>
                  <div className="text-[14px] text-[#4b5563]">{session.subject}</div>
                  <div className="text-[14px] text-[#4b5563]">{session.duration}</div>
                  <div>
                    <span className="inline-flex rounded-full bg-[#ffecef] px-2.5 py-1 text-[11px] font-medium text-[#d94a62]">
                      {session.type}
                    </span>
                  </div>
                  <div className="text-[16px] font-bold text-[#1b8a5a]">{session.rate}</div>
                  <div>
                    <span className="inline-flex rounded-full bg-[#daf2e8] px-2.5 py-1 text-[11px] font-medium text-[#33976d]">
                      {session.status}
                    </span>
                  </div>
                  <div>
                    <Link
                      href={`${PARENT_SCHEDULE_ROUTE}/${session.id}`}
                      className="text-[14px] font-semibold text-[#d61c3f] transition hover:text-[#be1837]"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </ParentShell>
  );
}
