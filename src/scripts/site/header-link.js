/**
 * Adds permalink icons to headings (h1-h6) that have an ID.
 *
 * Clicking one follows the anchor (so the address bar shows the permalink)
 * and copies the absolute URL. The icon briefly turns into a check mark and
 * a polite live region announces the copy.
 *
 * The icon deliberately carries no `title` attribute: the native tooltip is
 * unstyled, cannot be positioned, repeats the `aria-label` word for word and
 * drops over the first lines of the very section it points at.
 */

const FEEDBACK_DURATION_MS = 1600;
const COPIED_MESSAGE = "Link copied";

/** Shared polite live region — assistive tech gets the same feedback the icon shows. */
function getStatusRegion() {
    let region = document.querySelector('[data-header-link-status]');
    if (!region) {
        region = document.createElement('div');
        region.className = 'sr-only';
        region.setAttribute('data-header-link-status', '');
        region.setAttribute('role', 'status');
        region.setAttribute('aria-live', 'polite');
        document.body.appendChild(region);
    }
    return region;
}

function announce(message) {
    const region = getStatusRegion();
    region.textContent = '';
    // Clearing first and setting in a later task makes repeat copies announce again.
    window.setTimeout(() => {
        region.textContent = message;
    }, 50);
}

const feedbackTimers = new WeakMap();

function flashCopied(link) {
    const icon = link.querySelector('i');
    if (!icon) return;

    window.clearTimeout(feedbackTimers.get(link));
    link.classList.add('is-copied');
    icon.classList.remove('fa-link');
    icon.classList.add('fa-check');

    feedbackTimers.set(
        link,
        window.setTimeout(() => {
            link.classList.remove('is-copied');
            icon.classList.remove('fa-check');
            icon.classList.add('fa-link');
        }, FEEDBACK_DURATION_MS)
    );
}

async function copyPermalink(link) {
    // Read after the browser applied the hash, so the copied URL is the permalink.
    const url = new URL(link.getAttribute('href'), window.location.href).href;
    if (!navigator.clipboard?.writeText) return;
    try {
        await navigator.clipboard.writeText(url);
        flashCopied(link);
        announce(COPIED_MESSAGE);
    } catch {
        // Clipboard denied or unavailable — the anchor still navigated, nothing to report.
    }
}

export function initHeaderLinks() {
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        const id = heading.getAttribute('id');
        if (id) {
            // Check if link already exists (prevent double init)
            if (heading.querySelector('.header-link')) return;

            // Clone to remove children (like other links or icons) for clean text
            const clone = heading.cloneNode(true);
            // Remove existing links or icons from the clone to get clean heading text
            clone.querySelectorAll('.header-link, i, span.sr-only, .fa').forEach(el => el.remove());
            const headingText = clone.textContent.trim();

            const linkLabel = headingText
                ? `Copy link to section: ${headingText}`
                : "Copy link to this section";

            const link = document.createElement('a');
            link.className = 'header-link';
            link.href = `#${id}`;
            link.setAttribute('aria-label', linkLabel);
            link.innerHTML = '<i class="fa fa-link" aria-hidden="true"></i>';
            link.addEventListener('click', () => copyPermalink(link));

            heading.appendChild(link);
        }
    });
}
