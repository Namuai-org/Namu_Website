"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { MODELS } from "@/lib/models";
import { Button } from "@/components/editorial/Button";
import { Footer } from "@/components/editorial/Footer";
import { LearnMore } from "@/components/editorial/LearnMore";
import { ScrollObject } from "@/components/editorial/ScrollObject";
import { SplitText } from "@/components/editorial/SplitText";
import styles from "./models-page.module.css";

/**
 * The full catalogue.
 *
 * Same models as the home page, but set as a card grid rather than rows: the
 * image sits above its copy, and every card is the same height so the "Learn
 * more" pills line up along the bottom of each row.
 */
export function ModelsPage() {
  const { t } = useTranslation();

  return (
    <>
      <main id="main-content">
        <section className={styles.page}>
          {/* A soft wash off the top of the page, as on the reference, so the
              hero does not begin on flat cream. */}
          <div className={styles.wash} aria-hidden="true" />

          <div className="ds-container ds-outer">
            <ScrollObject>
              <header className={styles.head}>
                <h1
                  className="h4 ds-span"
                  style={
                    {
                      "--span": 12,
                      marginInline: "auto",
                    } as React.CSSProperties
                  }
                >
                  <SplitText text={t("home.models.title")} />
                </h1>

                <p
                  className={`text-large-alt ds-span ${styles.intro}`}
                  style={
                    {
                      "--span": 14,
                      marginInline: "auto",
                    } as React.CSSProperties
                  }
                >
                  <SplitText text={t("models.intro")} delay={0.2} />
                </p>
              </header>

              <div className={styles.grid}>
                {MODELS.map((model, i) => (
                  <article
                    key={model.key}
                    className={`${styles.card} slide-up`}
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    <div className={styles.media}>
                      <img
                        src={model.image}
                        alt={t(`${model.key}.alt`)}
                        className={`${styles.image} scale-out`}
                        loading="lazy"
                        width={1254}
                        height={1254}
                      />
                    </div>

                    <div className={styles.copy}>
                      <span className={`text-ui ${styles.kicker}`}>
                        {t(`${model.key}.kicker`)}
                      </span>
                      <h2 className={`h7 ${styles.name}`}>
                        {t(`${model.key}.name`)}
                      </h2>
                      <p className={`text-regular ${styles.desc}`}>
                        {t(`${model.key}.body`)}
                      </p>
                    </div>

                    {/* Pushed to the card's floor so the pills align across
                        a row whatever the description length. */}
                    <div className={styles.action}>
                      <LearnMore
                        href={model.href}
                        label={t("home.models.more")}
                      />
                    </div>
                  </article>
                ))}
              </div>

              <div className={styles.foot}>
                <Button href="/playground" variant="invert">
                  {t("models.cta")}
                </Button>
              </div>
            </ScrollObject>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
