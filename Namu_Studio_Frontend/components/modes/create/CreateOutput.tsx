"use client";

export function CreateOutput({ content }: { content: string }): JSX.Element {
  if (!content) {
    return <div className="grid flex-1 place-items-center rounded-xl border border-border bg-bg-panel text-sm text-text-muted">Sakamakon zai bayyana anan</div>;
  }
  return <div className="flex-1 overflow-y-auto whitespace-pre-wrap rounded-xl border border-border bg-bg-panel p-6 text-[15px] leading-[1.85] text-text-primary">{content}</div>;
}
