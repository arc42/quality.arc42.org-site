import {
  SELECTION_EVENT,
  STORAGE_KEY,
  addQuality,
  emitSelectionChanged,
  hasQuality,
  loadState,
  removeQuality,
  resolveStorage,
  saveState,
} from "../../map/store.js";

export const ADD_LABEL = "+ Add";
export const ADDED_LABEL = "✓ Added";
export const HERO_ADD_LABEL = "+ Add to selection";
export const HERO_ADDED_LABEL = "✓ In selection";
export const BANNER_DISMISSED_KEY = "q42.map.banner-dismissed";

const BUTTON_SELECTOR = "[data-map-add]";
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const TOAST_TIMEOUT_MS = 6000;

let initialized = false;

function labelsFor(button) {
  return button.dataset.mapAddVariant === "hero"
    ? [HERO_ADD_LABEL, HERO_ADDED_LABEL]
    : [ADD_LABEL, ADDED_LABEL];
}

function syncButton(button, state) {
  const pressed = hasQuality(state, button.dataset.mapAdd);
  const [addLabel, addedLabel] = labelsFor(button);
  const label = pressed ? addedLabel : addLabel;
  button.setAttribute("aria-pressed", String(pressed));
  // Rewriting the content adds DOM nodes; skip when it is already current.
  if (button.dataset.mapLabel === label) return;
  button.dataset.mapLabel = label;

  const doc = button.ownerDocument;
  button.textContent = label;
  // List buttons all read "+ Add"; a visually hidden title keeps their
  // accessible names distinct. The hero sits right under the page's H1.
  if (button.dataset.mapAddVariant !== "hero" && button.dataset.mapTitle) {
    const hidden = doc.createElement("span");
    hidden.className = "sr-only";
    hidden.textContent = ` ${button.dataset.mapTitle}`;
    button.appendChild(hidden);
  }
}

function syncButtons(root, state) {
  if (root.matches?.(BUTTON_SELECTOR)) syncButton(root, state);
  root.querySelectorAll?.(BUTTON_SELECTOR).forEach((button) => syncButton(button, state));
}

function syncTray(doc, state) {
  const count = state.qualities.length;
  doc.querySelectorAll("[data-map-tray]").forEach((tray) => {
    tray.hidden = count === 0;
  });
  doc.querySelectorAll("[data-map-tray-count]").forEach((badge) => {
    badge.textContent = String(count);
  });
}

// After a banner is dismissed its button is gone: move focus to the first
// visible control of the banner's target (`data-map-banner-next`), else to
// that target's first heading, so keyboard focus never drops to <body>.
function focusAfterBanner(doc, banner) {
  const target = doc.querySelector(banner.dataset.mapBannerNext || "main");
  if (!target) return;
  const control = [...target.querySelectorAll(FOCUSABLE)].find(
    (el) => el.getClientRects().length > 0,
  );
  if (control) {
    control.focus();
    return;
  }
  const heading = target.querySelector("h1, h2, h3") ?? target;
  heading.tabIndex = -1;
  heading.focus();
}

// Banners ship `hidden` in the page and are only revealed here, so readers
// who dismissed one never see it flash on load.
function initBanners(doc) {
  const storage = resolveStorage();
  const read = () => {
    try {
      return storage.getItem(BANNER_DISMISSED_KEY);
    } catch {
      return null;
    }
  };
  if (read() === "1") return;
  doc.querySelectorAll("[data-map-banner]").forEach((banner) => {
    banner.hidden = false;
    banner.querySelector("[data-map-banner-dismiss]")?.addEventListener("click", () => {
      try {
        storage.setItem(BANNER_DISMISSED_KEY, "1");
      } catch {
        // Storage full or blocked: the banner still hides for this page view.
      }
      banner.hidden = true;
      focusAfterBanner(doc, banner);
    });
  });
}

function createToast(doc) {
  const toast = doc.createElement("div");
  toast.className = "map-toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  doc.body.appendChild(toast);
  return toast;
}

export function initSelection({ document = globalThis.document } = {}) {
  if (initialized || !document?.body) return;
  initialized = true;

  let state = loadState();
  initBanners(document);
  const toast = createToast(document);
  let toastTimer = null;

  const sync = () => {
    syncButtons(document, state);
    syncTray(document, state);
  };

  const commit = (next) => {
    try {
      state = saveState(next);
    } catch {
      // Storage full or unavailable: keep the in-page selection working.
      state = next;
    }
    emitSelectionChanged(state, document);
  };

  // The live region stays in the accessibility tree; only its content and
  // the visible state change, so screen readers announce each update.
  const hideToast = () => {
    clearTimeout(toastTimer);
    toast.classList.remove("is-visible");
    toast.replaceChildren();
  };
  const scheduleHide = () => {
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, TOAST_TIMEOUT_MS);
  };
  // Pause the timeout while the reader is pointing at or focused in the toast.
  toast.addEventListener("mouseenter", () => clearTimeout(toastTimer));
  toast.addEventListener("focusin", () => clearTimeout(toastTimer));
  toast.addEventListener("mouseleave", () => {
    if (!toast.contains(document.activeElement)) scheduleHide();
  });
  toast.addEventListener("focusout", (event) => {
    if (!toast.contains(event.relatedTarget)) scheduleHide();
  });

  // `undo` is optional: the confirmation after an undo has no Undo of its own.
  const showToast = (message, undo = null) => {
    const count = state.qualities.length;
    const text = document.createElement("div");
    text.className = "map-toast__text";
    const title = document.createElement("span");
    title.className = "map-toast__title";
    title.textContent = message;
    const detail = document.createElement("span");
    detail.className = "map-toast__detail";
    detail.textContent = `${count} ${count === 1 ? "quality" : "qualities"} in your selection`;
    text.append(title, detail);

    toast.replaceChildren(text);
    if (undo) {
      const undoButton = document.createElement("button");
      undoButton.type = "button";
      undoButton.className = "map-toast__undo";
      undoButton.textContent = "Undo";
      undoButton.addEventListener("click", undo);
      toast.append(undoButton);
    }
    toast.classList.add("is-visible");
    scheduleHide();
  };

  const toggle = (button) => {
    const id = button.dataset.mapAdd;
    const title = button.dataset.mapTitle || id;
    const wasSelected = hasQuality(state, id);
    commit(wasSelected ? removeQuality(state, id) : addQuality(state, id));
    showToast(`${title} ${wasSelected ? "removed" : "added"}`, () => {
      // Undo is the single inverse step, applied to the current stored state
      // so a change made in another tab meanwhile is kept.
      const current = loadState();
      commit(wasSelected ? addQuality(current, id) : removeQuality(current, id));
      // Announce the undo in the same live region, then return focus to the
      // button the reader started from.
      showToast(`${title} ${wasSelected ? "added" : "removed"} again`);
      if (button.isConnected) button.focus();
    });
  };

  document.addEventListener("click", (event) => {
    const button = event.target.closest?.(BUTTON_SELECTOR);
    if (!button) return;
    event.preventDefault();
    toggle(button);
  });

  document.addEventListener(SELECTION_EVENT, (event) => {
    if (event.detail?.state) state = event.detail.state;
    sync();
  });

  document.defaultView?.addEventListener("storage", (event) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    state = loadState();
    sync();
  });

  // The qualities index renders its items client-side, after this runs.
  const Observer = document.defaultView?.MutationObserver;
  if (Observer) {
    new Observer((records) => {
      records.forEach((record) =>
        record.addedNodes.forEach((node) => {
          if (node.nodeType === 1) syncButtons(node, state);
        }),
      );
    }).observe(document.body, { childList: true, subtree: true });
  }

  sync();
}
