"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { StudioDemo } from "@/components/landing/StudioDemo";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useTranslation } from "@/hooks/useTranslation";

const OPEN_ANGLE = -112;
/** Slightly lower = heavier, more “physical” lid */
const LERP = 0.065;

function targetLidAngleFromProgress(p: number): number {
  if (p <= 0) return 0;
  if (p < 0.38) return (p / 0.38) * OPEN_ANGLE;
  if (p <= 0.62) return OPEN_ANGLE;
  if (p < 1) return OPEN_ANGLE + ((p - 0.62) / 0.38) * -OPEN_ANGLE;
  return 0;
}

export function SolutionsDeviceShowcase() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement | null>(null);
  const lidRef = useRef<HTMLDivElement | null>(null);
  const progressTargetRef = useScrollProgress(sectionRef);
  const smoothedAngleRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const lid = lidRef.current;
    if (!lid) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      lid.style.willChange = "transform";
      lid.style.transform = `translateZ(0) rotateX(${OPEN_ANGLE}deg)`;
      return;
    }

    smoothedAngleRef.current = targetLidAngleFromProgress(progressTargetRef.current);
    lid.style.willChange = "transform";
    lid.style.transform = `translateZ(0) rotateX(${smoothedAngleRef.current}deg)`;
  }, []);

  useEffect(() => {
    const lid = lidRef.current;
    if (!lid) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const tick = () => {
      const tgtA = targetLidAngleFromProgress(progressTargetRef.current);
      const curA = smoothedAngleRef.current;
      smoothedAngleRef.current = curA + (tgtA - curA) * LERP;

      lid.style.transform = `translateZ(0) rotateX(${smoothedAngleRef.current}deg)`;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="solutions-mac-scroll"
      id="solutions-demo"
      aria-label={t("solutions.deviceAlt")}
    >
      <div className="solutions-mac-sticky">
        <div className="solutions-mac-perspective">
          <div className="solutions-mac-glow" aria-hidden="true" />
          <div className="solutions-mac-rig">
            <div className="solutions-mac-unit">
              <div className="solutions-mac-base">
                <div className="solutions-mac-base-well" aria-hidden="true" />
                <div className="solutions-mac-base-lip" aria-hidden="true" />
              </div>
              <div className="solutions-mac-hinge-bar" aria-hidden="true" />
              <div className="solutions-mac-lid">
                <div ref={lidRef} className="solutions-mac-lid-pivot">
                  <div className="solutions-mac-lid-shell">
                    <div className="solutions-mac-lid-face">
                      <span className="solutions-mac-camera" aria-hidden="true" />
                      <div className="solutions-mac-screen-bezel">
                        <div className="solutions-mac-demo">
                          <StudioDemo
                            autoPlay
                            startDelayMs={200}
                            showControls={false}
                            showStoryPills={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
