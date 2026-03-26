"use client";

import { useEffect, useState } from "react";
import { HeroEntrance } from "@/components/landing/HeroEntrance";
import { useTranslation } from "@/hooks/useTranslation";

export function HeroSection() {
  const { t } = useTranslation();
  const heroBody = t("hero.body");
  const [typedLength, setTypedLength] = useState(0);

  useEffect(() => {
    setTypedLength(0);
  }, [heroBody]);

  useEffect(() => {
    let len = 0;
    let nextAt = performance.now();
    let raf = 0;
    let cancelled = false;

    const step = (now: number) => {
      if (cancelled) return;
      if (len >= heroBody.length) return;
      if (now < nextAt) {
        raf = requestAnimationFrame(step);
        return;
      }
      const nextCharacter = heroBody[len];
      const delay = nextCharacter === " " ? 16 : len < 10 ? 34 : 22;
      len += 1;
      setTypedLength(len);
      nextAt = now + delay;
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [heroBody]);

  return (
    <section className="hero-section" id="hero">
      <div className="hero-glow" />
      <div className="hero-silhouette" aria-hidden="true" />

      <HeroEntrance className="hero-content hero-content-home">
        <span className="section-label section-label-center hero-child">{t("hero.kicker")}</span>
        <h1 className="hero-title hero-child">
          <span className="hero-title-line">{t("hero.titleTop")}</span>
          <span className="hero-title-line hero-title-line-bottom">{t("hero.titleBottom")}</span>
        </h1>
        <p className="hero-body-home hero-child">
          {heroBody.slice(0, typedLength)}
          {typedLength < heroBody.length ? <span className="hero-body-caret" aria-hidden="true" /> : null}
        </p>

        <div className="hero-actions hero-child">
          <a href="#waitlist" className="btn-primary hero-primary">
            {t("hero.primaryCta")}
          </a>
          <a href="/login" className="btn-secondary hero-secondary">
            {t("hero.secondaryCta")}
          </a>
        </div>
      </HeroEntrance>
    </section>
  );
}
