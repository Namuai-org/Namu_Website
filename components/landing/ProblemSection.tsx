"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";

export function ProblemSection() {
  useScrollReveal("#problem .reveal");
  const { t } = useTranslation();

  const items = useMemo(
    () => [
      { id: "01", title: t("problem.1.title"), body: t("problem.1.body") },
      { id: "02", title: t("problem.2.title"), body: t("problem.2.body") },
      { id: "03", title: t("problem.3.title"), body: t("problem.3.body") },
      { id: "04", title: t("problem.4.title"), body: t("problem.4.body") },
    ],
    [t]
  );

  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const travel = Math.max(rect.height - window.innerHeight * 0.55, 1);
      const progress = Math.min(Math.max((window.innerHeight * 0.35 - rect.top) / travel, 0), 0.999);
      const nextIndex = Math.floor(progress * items.length);
      setActiveIndex(nextIndex);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items.length]);

  return (
    <section className="section problem-story" id="problem" ref={sectionRef}>
      <div className="container">
        <span className="section-label section-label-center problem-label reveal reveal-fade">{t("problem.label")}</span>
        <h2 className="problem-title reveal reveal-up">{t("problem.title")}</h2>

        <div className="problem-story-grid">
          <div className="problem-sticky reveal reveal-fade">
            <div className="problem-progress-track">
              <div className="problem-progress-fill" style={{ height: `${((activeIndex + 1) / items.length) * 100}%` }} />
            </div>
          </div>

          <div className="problem-sequence">
            {items.map((item, idx) => (
              <article
                className={`problem-seq-item ${idx % 2 === 0 ? "is-left" : "is-right"} ${idx === activeIndex ? "is-active" : ""} ${idx < activeIndex ? "is-past" : ""}`}
                key={item.id}
              >
                <span className="problem-number">{item.id}</span>
                <h3>{item.title}</h3>
                <div className="problem-underline" />
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
