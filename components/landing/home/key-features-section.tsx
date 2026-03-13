import Link from "next/link";

function IconWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#df1620] text-white">
      {children}
    </div>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 5 14h6l-1 8 8-12h-6l1-8Z" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
      <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 6v5c0 5 3.4 8.9 7 10 3.6-1.1 7-5 7-10V6l-7-3Z" />
      <path d="M9 12h6" />
      <path d="M12 9v6" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="3" />
      <path d="M16.5 7.5 21 3" />
      <path d="m14 5 2.5 2.5" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12a8 8 0 1 1 16 0" />
      <path d="M4 13v2a2 2 0 0 0 2 2h2v-6H6a2 2 0 0 0-2 2Z" />
      <path d="M20 13v2a2 2 0 0 1-2 2h-2v-6h2a2 2 0 0 1 2 2Z" />
      <path d="M12 19v2" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h10" />
      <path d="M18 7h2" />
      <path d="M10 17h10" />
      <path d="M4 17h2" />
      <circle cx="8" cy="7" r="2" />
      <circle cx="16" cy="17" r="2" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

const cards = [
  { title: "User-friendly Interface", icon: <BoltIcon /> },
  { title: "Advanced Member Dashboard", icon: <DatabaseIcon /> },
  { title: "Certified, Screened Tutors", icon: <ShieldIcon /> },
  { title: "Secure and Reliable Payment", icon: <TargetIcon /> },
  { title: "24/7 Dedicated Support", icon: <SupportIcon /> },
  { title: "Advanced Filtering Options", icon: <FilterIcon /> },
];

export function KeyFeaturesSection() {
  return (
    <section className="bg-white px-4 pb-28 pt-8 text-[#111111] sm:px-6 sm:pt-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e3d9d6] bg-white px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-800 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#df1620]" />
            Key Features
          </div>

          <p className="mt-8 max-w-5xl text-xl leading-[1.45] tracking-[-0.04em] text-[#202020] sm:text-2xl lg:text-3xl lg:leading-[1.38]">
            With an <span className="font-bold">easy-to-use</span> and advanced
            dashboard, Arch City Tutors is your gateway to finding the{" "}
            <span className="font-bold">perfect tutor</span> and{" "}
            <span className="font-bold"> scheduling tutoring sessions</span>{" "}
            with ease.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.slice(0, 4).map((card) => (
            <article
              key={card.title}
              className="flex min-h-[17rem] flex-col rounded-xl bg-[#efe4e1] p-7 transition-transform duration-300 ease-out hover:scale-105"
            >
              <IconWrap>{card.icon}</IconWrap>
              <h3 className="mt-auto max-w-[10rem] text-[1.05rem] font-bold leading-[1.18] tracking-[-0.03em] text-[#111111]">
                {card.title}
              </h3>
            </article>
          ))}

          {cards.slice(4, 6).map((card) => (
            <article
              key={card.title}
              className="flex min-h-[17rem] flex-col rounded-xl bg-[#efe4e1] p-7 transition-transform duration-300 ease-out hover:scale-105 sm:col-span-1"
            >
              <IconWrap>{card.icon}</IconWrap>
              <h3 className="mt-auto max-w-[10rem] text-[1.05rem] font-bold leading-[1.18] tracking-[-0.03em] text-[#111111]">
                {card.title}
              </h3>
            </article>
          ))}

          <div className="flex min-h-[17rem] flex-col items-center justify-center rounded-xl bg-white p-7 text-center sm:col-span-2 xl:col-span-2">
            <Link
              href="#create-account"
              className="flex h-20 w-20 items-center justify-center rounded-full bg-[#efe4e1] text-[#df1620] transition hover:bg-[#e8d8d4]"
              aria-label="Get started today"
            >
              <ArrowUpRightIcon />
            </Link>
            <p className="mt-5 text-[1.05rem] font-semibold text-[#2c2c2c]">
              Get started today
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
