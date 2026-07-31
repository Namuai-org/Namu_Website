"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { ScrollObject } from "../ScrollObject";
import { SplitText } from "../SplitText";
import styles from "./home.module.css";

type Props = {
  /** Portrait, shown at its natural aspect rather than cropped to a frame. */
  portrait: string;
  /** Describes the person, not the photo — this one is of a real person. */
  portraitAlt?: string;
  /** Handwritten signature, sitting above the printed attribution. */
  signature?: string;
};

export function Quote({ portrait, portraitAlt, signature }: Props) {
  const { t } = useTranslation();

  return (
    <section className={styles.quote}>
      <div className={`ds-container ${styles.quoteInner}`}>
        <ScrollObject className={styles.quoteRow}>
          <div className={styles.quoteMedia}>
            <div className={styles.quoteMediaFrame}>
              <img
                src={portrait}
                alt={portraitAlt ?? ""}
                className="scale-out"
                loading="lazy"
              />
            </div>
          </div>

          <blockquote className={styles.quoteBody}>
            <p className={styles.quoteText}>
              <SplitText text={t("mission.quote")} />
            </p>

            <footer>
              {signature ? (
                <img
                  src={signature}
                  alt=""
                  className={`fade-in ${styles.quoteSignature}`}
                  style={{ transitionDelay: "1s" }}
                  loading="lazy"
                />
              ) : null}

              <p
                className={`text-caption fade-in ${styles.quoteCite}`}
                style={{ transitionDelay: "1.1s" }}
              >
                {t("home.quote.name")}
                <br />
                {t("home.quote.role")}
              </p>
            </footer>
          </blockquote>
        </ScrollObject>
      </div>
    </section>
  );
}
