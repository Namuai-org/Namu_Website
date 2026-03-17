"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTranslation } from "@/hooks/useTranslation";

export function FAQSection() {
  useScrollReveal("#faq .reveal");
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
  ];

  return (
    <section className="section faq" id="faq">
      <div className="container narrow">
        <span className="section-label section-label-center reveal reveal-fade">{t("faq.label")}</span>
        <h2 className="title center reveal reveal-up faq-title">{t("faq.title")}</h2>

        <div className="faq-list reveal reveal-fade">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <article className={`faq-item ${isOpen ? "open" : ""}`} key={item.q}>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex((prev) => (prev === idx ? null : idx))}
                >
                  <span className="faq-question-main">
                    <span className="faq-index">{String(idx + 1).padStart(2, "0")}</span>
                    <span>{item.q}</span>
                  </span>
                </button>
                <div className={`faq-answer-wrap ${isOpen ? "open" : ""}`}>
                  <p className="faq-answer">{item.a}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
