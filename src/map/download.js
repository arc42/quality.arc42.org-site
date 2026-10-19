/** Save a Blob as a file: object URL → temporary <a download> click → revoke. */
export function downloadBlob(filename, blob, doc = globalThis.document) {
  const url = URL.createObjectURL(blob);
  const a = doc.createElement("a");
  a.href = url;
  a.download = filename;
  a.hidden = true;
  doc.body.append(a);
  try {
    a.click();
  } finally {
    a.remove();
    // Revoke on the next task: some browsers start the download asynchronously.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

/** Save text as a file. */
export function downloadText(filename, text, mime = "text/plain", doc = globalThis.document) {
  downloadBlob(filename, new Blob([text], { type: mime }), doc);
}
