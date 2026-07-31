"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { ScrollObject } from "../ScrollObject";
import { SplitText } from "../SplitText";
import styles from "./home.module.css";

export function Mission() {
  const { t } = useTranslation();

  return (
    <section className={styles.mission} id="approach">
      <div className="ds-container ds-outer">
        <ScrollObject
          className={`ds-span ${styles.missionInner}`}
          style={{ "--span": 18 } as React.CSSProperties}
        >
          <h2 className="h4">
            <SplitText text={t("solution.intro.title")} />
          </h2>
        </ScrollObject>

        <ScrollObject
          className={`ds-span ${styles.missionInner} ${styles.missionExpand}`}
          style={{ "--span": 16 } as React.CSSProperties}
        >
          <p className="h5">
            <SplitText text={t("solution.positioning")} />
          </p>
        </ScrollObject>
      </div>
    </section>
  );
}
