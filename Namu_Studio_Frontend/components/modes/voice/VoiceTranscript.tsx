"use client";

export function VoiceTranscript({
  label,
  content,
  streaming = false
}: {
  label: string;
  content: string;
  streaming?: boolean;
}): JSX.Element {
  return (
    <div className="w-full rounded-xl border border-border bg-bg-panel px-5 py-4">
      <div className="text-[11px] uppercase tracking-[0.08em] text-brand-orange">{label}</div>
      <div className="mt-2 text-base leading-[1.65] text-text-primary md:text-sm">
        {content}
        {streaming ? <span className="streaming-cursor" /> : null}
      </div>
    </div>
  );
}
