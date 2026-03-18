"use client";

import { CreateOutput } from "@/components/modes/create/CreateOutput";

export function CreateCanvas({
  output,
  wordCount,
  actions
}: {
  output: string;
  wordCount: number;
  actions?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="flex h-full min-h-0 flex-col bg-bg-base p-6">
      <div className="mb-3 flex items-center justify-between text-xs text-text-muted">
        <span>{wordCount} kalmomi</span>
        <div className="flex gap-2">{actions}</div>
      </div>
      <CreateOutput content={output} />
    </div>
  );
}
