"use client";

import type { MouseEvent } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getStudioTarget } from "@/lib/supabaseClient";
import { useTranslation } from "@/hooks/useTranslation";

export function HeroSection() {
  useScrollReveal("#hero .reveal");
  const { t } = useTranslation();

  const onPrimaryClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = await getStudioTarget();
    window.location.href = target;
  };

  return (
    <section className="hero-section" id="hero">
      <div className="hero-glow" />
      <div className="hero-silhouette" aria-hidden="true" />
      <div className="hero-ghost" aria-hidden="true">
        {t("hero.ghost")}
      </div>

      <div className="hero-content reveal reveal-up">
        <span className="hero-label">// {t("hero.label")}</span>
        <h1 className="hero-title">{t("hero.title")}</h1>
        <p className="hero-sub">{t("hero.subtitle")}</p>
        <p className="hero-body">{t("hero.body")}</p>
        <div className="hero-buttons">
          <a href="/login" className="btn-primary" onClick={onPrimaryClick}>
            {t("hero.primaryCta")}
          </a>
          <a href="#mission" className="btn-secondary">
            {t("hero.secondaryCta")}
          </a>
        </div>
      </div>
    </section>
  );
}
