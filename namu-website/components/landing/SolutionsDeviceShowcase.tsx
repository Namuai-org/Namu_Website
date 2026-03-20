"use client";

import { useEffect, useRef, useState } from "react";
import { StudioDemo } from "@/components/landing/StudioDemo";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Laptop open/close is driven by IntersectionObserver + CSS transitions
 * (see `.solutions-device-shell--open` in globals.css). No scroll listeners or rAF smoothing.
 */
export function SolutionsDeviceShowcase() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [demoActive, setDemoActive] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!stage || !frame) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncShell = (intersecting: boolean) => {
      const open = mq.matches || intersecting;
      frame.classList.toggle("solutions-device-shell--open", open);
      setDemoActive(open);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        syncShell(entry.isIntersecting);
      },
      {
        threshold: 0,
        /* Require the demo stage to sit in the main viewport band — open in view, close when scrolled past */
        rootMargin: "-10% 0px -16% 0px",
      }
    );

    const onReducedMotionChange = () => {
      if (mq.matches) {
        io.disconnect();
        syncShell(true);
      } else {
        io.observe(stage);
      }
    };

    onReducedMotionChange();
    mq.addEventListener("change", onReducedMotionChange);

    return () => {
      io.disconnect();
      mq.removeEventListener("change", onReducedMotionChange);
    };
  }, []);

  return (
    <div className="solutions-device-stage" ref={stageRef} id="solutions-demo">
      <div className="solutions-device-shell" ref={frameRef}>
        <div className="solutions-device-shadow" aria-hidden="true" />
        <div className="solutions-device-top">
          <span className="solutions-device-camera" aria-hidden="true" />
          <div className="solutions-device-screen">
            <div className="solutions-device-screen-shine" aria-hidden="true" />
            <div className="solutions-device-demo" aria-label={t("solutions.deviceAlt")}>
              <StudioDemo
                autoPlay={demoActive}
                startDelayMs={280}
                showControls={false}
                showStoryPills={false}
              />
            </div>
          </div>
        </div>
        <div className="solutions-device-base" aria-hidden="true">
          <div className="solutions-device-deck" />
          <div className="solutions-device-hinge" />
          <div className="solutions-device-lip" />
        </div>
      </div>
    </div>
  );
}
