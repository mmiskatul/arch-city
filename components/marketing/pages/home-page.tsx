import { CTASection } from "@/components/landing/cta-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { FooterSection } from "@/components/landing/footer-section";
import { HeroSection } from "@/components/landing/hero-section";
import { KeyFeaturesSection } from "@/components/landing/key-features-section";
import { PricingDetailsSection } from "@/components/landing/pricing-details-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { SiteHeader } from "@/components/landing/site-header";

export function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-2 mt-3 overflow-hidden rounded-[28px] bg-[#050505] text-white sm:mx-3">
        <SiteHeader thresholdId="home-sticky-threshold" />
        <HeroSection thresholdId="home-sticky-threshold" />
      </section>
      <FeaturesSection />
      <KeyFeaturesSection />
      <section className="mx-3 my-4 overflow-hidden rounded-[28px] bg-[#050505] text-white">
        <PricingSection />
      </section>
      <PricingDetailsSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
