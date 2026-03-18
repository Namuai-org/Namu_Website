"use client";

import dynamic from "next/dynamic";

import { useStudio } from "@/hooks/useStudio";

const ChatMode = dynamic(() => import("@/components/modes/chat/ChatMode").then((mod) => mod.ChatMode), {
  loading: () => <ModeSkeleton />
});
const CreateMode = dynamic(() => import("@/components/modes/create/CreateMode").then((mod) => mod.CreateMode), {
  loading: () => <ModeSkeleton />
});
const CodeMode = dynamic(() => import("@/components/modes/code/CodeMode").then((mod) => mod.CodeMode), {
  loading: () => <ModeSkeleton />
});
const VoiceMode = dynamic(() => import("@/components/modes/voice/VoiceMode").then((mod) => mod.VoiceMode), {
  loading: () => <ModeSkeleton />
});

export function ModeRouter(): JSX.Element {
  const { activeMode } = useStudio();

  if (activeMode === "create") return <CreateMode />;
  if (activeMode === "code") return <CodeMode />;
  if (activeMode === "voice") return <VoiceMode />;
  return <ChatMode />;
}

function ModeSkeleton(): JSX.Element {
  return (
    <div className="h-full p-4 md:p-6">
      <div className="mx-auto h-full max-w-[960px] rounded-3xl shimmer" style={{ backgroundColor: "var(--bg-elevated)" }} />
    </div>
  );
}
