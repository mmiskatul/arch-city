import Image from "next/image";

import { MarketingHeroFrame } from "@/components/landing/shared/marketing-hero-frame";

export function StudentsHeroSection({
  thresholdId,
}: {
  thresholdId: string;
}) {
  return (
    <MarketingHeroFrame
      thresholdId={thresholdId}
      badge="Students"
      title={
        <h1 className="mt-8 max-w-4xl text-xl font-bold tracking-[-0.06em] text-white sm:text-[28px] lg:text-[40px] lg:leading-[0.94]">
          It&apos;s Your Day to
          <span className="mx-3 inline-block rotate-[-2deg] rounded-lg bg-[#f3d6d6e7] px-4 py-1 text-[#ef242a] shadow-[0_12px_60px_rgba(255,255,255,0.1)]">
            Shape.
          </span>
        </h1>
      }
      description={
        <>
          A concierge-style service that sources qualified tutors for our
          students, providing an unmatched experience that will change the way
          our students approach tutoring.
        </>
      }
      sectionClassName="px-4 pb-16 pt-10 sm:px-6 lg:px-8"
      media={
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
      }
    />
  );
}
