"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import type { Modality } from "@/lib/playground";
import styles from "./playground.module.css";

/** After this long, the card admits the wait rather than repeating itself. */
const REASSURE_AFTER = 7;

/**
 * The waiting card.
 *
 * It names what is happening — transcribing, interpreting, generating — rather
 * than showing a bare spinner, and counts the seconds out loud, because a wait
 * you can measure is easier to sit through than one you cannot. Past seven
 * seconds it says so.
 */
export function Pending({ modality }: { modality: Modality }) {
  const { t } = useTranslation();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Fixed per mount, so the line does not shuffle while you read it.
  const [slow] = useState(() => 1 + Math.floor(Math.random() * 3));

  const label =
    elapsed >= REASSURE_AFTER
      ? t(`playground.pending.slow${slow}`)
      : t(`playground.pending.${modality}`);

  return (
    <div className={styles.pending}>
      <span className={styles.pendingDot} aria-hidden="true" />
      <span className={`text-ui ${styles.pendingLabel}`}>{label}</span>
      <span className={styles.pendingClock}>{elapsed}s</span>

      {/* Announced separately and less often than the visible timer ticks. */}
      <span className="sr-only" role="status" aria-live="polite">
        {elapsed % 5 === 0
          ? t("playground.pending.sr").replace("{s}", String(elapsed))
          : ""}
      </span>
    </div>
  );
}
