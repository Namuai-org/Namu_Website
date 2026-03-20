"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export function StudioPreviewCard() {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 4;
    const rotateY = (x - 0.5) * 6;
    const driftX = (x - 0.5) * 18;
    const driftY = (y - 0.5) * 14;

    frameRef.current.style.setProperty("--studio-tilt-x", `${rotateX}deg`);
    frameRef.current.style.setProperty("--studio-tilt-y", `${rotateY}deg`);
    frameRef.current.style.setProperty("--studio-drift-x", `${driftX}px`);
    frameRef.current.style.setProperty("--studio-drift-y", `${driftY}px`);
    frameRef.current.style.setProperty("--studio-glow-x", `${x * 100}%`);
    frameRef.current.style.setProperty("--studio-glow-y", `${y * 100}%`);
  };

  const onLeave = () => {
    if (!frameRef.current) return;
    frameRef.current.style.setProperty("--studio-tilt-x", "0deg");
    frameRef.current.style.setProperty("--studio-tilt-y", "0deg");
    frameRef.current.style.setProperty("--studio-drift-x", "0px");
    frameRef.current.style.setProperty("--studio-drift-y", "0px");
    frameRef.current.style.setProperty("--studio-glow-x", "50%");
    frameRef.current.style.setProperty("--studio-glow-y", "18%");
  };

  return (
    <div className="studio-shot-shell">
      <div className="studio-shot-frame" ref={frameRef} onMouseMove={onMove} onMouseLeave={onLeave}>
        <div className="studio-shot-aura studio-shot-aura-left" aria-hidden="true" />
        <div className="studio-shot-aura studio-shot-aura-right" aria-hidden="true" />
        <div className="studio-shot-glow" aria-hidden="true" />
        <div className="studio-shot-sheen" aria-hidden="true" />
        <div className="studio-shot-frame-top">
          <div className="studio-shot-header">
            <div className="studio-shot-kicker">
              <span className="studio-shot-dot" />
              <span>{t("solution.preview.kicker")}</span>
            </div>
            <div className="studio-shot-caption">{t("solution.preview.caption")}</div>
          </div>

          <div className="studio-shot-display">
            <div className="studio-shot-surface">
              <div className="studio-shot-depth" aria-hidden="true" />
              <div className="studio-shot-screen">
                <div className="studio-shot-screen-top" aria-hidden="true">
                  <div className="studio-shot-traffic">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="studio-shot-screen-label">{t("solution.preview.product")}</div>
                  <div className="studio-shot-screen-pill" />
                </div>
                <Image
                  src="/Screenshot.jpg"
                  alt={t("solution.preview.alt")}
                  width={1839}
                  height={824}
                  className="studio-shot-image"
                  sizes="(max-width: 1023px) 100vw, min(960px, 85vw)"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="studio-shot-base" aria-hidden="true">
          <div className="studio-shot-base-top" />
          <div className="studio-shot-base-shadow" />
        </div>
      </div>
    </div>
  );
}
