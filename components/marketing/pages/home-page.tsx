import { CTASection } from "@/components/landing/cta-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { FooterSection } from "@/components/landing/footer-section";
import { HeroSection } from "@/components/landing/hero-section";
import { KeyFeaturesSection } from "@/components/landing/key-features-section";
import { PricingDetailsSection } from "@/components/landing/pricing-details-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";

export function HomePage() {
  return (
    <MarketingPageShell
      thresholdId="home-sticky-threshold"
      hero={<HeroSection thresholdId="home-sticky-threshold" />}
    >
      <FeaturesSection />
      <KeyFeaturesSection />
      <section className="mx-3 my-4 overflow-hidden rounded-[28px] bg-[#050505] text-white">
        <PricingSection />
      </section>
      <PricingDetailsSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </MarketingPageShell>
  );
}
