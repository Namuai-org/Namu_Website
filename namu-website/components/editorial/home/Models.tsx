"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { MODELS } from "@/lib/models";
import { Button } from "../Button";
import { LearnMore } from "../LearnMore";
import { ScrollObject } from "../ScrollObject";
import { SplitText } from "../SplitText";
import styles from "./home.module.css";

/**
 * The model listing: one full-width row per model, image on the left and the
 * copy set across the grid on the right. /models carries the same catalogue
 * as a card grid.
 */

export function Models() {
  const { t } = useTranslation();

  return (
    <section className={styles.models} id="stack">
      <div className="ds-container ds-outer">
        <ScrollObject>
          <div className={styles.modelsHead}>
            <h2
              className="h4 ds-span"
              style={
                { "--span": 12, marginInline: "auto" } as React.CSSProperties
              }
            >
              <SplitText text={t("home.models.title")} />
            </h2>
          </div>

          <div className={styles.modelList}>
            {MODELS.map((model, i) => {
              const title = t(`${model.key}.name`);

              return (
                <article
                  key={model.key}
                  className={`${styles.modelRow} slide-up`}
                  /* --i drives .slide-up's 0.1s-per-row cascade. */
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <div className={styles.modelMedia}>
                    <img
                      src={model.image}
                      alt={t(`${model.key}.alt`)}
                      className={`${styles.modelImage} scale-out`}
                      loading="lazy"
                      width={1254}
                      height={1254}
                    />
                  </div>

                  <div className={styles.modelBody}>
                    <div className={styles.modelCopy}>
                      <div className={styles.modelHeading}>
                        <span className={`text-ui ${styles.modelKicker}`}>
                          {t(`${model.key}.kicker`)}
                        </span>
                        <h3 className={`h7 ${styles.modelName}`}>{title}</h3>
                      </div>

                      <p className={`text-regular ${styles.modelDesc}`}>
                        {t(`${model.key}.body`)}
                      </p>
                    </div>

                    <div className={styles.modelAction}>
                      <LearnMore
                        href={model.href}
                        label={t("home.models.more")}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className={styles.modelsFoot}>
            <Button href="/models" variant="invert">
              {t("home.models.all")}
            </Button>
          </div>
        </ScrollObject>
      </div>
    </section>
  );
}
