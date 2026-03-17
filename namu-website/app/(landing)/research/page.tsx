"use client";

import { Footer } from "@/components/landing/Footer";
import { NavBar } from "@/components/landing/NavBar";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";

export default function ResearchPage() {
  const { t } = useTranslation();
  useScrollReveal(".reveal");

  return (
    <>
      <NavBar />
      <section className="page-hero" id="research-page">
        <div className="container narrow">
          <span className="section-label reveal reveal-fade">{t("research.heroLabel")}</span>
          <h1 className="hero-title page-title reveal reveal-up">{t("research.heroTitle")}</h1>
          <p className="hero-sub reveal reveal-up">{t("research.heroSub")}</p>
        </div>
      </section>

      <section className="section research-page">
        <div className="container article research-grid">
          <article className="about-block research-card reveal reveal-up">
            <span className="section-label">{t("research.area1.label")}</span>
            <h2 className="title">{t("research.area1.title")}</h2>
            <p className="research-copy">{t("research.area1.body")}</p>
          </article>

          <article className="about-block research-card reveal reveal-up">
            <span className="section-label">{t("research.area2.label")}</span>
            <h2 className="title">{t("research.area2.title")}</h2>
            <p className="research-copy">{t("research.area2.body")}</p>
          </article>

          <article className="about-block research-card reveal reveal-up">
            <span className="section-label">{t("research.area3.label")}</span>
            <h2 className="title">{t("research.area3.title")}</h2>
            <p className="research-copy">{t("research.area3.body")}</p>
          </article>

          <article className="about-block research-card reveal reveal-up research-card-wide">
            <span className="section-label">{t("research.approachLabel")}</span>
            <h2 className="title">{t("research.approachTitle")}</h2>
            <p className="research-copy">{t("research.approachBody")}</p>
            <a href="/contact" className="btn-secondary research-cta">
              {t("research.cta")}
            </a>
          </article>
        </div>
      </section>
      <Footer />
    </>
  );
}
