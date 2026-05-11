/**
 * Site-wide navigation and utility functions.
 */

export function initNavigation() {
    const header = document.querySelector('.site-header');
    const mobileHeaderQuery = window.matchMedia('(max-width: 720px)');
    const hiddenHeaderClass = 'is-hidden';

    const revealHeader = () => {
        if (header) {
            header.classList.remove(hiddenHeaderClass);
        }
    };

    // 1. Navigation toggle
    const navToggles = document.querySelectorAll('.nav-toggle');
    navToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            revealHeader();
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
            revealHeader();
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
                revealHeader();
                searchInput.focus();
            }
        }
    });

    // 5. Hide the sticky header on mobile scroll-down, reveal it on scroll-up.
    if (header) {
        let lastScrollY = window.scrollY;
        let scrollTicking = false;
        const minScrollY = 80;
        const scrollDelta = 8;

        const headerHasFocus = () => header.contains(document.activeElement);
        const headerMenuIsOpen = () => Boolean(header.querySelector('.nav-toggle.active'));
        const shouldKeepHeaderVisible = () =>
            !mobileHeaderQuery.matches ||
            window.scrollY <= minScrollY ||
            headerHasFocus() ||
            headerMenuIsOpen();

        const updateHeaderVisibility = () => {
            scrollTicking = false;

            const currentScrollY = window.scrollY;
            const scrollDiff = currentScrollY - lastScrollY;

            if (Math.abs(scrollDiff) < scrollDelta) {
                return;
            }

            if (shouldKeepHeaderVisible() || scrollDiff < 0) {
                revealHeader();
            } else {
                header.classList.add(hiddenHeaderClass);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener(
            'scroll',
            () => {
                if (scrollTicking) return;

                scrollTicking = true;
                window.requestAnimationFrame(updateHeaderVisibility);
            },
            { passive: true },
        );

        header.addEventListener('focusin', revealHeader);

        const handleHeaderMediaChange = () => {
            revealHeader();
            lastScrollY = window.scrollY;
        };

        if (mobileHeaderQuery.addEventListener) {
            mobileHeaderQuery.addEventListener('change', handleHeaderMediaChange);
        } else {
            mobileHeaderQuery.addListener(handleHeaderMediaChange);
        }
    }

    // 6. Add target="_blank" to external links
    const host = window.location.host;
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (href.includes('//') && !href.includes(host)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // 7. Center and wrap images in articles
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
