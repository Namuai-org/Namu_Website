"use client";

import { useState } from "react";
import { useRafScroll } from "@/hooks/useRafScroll";
import styles from "./voice.module.css";

export type Section = { id: string; label: string };

/**
 * The pill bar under the hero. It scrolls away with the page rather than
 * pinning — one floating bar is enough — but it still marks whichever section
 * owns the upper third of the viewport while it is on screen.
 */
export function SectionNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

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

  return (
    <div className={styles.sectionNav}>
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
