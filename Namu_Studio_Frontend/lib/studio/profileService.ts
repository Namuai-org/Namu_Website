"use client";

import { supabase } from "@/lib/supabase/client";
import type { Language, ThemeName } from "@/lib/supabase/types";

export async function updateProfile(
  userId: string,
  updates: {
    full_name?: string;
    theme?: ThemeName;
    language?: Language;
    onboarding_complete?: boolean;
  }
) {
  return supabase.from("profiles").update(updates).eq("id", userId);
}
