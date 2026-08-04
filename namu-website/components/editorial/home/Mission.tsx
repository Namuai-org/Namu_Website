"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { ScrollObject } from "../ScrollObject";
import { SplitText } from "../SplitText";
import styles from "./home.module.css";

/**
 * The statement band.
 *
 * One centred measure, as on the reference: a large statement of what the
 * company does, then — set much smaller, so the two never compete — the
 * mission it serves. Both reveal from the same ScrollObject, the second a
 * beat behind.
 */
export function Mission() {
  const { t } = useTranslation();

  return (
    <section className={styles.mission} id="approach">
      <div className="ds-container ds-outer">
        <ScrollObject
          className={`ds-span ${styles.missionInner}`}
          style={{ "--span": 16 } as React.CSSProperties}
        >
          <h2 className={`h4 ${styles.missionStatement}`}>
            <SplitText text={t("home.mission.statement")} />
          </h2>

          <p className={`text-small fade-in ${styles.missionLabel}`}>
            {t("home.mission.label")}
          </p>

          <p className={`text-large-alt ${styles.missionExpand}`}>
            <SplitText text={t("home.mission.expand")} delay={0.2} />
          </p>
        </ScrollObject>
      </div>
    </section>
  );
}
