"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./investors.module.css";

/**
 * Real coordinates. The eight dialects the models are measured on, plus the
 * city Namu is built in.
 *
 * Positions are plotted from actual latitude and longitude and nothing else:
 * there is no country outline, because an approximated border on an investor
 * page is a claim you cannot stand behind. What the shape says is true — these
 * places lie along a band across southern Niger — and it says nothing more.
 */
const PLACES = [
  { name: "Niamey", lat: 13.51, lon: 2.11, home: true },
  { name: "Dogondoutchi", lat: 13.64, lon: 4.03 },
  { name: "Konni", lat: 13.79, lon: 5.25 },
  { name: "Tahoua", lat: 14.89, lon: 5.27 },
  { name: "Madaoua", lat: 14.07, lon: 5.96 },
  { name: "Maradi", lat: 13.5, lon: 7.1 },
  { name: "Tessaoua", lat: 13.75, lon: 7.99 },
  { name: "Zinder", lat: 13.8, lon: 8.99 },
  { name: "Mirriah", lat: 13.71, lon: 9.15 },
];

const VB_W = 1000;
const VB_H = 300;
const PAD_X = 70;
const PAD_Y = 60;

const lons = PLACES.map((p) => p.lon);
const lats = PLACES.map((p) => p.lat);
const lonMin = Math.min(...lons);
const lonMax = Math.max(...lons);
const latMin = Math.min(...lats);
const latMax = Math.max(...lats);

const project = (p: (typeof PLACES)[number]) => ({
  x: PAD_X + ((p.lon - lonMin) / (lonMax - lonMin)) * (VB_W - PAD_X * 2),
  /* Latitude runs the other way to screen y. */
  y: PAD_Y + (1 - (p.lat - latMin) / (latMax - latMin)) * (VB_H - PAD_Y * 2),
});

const POINTS = PLACES.map((p) => ({ ...p, ...project(p) }));

/* One path west to east, in longitude order, which is how the band runs. */
const ORDER = [...POINTS].sort((a, b) => a.lon - b.lon);
const ROUTE = ORDER.reduce(
  (d, p, i) => d + (i === 0 ? `M${p.x.toFixed(1)} ${p.y.toFixed(1)}` : ` L${p.x.toFixed(1)} ${p.y.toFixed(1)}`),
  "",
);

/**
 * Where the language is spoken, drawn on arrival.
 *
 * The line runs west to east across the band and the places light up along it
 * in the order it reaches them, so the section resolves into a picture of
 * coverage rather than presenting one.
 */
export function ReachMap() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setDrawn(true),
      { threshold: 0.3 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={hostRef} className={styles.map}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className={styles.mapSvg}
        role="img"
        aria-label="Niamey and the eight Hausa-speaking areas of Niger the models are measured on"
      >
        <path
          d={ROUTE}
          pathLength={1}
          className={`${styles.mapRoute} ${drawn ? styles.mapRouteIn : ""}`}
        />

        {ORDER.map((p, i) => (
          <g
            key={p.name}
            className={`${styles.mapPlace} ${drawn ? styles.mapPlaceIn : ""}`}
            style={{ transitionDelay: `${0.3 + i * 0.11}s` }}
          >
            {/* The home city gets a ring, not a different colour: it is the
                same kind of place, it is just where we work from. */}
            {p.home ? <circle cx={p.x} cy={p.y} r="11" className={styles.mapHome} /> : null}
            <circle cx={p.x} cy={p.y} r={p.home ? 5 : 4} className={styles.mapDot} />
            <text
              x={p.x}
              y={p.y - 18}
              textAnchor="middle"
              className={styles.mapLabel}
            >
              {p.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
