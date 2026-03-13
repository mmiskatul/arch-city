import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

import { ArrowIcon } from "@/components/landing/shared/arrow-icon";
import { SIGNUP_ROUTE } from "@/lib/routes";

type MarketingCTASectionProps = {
  title: ReactNode;
  description: ReactNode;
  imageAlt: string;
  imageSrc?: string;
  href?: string;
  ctaLabel?: string;
};

export function MarketingCTASection({
  title,
  description,
  imageAlt,
  imageSrc = "/home-06-builder-tools.webp",
  href = SIGNUP_ROUTE,
  ctaLabel = "Get started",
}: MarketingCTASectionProps) {
  return (
    <section className="mx-3 my-4 overflow-hidden rounded-[28px] bg-[#efe4e1] px-6 py-10 text-[#111111] sm:px-8 sm:py-12 lg:px-12 lg:py-14">
      <div className="mx-auto grid max-w-7xl px-10 items-center gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-12">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-bold tracking-[-0.06em] text-[#080808] sm:text-4xl lg:text-6xl lg:leading-[0.96]">
            {title}
          </h2>

          <p className="mt-8 text-xl leading-9 text-[#1f1f1f] sm:text-2xl">
            {description}
          </p>

          <Link
            href={href}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#df1620] px-7 py-4 text-xl font-bold text-white transition hover:bg-[#f02029]"
          >
            {ctaLabel}
            <ArrowIcon />
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-[34rem] lg:ml-auto">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
