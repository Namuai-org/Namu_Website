"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowUpRight } from "@/components/editorial/icons";
import { AudioSample } from "@/components/models/voice/AudioSample";
import { formatClock, useRecorder } from "@/hooks/useRecorder";
import {
  DIALECTS,
  REGISTERS,
  VOICES,
  type Dialect,
  type PlaygroundModel,
  type Register,
  type Voice,
} from "@/lib/playground";
import {
  NotConnectedError,
  blobToBase64,
  runAgent,
  runInterpret,
  runTranscribe,
  runVoice,
} from "@/lib/playgroundApi";
import { InlineSelect } from "./InlineSelect";
import { Pending } from "./Pending";
import {
  IconArrowUp,
  IconStopSmall,
  IconMic,
  IconPlus,
  IconPlayOutline,
  IconStop,
} from "./icons";
import styles from "./playground.module.css";

type Status = "idle" | "running" | "done" | "error";

type Result = {
  heard?: string;
  reply?: string;
  transcript?: string;
  audioUrl?: string;
};

/** `home.model.haFr` → `haFr`, which is the copy namespace for this mode. */
const slugOf = (model: PlaygroundModel) => model.key.split(".").pop() ?? "";

export function Console({
  model,
  resetToken,
}: {
  model: PlaygroundModel;
  /** Bumped by the rail's ⊕ to clear the console without remounting it. */
  resetToken: number;
}) {
  const { t } = useTranslation();

  // Families with variants take their copy from the chosen variant, so the
  // headline and presets follow the direction rather than the family.
  const [variantId, setVariantId] = useState(model.variants?.[0]?.id ?? "");
  const variant =
    model.variants?.find((v) => v.id === variantId) ?? model.variants?.[0];
  const slug = variant?.slug ?? slugOf(model);

  const [text, setText] = useState("");
  const [clip, setClip] = useState<{ blob: Blob; name: string } | null>(null);
  const [voice, setVoice] = useState<Voice>("Kanya");
  const [register, setRegister] = useState<Register>("Neutral");
  const [dialect, setDialect] = useState<Dialect>("Auto");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  const recorder = useRecorder();
  const fileRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const writes = model.modality === "write";
  const records = !writes;

  // Switching model or pressing ⊕ empties the console. Anything in flight is
  // abandoned — its answer belongs to a question that is no longer on screen.
  useEffect(() => {
    abortRef.current?.abort();
    setText("");
    setClip(null);
    setResult(null);
    setMessage(null);
    setStatus("idle");
    setVariantId(model.variants?.[0]?.id ?? "");
  }, [model.id, model.variants, resetToken]);

  useEffect(() => {
    if (recorder.state === "denied") setMessage(t("playground.micDenied"));
  }, [recorder.state, t]);

  const ready = writes ? text.trim().length > 0 : clip !== null;

  const attach = (file: File | undefined) => {
    if (!file) return;
    setClip({ blob: file, name: file.name });
    setMessage(null);
  };

  const toggleRecording = async () => {
    if (recorder.recording) {
      const blob = await recorder.stop();
      if (blob) setClip({ blob, name: `recording-${formatClock(recorder.seconds)}` });
      return;
    }
    setMessage(null);
    await recorder.start();
  };

  const run = async () => {
    if (!ready || status === "running") return;

    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("running");
    setMessage(null);
    setResult(null);

    try {
      if (writes) {
        const res = await runVoice(
          model.endpoint,
          { text: text.trim(), voice, register },
          controller.signal,
        );
        setResult({ audioUrl: res.audioUrl });
      } else {
        const audio = await blobToBase64(clip!.blob);
        const mimeType = clip!.blob.type || "audio/webm";

        if (model.modality === "listen") {
          const res = await runTranscribe(
            model.endpoint,
            { audio, mimeType, dialect },
            controller.signal,
          );
          setResult({ transcript: res.text });
        } else if (model.modality === "converse") {
          const res = await runAgent(
            model.endpoint,
            { audio, mimeType, history: [] },
            controller.signal,
          );
          setResult({ heard: res.heard, reply: res.reply, audioUrl: res.audioUrl });
        } else {
          const haFirst = (variant?.id ?? "ha-fr") === "ha-fr";
          const res = await runInterpret(
            model.endpoint,
            {
              audio,
              mimeType,
              from: haFirst ? "ha" : "fr",
              to: haFirst ? "fr" : "ha",
              dialect,
            },
            controller.signal,
          );
          setResult({ heard: res.heard, reply: res.spoken, audioUrl: res.audioUrl });
        }
      }
      setStatus("done");
    } catch (err) {
      if ((err as Error)?.name === "AbortError") {
        setStatus("idle");
        return;
      }
      setStatus("error");
      setMessage(
        err instanceof NotConnectedError
          ? t("playground.notConnected")
          : (err as Error).message,
      );
    } finally {
      abortRef.current = null;
    }
  };

  const presets = [1, 2, 3].map((n) => t(`playground.${slug}.p${n}`));

  return (
    <>
      <a
        className={`text-ui ${styles.exploreLink}`}
        href="/models"
      >
        {t("playground.explore")}
        <ArrowUpRight className={styles.exploreArrow} />
      </a>

      <h1 className={`h4 ${styles.stageTitle}`}>{t(`playground.${slug}.title`)}</h1>

      <div className={styles.composer}>
        {writes ? (
          <textarea
            className={styles.composerInput}
            placeholder={t(`playground.${slug}.placeholder`)}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) run();
            }}
            rows={2}
          />
        ) : (
          <p className={`text-regular ${styles.composerHint}`}>
            {clip ? (
              <span className={styles.attached}>
                <span className={`text-ui ${styles.attachedName}`}>{clip.name}</span>
                <button
                  type="button"
                  className={`text-ui ${styles.attachedClear}`}
                  onClick={() => setClip(null)}
                >
                  {t("playground.clear")}
                </button>
              </span>
            ) : (
              t(`playground.${slug}.placeholder`)
            )}
          </p>
        )}

        <div className={styles.composerBar}>
          {records && (
            <>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => fileRef.current?.click()}
                aria-label={t("playground.attach")}
              >
                <IconPlus />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="audio/*,.mp3,.wav,.m4a,.webm"
                className={styles.srOnlyInput}
                onChange={(e) => attach(e.target.files?.[0])}
                tabIndex={-1}
              />
            </>
          )}

          {recorder.recording && (
            <span className={styles.clock}>{formatClock(recorder.seconds)}</span>
          )}

          <div className={styles.composerBarEnd}>
            <div className={styles.settings}>
              <span className={styles.settingsModel}>
                {model.railKey ? t(model.railKey) : t(`${model.key}.name`)}
              </span>

              {model.variants && (
                <>
                  <span className={styles.settingsDivider} aria-hidden="true" />
                  <InlineSelect
                    label={t("playground.directionLabel")}
                    value={variantId}
                    options={model.variants.map((v) => v.id)}
                    labelFor={(id) =>
                      t(
                        model.variants?.find((v) => v.id === id)?.labelKey ?? "",
                      )
                    }
                    onChange={setVariantId}
                  />
                </>
              )}

              {writes ? (
                <>
                  <span className={styles.settingsDivider} aria-hidden="true" />
                  <InlineSelect
                    label={t("playground.voiceLabel")}
                    value={voice}
                    options={VOICES}
                    onChange={setVoice}
                  />
                  <span className={styles.settingsDivider} aria-hidden="true" />
                  <InlineSelect
                    label={t("playground.registerLabel")}
                    value={register}
                    options={REGISTERS}
                    onChange={setRegister}
                  />
                </>
              ) : model.modality !== "converse" ? (
                <>
                  <span className={styles.settingsDivider} aria-hidden="true" />
                  <InlineSelect
                    label={t("playground.dialectLabel")}
                    value={dialect}
                    options={DIALECTS}
                    onChange={setDialect}
                  />
                </>
              ) : null}
            </div>

            {records && !clip ? (
              <button
                type="button"
                className={`${styles.submit} ${recorder.recording ? styles.submitRecording : ""}`}
                onClick={toggleRecording}
                aria-label={
                  recorder.recording ? t("playground.stop") : t("playground.record")
                }
              >
                {recorder.recording ? <IconStop /> : <IconMic />}
              </button>
            ) : status === "running" ? (
              <button
                type="button"
                className={`${styles.submit} ${styles.submitReady}`}
                onClick={() => abortRef.current?.abort()}
                aria-label={t("playground.cancel")}
              >
                <IconStopSmall />
              </button>
            ) : (
              <button
                type="button"
                className={`${styles.submit} ${ready ? styles.submitReady : ""}`}
                onClick={run}
                disabled={!ready}
                aria-label={t("playground.send")}
              >
                <IconArrowUp />
              </button>
            )}
          </div>
        </div>
      </div>

      {status === "running" && <Pending modality={model.modality} />}

      {message && (
        <p className={`text-ui ${styles.note}`} role="status">
          {message}
        </p>
      )}

      {result && (
        <div className={styles.result}>
          {result.heard && (
            <div className={styles.resultBlock}>
              <span className={`text-small ${styles.resultLabel}`}>
                {t("playground.heard")}
              </span>
              <p className={`text-regular ${styles.resultText}`}>{result.heard}</p>
            </div>
          )}
          {result.transcript && (
            <div className={styles.resultBlock}>
              <span className={`text-small ${styles.resultLabel}`}>
                {t("playground.transcript")}
              </span>
              <p className={`text-regular ${styles.resultText}`}>
                {result.transcript}
              </p>
            </div>
          )}
          {result.reply && (
            <div className={styles.resultBlock}>
              <span className={`text-small ${styles.resultLabel}`}>
                {t("playground.reply")}
              </span>
              <p className={`text-regular ${styles.resultText}`}>{result.reply}</p>
            </div>
          )}
          {result.audioUrl && (
            <div className={styles.resultBlock}>
              <AudioSample src={result.audioUrl} />
            </div>
          )}

          <div className={styles.resultActions}>
            {(result.transcript || result.reply) && (
              <button
                type="button"
                className={`text-ui ${styles.resultAction}`}
                onClick={() => {
                  navigator.clipboard
                    ?.writeText(result.transcript ?? result.reply ?? "")
                    .then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    })
                    .catch(() => {});
                }}
              >
                {copied ? t("playground.copied") : t("playground.copy")}
              </button>
            )}
            {result.audioUrl && (
              <a
                className={`text-ui ${styles.resultAction}`}
                href={result.audioUrl}
                download={`namu-${slug}.mp3`}
              >
                {t("playground.download")}
              </a>
            )}
            <button
              type="button"
              className={`text-ui ${styles.resultAction}`}
              onClick={run}
            >
              {t("playground.again")}
            </button>
          </div>
        </div>
      )}

      <div className={styles.presets}>
        {presets.map((label) => (
          <button
            key={label}
            type="button"
            className={`text-ui ${styles.preset}`}
            onClick={() => {
              if (writes) setText(label);
            }}
          >
            <IconPlayOutline className={styles.presetIcon} />
            {label}
          </button>
        ))}
      </div>

      <p className={`text-small ${styles.disclaimer}`}>
        {t("playground.disclaimer")}
      </p>
    </>
  );
}
