import { FooterSection } from "@/components/landing/common/footer-section";
import { TutorsCTASection } from "@/components/landing/tutors/tutors-cta-section";
import { TutorsDetailsSection } from "@/components/landing/tutors/tutors-details-section";
import { TutorsFAQSection } from "@/components/landing/tutors/tutors-faq-section";
import { TutorsHeroSection } from "@/components/landing/tutors/tutors-hero-section";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";

export function TutorsPage() {
  return (
    <MarketingPageShell
      thresholdId="tutors-sticky-threshold"
      hero={<TutorsHeroSection thresholdId="tutors-sticky-threshold" />}
    >
      <TutorsDetailsSection />
      <TutorsCTASection />
      <TutorsFAQSection />
      <FooterSection />
    </MarketingPageShell>
  );
}

