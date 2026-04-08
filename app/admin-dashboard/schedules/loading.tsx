import { AdminShell } from "@/components/admin/admin-shell";

function SummaryCardStatic({ title }: { title: string }) {
  return (
    <article className="rounded-[14px] border border-[#e7e7eb] bg-white p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6b7280]">{title}</p>
      <div className="mt-3 h-12 w-16 rounded bg-[#eef1f4]" />
      <div className="mt-2 h-5 w-28 rounded bg-[#eef1f4]" />
      <div className="mt-2 h-4 w-24 rounded bg-[#f1f3f6]" />
    </article>
  );
}

function ScheduleTableSkeleton() {
  return (
    <div className="divide-y divide-[#eceef2]">
      {Array.from({ length: 6 }).map((_, rowIndex) => (
        <div
          key={`schedule-loading-row-${rowIndex}`}
          className="grid grid-cols-[0.95fr_1.5fr_1.2fr_1fr_1.2fr_0.9fr_0.8fr_0.9fr_0.7fr_0.6fr] gap-3 px-4 py-3 text-[13px] text-[#4b5563] animate-pulse"
        >
          <div className="flex items-center">
            <div className="h-4 w-24 rounded bg-[#eceef2]" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 shrink-0 rounded-full bg-[#eef1f4]" />
            <div className="h-4 w-36 rounded bg-[#eef1f4]" />
          </div>
          <div className="h-4 w-28 rounded bg-[#eceef2]" />
          <div className="h-4 w-24 rounded bg-[#eceef2]" />
          <div className="space-y-1.5">
            <div className="h-4 w-32 rounded bg-[#eceef2]" />
            <div className="h-3 w-24 rounded bg-[#f1f3f6]" />
          </div>
          <div className="h-4 w-16 rounded bg-[#eceef2]" />
          <div className="inline-flex h-6 w-16 rounded-full bg-[#eef1f4]" />
          <div className="inline-flex h-6 w-20 rounded-full bg-[#eef1f4]" />
          <div className="h-4 w-14 rounded bg-[#eceef2]" />
          <div className="inline-flex h-7 w-14 rounded-lg bg-[#eef1f4]" />
        </div>
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <AdminShell>
      <div className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-[38px] font-bold leading-none text-[#20242b]">Schedules</h1>
          <div className="inline-flex rounded-xl border border-[#e5e7eb] bg-white p-0.5">
            {(["All", "Today", "Week", "Month"] as const).map((item) => (
              <div
                key={item}
                className={`h-9 rounded-lg px-4 text-[13px] font-semibold leading-9 ${
                  item === "All" ? "bg-[#ffecef] text-[#d61c3f]" : "text-[#6b7280]"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <section className="mt-4 grid gap-3 lg:grid-cols-4">
          <SummaryCardStatic title="Sessions" />
          <SummaryCardStatic title="Upcoming" />
          <SummaryCardStatic title="Completed" />
          <SummaryCardStatic title="Cancelled" />
        </section>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {(["All", "Upcoming", "Requested", "Completed", "Cancelled"] as const).map((item) => (
              <div
                key={item}
                className={`inline-flex h-9 items-center rounded-full px-4 text-[13px] font-semibold ${
                  item === "All"
                    ? "border border-[#e24961] bg-[#ffecef] text-[#d61c3f]"
                    : "border border-[#e5e7eb] bg-[#f7f7f8] text-[#6b7280]"
                }`}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-white sm:w-[160px]" />
            <div className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-white sm:w-[130px]" />
          </div>
        </div>

        <section className="mt-3 overflow-hidden rounded-[14px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="overflow-x-auto">
            <div className="min-w-[1120px]">
              <div className="grid grid-cols-[0.95fr_1.5fr_1.2fr_1fr_1.2fr_0.9fr_0.8fr_0.9fr_0.7fr_0.6fr] gap-3 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
                <span>Session ID</span>
                <span>Student</span>
                <span>Tutor</span>
                <span>Subject</span>
                <span>Date & Time</span>
                <span>Duration</span>
                <span>Type</span>
                <span>Status</span>
                <span>FEE</span>
                <span> </span>
              </div>

              <ScheduleTableSkeleton />
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
