import { ContactHeroSection } from "@/components/landing/contact-hero-section";
import { ContactMethodsSection } from "@/components/landing/contact-methods-section";
import { CTASection } from "@/components/landing/cta-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FooterSection } from "@/components/landing/footer-section";
import { SiteHeader } from "@/components/landing/site-header";

export function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-2 mt-3 overflow-hidden rounded-[28px] bg-[#050505] text-white sm:mx-3">
        <SiteHeader thresholdId="contact-sticky-threshold" />
        <ContactHeroSection thresholdId="contact-sticky-threshold" />
      </section>
      <ContactMethodsSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
