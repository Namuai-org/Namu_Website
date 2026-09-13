"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { FilmPlayer, formatTime } from "../FilmPlayer";
import { ScrollObject } from "../ScrollObject";
import styles from "./home.module.css";

/** Length of namu-film.{webm,mp4}, so the label is right before metadata loads. */
const FILM_SECONDS = 113;

/**
 * The film, between the lead card and the stories.
 *
 * Laid out the way Aya presents its own: one line of introduction, then the
 * film large and centred with nothing else competing for it. It spans
 * eighteen of the twenty-four columns — the width the reference gives its
 * film block.
 *
 * The label is the section's heading. It is small on purpose: the film is the
 * headline, and a serif title above it only repeated what the film says.
 *
 * The page stays on paper around it. The film is cut from the site's own
 * palette — it opens on harmattan, turns kola, ends on ink — so its first act
 * reads as one more card on the page, and the darker acts carry the contrast
 * on their own.
 */
export function Film() {
  const { t } = useTranslation();

  return (
    <section className={styles.film} aria-labelledby="film-heading">
      <div className="ds-container ds-outer">
        <ScrollObject className={styles.filmInner}>
          <header className={styles.filmHead}>
            <h2 id="film-heading" className={`text-ui ${styles.filmKicker}`} data-fade>
              {t("home.film.kicker")}{" "}
              <span className={styles.filmDot} aria-hidden="true">·</span>{" "}
              {formatTime(FILM_SECONDS)}
            </h2>

            <p className={`text-regular ${styles.filmIntro}`} data-fade>
              {t("home.film.intro")}
            </p>
          </header>

          <div className={`${styles.filmStage} fade-in`}>
            <FilmPlayer
              webm="/editorial/namu-film.webm"
              mp4="/editorial/namu-film.mp4"
              poster="/editorial/namu-film-poster.jpg"
              title={t("home.film.name")}
              description={t("home.film.description")}
              duration={FILM_SECONDS}
            />
          </div>
        </ScrollObject>
      </div>
    </section>
  );
}
