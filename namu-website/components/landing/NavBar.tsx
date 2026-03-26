"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { useNavScroll } from "@/hooks/useNavScroll";
import { useScrollRevealLogo } from "@/hooks/useScrollRevealLogo";
import { getStudioTarget } from "@/lib/supabaseClient";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageToggle } from "@/components/landing/LanguageToggle";
import { NamuLogoMark } from "@/components/brand/NamuLogoMark";

export function NavBar() {
  const scrolled = useNavScroll(100);
  const logoRevealProgress = useScrollRevealLogo();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();
  const brandName = t("brand.name");
  /** Mark is the “N”; word suffix reveals on scroll so we don’t duplicate N in text */
  const brandSuffix = brandName.slice(1);

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
        <Link
          href="/"
          className="nav-brand"
          aria-label={brandName}
          onClick={() => setMenuOpen(false)}
        >
          <NamuLogoMark variant="onDark" height={28} />
          <span className="nav-name nav-name-wordmark" aria-hidden>
            <span
              className="nav-name-amu"
              style={{
                opacity: logoRevealProgress,
                transform: `translate(${(1 - logoRevealProgress) * -8}px, 0.14em)`,
              }}
            >
              {brandSuffix}
            </span>
          </span>
        </Link>

        <nav className="nav-links desktop-only">
          <Link href="/" className="nav-link">
            {t("nav.home")}
          </Link>
          <Link href="/solutions" className="nav-link">
            {t("nav.solutions")}
          </Link>
          <Link href="/research" className="nav-link">
            {t("nav.research")}
          </Link>
          <Link href="/team" className="nav-link">
            {t("nav.team")}
          </Link>
          <Link href="/pitch" className="nav-link">
            {t("nav.pitch")}
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
          <Link href="/solutions" onClick={() => setMenuOpen(false)}>
            {t("nav.solutions")}
          </Link>
          <Link href="/research" onClick={() => setMenuOpen(false)}>
            {t("nav.research")}
          </Link>
          <Link href="/team" onClick={() => setMenuOpen(false)}>
            {t("nav.team")}
          </Link>
          <Link href="/pitch" onClick={() => setMenuOpen(false)}>
            {t("nav.pitch")}
          </Link>
          <a href="/login" onClick={onStudioClick}>
            {t("nav.openStudio")} {"->"}
          </a>
        </div>
      </aside>
    </>
  );
}
