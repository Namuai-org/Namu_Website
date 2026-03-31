export interface ChatAttachmentPayload {
  name: string;
  mediaType: string;
  /** Raw base64 for images (no data: prefix) */
  dataBase64?: string;
  /** Inline text for .txt / small text files */
  textContent?: string;
}

const MAX_FILE_BYTES = 12 * 1024 * 1024;
const MAX_TEXT_CHARS = 120_000;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Converts user-picked files into a JSON-safe payload for /api/ai/chat.
 * Images become base64; plain text files become textContent; other files send metadata only.
 */
export async function prepareChatAttachments(files: File[]): Promise<ChatAttachmentPayload[]> {
  const out: ChatAttachmentPayload[] = [];

  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      continue;
    }

    if (file.type.startsWith("image/")) {
      const dataUrl = await readFileAsDataUrl(file);
      const comma = dataUrl.indexOf(",");
      const base64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
      out.push({ name: file.name, mediaType: file.type, dataBase64: base64 });
      continue;
    }

    if (file.type === "text/plain" || /\.(txt|md|csv|json|log)$/i.test(file.name)) {
      const text = await file.text();
      out.push({
        name: file.name,
        mediaType: file.type || "text/plain",
        textContent: text.slice(0, MAX_TEXT_CHARS)
      });
      continue;
    }

    out.push({
      name: file.name,
      mediaType: file.type || "application/octet-stream"
    });
  }

  return out;
}
