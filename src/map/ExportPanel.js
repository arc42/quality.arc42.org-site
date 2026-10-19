import { SHARE_MAX_LENGTH, SHARE_PARAM, encodeShare } from "./share.js";
import { fromImportJson, toExportJson } from "./exporters/json.js";
import { downloadText } from "./download.js";

const EXPORT_FILENAME = "q42-map.json";
const MAX_IMPORT_BYTES = 1024 * 1024;
const STATUS_CLEAR_MS = 3000;

// The "Export & share" dialog on /map/: share link, JSON download and import.
// The markup lives in _pages/65-quality-map.md; this class only wires it.

export class ExportPanel {
  constructor(dialog, { getState, getSubgraph, onImport }) {
    this.dialog = dialog;
    this.doc = dialog.ownerDocument;
    this.getState = getState;
    this.getSubgraph = getSubgraph;
    this.onImport = onImport;
    this.opener = null;
    this.statusTimer = 0;
    const $ = (sel) => dialog.querySelector(sel);
    this.urlRow = $("[data-share-row]");
    this.urlInput = $("[data-share-url]");
    this.copyButton = $("[data-share-copy]");
    this.status = $("[data-share-status]");
    this.tooLong = $("[data-share-too-long]");
    this.fileInput = $("[data-import-file]");
    this.importError = $("[data-import-error]");

    $("[data-export-close]").addEventListener("click", () => this.close());
    // A click on the dialog element itself (not its content) hit the backdrop.
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) this.close();
    });
    dialog.addEventListener("close", () => {
      this.opener?.focus();
      this.opener = null;
    });
    this.copyButton.addEventListener("click", () => this.copy());
    $("[data-export-download]").addEventListener("click", () => this.download());
    $("[data-import-open]").addEventListener("click", () => this.fileInput.click());
    this.fileInput.addEventListener("change", () => this.importFile());
  }

  open(opener = this.doc.activeElement) {
    this.opener = opener;
    this.setImportError("");
    this.setStatus("");
    if (!this.dialog.open) this.dialog.showModal();
    // The selection may have changed since the last opening.
    return this.refreshShare();
  }

  close() {
    if (this.dialog.open) this.dialog.close();
  }

  async refreshShare() {
    this.copyButton.disabled = true;
    this.urlInput.value = "";
    const token = await encodeShare(this.getState());
    const tooLong = token.length > SHARE_MAX_LENGTH;
    this.urlRow.hidden = tooLong;
    this.tooLong.hidden = !tooLong;
    if (tooLong) return;
    const { origin, pathname } = this.doc.location;
    this.urlInput.value = `${origin}${pathname}#${SHARE_PARAM}=${token}`;
    this.copyButton.disabled = false;
  }

  async copy() {
    const url = this.urlInput.value;
    if (!url) return;
    try {
      await this.doc.defaultView.navigator.clipboard.writeText(url);
      this.setStatus("Copied");
    } catch {
      // No clipboard API or permission denied: select the text for a manual copy.
      this.urlInput.focus();
      this.urlInput.select();
      this.setStatus("Selected: press Ctrl+C or ⌘C to copy");
    }
  }

  setStatus(text) {
    clearTimeout(this.statusTimer);
    this.status.textContent = text;
    if (text) this.statusTimer = setTimeout(() => (this.status.textContent = ""), STATUS_CLEAR_MS);
  }

  download() {
    const text = toExportJson(this.getState(), this.getSubgraph());
    downloadText(EXPORT_FILENAME, text, "application/json", this.doc);
  }

  async importFile() {
    const file = this.fileInput.files?.[0];
    // Reset so choosing the same file again fires another change event.
    this.fileInput.value = "";
    if (!file) return;
    this.setImportError("");
    try {
      if (file.size > MAX_IMPORT_BYTES) throw new Error("The file is larger than 1 MB");
      const state = fromImportJson(await file.text());
      this.onImport(state, "replace");
      this.close();
    } catch (error) {
      this.setImportError(`Could not import ${file.name}: ${error.message}.`);
    }
  }

  setImportError(text) {
    this.importError.textContent = text;
    this.importError.hidden = text === "";
  }
}
