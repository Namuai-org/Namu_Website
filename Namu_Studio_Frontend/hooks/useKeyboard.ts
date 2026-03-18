"use client";

import { useEffect } from "react";

export function useKeyboard(shortcuts: Array<{ key: string; meta?: boolean; shift?: boolean; handler: () => void }>): void {
  useEffect(() => {
    const listener = (event: KeyboardEvent): void => {
      shortcuts.forEach((shortcut) => {
        const metaMatch = shortcut.meta ? event.metaKey || event.ctrlKey : true;
        const shiftMatch = shortcut.shift ? event.shiftKey : true;
        if (event.key.toLowerCase() === shortcut.key.toLowerCase() && metaMatch && shiftMatch) {
          event.preventDefault();
          shortcut.handler();
        }
      });
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [shortcuts]);
}
