"use client";

import { useEffect, useState } from "react";

import { AUTH_EDITORIAL_RESTART_EVENT } from "@/lib/auth/authEditorial";
import { cn } from "@/lib/cn";

type Phase = "line1" | "pause" | "line2" | "done";

function Caret({ className }: { className?: string }): JSX.Element {
  return <span className={cn("auth-typewriter-caret", className)} aria-hidden />;
}

export function AuthTypewriterHeadline({
  line1,
  line2,
  className
}: {
  line1: string;
  line2: string;
  className?: string;
}): JSX.Element {
  const [shown1, setShown1] = useState("");
  const [shown2, setShown2] = useState("");
  const [phase, setPhase] = useState<Phase>("line1");
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    const bump = (): void => setRunId((n) => n + 1);
    window.addEventListener(AUTH_EDITORIAL_RESTART_EVENT, bump);
    return () => window.removeEventListener(AUTH_EDITORIAL_RESTART_EVENT, bump);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setShown1(line1);
      setShown2(line2);
      setPhase("done");
      return;
    }

    let cancelled = false;
    setShown1("");
    setShown2("");
    setPhase("line1");

    const delayFor = (ch: string, index: number): number => {
      if (ch === " ") return 22 + (index % 3) * 8;
      if ([".", ",", "!", "?", "ƙ", "ɗ", "ƴ", "Ɓ", "Ɗ", "Ƙ"].includes(ch)) return 120 + (index % 5) * 14;
      return 38 + (index % 7) * 9;
    };

    const typeLine = (full: string, onComplete: () => void): void => {
      let i = 0;
      const step = (): void => {
        if (cancelled) return;
        if (i >= full.length) {
          onComplete();
          return;
        }
        i += 1;
        const next = full.slice(0, i);
        if (full === line1) setShown1(next);
        else setShown2(next);
        window.setTimeout(step, delayFor(full[i - 1] ?? "", i));
      };
      step();
    };

    typeLine(line1, () => {
      if (cancelled) return;
      setPhase("pause");
      window.setTimeout(() => {
        if (cancelled) return;
        setPhase("line2");
        typeLine(line2, () => {
          if (!cancelled) setPhase("done");
        });
      }, 380);
    });

    return () => {
      cancelled = true;
    };
  }, [line1, line2, runId]);

  return (
    <h2 className={cn("max-w-[540px] font-website-display text-[clamp(32px,4vw,52px)] font-bold leading-[1.12] tracking-tight", className)}>
      <span className="block text-balance text-namu-cream">
        {shown1}
        {phase === "line1" ? <Caret className="bg-namu-cream" /> : null}
      </span>
      <span className="mt-2 block text-balance text-namu-orange">
        {shown2}
        {phase === "line2" ? <Caret className="bg-namu-orange" /> : null}
      </span>
    </h2>
  );
}
