"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NamuLogoMark } from "@/components/brand/NamuLogoMark";
import { Console, type ConsoleReport } from "@/components/playground/Console";
import { micLevel } from "@/hooks/useRecorder";
import { useTranslation } from "@/hooks/useTranslation";
import { modelById } from "@/lib/playground";
import type { ParkHandle } from "./engine/createPark";
import { STATION_ORDER, type StationId } from "./engine/layout";
import styles from "./park.module.css";

type Focus = StationId | "park";

/**
 * The park, and the console that lives inside it.
 *
 * React owns the words and the panel; the engine owns the scene. They meet at
 * two seams only: the console reports what it is doing so a sculpture can act
 * it out, and the page tells the camera how much of the screen is still free.
 */
export function ParkExperience() {
  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parkRef = useRef<ParkHandle | null>(null);
  const labelRefs = useRef<Partial<Record<StationId, HTMLElement | null>>>({});

  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [focus, setFocus] = useState<Focus>("park");
  const [hovered, setHovered] = useState<StationId | null>(null);
  const [touch, setTouch] = useState(false);
  const [narrow, setNarrow] = useState(false);

  const station = focus === "park" || focus === "hub" ? null : focus;
  const model = station ? modelById(station) : undefined;

  const nameOf = useCallback((id: StationId) => t(`park.${id}.name`), [t]);
  const modelNameOf = useCallback(
    (id: StationId) => {
      const entry = modelById(id);
      if (!entry) return "";
      return entry.railKey ? t(entry.railKey) : t(`${entry.key}.name`);
    },
    [t],
  );

  /* The camera's share of the screen ---------------------------------------- */

  const stationRef = useRef<StationId | null>(null);
  stationRef.current = station;

  const applyFrame = useCallback((immediate = false) => {
    const element = containerRef.current;
    const park = parkRef.current;
    if (!element || !park) return;
    const width = element.clientWidth;
    const height = element.clientHeight;
    const open = stationRef.current !== null;

    if (width < 900) {
      const bar = 58;
      const sheet = open ? height * 0.6 : 64;
      park.setFrame(
        { x: 14, y: bar, width: width - 28, height: Math.max(160, height - bar - sheet) },
        immediate,
      );
      return;
    }

    const bar = 68;
    if (open) {
      const panel = Math.min(470, Math.max(380, width * 0.3));
      park.setFrame(
        { x: 28, y: bar, width: Math.max(240, width - panel - 76), height: height - bar - 44 },
        immediate,
      );
    } else {
      park.setFrame(
        { x: 40, y: bar, width: width - 80, height: height - bar - 56 },
        immediate,
      );
    }
  }, []);

  /* Choosing a station ------------------------------------------------------- */

  const select = useCallback((next: Focus) => {
    setFocus(next);
    parkRef.current?.select(next === "park" ? null : next, true);

    const url = new URL(window.location.href);
    if (next === "park" || next === "hub") url.searchParams.delete("model");
    else url.searchParams.set("model", next);
    window.history.replaceState(null, "", url);
  }, []);

  const selectRef = useRef(select);
  selectRef.current = select;

  const step = useCallback(
    (direction: 1 | -1) => {
      const current = stationRef.current;
      const from = current ? STATION_ORDER.indexOf(current) : direction > 0 ? -1 : 0;
      const next = (from + direction + STATION_ORDER.length) % STATION_ORDER.length;
      selectRef.current(STATION_ORDER[next]);
    },
    [],
  );

  /* Building the park -------------------------------------------------------- */

  const copy = useMemo(
    () => ({
      interpret: {
        title: t("park.interpret.name"),
        sub: modelNameOf("interpret"),
        ha: t("park.interpret.ha"),
        fr: t("park.interpret.fr"),
        hint: t("park.interpret.hint"),
      },
      transcribe: { title: t("park.transcribe.name"), sub: modelNameOf("transcribe") },
      voice: {
        title: t("park.voice.name"),
        sub: modelNameOf("voice"),
        hint: t("park.voice.hint"),
      },
      agent: {
        title: t("park.agent.name"),
        sub: modelNameOf("agent"),
        ask: t("park.agent.ask"),
        answer: t("park.agent.answer"),
      },
    }),
    // The park is built once; its signs are baked into textures, so the copy is
    // read at build time and the whole scene is remounted if the language changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);
    setNarrow(window.matchMedia("(max-width: 899px)").matches);

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let alive = true;
    let handle: ParkHandle | null = null;

    import("./engine/createPark")
      .then(({ createPark }) =>
        createPark({
          canvas,
          container,
          copy,
          reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          labels: labelRefs.current,
          getLevel: () => micLevel.value,
          onHover: setHovered,
          onPick: (id) => id && selectRef.current(id),
          onProgress: setProgress,
        }),
      )
      .then((park) => {
        if (!alive) {
          park.dispose();
          return;
        }
        handle = park;
        parkRef.current = park;
        setReady(true);

        // A deep link lands on the station it names, without the flight.
        const wanted = new URLSearchParams(window.location.search).get("model");
        const initial = STATION_ORDER.find((id) => id === wanted);
        applyFrame(true);
        if (initial) {
          setFocus(initial);
          stationRef.current = initial;
          applyFrame(true);
          park.select(initial, false);
        }
      })
      .catch(() => setReady(true));

    return () => {
      alive = false;
      handle?.dispose();
      parkRef.current = null;
    };
  }, [applyFrame, copy]);

  useEffect(() => {
    applyFrame();
  }, [applyFrame, focus, ready]);

  useEffect(() => {
    const onResize = () => applyFrame(true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applyFrame]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === "Escape") selectRef.current("park");
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
      else if (/^[1-4]$/.test(event.key)) selectRef.current(STATION_ORDER[Number(event.key) - 1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  /* The console, reported to the sculpture ----------------------------------- */

  const onReport = useCallback((report: ConsoleReport) => {
    const id = stationRef.current;
    if (!id) return;
    parkRef.current?.setState(id, {
      activity: report.activity,
      level: micLevel.value,
      variantId: report.variantId,
      text: report.text,
    });
  }, []);

  const index = station ? STATION_ORDER.indexOf(station) : -1;

  return (
    <div className={styles.root} ref={containerRef} data-open={station ? "true" : "false"}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <header className={styles.bar}>
        <a className={styles.wordmark} href="/">
          <NamuLogoMark variant="onLight" height={22} />
          <span className={`text-ui ${styles.wordmarkLabel}`}>{t("playground.title")}</span>
        </a>
        <nav className={styles.barLinks}>
          <a className={`text-ui ${styles.barLink}`} href="/models">
            {t("park.explore")}
          </a>
          <a className={`text-ui ${styles.barLink}`} href="/playground?view=classic">
            {t("park.classic")}
          </a>
        </nav>
      </header>

      <div className={styles.labels}>
        {(["hub", ...STATION_ORDER] as StationId[]).map((id) => {
          const number = STATION_ORDER.indexOf(id);
          return (
            <button
              key={id}
              type="button"
              ref={(element) => {
                labelRefs.current[id] = element;
              }}
              className={styles.label}
              data-onscreen="false"
              data-kind={id === "hub" ? "hub" : "station"}
              data-active={hovered === id || focus === id ? "true" : "false"}
              data-dim={station ? "true" : "false"}
              onClick={() => select(id)}
              onPointerEnter={() => parkRef.current?.hover(id)}
              onPointerLeave={() => parkRef.current?.hover(null)}
            >
              {number >= 0 && (
                <span className={`text-small ${styles.labelNumber}`}>
                  {String(number + 1).padStart(2, "0")}
                </span>
              )}
              <span className={styles.labelName}>{nameOf(id)}</span>
            </button>
          );
        })}
      </div>

      <aside className={styles.panel} data-open={station ? "true" : "false"} aria-hidden={!station}>
        {station && model && (
          <>
            <button
              type="button"
              className={styles.back}
              onClick={() => select("park")}
              aria-label={t("park.back")}
              title={t("park.back")}
            >
              <span aria-hidden="true">←</span>
            </button>

            <header className={styles.panelTitle}>
              <h2 className={styles.panelName}>{nameOf(station)}</h2>
              <p className={`text-small ${styles.panelModel}`}>{modelNameOf(station)}</p>
              {/* The park is the description. Kept for anyone who cannot see it. */}
              <p className={styles.srOnly}>{t(`park.${station}.how`)}</p>
            </header>

            <div className={styles.console}>
              <Console model={model} resetToken={0} compact onReport={onReport} />
            </div>

            <nav className={styles.panelNav} aria-label={t("park.station")}>
              <button
                type="button"
                className={styles.navArrow}
                onClick={() => step(-1)}
                aria-label={nameOf(STATION_ORDER[(index + STATION_ORDER.length - 1) % STATION_ORDER.length])}
              >
                <span aria-hidden="true">←</span>
              </button>
              <span className={styles.pips}>
                {STATION_ORDER.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={styles.pip}
                    data-on={id === station ? "true" : "false"}
                    onClick={() => select(id)}
                    aria-label={nameOf(id)}
                    aria-current={id === station ? "true" : undefined}
                  />
                ))}
              </span>
              <button
                type="button"
                className={styles.navArrow}
                onClick={() => step(1)}
                aria-label={nameOf(STATION_ORDER[(index + 1) % STATION_ORDER.length])}
              >
                <span aria-hidden="true">→</span>
              </button>
            </nav>
          </>
        )}
      </aside>

      <p className={`text-small ${styles.hint}`} data-open={station ? "false" : "true"}>
        {t(narrow ? "park.hint.compact" : touch ? "park.hint.touch" : "park.hint.pointer")}
      </p>

      <div className={styles.loading} data-done={ready ? "true" : "false"} aria-hidden={ready}>
        <NamuLogoMark variant="onLight" height={30} />
        <span className={`text-small ${styles.loadingLabel}`}>{t("park.loading")}</span>
        <span className={styles.loadingTrack}>
          <span className={styles.loadingBar} style={{ transform: `scaleX(${Math.max(0.04, progress)})` }} />
        </span>
      </div>
    </div>
  );
}
