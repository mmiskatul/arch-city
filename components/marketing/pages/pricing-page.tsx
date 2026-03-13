import { CTASection } from "@/components/landing/cta-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FooterSection } from "@/components/landing/footer-section";
import { PricingDetailsSection } from "@/components/landing/pricing-details-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";

export function PricingPage() {
  return (
    <MarketingPageShell
      thresholdId="pricing-sticky-threshold"
      hero={<PricingSection thresholdId="pricing-sticky-threshold" />}
      heroClassName="mx-3 my-4 overflow-hidden rounded-[28px] bg-[#050505] text-white"
    >
      <PricingDetailsSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </MarketingPageShell>
  );
}
