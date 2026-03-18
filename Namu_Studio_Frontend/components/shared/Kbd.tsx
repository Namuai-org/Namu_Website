"use client";

export function Kbd({ children }: { children: React.ReactNode }): JSX.Element {
  return <kbd className="rounded-md border border-border bg-bg-panel px-2 py-1 font-mono text-[11px] text-text-secondary">{children}</kbd>;
}
