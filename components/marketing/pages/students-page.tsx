import { FAQSection } from "@/components/landing/faq-section";
import { FooterSection } from "@/components/landing/footer-section";
import { SiteHeader } from "@/components/landing/site-header";
import { StudentsCTASection } from "@/components/landing/students-cta-section";
import { StudentsDetailsSection } from "@/components/landing/students-details-section";
import { StudentsHeroSection } from "@/components/landing/students-hero-section";

export function StudentsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-2 mt-3 overflow-hidden rounded-[28px] bg-[#050505] text-white sm:mx-3">
        <SiteHeader thresholdId="students-sticky-threshold" />
        <StudentsHeroSection thresholdId="students-sticky-threshold" />
      </section>
      <StudentsDetailsSection />
      <StudentsCTASection />
      <FAQSection />
      <FooterSection />
    </main>
  );
}
