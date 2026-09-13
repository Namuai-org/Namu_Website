"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { NamuMark } from "@/components/editorial/icons";
import styles from "./playground.module.css";

/**
 * What a request meets while nothing is answering behind the console.
 *
 * The playground's endpoints arrive with the second version of the models, so
 * until then a send lands here: what is happening and a reason to come back,
 * rather than an error that makes the console look broken. Whatever the
 * visitor typed or recorded stays in the composer.
 *
 * Nothing needs removing on launch. Once an endpoint answers, its result
 * renders instead and this never appears.
 */
export function ComingSoon() {
  const { t } = useTranslation();

  return (
    <div className={styles.soon} role="status">
      <div className={styles.soonHead}>
        <NamuMark className={styles.soonMark} />
        <span className={`text-small ${styles.soonLabel}`}>
          {t("playground.soon.label")}
        </span>
      </div>

      <p className={`h7 ${styles.soonTitle}`}>{t("playground.soon.title")}</p>
      <p className={`text-regular ${styles.soonBody}`}>{t("playground.soon.body")}</p>

      <div className={styles.soonActions}>
        <Link href="/blog" className={`text-ui ${styles.resultAction}`}>
          {t("playground.soon.follow")}
        </Link>
      </div>
    </div>
  );
}
