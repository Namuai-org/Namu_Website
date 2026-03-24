"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { NamuLogoMark } from "@/components/brand/NamuLogoMark";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-col footer-brand-col">
          <div className="footer-brand">
            <NamuLogoMark variant="onDark" height={30} />
            <span className="footer-name">{t("brand.name")}</span>
          </div>
          <p>{t("brand.missionShort")}</p>
        </div>

        <div className="footer-col">
          <h4>{t("footer.nav")}</h4>
          <div className="footer-link-list">
            <Link href="/">{t("nav.home")}</Link>
            <Link href="/solutions">{t("nav.solutions")}</Link>
            <Link href="/research">{t("nav.research")}</Link>
            <Link href="/team">{t("nav.team")}</Link>
            <Link href="/pitch">{t("nav.pitch")}</Link>
          </div>
        </div>

        <div className="footer-col">
          <h4>{t("footer.products")}</h4>
          <div className="footer-link-list">
            <Link href="/solutions">{t("footer.product1")}</Link>
          </div>
        </div>

        <div className="footer-col">
          <h4>{t("footer.contact")}</h4>
          <div className="footer-link-list footer-contact-list">
            <a href="mailto:thenamu.ai@gmail.com">namu.ai@gmail.com</a>
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
      </div>

      <hr />
      <div className="container footer-bottom">
        <p>{t("footer.rights")}</p>
        <p>{t("footer.legal")}</p>
      </div>
    </footer>
  );
}
