"use client";

import { NavBar } from "@/components/landing/NavBar";
import { PitchDeckShell } from "@/components/pitch/PitchDeckShell";

export default function PitchPage() {
  return (
    <>
      <NavBar />
      <main className="pitch-deck-page">
        <div className="pitch-deck-stage">
          <PitchDeckShell />
        </div>
      </main>
    </>
  );
}
