import { ReactNode } from "react";

import { SiteHeader } from "@/components/landing/site-header";

type MarketingPageShellProps = {
  thresholdId: string;
  hero: ReactNode;
  children: ReactNode;
  heroClassName?: string;
};

const defaultHeroClassName =
  "mx-2 mt-3 overflow-hidden rounded-[28px] bg-[#050505] text-white sm:mx-3";

export function MarketingPageShell({
  thresholdId,
  hero,
  children,
  heroClassName = defaultHeroClassName,
}: MarketingPageShellProps) {
  return (
    <main className="min-h-screen bg-white">
      <section className={heroClassName}>
        <SiteHeader thresholdId={thresholdId} />
        {hero}
      </section>
      {children}
    </main>
  );
}
