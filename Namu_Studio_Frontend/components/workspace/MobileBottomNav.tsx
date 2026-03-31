"use client";

import { Code2, MessageSquare, Mic, PenLine } from "lucide-react";

import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { AppMode } from "@/types";

const icons = {
  chat: MessageSquare,
  create: PenLine,
  code: Code2,
  voice: Mic
} satisfies Record<AppMode, typeof MessageSquare>;

export function MobileBottomNav(): JSX.Element {
  const { activeMode, setMode } = useStudio();
  const { t } = useTranslation();
  const items: AppMode[] = ["chat", "create", "code", "voice"];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[100] border-t font-sans md:hidden"
      style={{
        height: "calc(64px + env(safe-area-inset-bottom))",
        background: "rgba(255, 255, 255, 0.78)",
        borderColor: "rgba(26, 21, 16, 0.08)",
        paddingBottom: "env(safe-area-inset-bottom)",
        backdropFilter: "blur(18px) saturate(1.1)",
        WebkitBackdropFilter: "blur(18px) saturate(1.1)"
      }}
    >
      <div className="flex h-16 items-center px-2">
        {items.map((item) => {
          const Icon = icons[item];
          const active = activeMode === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className="flex flex-1 flex-col items-center justify-center gap-1"
              style={{ color: active ? "var(--orange)" : "var(--actbar-icon)" }}
            >
              <span
                className="flex min-h-12 min-w-[72px] flex-col items-center justify-center rounded-xl px-4 py-1"
                style={{ background: active ? "var(--orange-subtle)" : "transparent" }}
              >
                <Icon className="h-[22px] w-[22px]" />
                <span className="text-[10px]">{t(`workspace.${item}`)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
