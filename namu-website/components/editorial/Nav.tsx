"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowRight, ArrowUpRight, ChevronDown, NamuMark } from "./icons";
import { NAV_PANELS, type PanelItem } from "./navPanels";
import styles from "./nav.module.css";

const LINKS = [
  { href: "/models", key: "nav.approach", panel: "models" },
  { href: "/playground", key: "nav.products", panel: "products" },
  { href: "/blog", key: "nav.blog", panel: "blog" },
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
  /* The phone menu's own open section. Kept apart from `openPanel`, which is
     driven by hover and must never be set by a tap inside the sheet. */
  const [sheetPanel, setSheetPanel] = useState<string | null>(null);
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

  /* Model and product items name an i18n key; blog items carry the post's own
     title and excerpt, which are already prose. */
  const copy = (item: PanelItem, field: "title" | "body") =>
    item.literal ? item[field] : t(item[field]);

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
    if (!menuOpen) setSheetPanel(null);
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

  /* A touch tablet shows the inline bar but cannot hover it, so its panels
     would never open. There, a tap on a trigger unfolds the panel the way a
     pointer resting on it does, and a tap anywhere outside the header folds
     it again. Phones use the sheet instead, and mice keep hover. */
  const tapOpensPanel = () =>
    window.matchMedia("(hover: none)").matches && window.innerWidth > 600;

  useEffect(() => {
    if (!openPanel) return;
    const onDown = (e: PointerEvent) => {
      if (!tapOpensPanel()) return;
      const header = (e.target as Element | null)?.closest("header");
      if (!header) closeNow();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [openPanel]);

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
              {LINKS.map(({ href, key, panel }, index) => {
                const sheetOpen = sheetPanel === panel;
                const content = NAV_PANELS[panel];
                return (
                  <li
                    key={href}
                    className={styles.linkItem}
                    style={{ "--i": index } as React.CSSProperties}
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
                      onClick={(e) => {
                        if (panel && tapOpensPanel()) {
                          e.preventDefault();
                          setActiveItem(0);
                          setOpenPanel((cur) => (cur === panel ? null : panel));
                          return;
                        }
                        closeNow();
                      }}
                    >
                      {t(key)}
                    </Link>

                    {/* Phones: the same panel, unfolded in place under its
                        heading rather than floating below the bar. */}
                    <button
                      type="button"
                      className={`${styles.sheetTrigger} ${
                        sheetOpen ? styles.sheetTriggerOpen : ""
                      }`}
                      aria-expanded={sheetOpen}
                      aria-controls={`sheet-${panel}`}
                      onClick={() =>
                        setSheetPanel((cur) => (cur === panel ? null : panel))
                      }
                    >
                      <span>{t(key)}</span>
                      <ChevronDown className={styles.sheetChevron} />
                    </button>

                    <div
                      id={`sheet-${panel}`}
                      className={`${styles.sheetSection} ${
                        sheetOpen ? styles.sheetSectionOpen : ""
                      }`}
                      aria-hidden={!sheetOpen}
                    >
                      <div className={styles.sheetSectionInner}>
                        <p className={`${styles.metaDesc} ${styles.sheetDesc}`}>
                          {t(content.bodyKey)}
                        </p>
                        <ul className={styles.sheetList}>
                          {content.items.map((item, j) => (
                            <li
                              key={item.href + item.title}
                              className={styles.sheetItem}
                              style={{ "--j": j } as React.CSSProperties}
                            >
                              <Link
                                href={item.href}
                                className={`${styles.sheetRow} ${
                                  content.layout === "stories"
                                    ? styles.sheetRowStory
                                    : ""
                                }`}
                                tabIndex={sheetOpen ? 0 : -1}
                                onClick={() => setMenuOpen(false)}
                              >
                                <span className={styles.sheetThumb}>
                                  <img src={item.image} alt="" loading="lazy" />
                                </span>
                                <span className={styles.sheetText}>
                                  <span
                                    className={
                                      content.layout === "stories"
                                        ? styles.sheetStoryTitle
                                        : styles.metaTitle
                                    }
                                  >
                                    {copy(item, "title")}
                                  </span>
                                  {item.meta ? (
                                    <span className={styles.storyMeta}>{item.meta}</span>
                                  ) : null}
                                </span>
                                <ArrowRight className={styles.sheetArrow} />
                              </Link>
                            </li>
                          ))}
                          <li
                            className={styles.sheetItem}
                            style={{ "--j": content.items.length } as React.CSSProperties}
                          >
                            <Link
                              href={content.allHref}
                              className={`${styles.metaTitle} ${styles.sheetAll}`}
                              tabIndex={sheetOpen ? 0 : -1}
                              onClick={() => setMenuOpen(false)}
                            >
                              {t(content.allKey)}
                              <ArrowRight className={styles.sheetAllArrow} />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              })}
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

              <a href="mailto:contact@namuai.org" className={styles.feature}>
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
              {panel.layout === "stories" ? (
                /* Articles get the whole width: a picture large enough to
                   recognise and a title large enough to read, stacked. There
                   is no preview pane because there is nothing to preview —
                   every row already carries its own image. */
                <div className={styles.stories}>
                  <div className={styles.storiesHead}>
                    <h2 className={styles.metaTitle}>{t(panel.titleKey)}</h2>
                    <p className={styles.metaDesc}>{t(panel.bodyKey)}</p>
                  </div>

                  <div className={styles.storiesList}>
                    {panel.items.map((item) => (
                      <Link
                        key={item.href + item.title}
                        href={item.href}
                        className={styles.storyCard}
                        onClick={closeNow}
                      >
                        <span className={styles.storyThumb}>
                          <img src={item.image} alt="" loading="lazy" />
                        </span>
                        <span className={styles.storyBody}>
                          <span className={styles.storyTitle}>
                            {copy(item, "title")}
                          </span>
                          <span className={styles.storyFoot}>
                            <span className={styles.storyMeta}>{item.meta}</span>
                            <ArrowRight className={styles.panelRowArrow} />
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>

                  <Link
                    href={panel.allHref}
                    className={`${styles.metaTitle} ${styles.panelAll}`}
                    onClick={closeNow}
                  >
                    {t(panel.allKey)}
                  </Link>
                </div>
              ) : (
              <div className={styles.panelCols}>
                <div className={styles.panelLeft}>
                  <div>
                    <h2 className={styles.metaTitle}>{t(panel.titleKey)}</h2>
                    <p className={styles.metaDesc}>{t(panel.bodyKey)}</p>

                    <div role="tablist" className={styles.panelList}>
                      {panel.items.map((item, i) => (
                        <Link
                          key={item.href + item.title}
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
                              {copy(item, "title")}
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
                      key={item.href + item.title}
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
                          {copy(item, "title")}
                        </span>
                        <ArrowRight className={styles.panelRowArrow} />
                      </span>
                      <p className={styles.metaDesc}>{copy(item, "body")}</p>
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
