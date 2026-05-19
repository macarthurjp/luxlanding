/* Alternancia de imágenes del hero */
let current = 1;
const bg1 = document.querySelector('.bg1');
const bg2 = document.querySelector('.bg2');

if (bg1 && bg2) {
    setInterval(() => {
        bg1.style.opacity = current === 1 ? '1' : '0';
        bg2.style.opacity = current === 2 ? '1' : '0';
        current = current === 1 ? 2 : 1;
    }, 6000);
}

/* Cambio de idioma */
const langLinks = document.querySelectorAll('.lang-switch a');
const heroTexts = document.querySelectorAll('.hero-text');
const langSections = document.querySelectorAll('.lang-section');

langLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();

        langLinks.forEach(a => a.classList.remove('active'));
        link.classList.add('active');

        const lang = link.dataset.lang || link.getAttribute('href')?.replace('#', '');
        if (!lang) return;

        heroTexts.forEach(t => {
            t.style.display = 'none';
        });

        const activeHero = document.querySelector(`.hero-text.lang-${lang}`);
        if (activeHero) {
            activeHero.style.display = 'block';
        }

        if (langSections.length > 0) {
            langSections.forEach(sec => {
                sec.style.display = 'none';
            });

            const activeSection = document.getElementById(lang);
            if (activeSection) {
                activeSection.style.display = 'block';
            }
        }
    });
});

/* Reveal on scroll */
const reveals = document.querySelectorAll('.reveal');

function revealOnScroll() {
    reveals.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            el.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);