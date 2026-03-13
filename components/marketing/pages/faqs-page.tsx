import { CTASection } from "@/components/landing/common/cta-section";
import {
  FaqAccordionSection,
  studentFaqs,
  tutorFaqs,
} from "@/components/landing/faqs/faq-accordion-section";
import { FaqsHeroSection } from "@/components/landing/faqs/faqs-hero-section";
import { FooterSection } from "@/components/landing/common/footer-section";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";

export function FaqsPage() {
  return (
    <MarketingPageShell
      thresholdId="faqs-sticky-threshold"
      hero={<FaqsHeroSection thresholdId="faqs-sticky-threshold" />}
    >
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
        reverse
      />
      <CTASection />
      <FooterSection />
    </MarketingPageShell>
  );
}

