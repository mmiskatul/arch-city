import { FooterSection } from "@/components/landing/footer-section";
import { SiteHeader } from "@/components/landing/site-header";
import { TutorsCTASection } from "@/components/landing/tutors-cta-section";
import { TutorsDetailsSection } from "@/components/landing/tutors-details-section";
import { TutorsFAQSection } from "@/components/landing/tutors-faq-section";
import { TutorsHeroSection } from "@/components/landing/tutors-hero-section";

export function TutorsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-2 mt-3 overflow-hidden rounded-[28px] bg-[#050505] text-white sm:mx-3">
        <SiteHeader thresholdId="tutors-sticky-threshold" />
        <TutorsHeroSection thresholdId="tutors-sticky-threshold" />
      </section>
      <TutorsDetailsSection />
      <TutorsCTASection />
      <TutorsFAQSection />
      <FooterSection />
    </main>
  );
}
