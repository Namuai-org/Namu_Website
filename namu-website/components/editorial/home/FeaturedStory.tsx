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
  /**
   * Where the card leads. Without one it renders as a plain statement: no
   * link, and no arrow tile either, since the arrow's whole job is to promise
   * a destination.
   */
  href?: string;
  image: string;
  /**
   * Double-resolution file. The plate goes full bleed, so on a Retina screen a
   * 1440px viewport asks for ~2880 device pixels — without this the browser
   * upscales the 1x file by nearly 2x and the wordmark goes soft.
   */
  image2x?: string;
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
export function FeaturedStory({ href, image, image2x, ratio }: Props) {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useRafScroll((scrollY, viewportH) => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const media = mediaRef.current;
    const img = imgRef.current;
    if (!section || !frame || !media || !img) return;
    if (window.innerWidth <= 600) return;

    const rect = section.getBoundingClientRect();
    const top = rect.top + scrollY;

    // Runway: from the section's top edge entering the viewport bottom until
    // its top edge reaches the viewport top.
    const start = top - viewportH;
    const p = clamp((scrollY - start) / viewportH);

    // Ends at full bleed. The band the card sits in is a fraction of the frame,
    // so the start has to stay high enough that the card still fits inside it
    // while the frame is at its smallest.
    frame.style.maxWidth = `${85 + p * 15}%`;
    media.style.borderRadius = `calc(${(1 - p) * 6} * var(--unit-fx))`;
    img.style.transform = `scale(${1.2 - p * 0.2})`;
  });

  return (
    <section ref={sectionRef} className={styles.featured}>
      <div className={styles.featuredStage}>
        <div ref={frameRef} className={styles.featuredFrame}>
          {/* The clip lives here rather than on the frame, so the card can be
              overlaid on the plate on desktop and sit below it on a phone —
              where there is no room to overlay without hiding the tagline —
              without being cut off in either case. */}
          <div
            ref={mediaRef}
            className={styles.featuredMedia}
            style={{ aspectRatio: ratio }}
          >
            <img
              ref={imgRef}
              src={image}
              srcSet={image2x ? `${image} 1x, ${image2x} 2x` : undefined}
              alt={t("home.featured.alt")}
              className={styles.featuredImage}
              loading="eager"
              decoding="async"
            />
          </div>

          {/* Sits on the plate, in the band below the tagline. The band is
              defined as a fraction of the frame, so it clears "our language.
              our future." at every size the frame animates through. */}
          <ScrollObject className={styles.featuredCaptionWrap}>
            {/* Named by its destination: the card carries a statement, not a
                label saying where it goes. */}
            {href ? (
              <Link
                href={href}
                className={styles.featuredCard}
                aria-label={`${t("home.featured.title")} — about Namu`}
              >
                <h2 className={styles.featuredTitle}>
                  <SplitText text={t("home.featured.title")} />
                </h2>

                <span className={styles.featuredRule} aria-hidden="true" />

                <span className={styles.featuredArrowTile} aria-hidden="true">
                  <ArrowRight className={styles.featuredArrow} />
                </span>
              </Link>
            ) : (
              <div className={`${styles.featuredCard} ${styles.featuredCardStatic}`}>
                <h2 className={styles.featuredTitle}>
                  <SplitText text={t("home.featured.title")} />
                </h2>

                <span className={styles.featuredRule} aria-hidden="true" />
              </div>
            )}
          </ScrollObject>
        </div>
      </div>
    </section>
  );
}
