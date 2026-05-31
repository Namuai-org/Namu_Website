"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { useTranslation } from "@/hooks/useTranslation";
import { NamuLogoMark } from "@/components/brand/NamuLogoMark";
import styles from "./solutions-macbook-demo.module.css";
import { StudioDemo } from "./StudioDemo";

/** Split workplace CTA copy into two lines (question + follow-up). */
function splitWorkplaceCtaBody(text: string): [string, string] {
  const q = text.indexOf("?");
  if (q === -1) return [text.trim(), ""];
  return [text.slice(0, q + 1).trim(), text.slice(q + 1).trim()];
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function smoothStep(value: number) {
  return value * value * (3 - 2 * value);
}

export function SolutionsMacBookDemoSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const scaleWrapRef = useRef<HTMLDivElement>(null);
  const floatWrapRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<"desktop" | "mobile" | "reduce">("desktop");

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (mqReduce.matches) setMode("reduce");
      else if (window.innerWidth < 768) setMode("mobile");
      else setMode("desktop");
    };
    update();
    mqReduce.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mqReduce.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const cardInView = useInView(cardRef, 0.15);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sectionEl = sectionRef.current;
    const scaleEl = scaleWrapRef.current;
    const floatEl = floatWrapRef.current;
    const lidEl = lidRef.current;
    const screenEl = screenRef.current;
    const glowEl = glowRef.current;
    if (!sectionEl || !scaleEl || !floatEl || !lidEl || !screenEl || !glowEl) return;

    const render = (rawProgress: number) => {
      const closedProgress = smoothStep(1 - clamp(rawProgress, 0, 1));
      const openProgress = 1 - closedProgress;
      const bodyProgress = Math.pow(openProgress, 0.88);
      const lidAngle = closedProgress * -90;
      const scale = 1 - bodyProgress * 0.018;
      const lift = -1 - bodyProgress * 7;
      const sway = 0;
      const pitch = (1 - bodyProgress) * 1.1;
      const floatY = bodyProgress * 6;
      const glowOpacity = 0.15 + openProgress * 0.11;
      const screenBrightness = 1.01 + openProgress * 0.06;
      const screenSaturation = 0.98 + openProgress * 0.07;

      scaleEl.style.opacity = "1";
      scaleEl.style.transform = `translate3d(0, ${lift}px, 0) scale(${scale})`;
      floatEl.style.transform = `translate3d(0, ${floatY}px, 0) rotateX(${pitch}deg) rotateY(${sway}deg)`;
      lidEl.style.transform = `rotateX(${lidAngle}deg)`;
      screenEl.style.opacity = `${0.92 + openProgress * 0.08}`;
      screenEl.style.filter = `brightness(${screenBrightness}) saturate(${screenSaturation})`;
      glowEl.style.opacity = `${glowOpacity}`;
    };

    if (mode !== "desktop") {
      render(0);
      return;
    }

    const measure = () => {
      const rect = sectionEl.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const start = viewportH * 0.72;
      const end = viewportH * 0.18;
      const travel = Math.max(1, rect.height + start - end);
      const rawProgress = clamp((start - rect.top) / travel, 0, 1);
      render(rawProgress);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [mode]);

  const rootClass =
    mode === "reduce"
      ? `${styles.root} ${styles.reduceMotion}`
      : mode === "mobile"
        ? `${styles.root} ${styles.mobileStatic}`
        : styles.root;

  const [ctaLine1, ctaLine2] = splitWorkplaceCtaBody(t("solutions.workplaceCtaBody"));

  const reduceMotion = mode === "reduce";
  const showDemoControls = false;
  const showDemoStoryPills = false;

  return (
    <section className={rootClass} aria-labelledby="mockup-workspace-heading">
      <div className={styles.copy}>
        <span className={styles.copyLabel}>{t("solutions.mockupSectionLabel")}</span>
        <h3 id="mockup-workspace-heading" className={styles.copyTitle}>
          {t("solutions.mockupSectionTitle")}
        </h3>
        <p className={styles.copySub}>{t("solutions.mockupSectionSubline")}</p>
      </div>

      <div ref={sectionRef} className={styles.scrollStage} id="solutions-demo" aria-label={t("solutions.deviceAlt")}>
        <div className={styles.sticky}>
          <div className={styles.perspective}>
            <div ref={glowRef} className={styles.glow} aria-hidden />
            <div ref={scaleWrapRef} className={styles.assemblyScale}>
              <div className={styles.responsiveScale}>
                <div ref={floatWrapRef} className={styles.assemblyFloat}>
                  <div className={styles.unit}>
                    <div className={styles.base}>
                      <div className={styles.lidAnchor}>
                        <div ref={lidRef} className={styles.lidPivot}>
                          <div className={styles.lidMesh}>
                            <div className={styles.hingeBar} aria-hidden />
                            <div className={styles.lidInner}>
                              <div className={styles.notch} aria-hidden />
                              <div ref={screenRef} className={styles.screenClip}>
                                <div className={styles.desktopScene} aria-hidden>
                                  <div className={styles.desktopWallpaper} />
                                  <div className={styles.desktopMenuBar}>
                                    <div className={styles.menuBarLeft}>
                                      <span className={styles.menuBarBrandMark}>
                                        <NamuLogoMark variant="onDark" height={16} />
                                      </span>
                                      <span className={styles.menuBarLabel}>Namu</span>
                                    </div>
                                    <div className={styles.menuBarRight}>
                                      <span className={styles.menuStatusIcon} aria-hidden="true">
                                        <svg viewBox="0 0 24 24">
                                          <path
                                            d="M3.5 9.5C5.9 7.1 8.8 6 12 6s6.1 1.1 8.5 3.5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.9"
                                            strokeLinecap="round"
                                          />
                                          <path
                                            d="M6.7 12.7C8.2 11.2 10 10.5 12 10.5s3.8 0.7 5.3 2.2"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.9"
                                            strokeLinecap="round"
                                          />
                                          <path
                                            d="M9.8 15.8c0.6-0.6 1.4-0.9 2.2-0.9s1.6 0.3 2.2 0.9"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.9"
                                            strokeLinecap="round"
                                          />
                                          <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                                        </svg>
                                      </span>
                                      <span className={styles.menuStatusIcon} aria-hidden="true">
                                        <svg viewBox="0 0 24 24">
                                          <defs>
                                            <linearGradient id="siriOrb" x1="0" y1="0" x2="1" y2="1">
                                              <stop offset="0%" stopColor="#9fd7ff" />
                                              <stop offset="50%" stopColor="#d6703f" />
                                              <stop offset="100%" stopColor="#7aa7d8" />
                                            </linearGradient>
                                          </defs>
                                          <circle cx="12" cy="12" r="7.5" fill="none" stroke="url(#siriOrb)" strokeWidth="2.2" />
                                          <path
                                            d="M12 4.8a7.2 7.2 0 0 1 7.2 7.2"
                                            fill="none"
                                            stroke="#fff7ef"
                                            strokeOpacity="0.9"
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                          />
                                        </svg>
                                      </span>
                                    </div>
                                  </div>
                                  <div className={styles.desktopWindow}>
                                    <div className={styles.desktopWindowBar}>
                                      <div className={styles.windowTrafficLights}>
                                        <span className={`${styles.trafficLight} ${styles.trafficLightRed}`} />
                                        <span className={`${styles.trafficLight} ${styles.trafficLightYellow}`} />
                                        <span className={`${styles.trafficLight} ${styles.trafficLightGreen}`} />
                                      </div>
                                      <span className={styles.desktopWindowTitle}>
                                        <span className={styles.windowBrandMark}>
                                          <NamuLogoMark variant="onDark" height={15} />
                                        </span>
                                        <span>Namu AI-Studio</span>
                                      </span>
                                    </div>
                                    <div className={styles.screenDemoWrap}>
                                      <div className={styles.screenDemoScale}>
                                        <StudioDemo
                                          autoPlay={!reduceMotion}
                                          loop={!reduceMotion}
                                          startDelayMs={0}
                                          showControls={showDemoControls}
                                          showStoryPills={showDemoStoryPills}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className={styles.desktopDock}>
                                    <span className={`${styles.dockIcon} ${styles.dockIconSafari}`}>
                                      <img src="/macos-icons/safari.png" alt="" />
                                    </span>
                                    <span className={`${styles.dockIcon} ${styles.dockIconApps}`}>
                                      <img src="/macos-icons/apps.png" alt="" />
                                    </span>
                                    <span className={`${styles.dockIcon} ${styles.dockIconNamu}`}>
                                      <NamuLogoMark variant="onDark" height={22} />
                                    </span>
                                    <span className={`${styles.dockIcon} ${styles.dockIconSettings}`}>
                                      <img src="/macos-icons/system-settings.png" alt="" />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.baseTop}>
                        <div className={styles.trackpad} aria-hidden />
                        <div className={styles.magsafe} aria-hidden />
                      </div>
                      <div className={styles.baseFront} aria-hidden />
                      <div className={styles.baseBottom} aria-hidden />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.requestCardOuter}>
        <div ref={cardRef} className={`${styles.requestCard}${cardInView ? ` ${styles.requestCardVisible}` : ""}`}>
          <div className={styles.requestAnimWrap} aria-hidden>
            <div className={styles.requestBlobs}>
              <span className={styles.requestBlob} />
              <span className={styles.requestBlob} />
              <span className={styles.requestBlob} />
            </div>
            <div className={styles.requestAurora} />
            <div className={styles.requestMesh} />
            <div className={styles.requestArcs} />
            <div className={styles.requestSheen} />
          </div>
          <span className={`${styles.requestCornerPill} ${styles.requestCornerTL}`}>{t("solutions.demoCtaCornerTL")}</span>
          <span className={`${styles.requestCornerPill} ${styles.requestCornerBL}`}>{t("solutions.demoCtaCornerBL")}</span>
          <span className={`${styles.requestCornerPill} ${styles.requestCornerTR}`}>{t("solutions.demoCtaCornerTR")}</span>
          <span className={`${styles.requestCornerPill} ${styles.requestCornerBR}`}>{t("solutions.demoCtaCornerBR")}</span>
          <div className={styles.requestCardInner}>
            <p className={styles.requestEyebrow}>{t("solutions.demoCtaLabel")}</p>
            <h4 className={styles.requestTitle}>{t("solutions.demoCtaTitle")}</h4>
            <div className={styles.requestBodyLines}>
              <p className={styles.requestBodyLine}>{ctaLine1}</p>
              {ctaLine2 ? <p className={styles.requestBodyLine}>{ctaLine2}</p> : null}
            </div>
            <Link href="/login" className={styles.requestBtn}>
              {t("solutions.demoCtaLabel")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
