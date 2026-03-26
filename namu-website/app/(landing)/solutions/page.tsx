"use client";

import { Footer } from "@/components/landing/Footer";
import { HeroEntrance } from "@/components/landing/HeroEntrance";
import { SolutionsFeatureShowcase } from "@/components/landing/SolutionsFeatureShowcase";
import { SolutionsMacBookDemoSection } from "@/components/landing/SolutionsMacBookDemoSection";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";

export default function SolutionsPage() {
  const { t } = useTranslation();
  useScrollReveal(".reveal");

  return (
    <>
      <section className="page-hero solutions-page-hero" id="solutions-page">
        <div className="container narrow">
          <HeroEntrance className="solutions-hero-entrance">
            <span className="section-label section-label-center hero-child">{t("solutions.heroLabel")}</span>
            <h1 className="hero-title page-title solutions-hero-focus-title hero-child">{t("solutions.heroTitle")}</h1>
            <div className="hero-actions solutions-hero-actions hero-child">
              <a
                href="/login"
                className="btn-secondary hero-secondary solutions-hero-secondary solutions-hero-focus-cta"
              >
                {t("hero.secondaryCta")}
              </a>
            </div>
          </HeroEntrance>
        </div>
      </section>

      <section className="section solutions-page-clean solutions-page-tight-footer">
        <div className="container article">
          <article className="about-block solutions-about-block reveal reveal-up">
            <span className="section-label section-label-center">{t("solutions.aboutLabel")}</span>
            <div className="solutions-about-stage">
              <div className="solutions-about-intro">
                <h2 className="solutions-about-title">{t("solutions.summaryTitle")}</h2>
                <p className="solutions-about-kicker">{t("solutions.aboutIntro")}</p>
              </div>
              <div className="solutions-about-body-stack">
                <p className="solutions-about-body solutions-about-body--lead">{t("solutions.aboutBody1")}</p>
              </div>
            </div>
          </article>

          <div id="solutions-features">
            <SolutionsFeatureShowcase />
          </div>

          <article className="about-block solutions-workplace-block solutions-workplace-block--immersive reveal reveal-up">
            <SolutionsMacBookDemoSection />
          </article>
        </div>
      </section>
      <Footer />
    </>
  );
}
