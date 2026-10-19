/** Save text as a file: Blob → object URL → temporary <a download> click → revoke. */
export function downloadText(filename, text, mime = "text/plain", doc = globalThis.document) {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
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

/** Save a Blob as a file (same pattern as downloadText). */
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
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}
