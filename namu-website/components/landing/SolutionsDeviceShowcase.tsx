"use client";

import { useEffect, useRef, useState } from "react";
import { StudioDemo } from "@/components/landing/StudioDemo";
import { useTranslation } from "@/hooks/useTranslation";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}

export function SolutionsDeviceShowcase() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [openness, setOpenness] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      if (!stageRef.current || !frameRef.current) return;

      const rect = stageRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalDistance = rect.height + viewportHeight;
      const traveled = viewportHeight - rect.top;
      const progress = clamp(traveled / totalDistance, 0, 1);
      const opening = smoothstep(0.04, 0.16, progress);
      const closing = 1 - smoothstep(0.6, 0.86, progress);
      const eased = clamp(opening * closing, 0, 1);
      const closeProgress = smoothstep(0.58, 0.92, progress);
      const shellTilt = closeProgress * 7;
      const shellDrop = closeProgress * 14;

      setOpenness(eased);

      frameRef.current.style.setProperty("--device-open", eased.toFixed(3));
      frameRef.current.style.setProperty("--device-lid-rotate", `${110 - eased * 110}deg`);
      frameRef.current.style.setProperty("--device-lift", `${(1 - eased) * 8}px`);
      frameRef.current.style.setProperty("--device-screen-opacity", `${0.18 + eased * 0.82}`);
      frameRef.current.style.setProperty("--device-base-scale", `${0.992 + eased * 0.008}`);
      frameRef.current.style.setProperty("--device-shadow-opacity", `${0.12 + eased * 0.16}`);
      frameRef.current.style.setProperty("--device-exit-tilt", `${shellTilt}deg`);
      frameRef.current.style.setProperty("--device-shell-drop", `${shellDrop}px`);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="solutions-device-stage" ref={stageRef}>
      <div className="solutions-device-shell" ref={frameRef}>
        <div className="solutions-device-shadow" aria-hidden="true" />
        <div className="solutions-device-top">
          <span className="solutions-device-camera" aria-hidden="true" />
          <div className="solutions-device-screen">
            <div className="solutions-device-demo" aria-label={t("solutions.deviceAlt")}>
              <StudioDemo autoPlay={openness > 0.62} startDelayMs={200} showControls={false} showStoryPills={false} />
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
