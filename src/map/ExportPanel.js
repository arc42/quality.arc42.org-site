import { SHARE_MAX_LENGTH, SHARE_PARAM, encodeShare } from "./share.js";
import { fromImportJson, toExportJson } from "./exporters/json.js";
import { MARKDOWN_SECTIONS, toMarkdown } from "./exporters/markdown.js";
import { downloadBlob, downloadText } from "./download.js";
import { serializeMapSvg, svgToPngBlob } from "./exporters/svg.js";
import { bindDialog } from "./dialog.js";

const SVG_FILENAME = "quality-map.svg";
const PNG_FILENAME = "quality-map.png";
const EXPORT_FILENAME = "q42-map.json";
const MARKDOWN_FILENAME = "quality-map.md";
const MAX_IMPORT_BYTES = 1024 * 1024;
const STATUS_CLEAR_MS = 3000;
const COPIED = "Copied";
const SELECTED = "Selected: press Ctrl+C or ⌘C to copy";

// The "Export & share" dialog on /map/: share link, JSON download and import,
// Markdown for arc42 with a live preview.
// The markup lives in _pages/65-quality-map.md; this class only wires it.

export class ExportPanel {
  constructor(dialog, { getState, getSubgraph, getSvg = () => null, onImport }) {
    this.dialog = dialog;
    this.doc = dialog.ownerDocument;
    this.getState = getState;
    this.getSubgraph = getSubgraph;
    this.getSvg = getSvg;
    this.onImport = onImport;
    this.modal = bindDialog(dialog);
    this.statusTimers = new Map();
    const $ = (sel) => dialog.querySelector(sel);
    this.urlRow = $("[data-share-row]");
    this.urlInput = $("[data-share-url]");
    this.copyButton = $("[data-share-copy]");
    this.status = $("[data-share-status]");
    this.tooLong = $("[data-share-too-long]");
    this.shareFailed = $("[data-share-failed]");
    this.fileInput = $("[data-import-file]");
    this.importError = $("[data-import-error]");
    this.mdOptions = [...dialog.querySelectorAll("[data-md-option]")];
    this.mdPreview = $("[data-md-preview]");
    this.mdStatus = $("[data-md-status]");
    this.imageButtons = [$("[data-image-png]"), $("[data-image-svg]")];
    this.imageStatus = $("[data-image-status]");

    $("[data-export-close]").addEventListener("click", () => this.close());
    this.copyButton.addEventListener("click", () => this.copy());
    $("[data-export-download]").addEventListener("click", () => this.download());
    $("[data-import-open]").addEventListener("click", () => this.fileInput.click());
    this.fileInput.addEventListener("change", () => this.importFile());
    for (const box of this.mdOptions) box.addEventListener("change", () => this.refreshMarkdown());
    $("[data-md-copy]").addEventListener("click", () => this.copyMarkdown());
    $("[data-md-download]").addEventListener("click", () => this.downloadMarkdown());
    $("[data-image-svg]").addEventListener("click", () => this.exportImage("svg"));
    $("[data-image-png]").addEventListener("click", () => this.exportImage("png"));
  }

  open(opener = this.doc.activeElement) {
    this.setImportError("");
    this.setStatus(this.status, "");
    this.setStatus(this.mdStatus, "");
    this.setStatus(this.imageStatus, "");
    // The selection may have changed since the last opening.
    this.refreshMarkdown();
    // Nothing drawn, nothing to export.
    const empty = this.getState().qualities.length === 0;
    for (const button of this.imageButtons) button.disabled = empty;
    this.modal.open(opener);
    return this.refreshShare();
  }

  close() {
    this.modal.close();
  }

  async refreshShare() {
    this.copyButton.disabled = true;
    this.urlInput.value = "";
    this.shareFailed.hidden = true;
    let token;
    try {
      token = await encodeShare(this.getState());
    } catch {
      // E.g. no CompressionStream in this browser: point to the JSON file instead.
      this.urlRow.hidden = true;
      this.tooLong.hidden = true;
      this.shareFailed.hidden = false;
      return;
    }
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
      this.setStatus(this.status, COPIED);
    } catch {
      // No clipboard API or permission denied: select the text for a manual copy.
      this.urlInput.focus();
      this.urlInput.select();
      this.setStatus(this.status, SELECTED);
    }
  }

  markdown() {
    const checked = new Set(this.mdOptions.filter((b) => b.checked).map((b) => b.dataset.mdOption));
    const sections = MARKDOWN_SECTIONS.filter((s) => checked.has(s));
    return toMarkdown(this.getState(), this.getSubgraph(), {
      sections,
      links: checked.has("links"),
    });
  }

  refreshMarkdown() {
    // textContent, never innerHTML: titles and scenarios are user text.
    this.mdPreview.textContent = this.markdown();
  }

  async copyMarkdown() {
    const text = this.markdown();
    try {
      await this.doc.defaultView.navigator.clipboard.writeText(text);
      this.setStatus(this.mdStatus, COPIED);
    } catch {
      // Select the preview for a manual copy; it shows exactly this text.
      this.mdPreview.textContent = text;
      this.mdPreview.parentElement.focus();
      this.doc.getSelection().selectAllChildren(this.mdPreview);
      this.setStatus(this.mdStatus, SELECTED);
    }
  }

  downloadMarkdown() {
    downloadText(MARKDOWN_FILENAME, this.markdown(), "text/markdown", this.doc);
  }

  async exportImage(format) {
    const svg = this.getSvg();
    if (!svg) return;
    this.setStatus(this.imageStatus, "Preparing…");
    try {
      const text = serializeMapSvg(svg);
      if (format === "svg") {
        downloadText(SVG_FILENAME, text, "image/svg+xml", this.doc);
      } else {
        downloadBlob(PNG_FILENAME, await svgToPngBlob(text), this.doc);
      }
      this.setStatus(this.imageStatus, "Downloaded");
    } catch (error) {
      this.setStatus(this.imageStatus, error.message || "Export failed");
    }
  }

  setStatus(element, text) {
    clearTimeout(this.statusTimers.get(element));
    element.textContent = text;
    if (text) {
      this.statusTimers.set(
        element,
        setTimeout(() => (element.textContent = ""), STATUS_CLEAR_MS),
      );
    }
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
