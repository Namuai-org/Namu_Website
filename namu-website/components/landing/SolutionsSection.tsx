"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./solutions-section.module.css";

const STEP_IDS = ["1", "2", "3"] as const;
const PANEL_COUNT = STEP_IDS.length + 1;

const STEP_IMAGES = {
  "1": { src: "/step1.jpeg", alt: "Namu Studio — AI workspace for Hausa speakers" },
  "2": { src: "/step2.webp", alt: "Infrastructure and model hosting"               },
  "3": { src: "/step3.webp", alt: "Real interactions improving the system"         },
} as const;

/* ─── Step image card ─── */
function StepImage({ step }: { step: "1" | "2" | "3" }) {
  const img = STEP_IMAGES[step];
  return (
    <div className={styles.imageCard}>
      <Image
        src={img.src}
        alt={img.alt}
        fill
        unoptimized
        className={styles.stepImage}
        sizes="(max-width: 767px) 100vw, 55vw"
      />
      <div className={styles.imageOverlay} aria-hidden="true" />
    </div>
  );
}

/* ─── Main section ─── */
export function SolutionsSection() {
  const { t } = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState(0);

  const steps = STEP_IDS.map((id) => ({
    id,
    num: id.padStart(2, "0"),
    title: t(`solution.step${id}.title`),
    body:  t(`solution.step${id}.body`),
  }));

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wrapper = wrapperRef.current;
    const track   = trackRef.current;
    if (!wrapper || !track) return;

    const panelEls = Array.from(track.querySelectorAll<HTMLElement>("[data-panel]"));

    // Use visualViewport for accurate height on mobile (handles iOS address bar)
    const vh = () => window.visualViewport?.height ?? window.innerHeight;

    const update = () => {
      const rect  = wrapper.getBoundingClientRect();
      const range = wrapper.offsetHeight - vh();
      if (range <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / range));

      for (let i = 1; i < PANEL_COUNT; i++) {
        const start = (i - 1) / (PANEL_COUNT - 1);
        const end   = i       / (PANEL_COUNT - 1);
        const p     = Math.max(0, Math.min(1, (progress - start) / (end - start)));
        panelEls[i].style.clipPath = `inset(${(1 - p) * 100}% 0 0 0)`;
        if (p > 0.28) panelEls[i].classList.add(styles.panelVisible);
        else          panelEls[i].classList.remove(styles.panelVisible);
      }

      setActivePanel(Math.min(PANEL_COUNT - 1, Math.round(progress * (PANEL_COUNT - 1))));
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // visualViewport fires when the mobile keyboard or address bar resizes the view
    window.visualViewport?.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);

  const panels = [
    {
      key: "intro", bg: styles.bg0, stepId: null as null, ghost: null,
      text: (
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.badgeLabel}>{t("solution.label")}</span>
          </div>
          <hr className={styles.rule} />
          <h2 className={`${styles.title} ${styles.introTitle}`}>
            {t("solution.intro.title")}
          </h2>
          <p className={styles.body}>{t("solution.intro.body")}</p>
        </div>
      ),
    },
    ...steps.map((step) => ({
      key: step.id,
      bg: styles[`bg${step.id}` as keyof typeof styles],
      stepId: step.id as "1" | "2" | "3",
      ghost: step.num,
      text: (
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.badgeLabel}>{t("solution.label")}</span>
            <span className={styles.badgeSep} aria-hidden="true" />
            <span className={styles.badgeStep}>{step.num} / 0{STEP_IDS.length}</span>
          </div>
          <hr className={styles.rule} />
          <h2 className={styles.title}>{step.title}</h2>
          <p className={styles.body}>{step.body}</p>
        </div>
      ),
    })),
  ];

  return (
    <section id="solutions" aria-label={t("solution.label")}>
      <div ref={wrapperRef} className={styles.wrapper}>
        <div className={styles.stage}>
          <div ref={trackRef} className={styles.track}>
            {panels.map((panel, i) => (
              <div
                key={panel.key}
                data-panel={i}
                className={`${styles.panel} ${panel.bg} ${i === 0 ? styles.panelVisible : ""}`}
                style={{ zIndex: i + 1 }}
              >
                <div className={styles.textCol}>
                  {panel.ghost && (
                    <span className={styles.ghostNum} aria-hidden="true">
                      {panel.ghost}
                    </span>
                  )}
                  {panel.text}
                </div>

                {panel.stepId !== null && (
                  <div className={styles.diagramCol}>
                    <StepImage step={panel.stepId} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.progressRail} aria-hidden="true">
            {Array.from({ length: PANEL_COUNT }, (_, i) => (
              <span key={i}
                className={`${styles.railDot} ${i === activePanel ? styles.railDotActive : ""}`} />
            ))}
          </div>

          <div className={styles.scrollHint} aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M3 9l4 4 4-4" stroke="currentColor" strokeWidth="1.4"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>scroll</span>
          </div>
        </div>
      </div>
    </section>
  );
}
