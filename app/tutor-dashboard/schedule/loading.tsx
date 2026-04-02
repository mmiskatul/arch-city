export default function Loading() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="h-7 w-40 rounded bg-[#eef1f4] animate-pulse" />
        <div className="hidden gap-3 md:flex">
          <div className="h-8 w-32 rounded-lg bg-[#eef1f4] animate-pulse" />
          <div className="h-8 w-32 rounded-lg bg-[#eef1f4] animate-pulse" />
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[12px] border border-[#e7e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-4 border-b border-[#eceef2] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-6">
            <div className="h-8 w-24 rounded bg-[#eef1f4] animate-pulse" />
            <div className="h-8 w-28 rounded bg-[#eef1f4] animate-pulse" />
            <div className="h-8 w-24 rounded bg-[#eef1f4] animate-pulse" />
          </div>

          <div className="flex items-center gap-3 text-[14px] text-[#6b7280]">
            <div className="h-8 w-[128px] rounded-lg bg-[#eef1f4] animate-pulse" />
            <span>to</span>
            <div className="h-8 w-[128px] rounded-lg bg-[#eef1f4] animate-pulse" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[980px] animate-pulse">
            <div className="grid grid-cols-[1.65fr_0.8fr_1fr_0.8fr_0.9fr_0.8fr_0.7fr_0.9fr_0.8fr] gap-4 border-b border-[#eceef2] bg-[#fafafb] px-4 py-3">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={`schedule-head-skeleton-${index}`} className="h-3 rounded bg-[#eef1f4]" />
              ))}
            </div>

            {Array.from({ length: 7 }).map((_, rowIndex) => (
              <div
                key={`schedule-row-skeleton-${rowIndex}`}
                className="grid grid-cols-[1.65fr_0.8fr_1fr_0.8fr_0.9fr_0.8fr_0.7fr_0.9fr_0.8fr] gap-4 px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-[#eef1f4]" />
                  <div className="h-4 w-44 rounded bg-[#eef1f4]" />
                </div>
                <div className="h-4 w-16 rounded bg-[#eef1f4]" />
                <div className="h-4 w-24 rounded bg-[#eef1f4]" />
                <div className="h-4 w-20 rounded bg-[#eef1f4]" />
                <div className="h-4 w-16 rounded bg-[#eef1f4]" />
                <div className="h-6 w-20 rounded-full bg-[#eef1f4]" />
                <div className="h-4 w-14 rounded bg-[#eef1f4]" />
                <div className="h-6 w-20 rounded-full bg-[#eef1f4]" />
                <div className="h-8 w-16 rounded-full bg-[#eef1f4]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
