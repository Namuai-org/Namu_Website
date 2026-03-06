"use client";

import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getStudioTarget } from "@/lib/supabaseClient";
import { useTranslation } from "@/hooks/useTranslation";
import { StudioDemo } from "@/components/landing/StudioDemo";

export function SolutionsSection() {
  useScrollReveal("#solutions .reveal");
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { number: t("how.s1.number"), title: t("how.s1.title"), body: t("how.s1.body") },
    { number: t("how.s2.number"), title: t("how.s2.title"), body: t("how.s2.body") },
    { number: t("how.s3.number"), title: t("how.s3.title"), body: t("how.s3.body") },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, 2200);

    return () => window.clearInterval(timer);
  }, [steps.length]);

  const onStudioClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = await getStudioTarget();
    window.location.href = target;
  };

  return (
    <section className="section solution-single" id="solutions">
      <div className="container center">
        <span className="section-label reveal reveal-fade">{t("solution.label")}</span>
        <h2 className="display-title reveal reveal-up">{t("solution.title")}</h2>
        <p className="solution-subtitle reveal reveal-up">{t("solution.subtitle")}</p>

        <div className="timeline-grid solution-steps-grid">
          {steps.map((step, index) => (
            <article
              className={`timeline-step ${activeStep === index ? "timeline-step-active" : ""}`}
              key={step.number}
              onMouseEnter={() => setActiveStep(index)}
            >
              <span className="timeline-node" aria-hidden="true" />
              <span className="timeline-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>

        <h3 className="title solution-demo-title reveal reveal-up">{t("how.title")}</h3>

        <div className="solution-demo-shell reveal reveal-fade">
          <StudioDemo autoPlay />
        </div>

        <div className="solution-pill-row reveal reveal-up">
          <span>{t("solution.pill1")}</span>
          <span>{t("solution.pill2")}</span>
          <span>{t("solution.pill3")}</span>
          <span>{t("solution.pill4")}</span>
        </div>

        <a href="/login" onClick={onStudioClick} className="btn-primary solution-main-cta reveal reveal-up">
          {t("solution.cta")}
        </a>
      </div>
    </section>
  );
}
