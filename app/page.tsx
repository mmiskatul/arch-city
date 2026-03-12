import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { SiteHeader } from "@/components/landing/site-header";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-2 mt-2 overflow-x-hidden overflow-y-visible rounded-[28px] bg-[#050505] text-white shadow-[0_30px_120px_rgba(0,0,0,0.16)] sm:mx-3 sm:mt-3">
        <SiteHeader />
        <HeroSection />
      </section>
      <FeaturesSection />
    </main>
  );
}
