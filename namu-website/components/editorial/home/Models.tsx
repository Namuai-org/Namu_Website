"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "../Button";
import { ScrollObject } from "../ScrollObject";
import { SplitText } from "../SplitText";
import styles from "./home.module.css";

/**
 * The model listing: one full-width row per model, image on the left and the
 * copy set across the grid on the right.
 *
 * `href` is deliberately optional. The individual model pages do not exist
 * yet, so a row without one renders as plain content — no link wrappers, no
 * "Learn more". Filling in `href` turns both back on without any other change.
 */
type Model = {
  key: string;
  image: string;
  href?: string;
};

const MODELS: Model[] = [
  { key: "home.model.haFr", image: "/modim/hausa-french.png" },
  { key: "home.model.frHa", image: "/modim/french-hausa.png" },
  { key: "home.model.asr", image: "/modim/asr.png" },
  { key: "home.model.tts", image: "/modim/tts.png" },
  { key: "home.model.agent", image: "/modim/voice-agent.png" },
];

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
                      {model.href ? (
                        <Button href={model.href} simple>
                          {t("home.models.more")}
                        </Button>
                      ) : (
                        /* No destination yet, so this is the pill's shape
                           without the control — a button that goes nowhere is
                           worse than none. Give a model an `href` above and the
                           real Button takes over. */
                        <span className="button button--simple">
                          <span className="button__pill">
                            {t("home.models.more")}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </ScrollObject>
      </div>
    </section>
  );
}
