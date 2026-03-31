import type { ThemeName } from "@/lib/supabase/types";

export type StudioThemePreset = {
  key: ThemeName;
  name: string;
  tagline: string;
  swatch: { base: string; elevated: string };
};

export const STUDIO_THEME_PRESETS: StudioThemePreset[] = [
  { key: "namu", name: "Namu", tagline: "Warm & clear — default", swatch: { base: "#E8E6DF", elevated: "#F2F0EA" } },
  { key: "gece", name: "Gece", tagline: "Deep dark, high contrast", swatch: { base: "#0D0D0F", elevated: "#1C1C1F" } },
  { key: "daji", name: "Daji", tagline: "Forest dark", swatch: { base: "#0A1008", elevated: "#192212" } },
  { key: "sahara", name: "Sahara", tagline: "Warm light, bright workspace", swatch: { base: "#F5F0E8", elevated: "#FFFFFF" } },
  { key: "dare", name: "Dare", tagline: "Midnight navy", swatch: { base: "#080E18", elevated: "#131C2A" } }
];
