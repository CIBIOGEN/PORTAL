// js/theme.js — selector global de tema (noche / claro / contraste)
(() => {
    const THEME_KEY = 'cibiogen-theme';
    const THEMES = ['noche', 'claro', 'contraste'];
    const LABELS = { noche: '🌙', claro: '☀️', contraste: '🌗' };
    const NAMES = { noche: 'Noche', claro: 'Claro', contraste: 'Contraste' };

    function current() {
        const saved = localStorage.getItem(THEME_KEY);
        return THEMES.includes(saved) ? saved : 'noche';
    }

    function apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    function next(theme) {
        return THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    }

    function buildButton() {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-toggle';
        btn.setAttribute('aria-label', 'Cambiar tema');
        btn.addEventListener('click', () => {
            const t = next(current());
            localStorage.setItem(THEME_KEY, t);
            apply(t);
            render(btn, t);
        });
        const slot = document.querySelector('.cabecera-actions');
        if (slot) {
            slot.appendChild(btn);
        } else {
            btn.classList.add('theme-toggle--float');
            document.body.appendChild(btn);
        }
        render(btn, current());
    }

    function render(btn, theme) {
        btn.innerHTML = `${LABELS[theme]} <span>${NAMES[theme]}</span>`;
    }

    apply(current());
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildButton);
    } else {
        buildButton();
    }
})();