"use client";

import { useCodeStore } from "@/lib/studio/codeStore";
import type { CodeFile } from "@/types";

export function CodeToolbar({ files }: { files: CodeFile[] }): JSX.Element {
  const { activeFileId, setActiveFileId } = useCodeStore();
  return (
    <div className="flex border-b border-bg-elevated bg-bg-panel">
      {files.map((file) => (
        <button
          key={file.id}
          type="button"
          onClick={() => setActiveFileId(file.id)}
          className={`border-t-2 px-4 py-3 text-sm ${activeFileId === file.id ? "border-brand-orange text-text-primary" : "border-transparent text-text-secondary"}`}
        >
          {file.name}
        </button>
      ))}
    </div>
  );
}
