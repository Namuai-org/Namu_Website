"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";

const ENTER_MS = 600;

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useLayoutEffect(() => {
    setIsReady(false);
    setIsDone(false);
  }, [pathname]);

  useEffect(() => {
    let innerRaf = 0;
    const outerRaf = requestAnimationFrame(() => {
      innerRaf = requestAnimationFrame(() => {
        setIsReady(true);
      });
    });
    return () => {
      cancelAnimationFrame(outerRaf);
      cancelAnimationFrame(innerRaf);
    };
  }, [pathname]);

  // Once the entrance has played out, drop the transform/filter/will-change.
  // While any of them are set this wrapper is a containing block, which
  // silently breaks every position:sticky and position:fixed descendant.
  useEffect(() => {
    if (!isReady) return;
    const id = setTimeout(() => setIsDone(true), ENTER_MS + 50);
    return () => clearTimeout(id);
  }, [isReady, pathname]);

  return (
    <div
      className={`page-enter${isReady ? " page-enter-active" : ""}${
        isDone ? " page-enter-done" : ""
      }`}
      style={{ width: "100%" }}
    >
      {children}
    </div>
  );
}
