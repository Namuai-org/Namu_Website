"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";

const pillarKeys = [
  { title: "mission.pillar1Title" as const, body: "mission.pillar1Body" as const },
  { title: "mission.pillar2Title" as const, body: "mission.pillar2Body" as const },
  { title: "mission.pillar3Title" as const, body: "mission.pillar3Body" as const },
];

export function MissionSection() {
  useScrollReveal("#mission .reveal");
  const { t } = useTranslation();

  return (
    <section className="section mission mission-editorial" id="mission">
      <div className="container mission-editorial-inner">
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

          <div className="mission-stand">
            <p className="mission-stand-kicker">{t("mission.standKicker")}</p>
            <h2 className="mission-stand-headline">{t("mission.standHeadline")}</h2>
            <p className="mission-stand-lead">{t("mission.standLead")}</p>
            <div className="mission-stand-body">
              <p>{t("mission.p2")}</p>
              <p>{t("mission.p3")}</p>
            </div>
          </div>
        </div>

        <ul className="mission-pillars reveal reveal-fade" aria-label={t("mission.standKicker")}>
          {pillarKeys.map((pillar, index) => (
            <li key={pillar.title} className={`mission-pillar mission-pillar-${index + 1}`}>
              <span className="mission-pillar-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mission-pillar-title">{t(pillar.title)}</h3>
              <p className="mission-pillar-body">{t(pillar.body)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
