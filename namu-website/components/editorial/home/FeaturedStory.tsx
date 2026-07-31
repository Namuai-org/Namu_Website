"use client";

import Link from "next/link";
import { useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { clamp, useRafScroll } from "@/hooks/useRafScroll";
import { ArrowRight } from "../icons";
import { ScrollObject } from "../ScrollObject";
import { SplitText } from "../SplitText";
import styles from "./home.module.css";

type Props = {
  href: string;
  image: string;
};

/**
 * The lead story. As the section crosses the viewport its frame widens from
 * 80% to full bleed and its corners square off, while the photograph inside
 * eases back from a 1.2 zoom — so the image appears to settle into place.
 */
export function FeaturedStory({ href, image }: Props) {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useRafScroll((scrollY, viewportH) => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!section || !frame || !img) return;
    if (window.innerWidth <= 600) return;

    const rect = section.getBoundingClientRect();
    const top = rect.top + scrollY;

    // Runway: from the section's top edge entering the viewport bottom until
    // its top edge reaches the viewport top.
    const start = top - viewportH;
    const p = clamp((scrollY - start) / viewportH);

    frame.style.maxWidth = `${80 + p * 20}%`;
    frame.style.borderRadius = `calc(${(1 - p) * 6} * var(--unit-fx))`;
    img.style.transform = `scale(${1.2 - p * 0.2})`;
  });

  return (
    <section
      ref={sectionRef}
      className={styles.featured}
      aria-label={t("home.featured.title")}
    >
      <div ref={frameRef} className={styles.featuredFrame}>
        <img
          ref={imgRef}
          src={image}
          alt={t("home.featured.alt")}
          className={styles.featuredImage}
          loading="eager"
        />
      </div>

      <div
        className={`ds-span ${styles.featuredCaptionWrap}`}
        style={{ "--span": 16 } as React.CSSProperties}
      >
        <ScrollObject className={styles.featuredCaption}>
          <div className={styles.featuredRow}>
            <h2
              className="h6 ds-span"
              style={{ "--span": 10 } as React.CSSProperties}
            >
              <Link href={href}>
                <SplitText text={t("home.featured.title")} />
              </Link>
            </h2>

            <div
              className="text-caption ds-span"
              style={{ "--span": 3 } as React.CSSProperties}
            >
              {t("home.featured.category")}
            </div>

            <div
              className={`ds-span ${styles.featuredMeta}`}
              style={{ "--span": 3 } as React.CSSProperties}
            >
              <div className="text-caption">{t("home.featured.readTime")}</div>
              <Link href={href} aria-label={t("home.featured.title")}>
                <ArrowRight className={styles.featuredArrow} />
              </Link>
            </div>
          </div>
        </ScrollObject>
      </div>
    </section>
  );
}
