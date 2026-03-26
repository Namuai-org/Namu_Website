"use client";

import { PitchDeckShell } from "@/components/pitch/PitchDeckShell";

export default function PitchPage() {
  return (
    <>
      <main className="pitch-deck-page">
        <div className="pitch-deck-stage">
          <PitchDeckShell />
        </div>
      </main>
    </>
  );
}
