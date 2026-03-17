"use client";

import { Footer } from "@/components/landing/Footer";
import { NavBar } from "@/components/landing/NavBar";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";

export default function PitchPage() {
  const { t } = useTranslation();
  useScrollReveal(".reveal");

  return (
    <>
      <NavBar />
      <section className="page-hero" id="pitch-page">
        <div className="container narrow">
          <span className="section-label reveal reveal-fade">{t("pitch.heroLabel")}</span>
          <h1 className="hero-title page-title reveal reveal-up">{t("pitch.heroTitle")}</h1>
          <p className="hero-sub reveal reveal-up">{t("pitch.heroSub")}</p>
        </div>
      </section>

      <section className="section pitch-page">
        <div className="container article pitch-grid">
          <article className="about-block pitch-card reveal reveal-up">
            <span className="section-label">{t("pitch.card1.label")}</span>
            <h2 className="title">{t("pitch.card1.title")}</h2>
            <p className="research-copy">{t("pitch.card1.body")}</p>
          </article>

          <article className="about-block pitch-card reveal reveal-up">
            <span className="section-label">{t("pitch.card2.label")}</span>
            <h2 className="title">{t("pitch.card2.title")}</h2>
            <p className="research-copy">{t("pitch.card2.body")}</p>
          </article>

          <article className="about-block pitch-card reveal reveal-up">
            <span className="section-label">{t("pitch.card3.label")}</span>
            <h2 className="title">{t("pitch.card3.title")}</h2>
            <p className="research-copy">{t("pitch.card3.body")}</p>
          </article>

          <article className="about-block pitch-card reveal reveal-up pitch-card-wide">
            <span className="section-label">{t("pitch.card4.label")}</span>
            <h2 className="title">{t("pitch.card4.title")}</h2>
            <p className="research-copy">{t("pitch.card4.body")}</p>
            <a href="/contact" className="btn-primary pitch-cta">
              {t("pitch.cta")}
            </a>
          </article>
        </div>
      </section>
      <Footer />
    </>
  );
}
