"use client";

import { useEffect, useState } from "react";
import { useRafScroll } from "@/hooks/useRafScroll";
import styles from "./voice.module.css";

export type Section = { id: string; label: string };

/**
 * The pill bar under the hero. It marks whichever section currently owns the
 * upper third of the viewport — a third rather than the midpoint, because the
 * bar itself sits at the top and the eye reads the section behind it.
 */
export function SectionNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [stuck, setStuck] = useState(false);

  useRafScroll((scrollY, viewportH) => {
    const line = scrollY + viewportH * 0.33;

    let current = sections[0]?.id ?? "";
    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top + scrollY <= line) current = id;
    }
    setActive((cur) => (cur === current ? cur : current));
  });

  // The bar tightens once it detaches from the hero.
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`${styles.sectionNav} ${stuck ? styles.sectionNavStuck : ""}`}>
      <nav aria-label="Page sections" className={styles.sectionNavInner}>
        <ul className={styles.sectionNavList}>
          {sections.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`text-ui ${styles.sectionNavLink} ${
                  active === id ? styles.sectionNavLinkActive : ""
                }`}
                aria-current={active === id ? "true" : undefined}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
