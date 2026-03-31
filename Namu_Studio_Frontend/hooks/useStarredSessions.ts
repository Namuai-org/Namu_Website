"use client";

import { useCallback, useState } from "react";

const STORAGE_KEY = "namu_session_stars";

function readStars(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function useStarredSessions(): {
  starredIds: Set<string>;
  isStarred: (id: string) => boolean;
  toggleStar: (id: string) => void;
  starRevision: number;
} {
  const [starredIds, setStarredIds] = useState<Set<string>>(readStars);
  const [starRevision, setStarRevision] = useState(0);

  const isStarred = useCallback((id: string) => starredIds.has(id), [starredIds]);

  const toggleStar = useCallback((id: string) => {
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
    setStarRevision((n) => n + 1);
  }, []);

  return { starredIds, isStarred, toggleStar, starRevision };
}
