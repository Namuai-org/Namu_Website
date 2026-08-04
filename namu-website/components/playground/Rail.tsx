"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { PLAYGROUND_MODELS, type PlaygroundModel } from "@/lib/playground";
import { Button } from "@/components/editorial/Button";
import { IconPanel, IconPlusCircle, MODEL_GLYPHS } from "./icons";
import styles from "./playground.module.css";

type Props = {
  open: boolean;
  activeId: string;
  onSelect: (model: PlaygroundModel) => void;
  onReset: (model: PlaygroundModel) => void;
  onClose: () => void;
};

/**
 * The model rail.
 *
 * Selecting a row switches the console; the ⊕ on a row clears whatever is in it
 * and starts again. Both live on the same row, so the ⊕ is a real button rather
 * than a nested one — a button inside a button is not valid, and the browser
 * resolves it in ways you cannot rely on.
 */
export function Rail({ open, activeId, onSelect, onReset, onClose }: Props) {
  const { t } = useTranslation();

  return (
    <aside
      className={`${styles.rail} ${open ? "" : styles.railClosed}`}
      aria-hidden={!open}
      inert={!open}
    >
      <div className={styles.railHead}>
        <Link href="/" className={styles.wordmark}>
          <span className={styles.wordmarkName}>namu</span>
          <span className={`text-ui ${styles.wordmarkSuffix}`}>
            {t("playground.wordmark")}
          </span>
        </Link>

        <button
          type="button"
          className={styles.iconButton}
          onClick={onClose}
          aria-label={t("playground.collapse")}
        >
          <IconPanel />
        </button>
      </div>

      <span className={`text-small ${styles.railLabel}`}>
        {t("playground.models")}
      </span>

      <div className={styles.modelList} role="tablist" aria-label={t("playground.models")}>
        {PLAYGROUND_MODELS.map((model) => {
          const Glyph = MODEL_GLYPHS[model.icon];
          const active = model.id === activeId;

          return (
            <div
              key={model.id}
              className={`${styles.modelRow} ${active ? styles.modelRowActive : ""}`}
            >
              <button
                type="button"
                role="tab"
                aria-selected={active}
                className={styles.modelRowMain}
                onClick={() => onSelect(model)}
              >
                <Glyph className={styles.modelGlyph} />
                <span className={styles.modelName}>
                  {t(`${model.key}.name`)}
                </span>
              </button>

              <button
                type="button"
                className={styles.modelNew}
                onClick={() => onReset(model)}
                aria-label={`${t("playground.newSession")} — ${t(`${model.key}.name`)}`}
              >
                <IconPlusCircle />
              </button>
            </div>
          );
        })}
      </div>

      <div className={styles.railRule} />

      <p className={`text-small ${styles.railSessions}`}>
        {t("playground.sessions")}
      </p>

      <div className={styles.railFoot}>
        <span className={`text-small ${styles.railFootLabel}`}>
          {t("playground.discover")}
        </span>
        <Button
          href="mailto:contact@namuai.org"
          variant="invert"
          simple
          className={styles.railCta}
        >
          {t("playground.contact")}
        </Button>
      </div>
    </aside>
  );
}
