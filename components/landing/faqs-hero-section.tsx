import { MarketingHeroFrame } from "@/components/landing/shared/marketing-hero-frame";

export function FaqsHeroSection({
  thresholdId,
}: {
  thresholdId: string;
}) {
  return (
    <MarketingHeroFrame
      thresholdId={thresholdId}
      badge="FAQs"
      title={
        <h1 className="mt-8 max-w-4xl text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-[5.2rem] lg:leading-[0.94]">
          Find
          <span className="mx-3 inline-block rotate-[-2deg] rounded-[1rem] bg-white px-4 py-1 text-[#ef242a] shadow-[0_12px_60px_rgba(255,255,255,0.1)]">
            Answers
          </span>
          to Your Questions.
        </h1>
      }
      description={
        <>
          We have compiled a list of frequently asked questions to help you
          find the answers you need.
        </>
      }
    />
  );
}
