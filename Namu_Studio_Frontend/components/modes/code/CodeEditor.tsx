"use client";

import CodeMirror from "@uiw/react-codemirror";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";

import type { CodeFile } from "@/types";

export function CodeEditor({ file, onChange }: { file: CodeFile; onChange: (value: string) => void }): JSX.Element {
  const extensions = file.language === "html" ? [html()] : file.language === "css" ? [css()] : [javascript()];
  return (
    <CodeMirror
      value={file.content}
      height="100%"
      extensions={extensions}
      onChange={onChange}
      theme="dark"
      basicSetup={{ lineNumbers: true, autocompletion: true, foldGutter: true }}
      style={{ fontSize: "13px" }}
    />
  );
}
