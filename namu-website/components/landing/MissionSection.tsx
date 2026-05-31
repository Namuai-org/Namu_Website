"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./mission-section.module.css";

export function MissionSection() {
  useScrollReveal("#mission .reveal");
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, 0.2);

  return (
    <section ref={sectionRef} className="section mission mission-editorial" id="mission">
      <div className={`container mission-editorial-inner ${styles.missionStack}`}>
        <span className="section-label section-label-center reveal reveal-fade">{t("mission.label")}</span>

        <div className={styles.missionCenter}>
          <div className={`${styles.quoteEnter} ${inView ? styles.isIn : ""}`}>
            <div className={styles.quoteInner}>
              <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
              <blockquote className={styles.quoteText}>{t("mission.quote")}</blockquote>
              <div className={styles.quoteAttribution}>
                <span className={`${styles.quoteMark} ${styles.quoteMarkClose}`} aria-hidden="true">&rdquo;</span>
                <p className={styles.missionCredit}>{t("mission.attributionLine")}</p>
              </div>
            </div>
          </div>

          <p className={`${styles.missionStatement} ${inView ? styles.isIn : ""}`}>{t("mission.statement1")}</p>
        </div>
      </div>
    </section>
  );
}
