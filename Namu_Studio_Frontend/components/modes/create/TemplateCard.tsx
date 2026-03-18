"use client";

export function TemplateCard({ label, onClick }: { label: string; onClick: () => void }): JSX.Element {
  return (
    <button type="button" onClick={onClick} className="rounded-[10px] border border-border bg-bg-elevated px-3 py-2 text-left text-xs text-text-secondary transition hover:border-brand-orange/30 hover:bg-bg-active hover:text-text-primary">
      {label}
    </button>
  );
}
