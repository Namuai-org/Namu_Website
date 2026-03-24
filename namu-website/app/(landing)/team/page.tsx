"use client";

import { Footer } from "@/components/landing/Footer";
import { HeroEntrance } from "@/components/landing/HeroEntrance";
import { NavBar } from "@/components/landing/NavBar";
import { useTranslation } from "@/hooks/useTranslation";

export default function TeamPage() {
  const { t } = useTranslation();

  return (
    <>
      <NavBar />
      <section className="page-hero team-page">
        <div className="container narrow">
          <HeroEntrance>
            <span className="section-label section-label-center">{t("team.label")}</span>
            <h1 className="page-title">{t("team.title")}</h1>
            <p className="team-page-intro">{t("team.intro")}</p>
          </HeroEntrance>
        </div>
      </section>

      <section className="section team-page-shell">
        <div className="container article">
          <article className="team-hero-card">
            <div className="team-hero-copy">
              <span className="team-kicker">{t("team.kicker")}</span>
              <h2>{t("team.founder.name")}</h2>
              <p className="team-role">{t("team.founder.role")}</p>
              <p className="team-bio team-bio-lead">{t("team.founder.bio1")}</p>
              <p className="team-bio">{t("team.founder.bio2")}</p>
            </div>

            <div className="team-side-note">
              <p>{t("team.note")}</p>
              <a href="mailto:hello@namu.ai" className="team-contact-link">
                hello@namu.ai
              </a>
            </div>
          </article>

          <section className="team-values-grid">
            <article className="team-value-card">
              <span className="team-value-label">{t("team.value1.label")}</span>
              <p>{t("team.value1.body")}</p>
            </article>
            <article className="team-value-card">
              <span className="team-value-label">{t("team.value2.label")}</span>
              <p>{t("team.value2.body")}</p>
            </article>
            <article className="team-value-card">
              <span className="team-value-label">{t("team.value3.label")}</span>
              <p>{t("team.value3.body")}</p>
            </article>
          </section>
        </div>
      </section>
      <Footer />
    </>
  );
}
