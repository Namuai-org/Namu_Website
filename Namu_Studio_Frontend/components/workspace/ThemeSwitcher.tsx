"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Palette } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Tooltip } from "@/components/shared/Tooltip";
import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useTheme, type ThemeName } from "@/lib/theme/themeContext";

const themes: Array<{
  key: ThemeName;
  name: string;
  tagline: string;
  swatch: { base: string; elevated: string };
}> = [
  { key: "namu", name: "Namu", tagline: "Warm & clear - default", swatch: { base: "#E8E6DF", elevated: "#F2F0EA" } },
  { key: "gece", name: "Gece", tagline: "Deep dark, high contrast", swatch: { base: "#0D0D0F", elevated: "#1C1C1F" } },
  { key: "daji", name: "Daji", tagline: "Forest dark", swatch: { base: "#0A1008", elevated: "#192212" } },
  { key: "sahara", name: "Sahara", tagline: "Warm light, bright workspace", swatch: { base: "#F5F0E8", elevated: "#FFFFFF" } },
  { key: "dare", name: "Dare", tagline: "Midnight navy", swatch: { base: "#080E18", elevated: "#131C2A" } }
];

export function ThemeSwitcher(): JSX.Element {
  const { theme, setTheme } = useTheme();
  const { themeSwitcherOpen, toggleThemeSwitcher, closeThemeSwitcher } = useStudio();
  const { t } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ left: 56, bottom: 16 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!themeSwitcherOpen || !buttonRef.current) return;
    const updatePosition = (): void => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition({
        left: rect.right + 8,
        bottom: window.innerHeight - rect.bottom
      });
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [themeSwitcherOpen]);

  useEffect(() => {
    if (!themeSwitcherOpen) return;
    const onPointerDown = (event: MouseEvent): void => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      closeThemeSwitcher();
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        closeThemeSwitcher();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeThemeSwitcher, themeSwitcherOpen]);

  const panel = useMemo(() => {
    if (!mounted || !themeSwitcherOpen) return null;
    return createPortal(
      <AnimatePresence>
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, x: -8, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -8, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="fixed z-[9999] w-[260px] rounded-[14px] border p-4 shadow-xl"
          style={{
            left: `${position.left}px`,
            bottom: `${position.bottom}px`,
            background: "var(--bg-elevated)",
            borderColor: "var(--border-bright)"
          }}
        >
          <div className="mb-3 text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
            {t("workspace.theme")}
          </div>
          <div className="space-y-1">
            {themes.map((item) => {
              const active = item.key === theme;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setTheme(item.key);
                    window.setTimeout(() => closeThemeSwitcher(), 300);
                  }}
                  className="flex h-[52px] w-full items-center gap-3 rounded-[10px] border px-3 text-left transition hover:bg-[var(--bg-active)]"
                  style={{
                    background: active ? "var(--orange-subtle)" : "transparent",
                    borderColor: active ? "rgba(214,112,63,0.25)" : "transparent"
                  }}
                >
                  <span className="flex h-7 w-9 overflow-hidden rounded-[7px] border border-black/10">
                    <span className="w-[40%]" style={{ backgroundColor: item.swatch.base }} />
                    <span className="w-[30%]" style={{ backgroundColor: item.swatch.elevated }} />
                    <span className="w-[30%]" style={{ backgroundColor: "#D6703F" }} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                      {item.name}
                    </span>
                    <span className="block truncate text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {item.tagline}
                    </span>
                  </span>
                  <Check
                    className="h-4 w-4 transition"
                    style={{ color: "var(--orange)", opacity: active ? 1 : 0 }}
                  />
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>,
      document.body
    );
  }, [closeThemeSwitcher, mounted, position.bottom, position.left, setTheme, theme, themeSwitcherOpen]);

  return (
    <>
      <Tooltip content={t("workspace.theme")}>
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleThemeSwitcher}
          className="flex h-10 w-10 items-center justify-center rounded-[10px] text-[var(--actbar-icon)] transition hover:bg-bg-elevated hover:text-[var(--actbar-active)]"
        >
          <Palette className="h-5 w-5" />
        </button>
      </Tooltip>
      {panel}
    </>
  );
}
