"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { ChatInput } from "@/components/modes/chat/ChatInput";
import { useAuth } from "@/hooks/useAuth";
import { useStudio } from "@/hooks/useStudio";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getGreetingHour } from "@/lib/utils";

export function HomeState(): JSX.Element {
  const { user } = useAuth();
  const { draftInput, setDraftInput, startSession, hasVisitedWorkspace, setMode } = useStudio();
  const { t } = useTranslation();
  const [selectedChip, setSelectedChip] = useState("");
  const suggestions = [
    t("prompts.home1"),
    t("prompts.home2"),
    t("prompts.home3"),
    t("prompts.home4"),
    t("prompts.home5"),
    t("prompts.home6"),
    t("prompts.home7"),
    t("prompts.home8")
  ];

  const greeting = useMemo(() => {
    const key = getGreetingHour();
    const name = user?.fullName ?? "Namu";
    if (key === "morning") return `Ina kwana, ${name}.`;
    if (key === "afternoon") return `Barka da rana, ${name}.`;
    return `Barka da yamma, ${name}.`;
  }, [user?.fullName]);

  return (
    <div
      className="flex h-full flex-col items-center justify-center px-4 py-8 md:px-6 md:py-10"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 40%, var(--bg-panel) 0%, var(--bg-base) 60%, color-mix(in srgb, var(--bg-base) 80%, #000 20%) 100%)"
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center md:mb-12"
      >
        <h1
          className="text-[clamp(22px,6vw,42px)] font-bold leading-[1.2]"
          style={{ color: "var(--text-primary)" }}
        >
          {greeting}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.5 }}
          className="mt-2 text-base"
          style={{ color: "var(--text-muted)" }}
        >
          {hasVisitedWorkspace
            ? "Mun yi maka shirye. Fara daga inda ka tsaya."
            : "Za mu iya taimaka maka da komai a Hausa."}
        </motion.p>
      </motion.div>

      <div className="w-full max-w-[680px]">
        <ChatInput
          value={draftInput}
          setValue={setDraftInput}
          onSubmit={() => startSession(draftInput, "chat")}
          variant="home"
          onMicClick={() => setMode("voice")}
        />
      </div>

      <div className="mt-8 w-full max-w-[680px] md:mt-10">
        <div
          className="mb-3 text-center text-[11px] uppercase tracking-[0.1em]"
          style={{ color: "var(--text-muted)" }}
        >
          Ka iya gwada:
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:justify-center md:overflow-visible">
          {suggestions.map((chip, index) => (
            <motion.button
              key={chip}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: selectedChip === chip ? 0.6 : 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.04 }}
              type="button"
              onClick={() => {
                setDraftInput(chip);
                setSelectedChip(chip);
              }}
              className="shrink-0 whitespace-nowrap rounded-full border px-[18px] py-[9px] text-[13px] transition hover:-translate-y-px"
              style={{
                background: "var(--chip-bg)",
                borderColor: "var(--chip-border)",
                color: "var(--chip-text)"
              }}
            >
              {chip}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
