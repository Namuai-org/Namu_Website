"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { downloadAllPitchSvgsZip, downloadCurrentSlideAsSvg } from "@/lib/pitchExport";
import { PITCH_SLIDE_LABELS } from "@/lib/pitchSlideLabels";

const DECK_EMBED_SRC = "/deck/namu-pitch.html?embed=1";
const DECK_PRINT_SRC = "/deck/namu-pitch.html?print=1";

type DeckSlideMessage = {
  type: "namu-deck-slide";
  index: number;
  total: number;
  title: string;
};

function isDeckMessage(data: unknown): data is DeckSlideMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as DeckSlideMessage).type === "namu-deck-slide" &&
    typeof (data as DeckSlideMessage).index === "number" &&
    typeof (data as DeckSlideMessage).total === "number"
  );
}

export function PitchDeckShell() {
  const { t } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [slide, setSlide] = useState({
    index: 0,
    total: PITCH_SLIDE_LABELS.length,
    title: PITCH_SLIDE_LABELS[0] ?? "",
  });
  const [zipBusy, setZipBusy] = useState(false);

  const postGo = useCallback((index: number) => {
    iframeRef.current?.contentWindow?.postMessage({ type: "namu-deck-nav", index }, "*");
  }, []);

  const slideRef = useRef(slide);
  slideRef.current = slide;

  const handleExportPdf = useCallback(() => {
    window.open(DECK_PRINT_SRC, "_blank", "noopener,noreferrer");
  }, []);

  const handleDownloadSvg = useCallback(() => {
    const { index, total, title } = slideRef.current;
    const label = title || PITCH_SLIDE_LABELS[index] || `Slide ${index + 1}`;
    downloadCurrentSlideAsSvg(label, index, total);
  }, []);

  const handleDownloadAllSvgs = useCallback(async () => {
    if (zipBusy) return;
    setZipBusy(true);
    try {
      await downloadAllPitchSvgsZip();
    } catch (e) {
      console.error(e);
    } finally {
      setZipBusy(false);
    }
  }, [zipBusy]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target;
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable)
      ) {
        return;
      }
      const { index, total } = slideRef.current;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        if (index < total - 1) postGo(index + 1);
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        if (index > 0) postGo(index - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [postGo]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (!isDeckMessage(e.data)) return;
      setSlide({
        index: e.data.index,
        total: e.data.total,
        title: e.data.title || PITCH_SLIDE_LABELS[e.data.index] || "",
      });
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const n = slide.total;
  const idx = slide.index;
  const label =
    slide.title || PITCH_SLIDE_LABELS[idx] || `Slide ${idx + 1}`;
  const canPrev = idx > 0;
  const canNext = idx < n - 1;

  return (
    <div className="pitch-shell">
      <header className="pitch-shell-top">
        <div className="pitch-shell-brand">
          <span className="pitch-shell-name">{t("pitch.shellBrand")}</span>
          <span className="pitch-shell-count" aria-live="polite">
            {idx + 1} / {n}
          </span>
        </div>
        <div className="pitch-shell-toolbar" role="toolbar" aria-label={t("pitch.toolbarLabel")}>
          <button
            type="button"
            className="pitch-toolbar-btn pitch-toolbar-btn--ghost"
            onClick={handleDownloadSvg}
          >
            {t("pitch.downloadSvg")}
          </button>
          <button
            type="button"
            className="pitch-toolbar-btn pitch-toolbar-btn--ghost"
            onClick={handleDownloadAllSvgs}
            disabled={zipBusy}
            aria-busy={zipBusy}
          >
            {zipBusy ? t("pitch.downloadAllSvgsWorking") : t("pitch.downloadAllSvgs")}
          </button>
          <button
            type="button"
            className="pitch-toolbar-btn pitch-toolbar-btn--primary"
            onClick={handleExportPdf}
          >
            {t("pitch.exportPdf")}
          </button>
        </div>
      </header>

      <div className="pitch-shell-body">
        <aside className="pitch-shell-toc" aria-label={t("pitch.tocLabel")}>
          <ol className="pitch-shell-toc-list">
            {PITCH_SLIDE_LABELS.map((item, i) => (
              <li key={item + String(i)}>
                <button
                  type="button"
                  className={`pitch-shell-toc-item${i === idx ? " is-active" : ""}`}
                  onClick={() => postGo(i)}
                  aria-current={i === idx ? "true" : undefined}
                >
                  <span className="pitch-shell-toc-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="pitch-shell-toc-title">{item}</span>
                </button>
              </li>
            ))}
          </ol>
        </aside>

        <div className="pitch-shell-main">
          <div className="pitch-shell-frame">
            <div className="pitch-shell-frame-label" aria-live="polite">
              <span className="pitch-shell-frame-title">{label}</span>
            </div>
            <div className="pitch-shell-frame-inner">
              <iframe
                ref={iframeRef}
                className="pitch-shell-iframe"
                src={DECK_EMBED_SRC}
                title={t("pitch.deckTitle")}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>

      <footer className="pitch-shell-bottom">
        <button
          type="button"
          className="pitch-shell-navbtn pitch-shell-navbtn--prev"
          disabled={!canPrev}
          onClick={() => postGo(idx - 1)}
          aria-label={t("pitch.navPrev")}
        >
          ← {t("pitch.navPrevShort")}
        </button>
        <div className="pitch-shell-dots-scroll">
          <div className="pitch-shell-dots" role="tablist" aria-label={t("pitch.progressLabel")}>
            {Array.from({ length: n }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`pitch-shell-dot${i === idx ? " is-on" : ""}`}
                onClick={() => postGo(i)}
                aria-label={`${t("pitch.goToSlide")} ${i + 1}`}
                aria-current={i === idx ? "true" : undefined}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          className="pitch-shell-navbtn pitch-shell-navbtn--next"
          disabled={!canNext}
          onClick={() => postGo(idx + 1)}
          aria-label={t("pitch.navNext")}
        >
          {t("pitch.navNextShort")} →
        </button>
      </footer>
    </div>
  );
}
