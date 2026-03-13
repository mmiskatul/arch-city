import Link from "next/link";

import { ArrowIcon } from "@/components/landing/shared/arrow-icon";
import { MarketingHeroFrame } from "@/components/landing/shared/marketing-hero-frame";

export function AboutHeroSection({
  thresholdId,
}: {
  thresholdId: string;
}) {
  return (
    <MarketingHeroFrame
      id="about"
      thresholdId={thresholdId}
      badge="Arch City Tutors"
      title={
        <h1 className="mt-8 max-w-3xl text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-[5.25rem] lg:leading-[0.94]">
          Book Tutors
          <span className="mx-3 inline-block rotate-[-2deg] rounded-[1rem] bg-white px-4 py-1 text-[#ef242a] shadow-[0_12px_60px_rgba(255,255,255,0.1)]">
            Anywhere, Anytime
          </span>
        </h1>
      }
      description={
        <>
          Arch City Tutors was founded to bridge the gap between students,
          tutors, and convenience. As parents, we understand that students and
          their families have busy schedules, and it can be difficult to
          schedule tutoring sessions around extracurricular activities. With
          this in mind, we developed a secure and safe platform that enables
          students in need of tutoring to directly connect with qualified
          tutors who have already passed our stringent background check.
        </>
      }
      action={
        <Link
          href="/#create-account"
          className="inline-flex items-center gap-3 rounded-full bg-[#ef242a] px-8 py-4 text-lg font-bold text-white shadow-[0_18px_45px_rgba(239,36,42,0.33)] transition hover:bg-[#ff343a]"
        >
          Get started
          <ArrowIcon />
        </Link>
      }
    />
  );
}
