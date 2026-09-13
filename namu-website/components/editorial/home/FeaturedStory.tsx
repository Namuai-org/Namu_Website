"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { clamp, useRafScroll } from "@/hooks/useRafScroll";
import styles from "./home.module.css";

type Props = {
  image: string;
  /** The image's true aspect ratio. The frame takes it so nothing is cropped. */
  ratio: string;
  /**
   * A square crop for phones. The plate is a designed composition with its
   * words in the middle; at a phone's width the full landscape frame shrinks
   * them past reading, so a phone gets the centre of it, full bleed.
   */
  phoneImage?: string;
};

const PHONE = "(max-width: 600px)";

/**
 * The cover plate, straight after the hero.
 *
 * On a wide screen the frame widens from 85% to full bleed as the section
 * crosses the viewport, its corners square off, and the picture eases back
 * from a 1.2 zoom — so it appears to settle into place.
 *
 * On a phone it is simply there, full bleed and still, the way the reference
 * sets its lead image on mobile: a screen-wide square straight after the
 * hero, with nothing laid over it. The words are part of the picture, so
 * there is no card on top of it at any size.
 */
export function FeaturedStory({ image, ratio, phoneImage }: Props) {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const phone = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia(PHONE);
    const apply = () => {
      phone.current = mq.matches;
      if (!mq.matches) return;
      // Clear whatever the wide-screen animation last wrote, so a window
      // narrowed mid-scroll lands on the phone layout rather than a frozen
      // frame of the animation.
      frameRef.current?.style.removeProperty("max-width");
      mediaRef.current?.style.removeProperty("border-radius");
      imgRef.current?.style.removeProperty("transform");
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useRafScroll((scrollY, viewportH) => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const media = mediaRef.current;
    const img = imgRef.current;
    if (!section || !frame || !media || !img || phone.current) return;

    const rect = section.getBoundingClientRect();
    const top = rect.top + scrollY;

    // Runway: from the section's top edge entering the viewport bottom until
    // its top edge reaches the viewport top.
    const start = top - viewportH;
    const p = clamp((scrollY - start) / viewportH);

    frame.style.maxWidth = `${85 + p * 15}%`;
    media.style.borderRadius = `calc(${(1 - p) * 6} * var(--unit-fx))`;
    img.style.transform = `scale(${1.2 - p * 0.2})`;
  });

  return (
    <section ref={sectionRef} className={styles.featured}>
      <div className={styles.featuredStage}>
        <div ref={frameRef} className={styles.featuredFrame}>
          <div
            ref={mediaRef}
            className={styles.featuredMedia}
            style={{ "--plate-ratio": ratio } as React.CSSProperties}
          >
            <picture>
              {phoneImage ? <source media={PHONE} srcSet={phoneImage} /> : null}
              <img
                ref={imgRef}
                src={image}
                alt={t("home.featured.alt")}
                className={styles.featuredImage}
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
}
