"use client";

import { useEffect, useState } from "react";
import styles from "./motion-toggle.module.css";

const KEY = "namu-reduced-motion";

/**
 * An explicit motion switch, independent of the OS setting. Some people want
 * the animation off on this site without turning it off system-wide, and some
 * arrive with the OS flag set but want to see the full thing.
 */
export function MotionToggle() {
  const [off, setOff] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    const initial =
      stored !== null
        ? stored === "1"
        : window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setOff(initial);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("accessibility-mode", off);
    localStorage.setItem(KEY, off ? "1" : "0");
  }, [off, ready]);

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setOff((v) => !v)}
      aria-pressed={off}
    >
      <span className={styles.state}>{off ? "Off" : "On"}</span>
      <span className={styles.label}>Motion</span>
    </button>
  );
}
