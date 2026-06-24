"use client";

import Image from "next/image";
import { HeroEntrance } from "@/components/landing/HeroEntrance";
import { HeroTicker } from "@/components/landing/HeroTicker";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useTranslation } from "@/hooks/useTranslation";

export function HeroSection() {
  const { t } = useTranslation();
  const heroBody = t("hero.body");
  const typed = useTypewriter(heroBody);

  return (
    <section className="hero-section" id="hero">
      {/* Full-bleed background image */}
      <Image
        src="/hero-glow.jpg"
        alt=""
        fill
        priority
        unoptimized
        sizes="100vw"
        className="hero-bg-image"
      />
      {/* Gradient overlay — darkens edges for text legibility */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* African art symbol ticker at bottom */}
      <HeroTicker />

      <HeroEntrance className="hero-content hero-content-home">
        <span className="section-label section-label-center hero-child">{t("hero.kicker")}</span>
        <h1 className="hero-title hero-child">
          <span className="hero-title-line hero-title-line-bottom">{t("hero.titleTop")}</span>
          <span className="hero-title-line hero-title-line-bottom">{t("hero.titleBottom")}</span>
        </h1>
        <p className="hero-body-home hero-child">
          {typed}
          {typed.length < heroBody.length ? <span className="hero-body-caret" aria-hidden="true" /> : null}
        </p>
      </HeroEntrance>
    </section>
  );
}
