"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

/** Even 60° orbit: index 0 = 12 o'clock, then clockwise. Same radius for every sector. */
function hubSlotTransform(index: number, radius: number): CSSProperties {
  const deg = index * 60 - 90;
  const rad = (deg * Math.PI) / 180;
  const x = Math.sin(rad) * radius;
  const y = -Math.cos(rad) * radius;
  return {
    transform: `translate(${x}px, ${y}px)`,
  };
}
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";

type FutureNodeProps = {
  className: string;
  title: string;
  detail: string;
  delayClass: string;
};

function FutureNode({ className, title, detail, delayClass }: FutureNodeProps) {
  const [active, setActive] = useState(false);
  const [typedLength, setTypedLength] = useState(0);

  useEffect(() => {
    if (!active) {
      setTypedLength(0);
      return;
    }

    let len = 0;
    let nextAt = performance.now();
    let raf = 0;
    let cancelled = false;

    const step = (now: number) => {
      if (cancelled) return;
      if (len >= detail.length) return;
      if (now < nextAt) {
        raf = requestAnimationFrame(step);
        return;
      }
      const delay = detail[len] === " " ? 10 : 18;
      len += 1;
      setTypedLength(len);
      nextAt = now + delay;
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [active, detail]);

  return (
    <button
      type="button"
      className={`future-node ${className} ${delayClass} ${active ? "is-active" : ""}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onTouchStart={() => setActive((current) => !current)}
    >
      <span className="future-node-glow" aria-hidden="true" />
      <span className="future-node-label">{title}</span>
      <span className={`future-node-detail ${active ? "is-visible" : ""}`}>
        <span className="future-node-detail-inner">
          {active ? detail.slice(0, typedLength) : ""}
          <span className="future-node-caret" aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}

export function FuturePlansSection() {
  useScrollReveal("#future-plans .reveal");
  const { t } = useTranslation();
  const [orbitR, setOrbitR] = useState(236);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 760) return;
      if (w <= 980) setOrbitR(198);
      else if (w <= 1180) setOrbitR(218);
      else setOrbitR(236);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* Order = position clockwise from top: 12, 2, 4, 6, 8, 10 o'clock at equal radius */
  const sectors = [
    { key: "education", className: "future-node-education" },
    { key: "health", className: "future-node-health" },
    { key: "banking", className: "future-node-banking" },
    { key: "support", className: "future-node-support" },
    { key: "government", className: "future-node-government" },
    { key: "agri", className: "future-node-agri" },
  ];

  return (
    <section className="section future-plans" id="future-plans">
      <div className="container">
        <span className="section-label section-label-center reveal reveal-fade">{t("future.label")}</span>
        <p className="future-vision-copy reveal reveal-up">{t("future.body")}</p>
        <div className="future-scene reveal reveal-fade">
          <div className="future-scene-aura future-scene-aura-1" aria-hidden="true" />
          <div className="future-scene-aura future-scene-aura-2" aria-hidden="true" />
          <div className="future-scene-cloud future-scene-cloud-1" aria-hidden="true" />
          <div className="future-scene-cloud future-scene-cloud-2" aria-hidden="true" />

          <div className="future-hub">
            <svg className="future-scene-lines" viewBox="0 0 1200 780" aria-hidden="true">
              <defs>
                <linearGradient id="futureVisionBranch" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(214,112,63,0.9)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.12)" />
                </linearGradient>
              </defs>

              <circle className="future-loop-mini-path future-loop-mini-path-1" cx="600" cy="390" r="158" />
              <circle className="future-loop-mini-path future-loop-mini-path-2" cx="600" cy="390" r="118" />

              <line className="future-ring-tick future-ring-tick-1" x1="600" y1="174" x2="600" y2="146" />
              <line className="future-ring-tick future-ring-tick-2" x1="708" y1="203" x2="722" y2="179" />
              <line className="future-ring-tick future-ring-tick-3" x1="787" y1="282" x2="811" y2="268" />
              <line className="future-ring-tick future-ring-tick-4" x1="816" y1="390" x2="844" y2="390" />
              <line className="future-ring-tick future-ring-tick-5" x1="787" y1="498" x2="811" y2="512" />
              <line className="future-ring-tick future-ring-tick-6" x1="708" y1="577" x2="722" y2="601" />
              <line className="future-ring-tick future-ring-tick-7" x1="600" y1="606" x2="600" y2="634" />
              <line className="future-ring-tick future-ring-tick-8" x1="492" y1="577" x2="478" y2="601" />
              <line className="future-ring-tick future-ring-tick-9" x1="413" y1="498" x2="389" y2="512" />
              <line className="future-ring-tick future-ring-tick-10" x1="384" y1="390" x2="356" y2="390" />
              <line className="future-ring-tick future-ring-tick-11" x1="413" y1="282" x2="389" y2="268" />
              <line className="future-ring-tick future-ring-tick-12" x1="492" y1="203" x2="478" y2="179" />

              <path className="future-branch-path future-branch-path-1" d="M600 390L600 204" pathLength="100" />
              <path className="future-branch-path future-branch-path-2" d="M600 390L761 297" pathLength="100" />
              <path className="future-branch-path future-branch-path-3" d="M600 390L761 483" pathLength="100" />
              <path className="future-branch-path future-branch-path-4" d="M600 390L600 576" pathLength="100" />
              <path className="future-branch-path future-branch-path-5" d="M600 390L439 483" pathLength="100" />
              <path className="future-branch-path future-branch-path-6" d="M600 390L439 297" pathLength="100" />
            </svg>

            <div className="future-hub-core">
              <div className="future-loop-mini">
                <div className="future-loop-mini-rings" aria-hidden="true">
                  <span className="future-loop-mini-ring future-loop-mini-ring-1" />
                  <span className="future-loop-mini-ring future-loop-mini-ring-2" />
                  <span className="future-loop-mini-ring future-loop-mini-ring-3" />
                </div>
                <div className="future-loop-mini-core">{t("future.core")}</div>
              </div>
            </div>

            <div className="future-hub-orbit">
              {sectors.map((sector, index) => (
                <div
                  key={sector.key}
                  className="future-hub-slot"
                  style={hubSlotTransform(index, orbitR)}
                >
                  <div className="future-hub-slot-inner">
                    <FutureNode
                      className={sector.className}
                      delayClass={`future-node-delay-${index + 1}`}
                      title={t(`future.${sector.key}.title`)}
                      detail={t(`future.${sector.key}.body`)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
