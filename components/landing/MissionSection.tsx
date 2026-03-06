"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";

export function MissionSection() {
  useScrollReveal("#mission .reveal");
  const { t } = useTranslation();

  return (
    <section className="section mission" id="mission">
      <div className="container mission-single">
        <span className="section-label reveal reveal-fade">{t("mission.label")}</span>
        <div className="mission-accent reveal reveal-fade" />
        <blockquote className="mission-quote reveal reveal-up">{t("mission.quote")}</blockquote>
        <div className="mission-copy reveal reveal-up">
          <p>{t("mission.p1")}</p>
          <p>{t("mission.p2")}</p>
        </div>
      </div>
    </section>
  );
}
