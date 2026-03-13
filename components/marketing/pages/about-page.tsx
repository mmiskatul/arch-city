import { AboutBookingSection } from "@/components/landing/about/about-booking-section";
import { AboutHeroSection } from "@/components/landing/about/about-hero-section";
import { AboutProcessSection } from "@/components/landing/about/about-process-section";
import { AboutServicesSection } from "@/components/landing/about/about-services-section";
import { AboutSolutionsSection } from "@/components/landing/about/about-solutions-section";
import { CTASection } from "@/components/landing/common/cta-section";
import { FooterSection } from "@/components/landing/common/footer-section";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";

export function AboutPage() {
  return (
    <MarketingPageShell
      thresholdId="about-sticky-threshold"
      hero={<AboutHeroSection thresholdId="about-sticky-threshold" />}
    >
      <AboutSolutionsSection />
      <AboutProcessSection />
      <AboutBookingSection />
      <AboutServicesSection />
      <CTASection />
      <FooterSection />
    </MarketingPageShell>
  );
}

