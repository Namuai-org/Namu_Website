"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { NamuMark } from "./icons";
import styles from "./footer.module.css";

const COLUMNS = [
  {
    title: "nav.home",
    links: [
      { label: "nav.approach", href: "/#approach" },
      { label: "nav.models", href: "/#stack" },
      { label: "nav.blog", href: "/blog" },
      { label: "nav.brand", href: "/brand" },
    ],
  },
  {
    title: "nav.products",
    links: [
      { label: "nav.tryFree", href: "/playground" },
      { label: "nav.contactSales", href: "mailto:contact@namu.ai" },
    ],
  },
  {
    title: "footer.legalTitle",
    links: [
      { label: "footer.privacy", href: "/privacy" },
      { label: "footer.terms", href: "/terms" },
    ],
  },
] as const;

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer} id="site-footer">
      <div className="ds-container ds-outer">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.brandRow} aria-label="Namu — home">
              <NamuMark className={styles.mark} />
              <span className={styles.word}>namu</span>
            </Link>
            <p className={`text-regular ${styles.tagline}`}>
              {t("mission.statement1")}
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={t(col.title)}>
              <span className={`text-small ${styles.colTitle}`}>
                {t(col.title)}
              </span>
              <ul className={styles.list}>
                {col.links.map((link) => {
                  const external = link.href.startsWith("http");
                  return (
                    <li key={link.href}>
                      {external ? (
                        <a
                          href={link.href}
                          className="text-ui link-underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t(link.label)}
                        </a>
                      ) : (
                        <Link href={link.href} className="text-ui link-underline">
                          {t(link.label)}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}

          <nav aria-label="Get in touch">
            <span className={`text-small ${styles.colTitle}`}>
              {t("footer.contactTitle")}
            </span>
            <ul className={styles.list}>
              <li>
                <a
                  href="mailto:contact@namu.ai"
                  className="text-ui link-underline"
                >
                  contact@namu.ai
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className={`text-caption ${styles.bottom}`}>
          <span>{t("footer.rights")}</span>
          <div className={styles.bottomLinks}>
            <Link href="/privacy" className="link-underline">
              {t("footer.privacy")}
            </Link>
            <Link href="/terms" className="link-underline">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
