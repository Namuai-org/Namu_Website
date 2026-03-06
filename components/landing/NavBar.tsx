"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { useNavScroll } from "@/hooks/useNavScroll";
import { getStudioTarget } from "@/lib/supabaseClient";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageToggle } from "@/components/landing/LanguageToggle";

export function NavBar() {
  const scrolled = useNavScroll(100);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const onStudioClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = await getStudioTarget();
    window.location.href = target;
  };

  return (
    <>
      <header className={`nav-shell ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className="nav-brand" onClick={() => setMenuOpen(false)}>
          <span className="nav-mark">N</span>
          <span className="nav-name">{t("brand.name")}</span>
        </Link>

        <nav className="nav-links desktop-only">
          <Link href="/" className="nav-link">
            {t("nav.home")}
          </Link>
          <Link href="/about" className="nav-link">
            {t("nav.about")}
          </Link>
          <Link href="/solutions" className="nav-link">
            {t("nav.solutions")}
          </Link>
          <Link href="/blog" className="nav-link">
            {t("nav.blog")}
          </Link>
          <Link href="/contact" className="nav-link">
            {t("nav.contact")}
          </Link>
        </nav>

        <div className="nav-actions">
          <div className="desktop-only">
            <LanguageToggle />
          </div>
          <a href="/login" onClick={onStudioClick} className="nav-cta desktop-only">
            {t("nav.openStudio")} {"->"}
          </a>
          <button
            type="button"
            className="menu-toggle mobile-only"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={t("nav.menu")}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <aside className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-inner">
          <div className="mobile-lang-wrap">
            <LanguageToggle />
          </div>
          <Link href="/" onClick={() => setMenuOpen(false)}>
            {t("nav.home")}
          </Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>
            {t("nav.about")}
          </Link>
          <Link href="/solutions" onClick={() => setMenuOpen(false)}>
            {t("nav.solutions")}
          </Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)}>
            {t("nav.blog")}
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            {t("nav.contact")}
          </Link>
          <a href="/login" onClick={onStudioClick}>
            {t("nav.openStudio")} {"->"}
          </a>
        </div>
      </aside>
    </>
  );
}
