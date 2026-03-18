"use client";

import { Copy, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/components/shared/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { ChatMessage as ChatMessageType } from "@/types";

export function ChatMessage({
  message,
  onCopy,
  onRegenerate
}: {
  message: ChatMessageType;
  onCopy: (content: string) => void;
  onRegenerate?: () => void;
}): JSX.Element {
  const { t } = useTranslation();

  if (message.role === "user") {
    return (
      <div className="mb-6 flex justify-end">
        <div className="max-w-[88%] md:max-w-[75%]">
          <div className="mb-1 text-right text-[11px] text-text-muted">Kai · yanzu</div>
          <div
            className="rounded-[18px] rounded-br-[4px] border px-4 py-3 text-[15px] leading-[1.65] md:text-sm"
            style={{
              background: "var(--msg-user-bg)",
              borderColor: "var(--msg-user-border)",
              color: "var(--msg-user-text)"
            }}
          >
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(135deg,var(--orange)_0%,var(--orange-deep)_100%)] text-sm font-bold text-white">
        N
      </div>
      <div className="max-w-[88%] md:max-w-[80%]">
        <div className="mb-1 text-[11px] text-brand-orange">✦ Namu AI · yanzu</div>
        <div
          className="whitespace-pre-wrap rounded-[18px] rounded-tl-[4px] border px-5 py-4 text-[15px] leading-[1.75] md:text-sm"
          style={{
            background: "var(--msg-ai-bg)",
            borderColor: "var(--msg-ai-border)",
            color: "var(--msg-ai-text)"
          }}
        >
          {message.content}
          {message.streaming ? <span className="streaming-cursor" /> : null}
        </div>
        <div className="mt-2 hidden gap-1 md:flex">
          <Button variant="dark" size="sm" className="h-7 w-7 p-0" onClick={() => onCopy(message.content)} aria-label={t("toasts.copied")}>
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button variant="dark" size="sm" className="h-7 w-7 p-0" aria-label="Like">
            <ThumbsUp className="h-3.5 w-3.5" />
          </Button>
          <Button variant="dark" size="sm" className="h-7 w-7 p-0" aria-label="Dislike">
            <ThumbsDown className="h-3.5 w-3.5" />
          </Button>
          <Button variant="dark" size="sm" className="h-7 w-7 p-0" onClick={onRegenerate} aria-label="Regenerate">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
