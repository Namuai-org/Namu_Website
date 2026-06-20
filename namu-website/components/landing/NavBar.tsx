"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NamuLogoMark } from "@/components/brand/NamuLogoMark";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageToggle } from "@/components/landing/LanguageToggle";

const NAV_ITEMS = [
  {
    label: "Company",
    eyebrow: "Explore Company",
    links: [
      { label: "About",   href: "/"                         },
      { label: "Blog",    href: "/blog"                     },
      { label: "Brand",   href: "/brand"                    },
      { label: "Contact", href: "mailto:contact@namuai.org" },
    ],
  },
  {
    label: "Products",
    eyebrow: "Explore Products",
    links: [
      { label: "Namu Studio",   href: "/#waitlist" },
      { label: "Muryar Manoma", href: "#"          },
      { label: "KudiSauti",     href: "#"          },
      { label: "Muryar Ilimi",  href: "#"          },
    ],
  },
  {
    label: "Models",
    eyebrow: "Explore Models",
    links: [
      { label: "Namu TTS",    href: "#" },
      { label: "Namu ASR",    href: "#" },
      { label: "Namu LLM",    href: "#" },
      { label: "Namu Frausa", href: "#" },
    ],
  },
] as const;

type NavLabel = typeof NAV_ITEMS[number]["label"];

function useNavDropdown() {
  const [open, setOpen] = useState<NavLabel | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = (label: NavLabel) => { if (timer.current) clearTimeout(timer.current); setOpen(label); };
  const hide = () => { timer.current = setTimeout(() => setOpen(null), 120); };
  const cancel = () => { if (timer.current) clearTimeout(timer.current); };
  const close = () => setOpen(null);
  return { open, show, hide, cancel, close };
}

export function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const { t } = useTranslation();
  const brandName = t("brand.name");
  const dropdown = useNavDropdown();

  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(null);
    dropdown.close();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") dropdown.close(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <header className="nav-shell">

        {/* Logo */}
        <Link href="/" className="nav-brand" aria-label={brandName} onClick={() => setMenuOpen(false)}>
          <NamuLogoMark variant="onLight" height={42} />
        </Link>

        {/* Desktop nav — 3 items only */}
        <nav className="nav-links desktop-only" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`nav-link nav-link-btn ${dropdown.open === item.label ? "nav-link-active" : ""}`}
              onMouseEnter={() => dropdown.show(item.label)}
              onMouseLeave={dropdown.hide}
              aria-expanded={dropdown.open === item.label}
              aria-haspopup="true"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          <div className="desktop-only"><LanguageToggle /></div>
          <a href="mailto:contact@namuai.org" className="nav-contact desktop-only">{t("nav.contactSales")}</a>
          <a href="/#waitlist" className="nav-cta desktop-only">{t("nav.tryFree")}</a>
          <button type="button" className="menu-toggle mobile-only"
            onClick={() => setMenuOpen(p => !p)} aria-label={t("nav.menu")} aria-expanded={menuOpen}>
            <span /><span />
          </button>
        </div>
      </header>

      {/* ── Compact left-anchored dropdowns ── */}
      {NAV_ITEMS.map((item) => (
        <div
          key={item.label}
          className={`nav-dropdown ${dropdown.open === item.label ? "nav-dropdown-open" : ""}`}
          onMouseEnter={dropdown.cancel}
          onMouseLeave={dropdown.hide}
          aria-hidden={dropdown.open !== item.label}
        >
          <div className="nav-dropdown-inner">
            <p className="nav-dropdown-eyebrow">{item.eyebrow}</p>
            {item.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-dropdown-link"
                onClick={dropdown.close}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ))}

      {/* Backdrop */}
      {dropdown.open && (
        <div className="mega-backdrop" aria-hidden="true" onClick={dropdown.close} />
      )}

      {/* Mobile drawer */}
      <aside className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-inner">
          <div className="mobile-lang-wrap"><LanguageToggle /></div>

          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="mobile-dd">
              <button type="button" className="mobile-dd-toggle"
                onClick={() => setMobileOpen(p => p === item.label ? null : item.label)}
                aria-expanded={mobileOpen === item.label}>
                {item.label}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                  style={{ transform: mobileOpen === item.label ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {mobileOpen === item.label && (
                <div className="mobile-dd-list">
                  {item.links.map(link => (
                    <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
                  ))}
                </div>
              )}
            </div>
          ))}

          <a href="mailto:contact@namuai.org" onClick={() => setMenuOpen(false)}>{t("nav.contactSales")}</a>
          <a href="/#waitlist" className="nav-cta" onClick={() => setMenuOpen(false)}>{t("nav.tryFree")}</a>
        </div>
      </aside>
    </>
  );
}
