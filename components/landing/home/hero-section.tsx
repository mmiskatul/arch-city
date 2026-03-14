import Image from "next/image";
import Link from "next/link";

import { ArrowIcon } from "@/components/landing/shared/arrow-icon";

export function HeroSection({
  thresholdId,
}: {
  thresholdId: string;
}) {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#a50f15]/35 blur-[120px]" />
      <div className="absolute left-[-10%] top-32 h-72 w-72 rounded-full bg-[#7f1015]/20 blur-[120px]" />
      <div className="absolute right-[-8%] top-24 h-80 w-80 rounded-full bg-[#3c0b0d]/25 blur-[150px]" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="inline-flex items-center rounded-full border border-[#ef242a]/25 bg-white/6 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.24em] text-white/78 space-x-[-0.06em]">
          <span className="mr-2 h-2 w-2 rounded-full bg-[#48d597]" />
          Beta 1.0 Available Now
        </div>

        <h1 className="mt-8 max-w-4xl text-5xl font-bold tracking-[-0.06em] text-white sm:text-9xl lg:text-8xl lg:leading-[0.92] space-x-0">
          Tutoring Made <br />
          <span className="mx-3 inline-block rotate-[-2deg] rounded-[1.15rem] bg-white px-4 py-2 text-[#ef242a] shadow-[0_12px_60px_rgba(255,255,255,0.1)]">
            Easier
          </span>
          than Ever.
        </h1>

        <p className="mt-8 max-w-3xl text-[22px] leading-8 text-white/90 sm:text-xl">
          A concierge-style service that sources qualified tutors for students,
          providing an unmatched experience that changes the way families
          approach tutoring.
        </p>

        <div className="mt-10 flex flex-col items-center gap-5">
          <Link
            href="/signup"
            target="_blank"
            className="inline-flex items-center gap-3 rounded-full bg-red-600 px-8 py-4 text-xl font-bold text-white shadow-[0_18px_45px_rgba(239,36,42,0.33)] transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300/50 active:bg-red-800"
          >
            Get started
            <ArrowIcon />
          </Link>
          <p className="text-base text-white/55">
            Get started for just $10/month. Cancel anytime.
          </p>
        </div>

        <div id={thresholdId} aria-hidden="true" className="h-px w-full" />
      </div>

      <div className="pointer-events-none relative z-10 mx-auto mt-24 w-full max-w-5xl px-3 sm:mt-28 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem]">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/app-dashboard.webp"
              alt="Arch City Tutors dashboard preview"
              fill
              priority
              draggable={false}
              className="pointer-events-none select-none object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
