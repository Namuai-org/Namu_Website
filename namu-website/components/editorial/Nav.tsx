"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowRight, ArrowUpRight, NamuMark } from "./icons";
import { NAV_PANELS } from "./navPanels";
import styles from "./nav.module.css";

const LINKS = [
  { href: "/#stack", key: "nav.approach", panel: "models" },
  { href: "/playground", key: "nav.products", panel: "products" },
  { href: "/blog", key: "nav.blog", panel: null },
] as const;

/* Hover intent: a short delay stops the panel firing when the pointer is just
   travelling across the bar on its way somewhere else. */
const OPEN_DELAY = 90;
const CLOSE_DELAY = 180;

export function Nav() {
  const pathname = usePathname();
  const { t, language, setLanguage } = useTranslation();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState(0);
  const lastY = useRef(0);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleOpen = (panel: string | null) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (!panel) {
      hoverTimer.current = setTimeout(() => setOpenPanel(null), CLOSE_DELAY);
      return;
    }
    hoverTimer.current = setTimeout(() => {
      setOpenPanel((cur) => {
        if (cur !== panel) setActiveItem(0);
        return panel;
      });
    }, OPEN_DELAY);
  };

  const closeNow = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setOpenPanel(null);
  };

  useEffect(
    () => () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    },
    [],
  );

  // Hide going down, reveal going up — but never hide near the very top,
  // where the bar is part of the hero composition.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (y < 120) {
        setHidden(false);
      } else if (Math.abs(delta) > 6) {
        setHidden(delta > 0);
      }
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation, and lock the page behind it.
  useEffect(() => {
    setMenuOpen(false);
    closeNow();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      closeNow();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (hidden) closeNow();
  }, [hidden]);

  return (
    <header
      className={`${styles.header} ${hidden && !menuOpen ? styles.hidden : ""}`}
    >
      <div className={styles.shell}>
        <nav className={styles.bar} aria-label="Primary">
          <Link href="/" className={styles.logo} aria-label="Namu — home">
            <NamuMark className={styles.logoMark} />
            <span className={styles.logoWord}>namu</span>
          </Link>

          <button
            type="button"
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
          </button>

          <div
            id="primary-menu"
            className={`${styles.menu} ${menuOpen ? styles.menuOpen : ""}`}
          >
            <ul className={styles.links}>
              {LINKS.map(({ href, key, panel }) => (
                <li
                  key={href}
                  onMouseEnter={() => scheduleOpen(panel)}
                  onMouseLeave={() => scheduleOpen(null)}
                >
                  <Link
                    href={href}
                    className={`${styles.link} ${
                      pathname === href ? styles.linkActive : ""
                    } ${panel && openPanel === panel ? styles.linkOpen : ""}`}
                    aria-expanded={panel ? openPanel === panel : undefined}
                    onFocus={() => panel && setOpenPanel(panel)}
                    onClick={closeNow}
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>

            <div className={styles.right}>
              <button
                type="button"
                className={styles.langToggle}
                onClick={() => setLanguage(language === "en" ? "ha" : "en")}
                aria-label={
                  language === "en" ? "Sauya zuwa Hausa" : "Switch to English"
                }
              >
                <span
                  className={language === "en" ? styles.langOn : styles.langOff}
                >
                  EN
                </span>
                <span aria-hidden="true" className={styles.langOff}>
                  /
                </span>
                <span
                  className={language === "ha" ? styles.langOn : styles.langOff}
                >
                  HA
                </span>
              </button>

              <a href="mailto:contact@namu.ai" className={styles.feature}>
                {t("nav.contactSales")}
                <ArrowUpRight className={styles.featureArrow} />
              </a>
            </div>
          </div>
        </nav>

        <div
          className={`${styles.panelHost} ${styles.panelStack}`}
          onMouseEnter={() => {
            if (hoverTimer.current) clearTimeout(hoverTimer.current);
          }}
          onMouseLeave={() => scheduleOpen(null)}
        >
          {Object.entries(NAV_PANELS).map(([id, panel]) => (
            <div
              key={id}
              className={`${styles.panel} ${
                openPanel === id ? styles.panelOpen : ""
              }`}
              /* Never toggle `hidden`/display here. Going from display:none
                 straight to the open state lands both keyframes in one frame
                 and the browser skips the transition entirely. Visibility is
                 carried by opacity + clip-path + pointer-events instead. */
              aria-hidden={openPanel !== id}
            >
              <div className={styles.panelCols}>
                <div className={styles.panelLeft}>
                  <div>
                    <h2 className={styles.metaTitle}>{t(panel.titleKey)}</h2>
                    <p className={styles.metaDesc}>{t(panel.bodyKey)}</p>

                    <div role="tablist" className={styles.panelList}>
                      {panel.items.map((item, i) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          role="tab"
                          aria-selected={activeItem === i}
                          className={`${styles.panelRow} ${
                            activeItem === i ? styles.panelRowActive : ""
                          }`}
                          onMouseEnter={() => setActiveItem(i)}
                          onFocus={() => setActiveItem(i)}
                          onClick={closeNow}
                        >
                          <span className={styles.panelRowLead}>
                            <span className={styles.panelRowThumb}>
                              <img src={item.image} alt="" loading="lazy" />
                            </span>
                            <span className={styles.metaTitle}>
                              {t(item.title)}
                            </span>
                          </span>
                          <ArrowRight className={styles.panelRowArrow} />
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={panel.allHref}
                    className={`${styles.metaTitle} ${styles.panelAll}`}
                    onClick={closeNow}
                  >
                    {t(panel.allKey)}
                  </Link>
                </div>

                <div className={styles.panelRight}>
                  {panel.items.map((item, i) => (
                    <div
                      key={item.title}
                      role="tabpanel"
                      className={`${styles.panelPreview} ${
                        activeItem === i ? styles.panelPreviewActive : ""
                      }`}
                      aria-hidden={activeItem !== i}
                    >
                      <span className={styles.panelPreviewMedia}>
                        <img src={item.image} alt="" loading="lazy" />
                      </span>
                      <span className={styles.panelPreviewHead}>
                        <span className={styles.metaTitle}>
                          {t(item.title)}
                        </span>
                        <ArrowRight className={styles.panelRowArrow} />
                      </span>
                      <p className={styles.metaDesc}>{t(item.body)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
