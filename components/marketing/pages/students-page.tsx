import { FAQSection } from "@/components/landing/faq-section";
import { FooterSection } from "@/components/landing/footer-section";
import { StudentsCTASection } from "@/components/landing/students-cta-section";
import { StudentsDetailsSection } from "@/components/landing/students-details-section";
import { StudentsHeroSection } from "@/components/landing/students-hero-section";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";

export function StudentsPage() {
  return (
    <MarketingPageShell
      thresholdId="students-sticky-threshold"
      hero={<StudentsHeroSection thresholdId="students-sticky-threshold" />}
    >
      <StudentsDetailsSection />
      <StudentsCTASection />
      <FAQSection />
      <FooterSection />
    </MarketingPageShell>
  );
}
