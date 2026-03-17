"use client";

import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";

export function HeroSection() {
  useScrollReveal("#hero .reveal");
  const { t } = useTranslation();
  const heroBody = t("hero.body");
  const [typedLength, setTypedLength] = useState(0);

  useEffect(() => {
    setTypedLength(0);
  }, [heroBody]);

  useEffect(() => {
    if (typedLength >= heroBody.length) return;

    const nextCharacter = heroBody[typedLength];
    const delay = nextCharacter === " " ? 16 : typedLength < 10 ? 34 : 22;
    const timer = window.setTimeout(() => {
      setTypedLength((current) => current + 1);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [heroBody, typedLength]);

  return (
    <section className="hero-section" id="hero">
      <div className="hero-glow" />
      <div className="hero-silhouette" aria-hidden="true" />

      <div className="hero-content reveal reveal-up">
        <span className="section-label section-label-center">{t("hero.kicker")}</span>
        <h1 className="hero-title">
          <span className="hero-title-line">{t("hero.titleTop")}</span>
          <span className="hero-title-line hero-title-line-bottom">{t("hero.titleBottom")}</span>
        </h1>
        <p className="hero-body-home">
          {heroBody.slice(0, typedLength)}
          {typedLength < heroBody.length ? <span className="hero-body-caret" aria-hidden="true" /> : null}
        </p>

        <div className="hero-actions">
          <a href="#waitlist" className="btn-primary hero-primary">
            {t("hero.primaryCta")}
          </a>
          <a href="/contact" className="btn-secondary hero-secondary">
            {t("hero.secondaryCta")}
          </a>
        </div>
      </div>
    </section>
  );
}
