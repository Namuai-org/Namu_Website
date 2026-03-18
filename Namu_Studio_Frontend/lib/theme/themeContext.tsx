"use client";

import { useShell } from "@/lib/studio/shellContext";
import type { ThemeName } from "@/lib/supabase/types";

export type { ThemeName };

export function useTheme(): { theme: ThemeName; setTheme: (theme: ThemeName) => void } {
  const { theme, setTheme } = useShell();
  return { theme, setTheme };
}
