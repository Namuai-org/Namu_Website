"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";

export function PartnersSection() {
  useScrollReveal("#partners .reveal");
  const { t } = useTranslation();

  return (
    <section className="section partners" id="partners">
      <div className="container center">
        <span className="section-label reveal reveal-fade">{t("partners.label")}</span>
        <p className="partners-intro reveal reveal-up">{t("partners.intro")}</p>
        <div className="partner-pills reveal reveal-up">
          <span>{t("partners.1")}</span>
          <span>{t("partners.2")}</span>
          <span>{t("partners.3")}</span>
          <span>{t("partners.4")}</span>
          <span>{t("partners.5")}</span>
        </div>
      </div>
    </section>
  );
}
