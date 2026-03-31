"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { X } from "lucide-react";

import { SessionHistoryContent } from "@/components/workspace/SessionHistoryContent";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function SessionHistoryPanel(): JSX.Element {
  const { sidebarOpen, closeSidebar } = useStudio();
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (!sidebarOpen) return;

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSidebar, sidebarOpen]);

  return (
    <AnimatePresence>
      {sidebarOpen && !isDesktop ? (
        <>
          <motion.button
            aria-label="Close session history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="studio-modal-scrim absolute inset-0 z-20"
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 top-0 z-30 flex h-full w-[min(280px,92vw)] flex-col border-r bg-bg-panel font-sans shadow-[8px_0_40px_rgba(26,21,16,0.08)]"
            style={{ borderColor: "var(--actbar-border)" }}
          >
            <div className="flex h-12 shrink-0 items-center justify-between border-b px-4" style={{ borderColor: "var(--actbar-border)" }}>
              <div className="text-sm font-semibold text-text-primary">{t("workspace.sessionHistory")}</div>
              <button type="button" onClick={closeSidebar} className="text-text-muted transition hover:text-text-primary">
                <X className="h-4 w-4" />
              </button>
            </div>
            <SessionHistoryContent className="min-h-0 flex-1" />
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
