/**
 * Site-wide navigation and utility functions.
 */

export function initNavigation() {
    // 1. Navigation toggle
    const navToggles = document.querySelectorAll('.nav-toggle');
    navToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = toggle.getAttribute('data-target');
            const target = document.querySelector(targetId);

            if (target) {
                toggle.classList.toggle('active');
                target.classList.toggle('active');
                const isActive = target.classList.contains('active');
                toggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            }
        });
    });

    // 2. Escape key closes active navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.nav-toggle.active').forEach(toggle => {
                const targetId = toggle.getAttribute('data-target');
                const target = document.querySelector(targetId);
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                if (target) target.classList.remove('active');
            });
        }
    });

    // 3. Click outside closes active navigation
    document.addEventListener('click', (e) => {
        if (e.target.closest('.site-header')) return;
        document.querySelectorAll('.nav-toggle.active').forEach(toggle => {
            const targetId = toggle.getAttribute('data-target');
            const target = document.querySelector(targetId);
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            if (target) target.classList.remove('active');
        });
    });

    // 4. Focus on search input with '/' key
    document.addEventListener('keyup', (e) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
        
        const slashKeys = ['/', '÷']; // '/' or keypad divide
        if (slashKeys.includes(e.key) || e.keyCode === 191) {
            const searchInput = document.getElementById('search');
            if (searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
        }
    });

    // 5. Add target="_blank" to external links
    const host = window.location.host;
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (href.includes('//') && !href.includes(host)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // 6. Center and wrap images in articles
    const images = document.querySelectorAll('article img:not(.emoji, .eye-catch)');
    images.forEach(img => {
        const parent = img.parentElement;
        if (parent && parent.tagName === 'P') {
            parent.style.textAlign = 'center';
        }
        
        // Wrap with link if not already wrapped
        if (parent && parent.tagName !== 'A') {
            const wrapper = document.createElement('a');
            wrapper.href = img.src;
            wrapper.target = '_blank';
            wrapper.rel = 'noopener noreferrer';
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
        }
    });
}
