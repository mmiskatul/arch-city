import { StudentShell } from "@/components/student/student-shell";

export default function Loading() {
  return (
    <StudentShell>
      <div className="w-full">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="h-7 w-40 animate-pulse rounded bg-[#eef1f4]" />
            <div className="h-4 w-32 animate-pulse rounded bg-[#eef1f4]" />
          </div>

          <div className="h-11 w-36 animate-pulse rounded-full bg-[#eef1f4]" />
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-lg bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="mt-0.5 h-4 w-4 shrink-0 animate-pulse rounded-full bg-[#eef1f4]" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 animate-pulse rounded bg-[#eef1f4]" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-[#eef1f4]" />
          </div>
        </div>

        <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <article
              key={`student-dashboard-summary-skeleton-${index}`}
              className="rounded-[12px] border border-[#e7e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-3 w-20 animate-pulse rounded bg-[#eef1f4]" />
                  <div className="h-6 w-12 animate-pulse rounded bg-[#eef1f4]" />
                  <div className="h-3 w-24 animate-pulse rounded bg-[#eef1f4]" />
                  <div className="h-3 w-16 animate-pulse rounded bg-[#eef1f4]" />
                </div>
                <div className="h-8 w-8 animate-pulse rounded-lg bg-[#eef1f4]" />
              </div>
            </article>
          ))}
        </section>

        <section className="mt-5">
          <div className="flex items-center justify-between gap-4">
            <div className="h-6 w-40 animate-pulse rounded bg-[#eef1f4]" />
            <div className="h-4 w-24 animate-pulse rounded bg-[#eef1f4]" />
          </div>

          <div className="mt-3 overflow-x-auto rounded-[12px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="min-w-[820px]">
              <div className="grid grid-cols-[1.6fr_0.9fr_0.7fr_0.7fr_0.8fr_0.9fr_1fr] gap-4 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={`student-dashboard-head-skeleton-${index}`} className="h-3 animate-pulse rounded bg-[#eef1f4]" />
                ))}
              </div>

              <div className="divide-y divide-[#eceef2]">
                {Array.from({ length: 3 }).map((_, rowIndex) => (
                  <div
                    key={`student-dashboard-row-skeleton-${rowIndex}`}
                    className="grid grid-cols-[1.6fr_0.9fr_0.7fr_0.7fr_0.8fr_0.9fr_1fr] items-center gap-4 px-4 py-4"
                  >
                    <div className="contents animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#eef1f4]" />
                        <div className="space-y-2">
                          <div className="h-4 w-24 rounded bg-[#eef1f4]" />
                          <div className="h-3 w-16 rounded bg-[#eef1f4]" />
                        </div>
                      </div>
                      <div className="h-4 w-20 rounded bg-[#eef1f4]" />
                      <div className="h-4 w-16 rounded bg-[#eef1f4]" />
                      <div className="h-4 w-14 rounded bg-[#eef1f4]" />
                      <div className="h-6 w-16 rounded-full bg-[#eef1f4]" />
                      <div className="h-6 w-[76px] rounded-full bg-[#eef1f4]" />
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-16 rounded-full bg-[#eef1f4]" />
                        <div className="h-4 w-12 rounded bg-[#eef1f4]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </StudentShell>
  );
}
