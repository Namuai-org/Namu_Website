"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import {
  IconGitHub,
  IconInstagram,
  IconLinkedIn,
  IconX,
  NamuMark,
} from "./icons";
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
      { label: "nav.contactSales", href: "mailto:contact@namuai.org" },
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

/* Real handles, carried over from the footer this replaces. */
const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/namuai", Icon: IconInstagram },
  { label: "LinkedIn", href: "https://linkedin.com/company/namuai", Icon: IconLinkedIn },
  { label: "X", href: "https://x.com/namuai", Icon: IconX },
  { label: "GitHub", href: "https://github.com/namuai", Icon: IconGitHub },
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
                  href="mailto:contact@namuai.org"
                  className="text-ui link-underline"
                >
                  contact@namuai.org
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@namuai.org"
                  className="text-ui link-underline"
                >
                  support@namuai.org
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.socials}>
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              className={styles.social}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
            >
              <Icon />
            </a>
          ))}
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
