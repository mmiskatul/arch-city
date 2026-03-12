import Link from "next/link";

function DashboardPreview() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-5xl px-3 sm:px-6">
      <div className="absolute inset-x-12 -top-8 h-28 rounded-full bg-[#ef242a]/22 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[#f2f2f2] shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between border-b border-black/6 bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-xs font-black text-white">
              AC
            </div>
            <div className="rounded-full bg-[#f4f4f5] px-4 py-2 text-sm font-semibold text-[#222]">
              Student Dashboard
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden rounded-full bg-[#111827] px-4 py-2 text-xs font-semibold text-white sm:block">
              12-25-2024 - 2:57 PM CT
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5e7eb] text-xs font-bold text-[#6b7280]">
              SA
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ef4444] text-sm font-bold text-white">
              +
            </div>
          </div>
        </div>

        <div className="grid min-h-[24rem] grid-cols-[72px_1fr] bg-[#f8f8f8]">
          <aside className="border-r border-black/6 bg-white px-3 py-4">
            <div className="grid gap-3">
              {["⌂", "⌕", "🗓"].map((icon) => (
                <div
                  key={icon}
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg ${
                    icon === "🗓"
                      ? "bg-[#ffe3e3] text-[#ef242a]"
                      : "bg-[#f4f4f5] text-[#6b7280]"
                  }`}
                >
                  <span aria-hidden="true">{icon}</span>
                </div>
              ))}
            </div>
          </aside>

          <div className="p-5 sm:p-8">
            <div className="max-w-xl">
              <h3 className="text-3xl font-extrabold tracking-tight text-[#151515]">
                My Schedule
              </h3>
              <p className="mt-2 text-sm text-[#707070]">
                View your upcoming, completed, and canceled tutoring sessions
                here.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { label: "All", active: true },
                { label: "Upcoming" },
                { label: "Completed" },
                { label: "Cancelled" },
              ].map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    tab.active
                      ? "bg-[#ef242a] text-white shadow-[0_8px_24px_rgba(239,36,42,0.22)]"
                      : "border border-black/8 bg-white text-[#5e5e5e]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              {[
                {
                  subject: "AP Calculus Session",
                  time: "Today, 4:30 PM",
                  tutor: "with Daniel H.",
                  status: "Upcoming",
                },
                {
                  subject: "SAT Writing Review",
                  time: "Tomorrow, 6:00 PM",
                  tutor: "with Monica T.",
                  status: "Rescheduled",
                },
                {
                  subject: "Physics Homework Help",
                  time: "Friday, 5:15 PM",
                  tutor: "with Amir R.",
                  status: "Confirmed",
                },
              ].map((item) => (
                <div
                  key={item.subject}
                  className="flex flex-col gap-4 rounded-[1.6rem] border border-black/6 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="text-base font-bold text-[#171717]">
                      {item.subject}
                    </div>
                    <div className="mt-1 text-sm text-[#666]">
                      {item.time} {item.tutor}
                    </div>
                  </div>
                  <div className="inline-flex w-fit rounded-full bg-[#111827] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#a50f15]/35 blur-[120px]" />
      <div className="absolute left-[-10%] top-32 h-72 w-72 rounded-full bg-[#7f1015]/20 blur-[120px]" />
      <div className="absolute right-[-8%] top-24 h-80 w-80 rounded-full bg-[#3c0b0d]/25 blur-[150px]" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="inline-flex items-center rounded-full border border-[#ef242a]/25 bg-white/6 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white/78">
          <span className="mr-2 h-2 w-2 rounded-full bg-[#48d597]" />
          Beta 1.0 Available Now
        </div>

        <h1 className="mt-8 max-w-4xl text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl lg:text-[6.25rem] lg:leading-[0.92]">
          Tutoring Made
          <span className="mx-3 inline-block rotate-[-2deg] rounded-[1.15rem] bg-white px-4 py-2 text-[#ef242a] shadow-[0_12px_60px_rgba(255,255,255,0.1)]">
            Easier
          </span>
          than Ever.
        </h1>

        <p className="mt-8 max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
          A concierge-style service that sources qualified tutors for students,
          providing an unmatched experience that changes the way families
          approach tutoring.
        </p>

        <div className="mt-10 flex flex-col items-center gap-5">
          <Link
            href="#create-account"
            className="inline-flex items-center gap-3 rounded-full bg-[#ef242a] px-8 py-4 text-base font-bold text-white shadow-[0_18px_45px_rgba(239,36,42,0.33)] transition hover:bg-[#ff343a]"
          >
            Get started
            <span aria-hidden="true">→</span>
          </Link>
          <p className="text-sm text-white/55">
            Get started for just $10/month. Cancel anytime.
          </p>
        </div>
      </div>

      <DashboardPreview />
    </section>
  );
}
