"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Logo } from "@/components/shared/Logo";
import { useTranslation } from "@/lib/i18n/useTranslation";

/**
 * Full-viewport shell shown while auth initializes and workspace session data loads.
 * Logo is centered; progress uses a gradient shimmer so the motion is always visible (unlike a solid “bar”).
 */
export function WorkspaceLoadingScreen(): JSX.Element {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  return (
    <div className="namu-workspace-cream relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-bg-base px-6 font-sans">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 60% at 50% 36%, rgba(218, 119, 86, 0.11), transparent 58%), radial-gradient(ellipse 70% 45% at 50% 100%, rgba(26, 21, 16, 0.05), transparent 55%)"
        }}
        aria-hidden
      />

      <div className="relative z-10 flex w-full max-w-[min(100%,220px)] flex-col items-center text-center">
        <motion.div
          className="flex w-full justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/*
            Logo SVG viewBox is wider than the visible wordmark; geometric center ≠ optical center.
            Same max width as the bar below + slight translateX aligns the mark with the progress track and label.
          */}
          <Logo
            className="h-12 w-auto translate-x-[10%] sm:h-[52px] sm:translate-x-[11%]"
            size="md"
          />
        </motion.div>

        <motion.div
          className="mt-9 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08, duration: 0.35 }}
        >
          <div
            className="relative mx-auto h-[3px] w-full max-w-[220px] overflow-hidden rounded-full border border-border-light/80 bg-bg-panel/90 shadow-[inset_0_1px_2px_rgba(26,21,16,0.06)]"
            role="progressbar"
            aria-busy="true"
            aria-valuetext={t("common.loading")}
          >
            <div className="workspace-loading-shimmer" />
          </div>
        </motion.div>

        <motion.div
          className="mt-5 flex items-center justify-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.35 }}
          aria-hidden
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-brand-orange/75 shadow-[0_0_10px_rgba(218,119,86,0.35)]"
              animate={
                reduceMotion
                  ? { opacity: 0.75 }
                  : { y: [0, -5, 0], opacity: [0.45, 1, 0.45] }
              }
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 0.65,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.14
                    }
              }
            />
          ))}
        </motion.div>

        <motion.p
          className="mt-4 text-[13px] font-medium tracking-[0.02em] text-text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.16, duration: 0.35 }}
        >
          {t("common.loading")}
        </motion.p>
      </div>
    </div>
  );
}
