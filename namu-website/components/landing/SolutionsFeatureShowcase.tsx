"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

const FEATURE_IDS = ["write", "plan", "code"] as const;

export function SolutionsFeatureShowcase() {
  const { t } = useTranslation();

  return (
    <section className="solutions-features">
      <div className="solutions-features-head-frame reveal reveal-up">
        <div className="solutions-features-head">
          <span className="section-label section-label-center">{t("solutions.featuresLabel")}</span>
          <h3 className="solutions-features-title">{t("solutions.featuresTitle")}</h3>
          <p className="solutions-features-intro">{t("solutions.featuresIntro")}</p>
        </div>
      </div>

      <div className="solutions-feature-stack">
        {FEATURE_IDS.map((id, index) => {
          const sideClass = index % 2 === 1 ? "solutions-feature-card-left reveal reveal-left" : "solutions-feature-card-right reveal reveal-right";

          return (
            <article
              key={id}
              className={`solutions-feature-card ${sideClass}`}
            >
              <div className="solutions-feature-copy">
                <span className="solutions-feature-kicker">{t(`solutions.feature.${id}.label`)}</span>
                <h4>{t(`solutions.feature.${id}.title`)}</h4>
                <p>{t(`solutions.feature.${id}.body`)}</p>
                <div className="solutions-feature-pills">
                  <span>{t(`solutions.feature.${id}.pill1`)}</span>
                  <span>{t(`solutions.feature.${id}.pill2`)}</span>
                </div>
              </div>

              <div className="solutions-feature-visual">
                <div className="solutions-feature-surface">
                  <div className="solutions-feature-image-wrap">
                    <Image
                      src={`/feature-${id}.jpg`}
                      alt={t(`solutions.feature.${id}.title`)}
                      fill
                      quality={100}
                      className="solutions-feature-image"
                      sizes="(max-width: 1023px) 100vw, 56vw"
                    />
                  </div>

                  <div className={`solutions-feature-float solutions-feature-float-main solutions-feature-float-${id}`}>
                    <span className="solutions-feature-float-tag">{t(`solutions.feature.${id}.overlayLabel`)}</span>
                    <strong>{t(`solutions.feature.${id}.overlayTitle`)}</strong>
                    <p>{t(`solutions.feature.${id}.overlayBody`)}</p>
                  </div>

                  <div className={`solutions-feature-float solutions-feature-float-support solutions-feature-float-support-${id}`}>
                    <span>{t(`solutions.feature.${id}.support1`)}</span>
                    <span>{t(`solutions.feature.${id}.support2`)}</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
