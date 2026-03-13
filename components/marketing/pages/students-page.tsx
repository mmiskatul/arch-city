import { FAQSection } from "@/components/landing/common/faq-section";
import { FooterSection } from "@/components/landing/common/footer-section";
import { StudentsCTASection } from "@/components/landing/students/students-cta-section";
import { StudentsDetailsSection } from "@/components/landing/students/students-details-section";
import { StudentsHeroSection } from "@/components/landing/students/students-hero-section";
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

