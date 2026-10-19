import { PRIORITIES } from "./store.js";
import { proposeIssueUrl } from "./propose.js";

const HEADINGS = { add: "Add your own requirement", edit: "Edit your requirement" };
const SUBMIT_LABELS = { add: "Add to map", edit: "Save" };

// The "Add your own requirement" dialog on /map/: title, scenario, linked
// qualities and priority, in add or edit mode.
// The markup lives in _pages/65-quality-map.md; this class only wires it.

export class CustomForm {
  constructor(
    dialog,
    {
      getQualities = () => [],
      onSubmit = () => {},
      onRemove = () => {},
      onFocusLost = () => {},
    } = {},
  ) {
    this.dialog = dialog;
    this.doc = dialog.ownerDocument;
    this.getQualities = getQualities;
    this.onSubmit = onSubmit;
    this.onRemove = onRemove;
    this.onFocusLost = onFocusLost;
    this.opener = null;
    this.editing = null; // the custom requirement being edited, or null when adding
    this.priority = null;
    const $ = (sel) => dialog.querySelector(sel);
    this.form = $("[data-custom-form]");
    this.heading = $("[data-custom-heading]");
    this.title = $("[data-custom-title]");
    this.titleError = $("[data-custom-title-error]");
    this.scenario = $("[data-custom-scenario]");
    this.chips = $("[data-custom-chips]");
    this.noQualities = $("[data-custom-no-qualities]");
    this.segments = [...dialog.querySelectorAll("[data-custom-priority]")];
    this.submit = $("[data-custom-submit]");
    this.remove = $("[data-custom-remove]");
    this.propose = $("[data-custom-propose]");
    this.proposeHint = $("[data-custom-propose-hint]");

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.save();
    });
    $("[data-custom-cancel]").addEventListener("click", () => this.close());
    // A click on the dialog element itself (not its content) hit the backdrop.
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) this.close();
    });
    dialog.addEventListener("close", () => {
      // In edit mode the opener (the panel's Edit button) is rebuilt on save.
      if (this.opener?.isConnected) this.opener.focus();
      else this.onFocusLost();
      this.opener = null;
    });
    this.title.addEventListener("input", () => {
      if (this.title.value.trim()) this.setTitleError(false);
      this.refreshPropose();
    });
    this.scenario.addEventListener("input", () => this.refreshPropose());
    this.chips.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-quality-id]");
      if (!chip) return;
      chip.setAttribute("aria-pressed", String(chip.getAttribute("aria-pressed") !== "true"));
      this.refreshPropose();
    });
    for (const button of this.segments) {
      button.addEventListener("click", () => {
        const value = button.dataset.customPriority;
        this.setPriority(value === this.priority ? null : value);
      });
    }
    this.remove.addEventListener("click", () => {
      const id = this.editing?.id;
      this.close();
      if (id) this.onRemove(id);
    });
  }

  /** Open empty to add, or pre-filled with `custom` to edit it. */
  open({ custom = null, opener = this.doc.activeElement } = {}) {
    this.opener = opener;
    this.editing = custom;
    const mode = custom ? "edit" : "add";
    this.heading.textContent = HEADINGS[mode];
    this.submit.textContent = SUBMIT_LABELS[mode];
    this.remove.hidden = !custom;
    this.title.value = custom?.title ?? "";
    this.scenario.value = custom?.scenario ?? "";
    this.setTitleError(false);
    this.setPriority(custom?.priority ?? null);
    this.renderChips(new Set(custom?.qualities ?? []));
    this.refreshPropose();
    if (!this.dialog.open) this.dialog.showModal();
    // Keep the heading in view on short screens.
    this.title.focus({ preventScroll: true });
  }

  close() {
    if (this.dialog.open) this.dialog.close();
  }

  renderChips(linked) {
    const qualities = this.getQualities();
    const chips = qualities.map((q) => {
      const chip = this.doc.createElement("button");
      chip.type = "button";
      chip.className = "map-pill map-custom__chip";
      chip.dataset.qualityId = q.id;
      chip.setAttribute("aria-pressed", String(linked.has(q.id)));
      const check = this.doc.createElement("span");
      check.className = "map-pill__check";
      check.setAttribute("aria-hidden", "true");
      check.textContent = "✓";
      chip.append(check, this.doc.createTextNode(q.label));
      return chip;
    });
    this.chips.replaceChildren(...chips);
    this.noQualities.hidden = chips.length > 0;
  }

  setPriority(priority) {
    this.priority = priority;
    for (const button of this.segments) {
      button.setAttribute("aria-pressed", String(button.dataset.customPriority === priority));
    }
  }

  setTitleError(invalid) {
    this.title.setAttribute("aria-invalid", String(invalid));
    this.titleError.hidden = !invalid;
  }

  /** The form's current values, shaped like a custom requirement. */
  values() {
    const shown = new Set(this.getQualities().map((q) => q.id));
    const pressed = [...this.chips.querySelectorAll('[aria-pressed="true"]')].map(
      (chip) => chip.dataset.qualityId,
    );
    // Links to qualities the form cannot show (e.g. unknown ids) are kept as they were.
    const kept = (this.editing?.qualities ?? []).filter((id) => !shown.has(id));
    return {
      title: this.title.value.trim(),
      scenario: this.scenario.value,
      qualities: [...pressed, ...kept],
      priority: PRIORITIES.includes(this.priority) ? this.priority : null,
    };
  }

  refreshPropose() {
    const data = this.values();
    const ready = data.title !== "";
    this.propose.hidden = !ready;
    this.proposeHint.hidden = ready;
    if (ready) this.propose.href = proposeIssueUrl(data);
  }

  save() {
    const data = this.values();
    if (!data.title) {
      this.setTitleError(true);
      this.title.focus();
      return;
    }
    const id = this.editing?.id ?? null;
    this.onSubmit(data, id);
    this.close();
  }
}
