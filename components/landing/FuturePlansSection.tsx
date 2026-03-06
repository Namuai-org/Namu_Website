"use client";

import type { SVGProps } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";

function AgricultureIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20V10" />
      <path d="M12 13C8.4 13 6 10.6 6 7c3.6 0 6 2.4 6 6Z" />
      <path d="M12 11c0-4 2.7-6.5 6.5-6.5 0 4-2.6 6.5-6.5 6.5Z" />
      <path d="M7 20h10" />
    </svg>
  );
}

function EducationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 8.5 12 4l9 4.5-9 4.5L3 8.5Z" />
      <path d="M7 10.5V15c0 1.7 2.4 3 5 3s5-1.3 5-3v-4.5" />
      <path d="M21 8.5V15" />
    </svg>
  );
}

function BankingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 9h16" />
      <path d="M6 9V7.5A2.5 2.5 0 0 1 8.5 5h7A2.5 2.5 0 0 1 18 7.5V9" />
      <rect x="4" y="9" width="16" height="10" rx="2" />
      <path d="M15 14h3" />
    </svg>
  );
}

function GovernmentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 9h18" />
      <path d="M5 9v8" />
      <path d="M9.5 9v8" />
      <path d="M14.5 9v8" />
      <path d="M19 9v8" />
      <path d="M2.5 19h19" />
      <path d="M12 4 3 8.5h18L12 4Z" />
    </svg>
  );
}

function SupportIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 15H6.5A2.5 2.5 0 0 1 4 12.5v-1a6.5 6.5 0 0 1 13.2-2.5" />
      <path d="M16 15h1.5a2.5 2.5 0 0 0 2.5-2.5v-1a6.5 6.5 0 0 0-13 0V15" />
      <path d="M8 15a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3Z" />
    </svg>
  );
}

function HealthIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20s-6.5-3.8-8.5-8.3C2.2 8.7 4 6 7 6c2 0 3.2 1 5 3 1.8-2 3-3 5-3 3 0 4.8 2.7 3.5 5.7C18.5 16.2 12 20 12 20Z" />
      <path d="M12 9v5" />
      <path d="M9.5 11.5h5" />
    </svg>
  );
}

export function FuturePlansSection() {
  useScrollReveal("#future-plans .reveal");
  const { t } = useTranslation();

  const plans = [
    { icon: AgricultureIcon, title: t("future.agri.title"), body: t("future.agri.body") },
    { icon: EducationIcon, title: t("future.education.title"), body: t("future.education.body") },
    { icon: BankingIcon, title: t("future.banking.title"), body: t("future.banking.body") },
    { icon: GovernmentIcon, title: t("future.government.title"), body: t("future.government.body") },
    { icon: SupportIcon, title: t("future.support.title"), body: t("future.support.body") },
    { icon: HealthIcon, title: t("future.health.title"), body: t("future.health.body") },
  ];

  return (
    <section className="section future-plans" id="future-plans">
      <div className="container">
        <span className="section-label section-label-center reveal reveal-fade">{t("future.label")}</span>
        <p className="future-intro reveal reveal-up">{t("future.intro")}</p>

        <div className="future-grid future-grid-enhanced">
          {plans.map((plan, idx) => (
            <article key={plan.title} className={`future-card future-card-${idx + 1} reveal reveal-up`}>
              <div className="future-card-top">
                <span className="future-icon-wrap" aria-hidden="true">
                  <plan.icon className="future-icon" />
                </span>
                <span className="future-chip">{t("future.inProgress")}</span>
              </div>
              <h3>{plan.title}</h3>
              <p>{plan.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
