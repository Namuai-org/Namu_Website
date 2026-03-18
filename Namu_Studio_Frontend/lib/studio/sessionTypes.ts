import type { AppMode, ChatMessage, CodeFile, SessionPreview } from "@/types";

export interface StudioSession extends SessionPreview {
  prompt?: string;
  chatMessages: ChatMessage[];
  createOutput: string;
  createPrompt: string;
  codePrompt: string;
  files: CodeFile[];
  voiceTranscript: string;
  voiceResponse: string;
  mode: AppMode;
  projectId?: string | null;
}
