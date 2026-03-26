"use client";

import Link from "next/link";
import { Footer } from "@/components/landing/Footer";
import { HeroEntrance } from "@/components/landing/HeroEntrance";
import { NavBar } from "@/components/landing/NavBar";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";

export default function AboutPage() {
  const { t } = useTranslation();
  useScrollReveal(".reveal");

  return (
    <>
      <section className="page-hero" id="about-page">
        <div className="container narrow">
          <HeroEntrance>
            <span className="section-label hero-child">{t("about.heroLabel")}</span>
            <h1 className="hero-title page-title hero-child">{t("about.heroTitle")}</h1>
            <p className="hero-sub hero-child">{t("about.heroSub")}</p>
          </HeroEntrance>
        </div>
      </section>

      <section className="section about-flow">
        <div className="container article">
          <article className="about-block reveal reveal-left">
            <span className="section-label">{t("about.whyLabel")}</span>
            <p className="editorial-text">{t("about.whyBody")}</p>
          </article>

          <article className="about-block reveal reveal-right">
            <span className="section-label">{t("about.problemLabel")}</span>
            <p className="editorial-text">{t("about.problemBody")}</p>
          </article>

          <article className="about-block reveal reveal-left">
            <span className="section-label">{t("about.solveLabel")}</span>
            <p className="editorial-text">{t("about.solveBody")}</p>
          </article>

          <article className="about-block reveal reveal-right">
            <span className="section-label">{t("about.visionLabel")}</span>
            <p className="editorial-text">{t("about.visionBody")}</p>
          </article>

          <article className="about-block reveal reveal-up">
            <span className="section-label">{t("about.involvedLabel")}</span>
            <p className="editorial-text">{t("about.involvedBody")}</p>
            <Link href="/login" className="btn-primary">
              {t("cta.primary")}
            </Link>
          </article>
        </div>
      </section>
      <Footer />
    </>
  );
}
