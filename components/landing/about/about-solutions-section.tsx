import type { ReactNode } from "react";

type SolutionCard = {
  title: string;
  description: string;
  icon: ReactNode;
};

const solutionCards: SolutionCard[] = [
  {
    title: "Tutoring When Students Need It",
    description:
      "Our Students can book a single tutoring session in preparation for a big test or they can book tutoring sessions on a more regular basis. Unlike our competition, Arch City Tutors doesn't require our Students to purchase more tutoring sessions than they need.",
    icon: <GroupIcon />,
  },
  {
    title: "Handpick Your Tutor",
    description:
      "Arch City Tutors provides our Students with a list of tutor profiles for them to pick from. Tutor profiles highlight each tutor's qualifications, areas of expertise, teaching style, availability, and pricing.",
    icon: <CrownIcon />,
  },
  {
    title: "Flexible Scheduling",
    description:
      "Arch City Tutors allows our Students and Tutors to work around their schedules. Due to our large network of Tutors, our Students generally have several dates, times, and locations to choose from.",
    icon: <GlobeIcon />,
  },
  {
    title: "Safety First",
    description:
      "All of our Tutors are certified by the Missouri Department of Elementary and Secondary Education and have passed a background check. As parents ourselves, we wouldn't want someone tutoring our children that we don't trust, therefore, we do not let a tutor join our platform unless we would trust them to tutor our very own children.",
    icon: <GemIcon />,
  },
];

export function AboutSolutionsSection() {
  return (
    <section className="bg-white px-4 pb-24 pt-16 text-[#111111] sm:px-6 sm:pt-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e3d9d6] bg-white px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#2d2d2d] shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#df1620]" />
            Our Solutions
          </div>

          <h2 className="mt-8 max-w-4xl text-2xl font-bold tracking-[-0.06em] text-[#111111] sm:text-3xl lg:text-5xl lg:leading-[0.95]">
            Why
            <span className="mx-3 inline-block rotate-[-2deg] rounded-[1rem] bg-[#f5dcdc] px-4 py-1 text-[#da252b] shadow-[0_8px_30px_rgba(239,36,42,0.08)]">
              Arch City Tutors?
            </span>
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#6d6d6d]">
            Arch City Tutors was founded to provide solutions to each of those
            problems:
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {solutionCards.map((card) => (
            <article
              key={card.title}
              className="rounded-[1.6rem] bg-[#efe4e1] p-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-8"
            >
              <div className="flex h-16 w-16 items-center justify-center text-[#ef242a]">
                {card.icon}
              </div>

              <h3 className="mt-6 max-w-xs text-xl font-black tracking-[-0.05em] text-[#171717]">
                {card.title}
              </h3>

              <p className="mt-5 text-base leading-8 text-[#5f5b5b]">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GroupIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <g fill="none" stroke="#111111" strokeWidth="2.4" strokeLinejoin="round">
        <circle cx="32" cy="18" r="8" fill="#ef242a" />
        <circle cx="18" cy="24" r="7" fill="#ef242a" />
        <circle cx="46" cy="24" r="7" fill="#ef242a" />
        <circle cx="22" cy="42" r="8" fill="#ef242a" />
        <circle cx="42" cy="42" r="8" fill="#ef242a" />
        <path d="M24 54v-4c0-4.4 3.6-8 8-8s8 3.6 8 8v4" />
        <path d="M8 50v-1c0-4.4 3.6-8 8-8h4" />
        <path d="M56 50v-1c0-4.4-3.6-8-8-8h-4" />
      </g>
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <path
        d="m12 48 5-24 15 10 15-18 5 32Z"
        fill="#ef242a"
        stroke="#111111"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M12 48h40"
        stroke="#111111"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <circle cx="32" cy="32" r="20" fill="#ef242a" stroke="#111111" strokeWidth="2.4" />
      <path d="M12 32h40" stroke="#111111" strokeWidth="2.2" />
      <path d="M32 12c7 6 11 13 11 20s-4 14-11 20c-7-6-11-13-11-20s4-14 11-20Z" stroke="#111111" strokeWidth="2.2" fill="none" />
      <path d="M18 21c8 3 20 3 28 0M18 43c8-3 20-3 28 0" stroke="#111111" strokeWidth="2.2" fill="none" />
    </svg>
  );
}

function GemIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <path
        d="M18 22h28l6 8-20 22L12 30Z"
        fill="#ef242a"
        stroke="#111111"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M24 22 32 52 40 22" stroke="#111111" strokeWidth="2.2" fill="none" />
      <path d="m18 22 7 8h14l7-8" stroke="#111111" strokeWidth="2.2" fill="none" />
    </svg>
  );
}
