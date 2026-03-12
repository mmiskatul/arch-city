import { HeroSection } from "@/components/landing/hero-section";
import { SiteHeader } from "@/components/landing/site-header";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <SiteHeader />
      <HeroSection />
    </main>
  );
}
