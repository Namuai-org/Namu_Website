"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowUpRight, ChevronDown } from "./icons";
import { NAV_PANELS, type PanelItem } from "./navPanels";
import styles from "./mobileMenu.module.css";

const LINKS = [
  { href: "/models", key: "nav.approach", panel: "models" },
  { href: "/playground", key: "nav.products", panel: "products" },
  { href: "/blog", key: "nav.blog", panel: "blog" },
] as const;

const LEGAL = [
  { href: "/privacy", key: "footer.privacy" },
  { href: "/terms", key: "footer.terms" },
  { href: "/brand", key: "nav.brand" },
  { href: "/investors", key: "footer.investors" },
] as const;

/* The same handles the footer carries. */
const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/namuai.inc" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/namu-a" },
  { label: "X", href: "https://x.com/namuai" },
  { label: "GitHub", href: "https://github.com/Namuai-org" },
] as const;

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * The phone menu, laid out as the reference's: a full page of paper under the
 * bar, which stays where it was with the logo and the close button, so the
 * menu reads as the bar opening rather than a panel arriving.
 *
 * Each top line is a route with a chevron beside it that unfolds its panel in
 * place: tinted rows with a picture, then the "All …" link and a rule. The
 * editorial link, the small print, the socials and the language switch sit
 * at the foot of the page.
 *
 * It lives outside the header on purpose. The bar's backdrop blur makes it
 * the containing block for anything fixed inside it, which is why the old
 * sheet could never be more than an inset card over the page.
 */
export function MobileMenu({ open, onClose }: Props) {
  const { t, language, setLanguage } = useTranslation();
  const [section, setSection] = useState<string | null>(null);

  // Every opening starts folded.
  useEffect(() => {
    if (!open) setSection(null);
  }, [open]);

  /* Model and product items name an i18n key; blog items carry the post's own
     title, which is already prose. */
  const title = (item: PanelItem) => (item.literal ? item.title : t(item.title));

  return (
    <div
      id="mobile-menu"
      className={`${styles.menu} ${open ? styles.open : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
    >
      <div className={styles.inner}>
        <ul className={styles.list}>
          {LINKS.map(({ href, key, panel }, i) => {
            const content = NAV_PANELS[panel];
            const expanded = section === panel;
            const stories = content.layout === "stories";

            return (
              <li
                key={panel}
                className={`${styles.item} ${expanded ? styles.itemOpen : ""}`}
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className={styles.head}>
                  <Link href={href} className={styles.headLink} onClick={onClose}>
                    {t(key)}
                  </Link>
                  <button
                    type="button"
                    className={styles.chevronButton}
                    aria-expanded={expanded}
                    aria-controls={`mobile-menu-${panel}`}
                    aria-label={`${t(key)} menu`}
                    onClick={() => setSection(expanded ? null : panel)}
                  >
                    <ChevronDown className={styles.chevron} />
                  </button>
                </div>

                <div
                  id={`mobile-menu-${panel}`}
                  className={`${styles.section} ${expanded ? styles.sectionOpen : ""}`}
                  inert={!expanded}
                >
                  <div className={styles.sectionInner}>
                    {stories ? (
                      <p className={styles.label}>{t(content.titleKey)}</p>
                    ) : null}

                    <ul className={styles.rows}>
                      {content.items.map((item, j) => (
                        <li
                          key={item.href + item.title}
                          className={styles.rowItem}
                          style={{ "--j": j } as React.CSSProperties}
                        >
                          <Link
                            href={item.href}
                            className={`${styles.row} ${stories ? styles.rowStory : ""}`}
                            onClick={onClose}
                          >
                            <span className={styles.thumb}>
                              <img src={item.image} alt="" loading="lazy" />
                            </span>
                            <span className={stories ? styles.storyTitle : styles.rowTitle}>
                              {title(item)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <Link href={content.allHref} className={styles.all} onClick={onClose}>
                      {t(content.allKey)}
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className={styles.foot} style={{ "--i": LINKS.length } as React.CSSProperties}>
          <a href="mailto:contact@namuai.org" className={styles.feature}>
            {t("nav.contactSales")}
            <ArrowUpRight className={styles.featureArrow} />
          </a>

          <div className={styles.small}>
            <ul>
              {LEGAL.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={onClose}>
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
            <ul>
              {SOCIALS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.lang}>
            <div className={styles.langPill} role="group" aria-label={t("nav.language")}>
              <button
                type="button"
                className={styles.langOption}
                aria-pressed={language === "en"}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
              <button
                type="button"
                className={styles.langOption}
                aria-pressed={language === "ha"}
                onClick={() => setLanguage("ha")}
              >
                HA
              </button>
            </div>
            <span className={styles.langLabel}>{t("nav.language")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
