import Image from "next/image";

export function StudentsHeroSection({
  thresholdId,
}: {
  thresholdId: string;
}) {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#a50f15]/35 blur-[120px]" />
      <div className="absolute left-[-10%] top-32 h-72 w-72 rounded-full bg-[#7f1015]/20 blur-[120px]" />
      <div className="absolute right-[-8%] top-24 h-80 w-80 rounded-full bg-[#3c0b0d]/25 blur-[150px]" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/82">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ef242a]" />
          Students
        </div>

        <h1 className="mt-8 max-w-4xl text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-[5.3rem] lg:leading-[0.94]">
          It&apos;s Your Day to
          <span className="mx-3 inline-block rotate-[-2deg] rounded-[1rem] bg-white px-4 py-1 text-[#ef242a] shadow-[0_12px_60px_rgba(255,255,255,0.1)]">
            Shape.
          </span>
        </h1>

        <p className="mt-8 max-w-3xl text-base leading-8 text-white/88 sm:text-lg">
          A concierge-style service that sources qualified tutors for our
          students, providing an unmatched experience that will change the way
          our students approach tutoring.
        </p>

        <div id={thresholdId} aria-hidden="true" className="mt-10 h-px w-full" />
      </div>

      <div className="relative mx-auto mt-12 max-w-3xl">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src="/students.webp"
            alt="Students learning with Arch City Tutors"
            fill
            priority
            className="object-contain object-bottom"
          />
        </div>
      </div>
    </section>
  );
}
