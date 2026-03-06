"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getStudioTarget } from "@/lib/supabaseClient";
import { useTranslation } from "@/hooks/useTranslation";

export function CTASection() {
  useScrollReveal("#cta .reveal");
  const { t } = useTranslation();

  const onStudioClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = await getStudioTarget();
    window.location.href = target;
  };

  return (
    <section className="section cta-dark" id="cta">
      <div className="container left-cta">
        <h2 className="title reveal reveal-up">{t("cta.title")}</h2>
        <p className="intro reveal reveal-up">{t("cta.body")}</p>
        <div className="cta-row reveal reveal-up">
          <Link href="/contact" className="btn-primary">
            {t("cta.primary")}
          </Link>
          <a href="/login" onClick={onStudioClick} className="btn-ghost">
            {t("cta.studio")}
          </a>
          <Link href="/contact" className="btn-ghost">
            {t("cta.invest")}
          </Link>
        </div>
      </div>
    </section>
  );
}
