import { CTASection } from "@/components/landing/cta-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { FooterSection } from "@/components/landing/footer-section";
import { HeroSection } from "@/components/landing/hero-section";
import { KeyFeaturesSection } from "@/components/landing/key-features-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { SiteHeader } from "@/components/landing/site-header";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-2 overflow-hidden mt-3 rounded-[28px] bg-[#050505] text-white  sm:mx-3">
        <SiteHeader />
        <HeroSection />
      </section>
      <FeaturesSection />
      <KeyFeaturesSection />
      <section className="mx-3 my-4 overflow-hidden rounded-[28px] bg-[#050505] text-white ">
        <PricingSection />
      </section>
      <FAQSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
