import Link from "next/link";

export function AboutHeroSection({
  thresholdId,
}: {
  thresholdId: string;
}) {
  return (
    <section
      id="about"
      className="relative overflow-hidden px-4 pb-20 pt-10 sm:px-6 lg:px-8"
    >
      <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#a50f15]/35 blur-[120px]" />
      <div className="absolute left-[-10%] top-28 h-72 w-72 rounded-full bg-[#7f1015]/20 blur-[120px]" />
      <div className="absolute right-[-8%] top-20 h-80 w-80 rounded-full bg-[#3c0b0d]/25 blur-[150px]" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/82">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ef242a]" />
          Arch City Tutors
        </div>

        <h1 className="mt-8 max-w-3xl text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-[5.25rem] lg:leading-[0.94]">
          Book Tutors
          <span className="mx-3 inline-block rotate-[-2deg] rounded-[1rem] bg-white px-4 py-1 text-[#ef242a] shadow-[0_12px_60px_rgba(255,255,255,0.1)]">
            Anywhere, Anytime
          </span>
        </h1>

        <p className="mt-8 max-w-3xl text-base leading-8 text-white/88 sm:text-lg">
          Arch City Tutors was founded to bridge the gap between students,
          tutors, and convenience. As parents, we understand that students and
          their families have busy schedules, and it can be difficult to
          schedule tutoring sessions around extracurricular activities. With
          this in mind, we developed a secure and safe platform that enables
          students in need of tutoring to directly connect with qualified
          tutors who have already passed our stringent background check.
        </p>

        <div className="mt-10">
          <Link
            href="/#create-account"
            className="inline-flex items-center gap-3 rounded-full bg-[#ef242a] px-8 py-4 text-lg font-bold text-white shadow-[0_18px_45px_rgba(239,36,42,0.33)] transition hover:bg-[#ff343a]"
          >
            Get started
            <ArrowIcon />
          </Link>
        </div>

        <div id={thresholdId} aria-hidden="true" className="mt-10 h-px w-full" />
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}
