import Image from "next/image";

import { MarketingHeroFrame } from "@/components/landing/shared/marketing-hero-frame";

export function TutorsHeroSection({
  thresholdId,
}: {
  thresholdId: string;
}) {
  return (
    <MarketingHeroFrame
      thresholdId={thresholdId}
      badge="Tutors"
      title={
        <h1 className="mt-8 max-w-4xl text-2xl font-black tracking-[-0.06em] text-white sm:text-3xl lg:text-5xl lg:leading-[0.94]">
          It&apos;s Your Day to
          <span className="mx-3 inline-block rotate-[-2deg] rounded-lg bg-[#f3d6d6e7] px-4 py-1 text-[#e0383d] shadow-[0_12px_60px_rgba(255,255,255,0.1)]">
            Inspire.
          </span>
        </h1>
      }
      description={
        <p className="px-10 sm:px-20">
          A concierge-style service that sources qualified tutors for our
          students, providing an unmatched experience that will change the way
          our students approach tutoring.
        </p>
      }
      sectionClassName="px-4 pb-10 pt-10 sm:px-6 lg:px-8"
      media={
        <div className="relative mx-auto mt-10 max-w-3xl">
          <div className="relative aspect-[5/3] w-full">
            <Image
              src="/tutors.webp"
              alt="Tutor helping a student"
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
