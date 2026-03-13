import {
  FaqAccordionSection,
  studentFaqs,
  tutorFaqs,
} from "@/components/landing/faq-accordion-section";
import { FaqsHeroSection } from "@/components/landing/faqs-hero-section";
import { CTASection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";
import { SiteHeader } from "@/components/landing/site-header";

export function FaqsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-2 mt-3 overflow-hidden rounded-[28px] bg-[#050505] text-white sm:mx-3">
        <SiteHeader thresholdId="faqs-sticky-threshold" />
        <FaqsHeroSection thresholdId="faqs-sticky-threshold" />
      </section>
      <FaqAccordionSection
        id="student-faqs"
        title="Student - Frequently Asked Questions"
        faqs={studentFaqs}
        pricingLink="/pricing"
      />
      <FaqAccordionSection
        id="tutor-faqs"
        title="Tutor - Frequently Asked Questions"
        faqs={tutorFaqs}
      />
      <CTASection />
      <FooterSection />
    </main>
  );
}
