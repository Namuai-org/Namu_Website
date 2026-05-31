"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useNavScroll } from "@/hooks/useNavScroll";
import { useScrollRevealLogo } from "@/hooks/useScrollRevealLogo";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageToggle } from "@/components/landing/LanguageToggle";
import { NamuLogoMark } from "@/components/brand/NamuLogoMark";

const PRODUCTS = [
  { name: "Namu Studio",   desc: "AI workspace for Hausa speakers",     href: "/#waitlist" },
  { name: "Muryar Manoma", desc: "Voice AI for farmers and agriculture", href: "#"          },
  { name: "KudiSauti",     desc: "Financial voice assistant",            href: "#"          },
  { name: "Muryar Ilimi",  desc: "AI education platform",                href: "#"          },
] as const;

const MODELS = [
  { name: "Namu_tts",    desc: "Text-to-speech in Hausa",      href: "#" },
  { name: "Namu_asr",    desc: "Automatic speech recognition", href: "#" },
  { name: "Namu_llm",    desc: "Large language model",         href: "#" },
  { name: "Namu_Frausa", desc: "French–Hausa translation",     href: "#" },
] as const;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"
      style={{ transition: "transform 0.22s ease", transform: open ? "rotate(180deg)" : "none", opacity: 0.55, flexShrink: 0 }}>
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* small delay stops flicker when moving between trigger and panel */
function useDropdown() {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const hide = () => { timer.current = setTimeout(() => setOpen(false), 110); };
  return { open, show, hide, close: () => setOpen(false) };
}

export function NavBar() {
  const pathname = usePathname();
  // Playground always shows the opaque cream nav so text stays readable over the page bg
  const scrolled = useNavScroll(100) || pathname === "/playground";
  const logoRevealProgress = useScrollRevealLogo();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileModelsOpen, setMobileModelsOpen] = useState(false);
  const { t } = useTranslation();
  const brandName = t("brand.name");
  const brandSuffix = brandName.slice(1);

  const products = useDropdown();
  const models = useDropdown();

  useEffect(() => {
    setMenuOpen(false);
    products.close();
    models.close();
    setMobileProductsOpen(false);
    setMobileModelsOpen(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") { products.close(); models.close(); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const anyOpen = products.open || models.open;

  return (
    <>
      <header className={`nav-shell ${scrolled ? "scrolled" : ""}`}>

        {/* Logo */}
        <Link href="/" className="nav-brand" aria-label={brandName} onClick={() => setMenuOpen(false)}>
          <span className="nav-logo-dark"><NamuLogoMark variant="onDark"  height={28} /></span>
          <span className="nav-logo-light"><NamuLogoMark variant="onLight" height={28} /></span>
          <span className="nav-name nav-name-wordmark" aria-hidden>
            <span className="nav-name-amu" style={{ opacity: logoRevealProgress, transform: `translate(${(1 - logoRevealProgress) * -8}px, 0.14em)` }}>
              {brandSuffix}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-links desktop-only" aria-label="Main navigation">

          <Link href="/" className={`nav-link ${pathname === "/" ? "nav-link-active" : ""}`}>
            {t("nav.home")}
          </Link>

          {/* Products */}
          <button type="button"
            className={`nav-link nav-link-btn ${products.open ? "nav-link-active" : ""}`}
            onMouseEnter={products.show} onMouseLeave={products.hide}
            aria-expanded={products.open} aria-haspopup="true">
            {t("nav.products")} <Chevron open={products.open} />
          </button>

          {/* Models */}
          <button type="button"
            className={`nav-link nav-link-btn ${models.open ? "nav-link-active" : ""}`}
            onMouseEnter={models.show} onMouseLeave={models.hide}
            aria-expanded={models.open} aria-haspopup="true">
            {t("nav.models")} <Chevron open={models.open} />
          </button>

          <Link href="/blog" className={`nav-link ${pathname.startsWith("/blog") ? "nav-link-active" : ""}`}>
            Blog
          </Link>

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

      {/* ── Products mega-dropdown ── */}
      <div className={`mega-dropdown ${products.open ? "mega-dropdown-open" : ""}`}
        onMouseEnter={products.show} onMouseLeave={products.hide} aria-hidden={!products.open}>
        <div className="mega-inner">
          <p className="mega-eyebrow">Our Products</p>
          <div className="mega-product-grid">
            {PRODUCTS.map(p => (
              <a key={p.name} href={p.href} className="mega-product-card">
                <span className="mega-product-dot" aria-hidden="true" />
                <span className="mega-product-body">
                  <span className="mega-product-name">{p.name}</span>
                  <span className="mega-product-desc">{p.desc}</span>
                </span>
                <svg className="mega-product-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Models mega-dropdown ── */}
      <div className={`mega-dropdown ${models.open ? "mega-dropdown-open" : ""}`}
        onMouseEnter={models.show} onMouseLeave={models.hide} aria-hidden={!models.open}>
        <div className="mega-inner">
          <p className="mega-eyebrow">Our Models</p>
          <div className="mega-model-grid">
            {MODELS.map(m => (
              <a key={m.name} href={m.href} className="mega-model-card">
                <span className="mega-model-dot" aria-hidden="true" />
                <span className="mega-model-body">
                  <span className="mega-model-name">{m.name}</span>
                  <span className="mega-model-desc">{m.desc}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Blurred backdrop */}
      {anyOpen && (
        <div className="mega-backdrop" aria-hidden="true"
          onClick={() => { products.close(); models.close(); }} />
      )}

      {/* Mobile drawer */}
      <aside className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-inner">
          <div className="mobile-lang-wrap"><LanguageToggle /></div>
          <Link href="/" onClick={() => setMenuOpen(false)}>{t("nav.home")}</Link>

          {/* Mobile Products */}
          <div className="mobile-dd">
            <button type="button" className="mobile-dd-toggle"
              onClick={() => setMobileProductsOpen(p => !p)} aria-expanded={mobileProductsOpen}>
              {t("nav.products")}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                style={{ transform: mobileProductsOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {mobileProductsOpen && (
              <div className="mobile-dd-list">
                {PRODUCTS.map(p => <a key={p.name} href={p.href} onClick={() => setMenuOpen(false)}>{p.name}</a>)}
              </div>
            )}
          </div>

          {/* Mobile Models */}
          <div className="mobile-dd">
            <button type="button" className="mobile-dd-toggle"
              onClick={() => setMobileModelsOpen(p => !p)} aria-expanded={mobileModelsOpen}>
              {t("nav.models")}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                style={{ transform: mobileModelsOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {mobileModelsOpen && (
              <div className="mobile-dd-list">
                {MODELS.map(m => <a key={m.name} href={m.href} onClick={() => setMenuOpen(false)}>{m.name}</a>)}
              </div>
            )}
          </div>

          <Link href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
          <a href="mailto:contact@namuai.org" onClick={() => setMenuOpen(false)}>{t("nav.contactSales")}</a>
          <a href="/#waitlist" className="nav-cta" onClick={() => setMenuOpen(false)}>{t("nav.tryFree")}</a>
        </div>
      </aside>
    </>
  );
}
