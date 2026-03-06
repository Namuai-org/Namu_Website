"use client";

import type { MouseEvent } from "react";
import { Footer } from "@/components/landing/Footer";
import { NavBar } from "@/components/landing/NavBar";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";
import { getStudioTarget } from "@/lib/supabaseClient";

export default function SolutionsPage() {
  const { t } = useTranslation();
  useScrollReveal(".reveal");

  const onStudioClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = await getStudioTarget();
    window.location.href = target;
  };

  return (
    <>
      <NavBar />
      <section className="page-hero" id="solutions-page">
        <div className="container narrow">
          <span className="section-label reveal reveal-fade">{t("solutions.heroLabel")}</span>
          <h1 className="hero-title page-title reveal reveal-up">{t("solutions.heroTitle")}</h1>
        </div>
      </section>

      <section className="section solutions-page-clean">
        <div className="container article">
          <article className="about-block reveal reveal-up">
            <h2 className="title">{t("solutions.summaryTitle")}</h2>
            <p className="editorial-text">{t("solutions.summaryBody")}</p>
          </article>

          <article className="about-block reveal reveal-up">
            <h3 className="title">{t("solutions.featuresTitle")}</h3>
            <ul className="solution-feature-list">
              <li>{t("solutions.f1")}</li>
              <li>{t("solutions.f2")}</li>
              <li>{t("solutions.f3")}</li>
              <li>{t("solutions.f4")}</li>
              <li>{t("solutions.f5")}</li>
            </ul>
          </article>

          <article className="about-block reveal reveal-up">
            <span className="section-label">{t("solutions.howLabel")}</span>
            <div className="mini-how-grid">
              <div>
                <h4>01</h4>
                <p>{t("how.s1.body")}</p>
              </div>
              <div>
                <h4>02</h4>
                <p>{t("how.s2.body")}</p>
              </div>
              <div>
                <h4>03</h4>
                <p>{t("how.s3.body")}</p>
              </div>
            </div>
            <a href="/login" onClick={onStudioClick} className="btn-primary">
              {t("solution.cta")}
            </a>
          </article>

          <article className="about-block reveal reveal-up">
            <span className="section-label">{t("solutions.visionLabel")}</span>
            <p className="editorial-text">{t("solutions.visionBody")}</p>
          </article>
        </div>
      </section>
      <Footer />
    </>
  );
}
