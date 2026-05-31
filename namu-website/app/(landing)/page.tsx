import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { FAQSection } from "@/components/landing/FAQSection";
import { FuturePlansSection } from "@/components/landing/FuturePlansSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { MissionSection } from "@/components/landing/MissionSection";
import { ProblemSection } from "@/components/landing/ProblemSection";

export default function HomePage() {
  return (
    <main className="home-page">
      <HeroSection />
      <ProblemSection />
      <MissionSection />
      <FuturePlansSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
