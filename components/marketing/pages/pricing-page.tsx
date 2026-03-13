import { CTASection } from "@/components/landing/cta-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FooterSection } from "@/components/landing/footer-section";
import { PricingDetailsSection } from "@/components/landing/pricing-details-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { SiteHeader } from "@/components/landing/site-header";

export function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-3 my-4 overflow-hidden rounded-[28px] bg-[#050505] text-white">
        <SiteHeader thresholdId="pricing-sticky-threshold" />
        <PricingSection thresholdId="pricing-sticky-threshold" />
      </section>
      <PricingDetailsSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
