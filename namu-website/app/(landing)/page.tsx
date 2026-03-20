import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { FAQSection } from "@/components/landing/FAQSection";
import { FuturePlansSection } from "@/components/landing/FuturePlansSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { MissionSection } from "@/components/landing/MissionSection";
import { NavBar } from "@/components/landing/NavBar";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionsSection } from "@/components/landing/SolutionsSection";

export default function HomePage() {
  return (
    <main className="home-page">
      <NavBar />
      <HeroSection />
      <MissionSection />
      <ProblemSection />
      <SolutionsSection />
      <FuturePlansSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
