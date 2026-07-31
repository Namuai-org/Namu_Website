"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { GradientField } from "../GradientField";
import { ScrollObject } from "../ScrollObject";
import { SplitText } from "../SplitText";
import styles from "./home.module.css";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className={styles.hero}>
      <div className={styles.glRunway} aria-hidden="true">
        <div className={styles.glSticky}>
          <GradientField />
        </div>
      </div>

      <div className={styles.heroContent}>
        <ScrollObject>
          <h1 className={`h1 ${styles.heroTitle}`}>
            <SplitText
              immediate
              srText={`${t("home.hero.line1")} ${t("home.hero.line2")}`}
              lines={[
                <em key="a">{t("home.hero.line1")}</em>,
                t("home.hero.line2"),
              ]}
            />
          </h1>
          <div
            className={`text-large fade-in ${styles.heroSub}`}
            style={{ transitionDelay: "0.7s" }}
          >
            {t("home.hero.tagline")}
          </div>
        </ScrollObject>
      </div>
    </section>
  );
}
