/**
 * Adds permalink icons to headings (h1-h6) that have an ID.
 */
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
            
            const linkLabel = headingText ? `Permalink to section: ${headingText}` : "Permalink to section";
            
            const link = document.createElement('a');
            link.className = 'header-link';
            link.href = `#${id}`;
            link.setAttribute('aria-label', linkLabel);
            link.title = linkLabel;
            link.innerHTML = '<i class="fa fa-link" aria-hidden="true"></i>';
            
            heading.appendChild(link);
        }
    });
}
