"use client";

export function TypingIndicator(): JSX.Element {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(135deg,var(--orange)_0%,var(--orange-deep)_100%)] text-sm font-bold text-white">N</div>
      <div className="rounded-[18px] rounded-tl-[4px] border border-border bg-bg-panel px-5 py-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((item) => (
            <span key={item} className="h-2 w-2 animate-bounceDot rounded-full bg-brand-orange" style={{ animationDelay: `${item * 150}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
