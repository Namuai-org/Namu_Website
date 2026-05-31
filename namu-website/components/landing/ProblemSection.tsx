"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useTranslation } from "@/hooks/useTranslation";

type ProblemCardProps = {
  id: string;
  body: string;
  align: "left" | "right";
  total: number;
};

function ProblemCard({ id, body, align, total }: ProblemCardProps) {
  const ref = useRef<HTMLElement>(null);
  const hasStarted = useInView(ref, 0.1);
  const typed = useTypewriter(body, hasStarted, 24, 12);

  return (
    <article
      ref={ref}
      className={`problem-scroll-card reveal ${align === "left" ? "reveal-left" : "reveal-right"} problem-scroll-card-${align}`}
    >
      <div className="problem-scroll-shell">
        <div className="problem-scroll-meta">
          <span className="problem-scroll-kicker">Problem</span>
          <span className="problem-scroll-count">
            {id} / {String(total).padStart(2, "0")}
          </span>
        </div>

        <div className="problem-scroll-window">
          <span className="problem-card-number">{id}</span>
          <p>
            {typed}
            {hasStarted && typed.length < body.length ? (
              <span className="problem-card-caret" aria-hidden="true" />
            ) : null}
          </p>
        </div>
      </div>
    </article>
  );
}

export function ProblemSection() {
  useScrollReveal("#problem .reveal");
  const { t } = useTranslation();

  const items = [
    { id: "01", body: t("problem.1.body"), align: "left"  as const },
    { id: "02", body: t("problem.2.body"), align: "right" as const },
    { id: "03", body: t("problem.3.body"), align: "left"  as const },
  ];

  return (
    <section className="section problem-editorial" id="problem">
      <div className="container">
        <span className="section-label section-label-center reveal reveal-fade">{t("problem.label")}</span>

        <div className="problem-scroll-list">
          {items.map((item) => (
            <ProblemCard key={item.id} id={item.id} body={item.body} align={item.align} total={items.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
