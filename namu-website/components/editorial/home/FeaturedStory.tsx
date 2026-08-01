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
  /** The image's true aspect ratio. The frame takes it so nothing is cropped. */
  ratio: string;
};

/**
 * The lead card. As the section crosses the viewport the frame widens from 80%
 * to full bleed and its corners square off, while the photograph inside eases
 * back from a 1.2 zoom — so the image appears to settle into place.
 *
 * The caption is one link rather than a row with two small ones. It overhangs
 * the bottom of the frame so it reads as pinned to the picture, and everything
 * in it responds on hover — the dot swells, a rule sweeps across in accent, the
 * arrow tile fills — so it is obvious the whole thing is a door.
 */
export function FeaturedStory({ href, image, ratio }: Props) {
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
    <section ref={sectionRef} className={styles.featured}>
      <div className={styles.featuredStage}>
        <div
          ref={frameRef}
          className={styles.featuredFrame}
          style={{ aspectRatio: ratio }}
        >
          <img
            ref={imgRef}
            src={image}
            alt={t("home.featured.alt")}
            className={styles.featuredImage}
            loading="eager"
          />
        </div>

        <ScrollObject className={styles.featuredCaptionWrap}>
          <Link href={href} className={styles.featuredCard}>
            <span className={`text-small ${styles.featuredEyebrow}`}>
              <span className={styles.featuredDot} aria-hidden="true" />
              {t("home.featured.category")}
            </span>

            <h2 className={`h6 ${styles.featuredTitle}`}>
              <SplitText text={t("home.featured.title")} />
            </h2>

            <span className={styles.featuredAction}>
              <span className={styles.featuredRule} aria-hidden="true" />
              <span className={`text-ui ${styles.featuredCta}`}>
                {t("home.featured.cta")}
              </span>
              <span className={styles.featuredArrowTile} aria-hidden="true">
                <ArrowRight className={styles.featuredArrow} />
              </span>
            </span>
          </Link>
        </ScrollObject>
      </div>
    </section>
  );
}
