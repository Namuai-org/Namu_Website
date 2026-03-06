"use client";

import { useEffect } from "react";

export function useScrollReveal(
  selector = ".reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-fade"
) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selector]);
}
