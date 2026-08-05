"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { PLAYGROUND_MODELS, modelById, type PlaygroundModel } from "@/lib/playground";
import { Console } from "./Console";
import { IconPanel } from "./icons";
import { Rail } from "./Rail";
import styles from "./playground.module.css";

/**
 * The console shell.
 *
 * One page switches on the selected model's modality rather than routing per
 * model — adding a model is then a line in lib/playground.ts, not a new route.
 * The choice lives in `?model=` so a mode can be linked to and survives reload.
 */
export function PlaygroundPage() {
  const { t } = useTranslation();
  const [model, setModel] = useState<PlaygroundModel>(PLAYGROUND_MODELS[0]);
  const [railOpen, setRailOpen] = useState(true);
  const [resetToken, setResetToken] = useState(0);

  // Read the deep link once on mount. Reading it during render would differ
  // between server and client and trip hydration.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("model");
    const found = id ? modelById(id) : undefined;
    if (found) setModel(found);
  }, []);

  // The rail is a column on a wide screen and a sheet on a narrow one, so it
  // should start closed where it would otherwise cover the console.
  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 600px)");
    setRailOpen(!narrow.matches);
  }, []);

  const select = useCallback((next: PlaygroundModel) => {
    setModel(next);
    const url = new URL(window.location.href);
    url.searchParams.set("model", next.id);
    window.history.replaceState(null, "", url);
    if (window.matchMedia("(max-width: 600px)").matches) setRailOpen(false);
  }, []);

  const reset = useCallback(
    (next: PlaygroundModel) => {
      select(next);
      setResetToken((n) => n + 1);
    },
    [select],
  );

  return (
    <div className={styles.shell}>
      <Rail
        open={railOpen}
        activeId={model.id}
        onSelect={select}
        onReset={reset}
        onClose={() => setRailOpen(false)}
      />

      <div className={styles.stage}>
        {!railOpen && (
          <button
            type="button"
            className={`${styles.iconButton} ${styles.stageToggle}`}
            onClick={() => setRailOpen(true)}
            aria-label={t("playground.expand")}
          >
            <IconPanel />
          </button>
        )}

        <div className={styles.stageInner}>
          <Console model={model} resetToken={resetToken} />
        </div>
      </div>
    </div>
  );
}
