import { StudentShell } from "@/components/student/student-shell";

export default function Loading() {
  return (
    <StudentShell>
      <div className="w-full">
        <h1 className="pb-5 text-[18px] font-bold text-[#20242b] sm:text-[22px]">Messages</h1>

        <div className="grid min-h-[720px] border-y border-[#e7e7eb] bg-white xl:grid-cols-[360px_minmax(0,1fr)] xl:border">
          <aside className="border-b border-[#eceef2] xl:border-r xl:border-b-0">
            <div className="p-4">
              <div className="h-11 w-full animate-pulse rounded-xl border border-[#e5e7eb] bg-[#fafafa]" />
            </div>

            <div className="space-y-3 px-4 py-1">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={`student-messages-route-thread-skeleton-${index}`} className="animate-pulse rounded-xl border border-[#eef1f4] px-3 py-4">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#eef1f4]" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-4 w-32 rounded bg-[#eef1f4]" />
                      <div className="h-3 w-40 rounded bg-[#eef1f4]" />
                      <div className="h-3 w-24 rounded bg-[#eef1f4]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section className="min-w-0">
            <div className="flex items-center justify-between gap-4 border-b border-[#eceef2] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-[#eef1f4]" />
                <div className="space-y-2">
                  <div className="h-4 w-28 animate-pulse rounded bg-[#eef1f4]" />
                  <div className="h-3 w-40 animate-pulse rounded bg-[#eef1f4]" />
                </div>
              </div>
              <div className="h-10 w-28 animate-pulse rounded-full bg-[#eef1f4]" />
            </div>

            <div className="bg-[#fcfcfd] px-4 py-3 text-center">
              <div className="mx-auto h-8 w-48 animate-pulse rounded-full bg-[#eef1f4]" />
            </div>

            <div className="max-h-[calc(100vh-340px)] space-y-8 overflow-y-auto bg-[#fcfcfd] px-4 py-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={`student-messages-route-message-skeleton-${index}`} className="h-16 rounded-[18px] bg-[#eef1f4] animate-pulse" />
              ))}
            </div>

            <div className="border-t border-[#eceef2] bg-white px-4 py-3">
              <div className="flex items-end gap-3">
                <div className="h-9 w-9 animate-pulse rounded-full bg-[#eef1f4]" />
                <div className="min-h-[48px] flex-1 animate-pulse rounded-2xl border border-[#e5e7eb] bg-[#fafafa]" />
                <div className="h-10 w-20 animate-pulse rounded-full bg-[#eef1f4]" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </StudentShell>
  );
}
