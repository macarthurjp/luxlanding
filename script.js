// Supabase sends password-recovery sessions to the production Site URL.
// Continue that authenticated flow in the Access-protected admin dashboard while
// preserving the one-time URL fragment Supabase needs to establish a session.
const DASHBOARD_RECOVERY_URL = "https://admin.luxlanding.eu";
if (
    window.location.hash.includes("type=recovery") &&
    window.location.origin !== new URL(DASHBOARD_RECOVERY_URL).origin
) {
    window.location.replace(`${DASHBOARD_RECOVERY_URL}${window.location.hash}`);
}

/* Cambio de idioma */
const langLinks = document.querySelectorAll('.lang-switch a');

langLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();

        const switcher = link.closest('.lang-switch');
        if (link.classList.contains('active')) {
            switcher?.classList.toggle('open');
            return;
        }

        langLinks.forEach(a => a.classList.remove('active'));
        link.classList.add('active');

        const lang = link.dataset.lang || link.getAttribute('href')?.replace('#', '');
        if (!lang) return;

        if (typeof window.applyLanguage === 'function') window.applyLanguage(lang);
        switcher?.classList.remove('open');
    });
});

document.addEventListener('click', event => {
    const switcher = document.querySelector('.lang-switch');
    if (switcher && !switcher.contains(event.target)) switcher.classList.remove('open');
});

/* Reveal on scroll */
const reveals = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -80px', threshold: 0.01 });

    reveals.forEach(element => revealObserver.observe(element));
} else {
    reveals.forEach(element => element.classList.add('visible'));
}

const footerYear = document.getElementById('footer-year');
if (footerYear) footerYear.textContent = String(new Date().getFullYear());

document.querySelectorAll('a[href="#lead-form"]').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

function setupAccessibleModal({ modalId, toggleId, closeId, linkSelector }) {
    const modal = document.getElementById(modalId);
    const toggle = toggleId ? document.getElementById(toggleId) : null;
    const close = document.getElementById(closeId);
    if (!modal || !close) return;

    let previousFocus = null;
    const open = event => {
        event?.preventDefault();
        previousFocus = document.activeElement;
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        window.setTimeout(() => close.focus(), 0);
    };
    const dismiss = () => {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        previousFocus?.focus();
    };

    toggle?.addEventListener('click', open);
    close.addEventListener('click', dismiss);
    document.querySelectorAll(linkSelector).forEach(link => link.addEventListener('click', open));
    modal.addEventListener('click', event => {
        if (event.target === modal) dismiss();
    });
    document.addEventListener('keydown', event => {
        if (!modal.classList.contains('active')) return;
        if (event.key === 'Escape') {
            dismiss();
            return;
        }
        if (event.key !== 'Tab') return;
        const focusable = [...modal.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
            .filter(element => !element.disabled && element.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
}

setupAccessibleModal({
    modalId: 'privacy-modal',
    toggleId: 'privacy-toggle',
    closeId: 'privacy-close',
    linkSelector: 'a[href="#privacy"], .privacy-inline-link',
});

setupAccessibleModal({
    modalId: 'faq-modal',
    toggleId: 'faq-toggle',
    closeId: 'faq-close',
    linkSelector: 'a[href="#faq"]',
});

// Opened programmatically from submit.js on a partner logo click — no
// dedicated toggle button, so this registration only wires up closing
// (close button, Escape, backdrop click, focus trap).
setupAccessibleModal({
    modalId: 'referral-code-modal',
    closeId: 'referral-code-close',
    linkSelector: 'a[data-referral-modal-trigger]',
});
