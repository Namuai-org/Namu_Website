"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-col">
          <div className="footer-brand">
            <span className="nav-mark">N</span>
            <span className="nav-name">{t("brand.name")}</span>
          </div>
          <p>{t("brand.missionShort")}</p>
        </div>

        <div className="footer-col">
          <h4>{t("footer.nav")}</h4>
          <Link href="/">{t("nav.home")}</Link>
          <Link href="/about">{t("nav.about")}</Link>
          <Link href="/solutions">{t("nav.solutions")}</Link>
          <Link href="/blog">{t("nav.blog")}</Link>
          <Link href="/contact">{t("nav.contact")}</Link>
        </div>

        <div className="footer-col">
          <h4>{t("footer.products")}</h4>
          <Link href="/solutions">{t("footer.product1")}</Link>
        </div>

        <div className="footer-col">
          <h4>{t("footer.contact")}</h4>
          <a href="mailto:hello@namu.ai">hello@namu.ai</a>
          <a href="https://x.com" target="_blank" rel="noreferrer">
            {t("footer.socialX")}
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            {t("footer.socialGithub")}
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            {t("footer.socialLinkedin")}
          </a>
        </div>
      </div>

      <hr />
      <div className="container footer-bottom">
        <p>{t("footer.rights")}</p>
        <p>{t("footer.legal")}</p>
      </div>
    </footer>
  );
}
