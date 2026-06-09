# Search: jump to full-results page from autocomplete — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a one-keystroke way to jump from the header search autocomplete (⌘K) to the full `/search/` results page, plus an always-visible footer that advertises the shortcut.

**Architecture:** In the header autocomplete (`src/scripts/site/autocomplete.js`), `Enter` keeps opening the highlighted result; **`Cmd+Enter`, `Ctrl+Enter`, or `Shift+Enter`** now navigate to `/search/?q=<query>` regardless of which row is active. The dropdown panel becomes a flex column: a scrollable results region plus a persistent, non-scrolling footer that shows `↵ open · ⌘⏎ all results · ↑↓ navigate · esc close`. The selectable "Show all N results" row stays as the mouse/click affordance.

**Tech Stack:** Vanilla ESM browser JS (no framework), SCSS, esbuild bundling, Jekyll, Playwright E2E (runs in Docker). All build/test via `make` + Docker — never run Ruby/Jekyll/Bundler locally.

---

## Design notes (folded in from brainstorming)

- **Why a chord, not plain Enter:** plain `Enter` is already bound to "open the auto-highlighted top result" (the panel auto-selects index 0 on open). Repurposing it would break "type → top hit → Enter" muscle memory. A modifier+Enter adds the new path without disturbing the old one. We accept all three of Cmd/Ctrl/Shift+Enter (forgiving, cheap) and *display* only the platform-native one.
- **Why a persistent footer:** the existing hint line (`Enter to open · …`) only rendered in the *few-results* branch — in the many-results case (exactly when "Show all" matters) there was no key hint at all. The new footer is rendered for every non-empty panel and never scrolls away.
- **Why a separate scroll region (not `position: sticky`):** a sticky footer would overlap the last result when arrowing to the bottom. A dedicated scroll region keeps the active-row auto-scroll math clean.
- **Accessibility:** the footer is decorative (`aria-hidden="true"`); the existing `aria-live` status region keeps announcing result counts, and the shortcut is added to the screen-reader hint text (`data-site-search-hint-desc`) so it isn't keyboard-discoverable-only for AT users. The panel keeps `role="listbox"`; the scroll wrapper is `role="presentation"` (transparent to AT) and the options remain its descendants.

---

## File Structure

| File | Responsibility | Change |
|------|----------------|--------|
| `tests/ui/search-autocomplete.spec.ts` | E2E: footer visibility + chord navigation + plain-Enter regression guard | **Create** |
| `src/scripts/site/autocomplete.js` | Chord handler, footer markup, scroll-region reference, sr-only hint | Modify |
| `_sass/components/_search-autocomplete.scss` | Panel → flex column, scroll region, footer styles; drop dead `.site-search__more` | Modify |

`_includes/site-header.html` is **not** changed: the sr-only hint text is set in JS (`hintDesc.textContent`), and the static fallback ("Press slash to focus this search.") is fine for the no-JS case.

---

### Task 1: Failing E2E spec for footer + chord

**Files:**
- Create: `tests/ui/search-autocomplete.spec.ts`

- [ ] **Step 1: Write the spec**

```ts
import { expect, test } from "@playwright/test";

// "data" matches many docs across qualities/requirements/approaches/standards,
// so the panel shows the "Show all N results" row and the footer.
const QUERY = "data";

async function openAutocomplete(page) {
  await page.goto("/");
  const input = page.locator("#site-search-input");
  await input.click();
  await input.fill(QUERY);
  // Panel renders after the 100ms input debounce + lookup fetch.
  await expect(page.locator("#site-search-panel")).toBeVisible();
  await expect(page.locator(".site-search__item").first()).toBeVisible();
  return input;
}

test("footer is always visible and advertises the all-results chord", async ({ page }) => {
  await openAutocomplete(page);
  const footer = page.locator(".site-search__footer");
  await expect(footer).toBeVisible();
  await expect(footer).toContainText("all results");
  // Many matches for "data" → the selectable Show-all row is present too.
  await expect(page.locator(".site-search__item--all")).toBeVisible();
});

test("plain Enter opens the highlighted top result (regression guard)", async ({ page }) => {
  const input = await openAutocomplete(page);
  const href = await page.locator(".site-search__item.is-active").getAttribute("data-href");
  expect(href).toBeTruthy();
  await input.press("Enter");
  await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("Shift+Enter jumps to the full /search/ page", async ({ page }) => {
  const input = await openAutocomplete(page);
  await input.press("Shift+Enter");
  await expect(page).toHaveURL(/\/search\/\?q=data/);
});

test("Control+Enter jumps to the full /search/ page", async ({ page }) => {
  const input = await openAutocomplete(page);
  await input.press("Control+Enter");
  await expect(page).toHaveURL(/\/search\/\?q=data/);
});
```

- [ ] **Step 2: Run the suite and confirm the new tests FAIL**

Run:
```bash
make test
```
Expected: the two existing-behavior expectations may pass, but **"footer is always visible…"**, **"Shift+Enter…"**, and **"Control+Enter…"** FAIL — there is no `.site-search__footer` yet, and modifier+Enter does not change the URL (it falls through to the form submit or the active-row handler). This is the red state.

- [ ] **Step 3: Commit the failing spec**

```bash
git add tests/ui/search-autocomplete.spec.ts
git commit -m "test: add E2E spec for search-autocomplete full-results chord"
```

---

### Task 2: Chord handler, footer markup, and sr-only hint in autocomplete.js

**Files:**
- Modify: `src/scripts/site/autocomplete.js`

- [ ] **Step 1: Add a scroll-region reference to panel state**

In `initAutocomplete`, alongside the other state declarations (`let activeIndex = -1;` … `let suppressNextOpen = false;`), add:

```js
  let scrollEl = null; // the inner .site-search__scroll region (set on each render)
```

- [ ] **Step 2: Compute the platform chord label and extend the sr-only hint**

Just after the existing `isMac` block that sets `hint.textContent`, replace the `hintDesc` block:

```js
  const hintDesc = form.querySelector("[data-site-search-hint-desc]");
  if (hintDesc) {
    hintDesc.textContent = isMac
      ? "Press Command-K to focus this search. Press Command-Enter to open all results."
      : "Press slash to focus this search. Press Control-Enter to open all results.";
  }
  const chordLabel = isMac ? "⌘⏎" : "Ctrl ⏎";
```

- [ ] **Step 3: Set/clear `scrollEl` in openPanel/closePanel**

Replace `openPanel`:

```js
  function openPanel(html, optionCount) {
    panel.innerHTML = html;
    panel.hidden = false;
    input.setAttribute("aria-expanded", optionCount > 0 ? "true" : "false");
    scrollEl = panel.querySelector(".site-search__scroll");
    currentOptions = Array.from(panel.querySelectorAll(".site-search__item"));
    activeIndex = currentOptions.length > 0 ? 0 : -1;
    applyActive();
  }
```

In `closePanel`, add `scrollEl = null;` after `activeIndex = -1;`:

```js
  function closePanel() {
    panel.hidden = true;
    panel.innerHTML = "";
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    activeIndex = -1;
    scrollEl = null;
    currentOptions = [];
  }
```

- [ ] **Step 4: Make the active-row auto-scroll target the scroll region**

In `applyActive`, replace the scroll block (the `if (activeIndex >= 0 …) { … } else { … }`):

```js
    if (activeIndex >= 0 && currentOptions[activeIndex]) {
      input.setAttribute("aria-activedescendant", currentOptions[activeIndex].id);
      const el = currentOptions[activeIndex];
      const view = scrollEl || panel;
      const elTop = el.offsetTop;
      const elBottom = elTop + el.offsetHeight;
      if (elTop < view.scrollTop) view.scrollTop = elTop;
      else if (elBottom > view.scrollTop + view.clientHeight) {
        view.scrollTop = elBottom - view.clientHeight;
      }
    } else {
      input.removeAttribute("aria-activedescendant");
    }
```

- [ ] **Step 5: Handle modifier+Enter in the keydown listener**

Replace the `else if (e.key === "Enter")` branch:

```js
    } else if (e.key === "Enter") {
      // Cmd / Ctrl / Shift + Enter jumps to the full-text /search/ page,
      // whatever row is highlighted. Plain Enter keeps opening the active row.
      if (e.metaKey || e.ctrlKey || e.shiftKey) {
        const q = input.value.trim();
        if (q.length >= 2) {
          e.preventDefault();
          window.location.assign(baseurl + "/search/?q=" + encodeURIComponent(q));
          return;
        }
      }
      if (!panel.hidden && activeIndex >= 0 && currentOptions[activeIndex]) {
        const href = currentOptions[activeIndex].getAttribute("data-href");
        if (href) {
          e.preventDefault();
          window.location.assign(href);
          return;
        }
      }
      // Otherwise form submits to /search/?q=... — full-page fallback.
    }
```

- [ ] **Step 6: Wrap results in a scroll region and always render the footer**

Replace the body of `renderPanel` from `let idx = 0;` to the `return` (i.e. everything after the `totalRendered === 0` early-return block). Also add `chordLabel` to the destructured parameter:

```js
function renderPanel({ scored, terms, query: q, baseurl, chordLabel }) {
  const { groups, totalRendered } = groupAndCap(scored);

  if (totalRendered === 0) {
    return {
      html:
        `<div class="site-search__empty" role="status">` +
        `No matches for <strong>${escapeHtml(q)}</strong>. ` +
        `<span class="site-search__hint-line">Press Enter to search full text.</span>` +
        `</div>`,
      optionCount: 0,
      resultCount: 0,
    };
  }

  let idx = 0;
  const parts = [`<div class="site-search__scroll" role="presentation">`];

  for (const { type, label } of GROUPS) {
    const bucket = groups.get(type) || [];
    if (bucket.length === 0) continue;

    parts.push(
      `<div class="site-search__group" data-type="${type}" role="group" aria-label="${label}">` +
        `<div class="site-search__group-label">${label}</div>` +
        `<ul class="site-search__list" role="presentation">`,
    );

    for (const { item } of bucket) {
      const id = `site-search-opt-${idx}`;
      const title = highlight(item.title, terms);
      const url = baseurl + item.url;
      const path = escapeHtml(item.url);
      parts.push(
        `<li role="option" id="${id}" class="site-search__item" data-type="${type}" data-href="${escapeHtml(url)}" data-index="${idx}" aria-selected="false">` +
          `<span class="site-search__title">${title}</span>` +
          `<span class="site-search__path" aria-hidden="true">${path}</span>` +
          `</li>`,
      );
      idx++;
    }

    parts.push(`</ul></div>`);
  }

  if (scored.length > totalRendered) {
    // Selectable "Show all" row: lives in the listbox so Arrow ↓ past the
    // last result lands on it, then Enter routes to /search/?q=… via the
    // existing data-href handlers.
    const allUrl = baseurl + "/search/?q=" + encodeURIComponent(q);
    const id = `site-search-opt-${idx}`;
    parts.push(
      `<div class="site-search__group site-search__group--all" role="group" aria-label="More">` +
        `<ul class="site-search__list" role="presentation">` +
          `<li role="option" id="${id}" class="site-search__item site-search__item--all" ` +
            `data-href="${escapeHtml(allUrl)}" data-index="${idx}" aria-selected="false">` +
            `<span class="site-search__title">` +
              `Show all <strong>${scored.length}</strong> results for <strong>${escapeHtml(q)}</strong>` +
            `</span>` +
          `</li>` +
        `</ul>` +
      `</div>`,
    );
    idx++;
  }

  parts.push(`</div>`); // close .site-search__scroll

  // Persistent footer — always shown, never scrolls. Decorative (aria-hidden);
  // the aria-live status region carries counts for assistive tech.
  parts.push(
    `<div class="site-search__footer" aria-hidden="true">` +
      `<span class="site-search__footer-hint">` +
        `<kbd>↵</kbd> open` +
        ` · <kbd>${escapeHtml(chordLabel)}</kbd> all results` +
        ` · <kbd>↑↓</kbd> navigate` +
        ` · <kbd>esc</kbd> close` +
      `</span>` +
    `</div>`,
  );

  return { html: parts.join(""), optionCount: idx, resultCount: scored.length };
}
```

Note: this removes the old `else { parts.push(\`<div class="site-search__more">…\`) }` branch — the footer replaces it.

- [ ] **Step 7: Pass `chordLabel` into renderPanel**

In `runQuery`, update the `renderPanel({ … })` call to include `chordLabel`:

```js
    const { html, optionCount, resultCount } = renderPanel({
      scored,
      terms,
      query: q,
      baseurl,
      chordLabel,
    });
```

- [ ] **Step 8: Commit**

```bash
git add src/scripts/site/autocomplete.js
git commit -m "search: add Cmd/Ctrl/Shift+Enter to open full results + persistent panel footer"
```

---

### Task 3: Panel flex layout, scroll region, and footer styles

**Files:**
- Modify: `_sass/components/_search-autocomplete.scss`

- [ ] **Step 1: Convert `.site-search__panel` to a flex column**

Replace the `.site-search__panel` rule's layout lines. Change `overflow-y: auto;` to `overflow: hidden;`, change `padding: 0.25rem 0;` to `padding: 0;`, and add `display: flex; flex-direction: column;`. Result:

```scss
.site-search__panel {
  background: var(--brand-paper);
  border: 1px solid var(--brand-violet-24);
  border-radius: $radius-sm;
  box-shadow:
    0 1px 2px rgba(36, 24, 35, 0.06),
    0 14px 36px rgba(36, 24, 35, 0.22);
  color: var(--brand-ink);
  display: flex;
  flex-direction: column;
  font-family: $font-family;
  font-size: 0.92rem;
  font-weight: 400;
  // Anchor to the right edge of the (narrow) input and grow leftward.
  // min-width gives titles room; max-width keeps the panel readable on wide screens.
  left: auto;
  letter-spacing: 0;
  line-height: 1.35;
  margin-top: 0.45rem;
  max-height: min(70vh, 34rem);
  max-width: 38rem;
  min-width: clamp(22rem, 32vw, 32rem);
  overflow: hidden;
  padding: 0;
  position: absolute;
  right: 0;
  text-transform: none;
  top: 100%;
  z-index: var(--z-popover); // above sticky header (1000)

  &[hidden] {
    display: none;
  }
}

.site-search__scroll {
  flex: 1 1 auto;
  min-height: 0; // let the flex child shrink so it can scroll
  overflow-y: auto;
  padding: 0.25rem 0;
  position: relative; // offsetParent for the active-row auto-scroll math
}
```

- [ ] **Step 2: Replace the `.site-search__more` rule with `.site-search__footer`**

Delete the `.site-search__more { … }` rule (its producer is gone) and add the footer rule in its place. Keep `.site-search__hint-line` (still used by the empty state):

```scss
.site-search__footer {
  border-top: 1px solid var(--brand-violet-18);
  color: var(--brand-muted);
  flex: 0 0 auto;
  font-size: 0.74rem;
  padding: 0.5rem 1rem;

  kbd {
    background: var(--brand-violet-08);
    border: 1px solid var(--brand-violet-18);
    border-radius: $radius-xs;
    color: var(--brand-ink);
    font-family: $code-font-family;
    font-size: 0.72rem;
    line-height: 1;
    padding: 0.1rem 0.3rem;
  }
}

.site-search__hint-line {
  color: var(--brand-muted);
}
```

- [ ] **Step 3: Format with Prettier (CSS lint runs `prettier --check`)**

Run:
```bash
docker compose run --rm esbuild npx prettier --write "_sass/components/_search-autocomplete.scss"
```
Expected: file reformatted in place (or already formatted).

- [ ] **Step 4: Commit**

```bash
git add _sass/components/_search-autocomplete.scss
git commit -m "search: style autocomplete panel footer and scrollable results region"
```

---

### Task 4: Rebuild, run the suite green, and verify manually

**Files:** none (verification only)

- [ ] **Step 1: Run the full UI suite (rebuilds JS via esbuild + SCSS via Jekyll, runs CSS lint + Playwright)**

Run:
```bash
make test
```
Expected: CSS lint passes (Prettier + `validate-css.js`), and **all four** tests in `search-autocomplete.spec.ts` PASS, with no regressions in the rest of the suite. This is the green state.

- [ ] **Step 2: Manual verification in the browser**

```bash
make dev   # http://localhost:4000 (if not already up)
```
Confirm in the header search:
- Type `data` → panel opens, top result highlighted, **footer visible at the bottom and not scrolling** with the list.
- Plain **Enter** → opens the highlighted result's page.
- **Shift+Enter**, **Ctrl+Enter**, and (on Mac) **Cmd+Enter** → land on `/search/?q=data`.
- Arrow ↓ to the **last** result → it scrolls fully into view and is **not hidden behind the footer**.
- Footer chord reads `⌘⏎` on macOS, `Ctrl ⏎` elsewhere.

- [ ] **Step 3: Final check — no leftover references to the removed class**

Run:
```bash
grep -rn "site-search__more" src/ _sass/ _includes/ assets/js/*.js 2>/dev/null || echo "clean"
```
Expected: `clean` (the `assets/js/*.map` bundles regenerate from source on build).

---

## Self-Review

- **Spec coverage:** chord (Task 2 Step 5 + tests Task 1), persistent footer (Task 2 Step 6 + Task 3 + test), keep plain-Enter (Task 2 Step 5 + regression test), keep "Show all" row (Task 2 Step 6 unchanged block), accessibility (Task 2 Step 2 sr-only hint + `aria-hidden` footer + `role="presentation"` scroll wrapper). All covered.
- **Placeholder scan:** none — every code step shows full code.
- **Type/name consistency:** `scrollEl`, `chordLabel`, `.site-search__scroll`, `.site-search__footer`, `.site-search__footer-hint` are used identically across JS and SCSS. The scroll region is `position: relative` (Task 3) so `el.offsetTop` in `applyActive` (Task 2 Step 4) is measured against it.
- **Build reality:** all JS/CSS tooling and tests run through Docker (`make`, `docker compose run … esbuild`); no local Ruby/Jekyll. The same `make test` command produces red (Task 1) then green (Task 4) because only the implementation changes between them.
