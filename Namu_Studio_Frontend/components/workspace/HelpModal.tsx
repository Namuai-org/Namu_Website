"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

import { useStudio } from "@/hooks/useStudio";

export function HelpModal(): JSX.Element {
  const { helpOpen, closeHelp } = useStudio();

  useEffect(() => {
    if (!helpOpen) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        closeHelp();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeHelp, helpOpen]);

  return (
    <AnimatePresence>
      {helpOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close help"
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeHelp}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 z-[9999] w-[min(460px,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-xl"
            style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                Taimako
              </h2>
              <button
                type="button"
                onClick={closeHelp}
                className="rounded-full p-2 transition hover:bg-[var(--bg-active)]"
                style={{ color: "var(--text-muted)" }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
              Namu AI-Studio v1.0 Beta. Don taimako, aika imel zuwa support@namu.ai
            </p>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
