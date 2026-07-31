"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    setIsReady(false);
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

  // There used to be a second phase here that added `page-enter-done` to drop
  // the wrapper's transform/filter once the entrance had played. It never
  // worked: no stylesheet ever defined `.page-enter-done`, so the identity
  // `scale(1)`/`blur(0px)` stayed on forever and kept this element a
  // containing block for every position:fixed descendant. The transform and
  // filter are gone from the stylesheet now, so there is nothing to undo.
  return (
    <div
      className={`page-enter${isReady ? " page-enter-active" : ""}`}
      style={{ width: "100%" }}
    >
      {children}
    </div>
  );
}
