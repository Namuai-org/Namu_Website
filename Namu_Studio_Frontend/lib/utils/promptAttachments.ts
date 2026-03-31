const MAX_BYTES = 12 * 1024 * 1024;
const MAX_TEXT_INJECT = 12_000;

/**
 * Appends attachment summaries / text file contents to a create/code prompt (plain text to the model).
 */
export async function augmentPromptWithFiles(base: string, files: File[]): Promise<string> {
  const t = base.trim();
  if (!files.length) {
    return t;
  }

  const chunks: string[] = [];
  for (const file of files) {
    if (file.size > MAX_BYTES) {
      continue;
    }
    if (file.type.startsWith("image/")) {
      chunks.push(`[Image attached: ${file.name}]`);
      continue;
    }
    if (file.type === "text/plain" || /\.(txt|md|csv|json|log)$/i.test(file.name)) {
      const text = await file.text();
      chunks.push(`--- ${file.name} ---\n${text.slice(0, MAX_TEXT_INJECT)}`);
      continue;
    }
    chunks.push(`[Attached file: ${file.name}]`);
  }

  if (!chunks.length) {
    return t;
  }
  const block = chunks.join("\n\n");
  return t ? `${t}\n\n${block}` : block;
}
