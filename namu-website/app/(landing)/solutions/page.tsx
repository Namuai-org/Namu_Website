"use client";

import { Footer } from "@/components/landing/Footer";
import { HeroEntrance } from "@/components/landing/HeroEntrance";
import { NavBar } from "@/components/landing/NavBar";
import { SolutionsDeviceShowcase } from "@/components/landing/SolutionsDeviceShowcase";
import { SolutionsFeatureShowcase } from "@/components/landing/SolutionsFeatureShowcase";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";

export default function SolutionsPage() {
  const { t } = useTranslation();
  useScrollReveal(".reveal");

  return (
    <>
      <NavBar />
      <section className="page-hero solutions-page-hero" id="solutions-page">
        <div className="container narrow">
          <HeroEntrance className="solutions-hero-entrance">
            <span className="section-label section-label-center">{t("solutions.heroLabel")}</span>
            <h1 className="hero-title page-title solutions-hero-focus-title">{t("solutions.heroTitle")}</h1>
            <div className="hero-actions solutions-hero-actions">
              <a
                href="/contact"
                className="btn-secondary hero-secondary solutions-hero-secondary solutions-hero-focus-cta"
              >
                {t("hero.secondaryCta")}
              </a>
            </div>
          </HeroEntrance>
        </div>
      </section>

      <section className="section solutions-page-clean">
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
                <p className="solutions-about-body solutions-about-body--secondary">{t("solutions.aboutBody2")}</p>
              </div>
            </div>
          </article>

          <SolutionsFeatureShowcase />

          <article className="about-block solutions-workplace-block reveal reveal-up">
            <span className="section-label section-label-center">{t("solutions.workplaceLabel")}</span>
            <div className="solutions-workplace-head">
              <h3 className="solutions-workplace-title">{t("solutions.workplaceTitle")}</h3>
              <p className="solutions-workplace-intro">{t("solutions.workplaceIntro")}</p>
            </div>
            <div className="solutions-workplace-demo-stack">
              <SolutionsDeviceShowcase />
              <div className="solutions-demo-cta solutions-demo-cta-entrance reveal reveal-up">
                <div className="solutions-demo-cta-background" aria-hidden="true">
                  <div className="solutions-demo-aura solutions-demo-aura-1" />
                  <div className="solutions-demo-aura solutions-demo-aura-2" />
                  <div className="solutions-demo-orbit solutions-demo-orbit-1" />
                  <div className="solutions-demo-orbit solutions-demo-orbit-2" />
                  <span className="solutions-demo-chip solutions-demo-chip-1">{t("cta.bg1")}</span>
                  <span className="solutions-demo-chip solutions-demo-chip-2">{t("cta.bg2")}</span>
                  <span className="solutions-demo-chip solutions-demo-chip-3">{t("cta.bg3")}</span>
                  <span className="solutions-demo-chip solutions-demo-chip-4">{t("cta.bg4")}</span>
                </div>
                <div className="solutions-demo-cta-inner">
                  <span className="solutions-demo-label">{t("solutions.demoCtaLabel")}</span>
                  <div className="solutions-demo-cta-copy">
                    <h4>{t("solutions.demoCtaTitle")}</h4>
                    <p>{t("solutions.workplaceCtaBody")}</p>
                  </div>
                  <div className="solutions-demo-action-row">
                    <a href="/contact" className="btn-primary solutions-demo-cta-button">
                      {t("hero.secondaryCta")}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
      <Footer />
    </>
  );
}
