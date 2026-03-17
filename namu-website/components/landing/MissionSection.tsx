"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";

export function MissionSection() {
  useScrollReveal("#mission .reveal");
  const { t } = useTranslation();

  return (
    <section className="section mission mission-editorial" id="mission">
      <div className="container">
        <span className="section-label section-label-center reveal reveal-fade">{t("mission.label")}</span>
        <div className="mission-layout reveal reveal-up">
          <aside className="mission-quote-shell">
            <span className="mission-mark" aria-hidden="true">
              "
            </span>
            <blockquote className="mission-quote">{t("mission.quote")}</blockquote>
            <div className="mission-attribution">
              <p className="mission-author">{t("mission.author")}</p>
              <p className="mission-role">{t("mission.role")}</p>
              <p className="mission-signature" aria-label={t("mission.author")}>
                <span className="mission-signature-text">{t("mission.signature")}</span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
