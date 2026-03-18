"use client";

import { useMemo } from "react";

import type { CodeFile } from "@/types";

export function LivePreview({ files }: { files: CodeFile[] }): JSX.Element {
  const srcDoc = useMemo(() => {
    const htmlFile = files.find((file) => file.language === "html")?.content ?? "";
    const cssFile = files.find((file) => file.language === "css")?.content ?? "";
    const jsFile = files.find((file) => file.language === "javascript")?.content ?? "";
    return htmlFile.replace("</head>", `<style>${cssFile}</style></head>`).replace("</body>", `<script>${jsFile}<\/script></body>`);
  }, [files]);

  return (
    <div className="flex h-full flex-col border-l border-bg-elevated bg-white">
      <div className="flex items-center justify-between border-b border-border-light px-4 py-3">
        <div className="text-sm font-medium text-text-dark">Kallon Kai</div>
        <div className="text-xs text-text-quiet">localhost:3000</div>
      </div>
      <iframe title="Live preview" srcDoc={srcDoc} className="h-full w-full border-0 bg-white" sandbox="allow-scripts" />
    </div>
  );
}
