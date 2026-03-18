"use client";

export function VoiceWaveform({ active }: { active: boolean }): JSX.Element {
  return (
    <div className="mt-8 flex h-16 w-full items-end justify-center gap-1">
      {Array.from({ length: 30 }, (_, index) => (
        <span key={index} className="w-[3px] rounded-full bg-brand-orange/70" style={{ height: `${active ? 4 + ((index * 13) % 36) : 12}px`, opacity: active ? 1 : 0.35 }} />
      ))}
    </div>
  );
}
