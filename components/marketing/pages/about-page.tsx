import { AboutBookingSection } from "@/components/landing/about-booking-section";
import { AboutHeroSection } from "@/components/landing/about-hero-section";
import { AboutProcessSection } from "@/components/landing/about-process-section";
import { AboutServicesSection } from "@/components/landing/about-services-section";
import { AboutSolutionsSection } from "@/components/landing/about-solutions-section";
import { CTASection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";
import { SiteHeader } from "@/components/landing/site-header";

export function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-2 mt-3 overflow-hidden rounded-[28px] bg-[#050505] text-white sm:mx-3">
        <SiteHeader thresholdId="about-sticky-threshold" />
        <AboutHeroSection thresholdId="about-sticky-threshold" />
      </section>
      <AboutSolutionsSection />
      <AboutProcessSection />
      <AboutBookingSection />
      <AboutServicesSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
