// js/carousel.js — genera y anima el carrusel de servicios
(() => {
    const CAROUSEL_ID = 'draggable-carousel';

    const ITEMS = [
        { label: 'PCR Virtual', svg: '<path d="M2 12h4l2-7 4 14 2-7h4"/>' },
        { label: 'Modelos Génicos', svg: '<path d="M8 3c0 4-4 4-4 8s4 4 4 8M16 3c0 4 4 4 4 8s-4 4-4 8M6 7h12M6 12h12M6 17h12"/>' },
        { label: 'Análisis CRISPR', svg: '<circle cx="6" cy="6" r="2.3"/><circle cx="6" cy="18" r="2.3"/><path d="M8.3 7.6 20 18M8.3 16.4 20 6"/>' },
        { label: 'Simulador 3D', svg: '<path d="M12 3 4 7v10l8 4 8-4V7z"/><path d="M4 7l8 4 8-4M12 11v10"/>' },
        { label: 'Bioinformática', svg: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>' },
        { label: 'Genotipado', svg: '<path d="M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z"/>' },
        { label: 'Extracción ADN', svg: '<path d="M9 2h6M10 2v6l-5 10a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-10V2"/>' },
        { label: 'Secuenciación', svg: '<path d="M4 20V10M9 20V4M14 20V13M19 20V7"/>' },
    ];

    function buildItems(container) {
        container.innerHTML = ITEMS.map(item => `
            <div class="carousel-item-wrapper">
                <div class="carousel-item">
                    <svg class="carousel-icon" viewBox="0 0 24 24">${item.svg}</svg>
                </div>
                <span class="carousel-label">${item.label}</span>
            </div>`).join('');
    }

    function enableDrag(container) {
        let isDown = false;
        let startX;
        let scrollLeft;

        const down = (x) => {
            isDown = true;
            container.classList.add('active');
            startX = x - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        };
        const up = () => {
            isDown = false;
            container.classList.remove('active');
        };
        const move = (x) => {
            if (!isDown) return;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        };

        container.addEventListener('mousedown', (e) => { e.preventDefault(); down(e.pageX); });
        container.addEventListener('mouseleave', up);
        container.addEventListener('mouseup', up);
        container.addEventListener('mousemove', (e) => { if (isDown) move(e.pageX); });

        container.addEventListener('touchstart', (e) => down(e.touches[0].pageX), { passive: true });
        container.addEventListener('touchend', up, { passive: true });
        container.addEventListener('touchmove', (e) => { if (isDown) move(e.touches[0].pageX); }, { passive: true });
    }

    const container = document.getElementById(CAROUSEL_ID);
    if (container) {
        buildItems(container);
        enableDrag(container);
    }
})();