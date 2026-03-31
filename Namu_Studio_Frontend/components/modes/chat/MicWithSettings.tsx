"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronUp, Hand, Mic, Square } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAudioLevel, usePreviewMediaStream } from "@/hooks/useAudioMeter";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getHoldToRecord, getPreferredMicId, setHoldToRecord, setPreferredMicId } from "@/lib/studio/voicePreferences";

type Voice = ReturnType<typeof import("@/hooks/useVoice").useVoice>;

interface MicWithSettingsProps {
  voice: Voice;
  supported: boolean;
  /** Home: primary mic opens voice workspace */
  onOpenVoiceMode?: () => void;
  /** Tap-to-toggle dictation (when hold-to-record is off) */
  onTapDictation: () => void;
  /** Hold-to-record dictation start */
  onBeginHoldDictation: () => void;
  isHome?: boolean;
  className?: string;
}

export function MicWithSettings({
  voice,
  supported,
  onOpenVoiceMode,
  onTapDictation,
  onBeginHoldDictation,
  isHome,
  className
}: MicWithSettingsProps): JSX.Element {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(() => getPreferredMicId());
  const [holdToRecord, setHoldToRecordState] = useState(false);
  const suppressNextClick = useRef(false);

  useEffect(() => {
    setHoldToRecordState(getHoldToRecord());
  }, []);

  useEffect(() => {
    if (menuOpen) setHoldToRecordState(getHoldToRecord());
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const refresh = (): void => {
      void navigator.mediaDevices?.enumerateDevices().then((all) => {
        setDevices(all.filter((d) => d.kind === "audioinput"));
      });
    };
    refresh();
    navigator.mediaDevices?.addEventListener("devicechange", refresh);
    return () => navigator.mediaDevices?.removeEventListener("devicechange", refresh);
  }, [menuOpen]);

  const effectiveDeviceId = selectedId ?? devices[0]?.deviceId ?? null;

  useEffect(() => {
    if (!menuOpen || devices.length === 0) return;
    if (!selectedId && devices[0]?.deviceId) {
      setSelectedId(devices[0].deviceId);
    }
  }, [devices, menuOpen, selectedId]);

  const previewStream = usePreviewMediaStream(effectiveDeviceId, menuOpen);
  const level = useAudioLevel(previewStream);

  const selectDevice = useCallback((id: string): void => {
    setSelectedId(id);
    setPreferredMicId(id);
  }, []);

  const toggleHold = useCallback(() => {
    const next = !holdToRecord;
    setHoldToRecordState(next);
    setHoldToRecord(next);
  }, [holdToRecord]);

  const micActive = voice.recording;
  const showDictation = !onOpenVoiceMode;

  const primaryLabel = useMemo(() => {
    if (onOpenVoiceMode) return t("workspace.voiceIdle");
    if (micActive) return t("workspace.stop");
    return t("workspace.voiceIdle");
  }, [micActive, onOpenVoiceMode, t]);

  const handlePrimaryPointerDown = (e: React.PointerEvent): void => {
    if (!showDictation || !supported || !holdToRecord) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    onBeginHoldDictation();
  };

  const handlePrimaryPointerUp = (e: React.PointerEvent): void => {
    if (!showDictation || !supported || !holdToRecord) return;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    voice.stopHold();
    suppressNextClick.current = true;
    window.setTimeout(() => {
      suppressNextClick.current = false;
    }, 0);
  };

  const handlePrimaryClick = (): void => {
    if (suppressNextClick.current) return;
    if (onOpenVoiceMode) {
      onOpenVoiceMode();
      return;
    }
    if (!supported) return;
    if (holdToRecord) return;
    if (micActive) {
      voice.stop();
    } else {
      onTapDictation();
    }
  };

  const btnClass = "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-l-lg rounded-r-none border-0 transition";

  return (
    <div
      className={`group/mic flex h-9 min-w-9 max-w-[88px] shrink-0 items-center overflow-hidden rounded-lg border border-transparent transition-[border-color,background-color,box-shadow] duration-200 ease-out hover:border-border hover:bg-bg-elevated ${className ?? ""}`}
      style={
        isHome
          ? {
              background: "var(--orange-subtle)",
              borderColor: "transparent"
            }
          : undefined
      }
    >
      <button
        type="button"
        onClick={handlePrimaryClick}
        onPointerDown={handlePrimaryPointerDown}
        onPointerUp={handlePrimaryPointerUp}
        onPointerCancel={handlePrimaryPointerUp}
        className={btnClass}
        style={{
          background: isHome ? "transparent" : micActive ? "var(--orange-subtle)" : "var(--bg-elevated)",
          color: "var(--orange)"
        }}
        aria-label={primaryLabel}
        aria-pressed={micActive}
        disabled={!supported && showDictation}
      >
        {micActive ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" strokeWidth={2} />}
      </button>

      <DropdownMenu.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="inline-flex h-9 max-w-0 items-center justify-center overflow-hidden border-0 border-l border-border/0 bg-transparent opacity-0 transition-all duration-200 ease-out group-hover/mic:max-w-9 group-hover/mic:border-border/60 group-hover/mic:opacity-100"
              style={{ color: "var(--text-muted)" }}
              aria-label={t("workspace.micSettings")}
            >
              <ChevronUp className="h-4 w-4" strokeWidth={2} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="start"
              side="top"
              sideOffset={10}
              onCloseAutoFocus={(e) => e.preventDefault()}
              className="z-[200] w-[min(100vw-24px,320px)] rounded-2xl border-[0.5px] p-0 shadow-xl outline-none"
              style={{
                background: "var(--bg-elevated)",
                borderColor: "var(--border)",
                boxShadow: "0 18px 40px rgba(26,21,16,0.12), 0 0 0 1px rgba(26,21,16,0.04)"
              }}
            >
              <div className="border-b border-border-light px-4 py-3">
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-border bg-bg-panel text-brand-orange">
                  <Mic className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Mic className="h-4 w-4 shrink-0 text-text-muted" />
                  <div
                    className="h-1.5 flex-1 overflow-hidden rounded-full"
                    style={{ background: "var(--border-light)" }}
                  >
                    <div
                      className="h-full rounded-full bg-brand-orange transition-[width] duration-75"
                      style={{ width: `${Math.max(8, Math.round(level * 100))}%` }}
                    />
                  </div>
                </div>
                <p className="mt-2 text-[11px] leading-snug" style={{ color: "var(--text-muted)" }}>
                  {t("workspace.micSettingsHint")}
                </p>
              </div>

              <div className="max-h-[200px] overflow-y-auto px-2 py-2">
                {devices.length === 0 ? (
                  <p className="px-2 py-2 text-xs" style={{ color: "var(--text-muted)" }}>
                    {t("workspace.micListEmpty")}
                  </p>
                ) : (
                  devices.map((device) => {
                    const active = device.deviceId === effectiveDeviceId;
                    return (
                      <button
                        key={device.deviceId}
                        type="button"
                        onClick={() => selectDevice(device.deviceId)}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[13px] transition hover:bg-bg-active"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <span className="min-w-0 flex-1 truncate">
                          {device.label || t("workspace.microphoneDefault")}
                        </span>
                        {active ? <Check className="h-4 w-4 shrink-0 text-brand-orange" /> : null}
                      </button>
                    );
                  })
                )}
              </div>

              <div className="border-t border-border-light px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <Hand className="h-4 w-4 shrink-0 text-text-muted" />
                    <span className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>
                      {t("workspace.holdToRecord")}
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={holdToRecord}
                    onClick={toggleHold}
                    className="relative h-7 w-12 shrink-0 rounded-full transition"
                    style={{
                      background: holdToRecord ? "var(--orange)" : "var(--border-bright)"
                    }}
                  >
                    <span
                      className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-[left]"
                      style={{ left: holdToRecord ? "calc(100% - 1.5rem)" : "0.25rem" }}
                    />
                  </button>
                </div>
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
    </div>
  );
}
