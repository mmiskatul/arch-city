import { ContactHeroSection } from "@/components/landing/contact-hero-section";
import { ContactMethodsSection } from "@/components/landing/contact-methods-section";
import { CTASection } from "@/components/landing/cta-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FooterSection } from "@/components/landing/footer-section";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";

export function ContactPage() {
  return (
    <MarketingPageShell
      thresholdId="contact-sticky-threshold"
      hero={<ContactHeroSection thresholdId="contact-sticky-threshold" />}
    >
      <ContactMethodsSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </MarketingPageShell>
  );
}
