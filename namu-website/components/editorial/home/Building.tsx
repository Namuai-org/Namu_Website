"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "../Button";
import { ArrowRight } from "../icons";
import { ScrollObject } from "../ScrollObject";
import { SplitText } from "../SplitText";
import styles from "./home.module.css";

/* Namu's stack, in the order the work actually flows. */
const ITEMS = [
  { key: "solution.step1", status: "home.status.data", href: "/#approach" },
  { key: "solution.step2", status: "home.status.models", href: "/#approach" },
  { key: "solution.step3", status: "home.status.platform", href: "/#approach" },
  { key: "solution.step4", status: "home.status.apps", href: "/#approach" },
] as const;

export function Building() {
  const { t } = useTranslation();

  return (
    <section className={styles.building} id="stack">
      <div className="ds-container ds-outer">
        <ScrollObject className={styles.buildingHead}>
          <h2
            className="h4 ds-span"
            style={{ "--span": 14, marginInline: "auto" } as React.CSSProperties}
          >
            <SplitText text={t("home.stack.title")} />
          </h2>
          <p
            className={`text-regular ds-span ${styles.buildingIntro}`}
            style={{ "--span": 10 } as React.CSSProperties}
          >
            <SplitText text={t("home.stack.body")} delay={0.15} />
          </p>
        </ScrollObject>

        <ScrollObject>
          <div className={styles.cardGrid}>
            {ITEMS.map((item, i) => (
              <Link
                key={item.key}
                href={item.href}
                className={`${styles.card} slide-up`}
                style={{ "--i": i } as React.CSSProperties}
              >
                <div>
                  <span className={`text-small ${styles.cardStatus}`}>
                    {t(item.status)}
                  </span>
                  <h3 className={`h6 ${styles.cardName}`}>
                    {t(`${item.key}.title`)}
                  </h3>
                  <p className={`text-regular ${styles.cardBody}`}>
                    {t(`${item.key}.body`)}
                  </p>
                </div>
                <span className={`text-ui ${styles.cardLink}`}>
                  {t("home.stack.more")}
                  <ArrowRight className={styles.cardArrow} />
                </span>
              </Link>
            ))}

            {/* The sixth tile inverts and carries the section's CTA. */}
            <div
              className={`${styles.card} ${styles.cardCta} slide-up`}
              style={{ "--i": 4 } as React.CSSProperties}
            >
              <div>
                <span className={`text-small ${styles.cardStatus}`}>
                  {t("home.status.loop")}
                </span>
                <h3 className={`h6 ${styles.cardName}`}>
                  {t("home.loop.title")}
                </h3>
                <p className={`text-regular ${styles.cardBody}`}>
                  {t("home.loop.body")}
                </p>
              </div>
              <div className={styles.cardLink}>
                <Button href="/#approach" variant="accent">
                  {t("home.stack.cta")}
                </Button>
              </div>
            </div>
          </div>
        </ScrollObject>
      </div>
    </section>
  );
}
