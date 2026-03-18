"use client";

export function Tooltip({
  content,
  children
}: {
  content: React.ReactNode;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="group relative flex">
      {children}
      <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-border bg-bg-panel px-3 py-2 text-sm text-text-primary shadow-md group-hover:block">
        <span className="absolute left-[-4px] top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-b border-l border-border bg-bg-panel" />
        {content}
      </div>
    </div>
  );
}
