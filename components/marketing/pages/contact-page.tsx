import { ContactHeroSection } from "@/components/landing/contact/contact-hero-section";
import { ContactMethodsSection } from "@/components/landing/contact/contact-methods-section";
import { CTASection } from "@/components/landing/common/cta-section";
import { FAQSection } from "@/components/landing/common/faq-section";
import { FooterSection } from "@/components/landing/common/footer-section";
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

