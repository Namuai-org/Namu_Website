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

/* Four balanced columns instead of "About / Products / Legal / Get in touch".

   Models earns a column of its own now that all four have pages — they were
   one line pointing at the catalogue. Privacy and Terms lose theirs: they were
   listed twice, once here and again in the bar underneath, and the bar is the
   conventional place for them. */
const COLUMNS = [
  {
    title: "footer.modelsTitle",
    links: [
      { label: "home.model.interpret.name", href: "/models/namu-interpret" },
      { label: "home.model.asr.name", href: "/models/namu-transcribe" },
      { label: "home.model.tts.name", href: "/models/namu-voice" },
      { label: "home.model.agent.name", href: "/models/namu-agent" },
      { label: "nav.panel.allModels", href: "/models" },
    ],
  },
  {
    title: "nav.products",
    links: [
      { label: "nav.product.studio.title", href: "/playground" },
      { label: "nav.product.app.title", href: "https://namu-app.com/" },
      { label: "nav.contactSales", href: "mailto:contact@namuai.org" },
    ],
  },
  {
    title: "footer.companyTitle",
    links: [
      { label: "nav.mission", href: "/#approach" },
      { label: "nav.blog", href: "/blog" },
      { label: "nav.brand", href: "/brand" },
      /* No href on purpose: the page does not exist yet, and a footer link
         that 404s is worse than a line that plainly is not one. Give it an
         href when the page lands. */
      { label: "footer.investors" },
    ],
  },
] as const;

/* Real handles, carried over from the footer this replaces. */
const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/namuai.inc",
    Icon: IconInstagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/namu-a",
    Icon: IconLinkedIn,
  },
  { label: "X", href: "https://x.com/namuai", Icon: IconX },
  { label: "GitHub", href: "https://github.com/Namuai-org", Icon: IconGitHub },
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
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={t(col.title)}>
              <span className={`text-small ${styles.colTitle}`}>
                {t(col.title)}
              </span>
              <ul className={styles.list}>
                {col.links.map((link) => {
                  const href = "href" in link ? (link.href as string) : undefined;
                  const external = href?.startsWith("http") ?? false;
                  return (
                    <li key={link.label}>
                      {!href ? (
                        <span className={`text-ui ${styles.pending}`}>
                          {t(link.label)}
                        </span>
                      ) : external ? (
                        <a
                          href={href}
                          className="text-ui link-underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t(link.label)}
                        </a>
                      ) : (
                        <Link href={href} className="text-ui link-underline">
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
