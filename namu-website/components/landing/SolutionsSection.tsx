"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./solutions-section.module.css";

const STEP_IDS = ["1", "2", "3"] as const;
const PANEL_COUNT = STEP_IDS.length + 1; // intro + 3 steps = 4

export function SolutionsSection() {
  const { t } = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState(0);

  const steps = STEP_IDS.map((id) => ({
    id,
    num: id.padStart(2, "0"),
    title: t(`solution.step${id}.title`),
    body: t(`solution.step${id}.body`),
  }));

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 768) return;

    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    let rafId = 0;
    let targetX = 0;
    let liveX = 0;

    const readScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const range = wrapper.offsetHeight - window.innerHeight;
      if (range <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / range));
      targetX = -(window.innerWidth * (PANEL_COUNT - 1)) * progress;
      setActivePanel(Math.round(progress * (PANEL_COUNT - 1)));
    };

    const animate = () => {
      // lerp gives the scrub-like feel without depending on GSAP ScrollTrigger
      liveX += (targetX - liveX) * 0.12;
      if (Math.abs(targetX - liveX) < 0.05) liveX = targetX;
      track.style.transform = `translateX(${liveX}px)`;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);
    readScroll();
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
      cancelAnimationFrame(rafId);
      track.style.transform = "";
    };
  }, []);

  return (
    <section id="solutions" aria-label={t("solution.label")}>
      <div ref={wrapperRef} className={styles.wrapper}>
        <div className={styles.stage}>
          <div ref={trackRef} className={styles.track}>

            {/* Intro panel */}
            <div className={`${styles.panel} ${styles.introPanel}`}>
              <div className={styles.content}>
                <span className={styles.label}>{t("solution.label")}</span>
                <span className={styles.rule} aria-hidden="true" />
                <h2 className={`${styles.title} ${styles.introTitle}`}>
                  {t("solution.intro.title")}
                </h2>
                <p className={styles.body}>{t("solution.intro.body")}</p>
              </div>
            </div>

            {/* Step panels */}
            {steps.map((step) => (
              <div key={step.id} className={styles.panel}>
                <span className={styles.bigNum} aria-hidden="true">
                  {step.num}
                </span>
                <div className={styles.content}>
                  <span className={styles.label}>{t("solution.label")}</span>
                  <span className={styles.rule} aria-hidden="true" />
                  <span className={styles.stepNum}>
                    {step.num} / 0{STEP_IDS.length}
                  </span>
                  <h2 className={styles.title}>{step.title}</h2>
                  <p className={styles.body}>{step.body}</p>
                </div>
              </div>
            ))}

          </div>

          <div className={styles.dots} aria-hidden="true">
            {Array.from({ length: PANEL_COUNT }, (_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i === activePanel ? styles.dotActive : ""}`}
              />
            ))}
          </div>

          <span className={styles.scrollHint} aria-hidden="true">scroll</span>
        </div>
      </div>
    </section>
  );
}
