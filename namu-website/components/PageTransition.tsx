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

  return (
    <div
      className={`page-enter${isReady ? " page-enter-active" : ""}`}
      style={{ width: "100%" }}
    >
      {children}
    </div>
  );
}
