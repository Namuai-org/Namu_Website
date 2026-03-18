"use client";

import { Mic2 } from "lucide-react";

import { Kbd } from "@/components/shared/Kbd";

export function VoiceControls({ recording, onToggle }: { recording: boolean; onToggle: () => void }): JSX.Element {
  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={onToggle}
        className={`grid h-[120px] w-[120px] place-items-center rounded-full border ${recording ? "animate-pulseVoice border-brand-orange bg-brand-orange/15" : "border-brand-orange/20 bg-[radial-gradient(circle,rgba(214,112,63,0.1)_0%,rgba(214,112,63,0.03)_70%,transparent_100%)]"} transition hover:scale-[1.03]`}
      >
        <div className="grid h-20 w-20 place-items-center rounded-full border border-brand-orange/30 bg-bg-panel">
          <Mic2 className="h-9 w-9 text-brand-orange" />
        </div>
      </button>
      <p className="mt-6 text-sm text-text-muted">Danna don fara magana</p>
      <div className="mt-2 flex items-center gap-2 text-xs text-border">
        <Kbd>Space</Kbd>
        <span>don fara/tsaita</span>
      </div>
    </div>
  );
}
