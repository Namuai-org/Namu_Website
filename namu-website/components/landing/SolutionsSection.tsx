"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { StudioPreviewCard } from "@/components/landing/StudioPreviewCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";

export function SolutionsSection() {
  useScrollReveal("#solutions .reveal");
  const implRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = implRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          root.classList.add("solution-impl-visible");
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px" }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);
  const { t } = useTranslation();
  const steps = [
    {
      id: "01",
      title: t("solution.step1.title"),
      body: t("solution.step1.body"),
      align: "left",
    },
    {
      id: "02",
      title: t("solution.step2.title"),
      body: t("solution.step2.body"),
      align: "right",
    },
    {
      id: "03",
      title: t("solution.step3.title"),
      body: t("solution.step3.body"),
      align: "left",
    },
  ];

  return (
    <section className="section solution-home" id="solutions">
      <div className="container">
        <div className="solution-home-copy solution-home-copy-centered">
          <span className="section-label section-label-center reveal reveal-fade">{t("solution.label")}</span>
          <p className="solution-subtitle solution-subtitle-centered reveal reveal-up">{t("solution.subtitle")}</p>
        </div>

        <div className="solution-loop-system">
          <svg className="solution-loop-lines" viewBox="0 0 1200 1040" aria-hidden="true">
            <defs>
              <linearGradient id="solutionLoopStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(214,112,63,0.14)" />
                <stop offset="50%" stopColor="rgba(214,112,63,0.52)" />
                <stop offset="100%" stopColor="rgba(155,190,228,0.24)" />
              </linearGradient>
              <marker id="solutionLoopArrow" markerWidth="12" markerHeight="12" refX="8" refY="6" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M1 1L9 6L1 11" fill="none" stroke="#d6703f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>
            <path className="solution-loop-path" d="M476 272C544 176 670 174 724 270" pathLength="100" markerEnd="url(#solutionLoopArrow)" />
            <path className="solution-loop-path solution-loop-path-delay" d="M914 434C988 582 902 800 676 904" pathLength="100" markerEnd="url(#solutionLoopArrow)" />
            <path className="solution-loop-path solution-loop-path-delay-two" d="M524 904C302 800 218 584 288 432" pathLength="100" markerEnd="url(#solutionLoopArrow)" />
          </svg>

          <div className="solution-steps">
            {steps.map((step, index) => (
              <article
                key={step.id}
                className={`solution-step-card solution-step-card-${index + 1} reveal ${
                  step.align === "left" ? "reveal-left solution-step-card-left" : "reveal-right solution-step-card-right"
                }`}
              >
                <div className="solution-step-shell">
                  <div className="solution-step-meta">
                    <span className="solution-step-number">{step.id}</span>
                    <span className="solution-step-kicker">{t("solution.label")}</span>
                  </div>
                  <h3 className="solution-step-title">{step.title}</h3>
                  <p className="solution-step-body">{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div ref={implRef} className="solution-implementation">
          <div className="solution-home-panel solution-impl-panel">
            <div className="solution-panel-topline">{t("solution.panelLabel")}</div>
            <h3 className="solution-panel-title">{t("solution.panelTitle")}</h3>
            <p className="solution-panel-copy">{t("solution.panelIntro")}</p>

            <div className="solution-demo-wrap solution-demo-wrap-inline">
              <div className="solution-demo-frame solution-demo-frame-static solution-impl-demo-frame">
                <StudioPreviewCard />
              </div>
            </div>

            <div className="solution-panel-list">
              <span>{t("solution.pill1")}</span>
              <span>{t("solution.pill2")}</span>
              <span>{t("solution.pill3")}</span>
              <span>{t("solution.pill4")}</span>
            </div>
            <p>{t("solution.panelBody")}</p>
            <div className="solution-panel-line" aria-hidden="true" />
            <Link href="/solutions" className="btn-outline solution-pointer">
              {t("solution.cta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
