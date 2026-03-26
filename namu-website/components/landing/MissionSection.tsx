"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./mission-section.module.css";

export function MissionSection() {
  useScrollReveal("#mission .reveal");
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [blocksInView, setBlocksInView] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBlocksInView(true);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBlocksInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const inClass = blocksInView ? styles.isIn : "";

  return (
    <section ref={sectionRef} className="section mission mission-editorial" id="mission">
      <div className={`container mission-editorial-inner ${styles.missionStack}`}>
        <span className="section-label section-label-center reveal reveal-fade">{t("mission.label")}</span>

        <div className={styles.missionCenter}>
          <div className={`${styles.quoteEnter} ${inClass}`}>
            <div className={styles.quoteInner}>
              <span className={styles.quoteMark} aria-hidden="true">
                &ldquo;
              </span>
              <blockquote className={styles.quoteText}>{t("mission.quote")}</blockquote>
              <div className={styles.quoteAttribution}>
                <span className={`${styles.quoteMark} ${styles.quoteMarkClose}`} aria-hidden="true">
                  &rdquo;
                </span>
                <p className={styles.missionCredit}>{t("mission.attributionLine")}</p>
              </div>
            </div>
          </div>

          <p className={`${styles.missionStatement} ${inClass}`}>{t("mission.statement1")}</p>
        </div>
      </div>
    </section>
  );
}
