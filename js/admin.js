// js/admin.js — panel de administración de imágenes del slider (sin login)
(() => {
    const STORE_KEY = 'cibiogen_slider';

    const fileInput = document.getElementById('admin-file-input');
    const resetBtn = document.getElementById('admin-reset');
    const grid = document.getElementById('admin-grid');
    const empty = document.getElementById('admin-empty');

    function readStore() {
        try {
            const raw = localStorage.getItem(STORE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    function writeStore(data) {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify(data));
        } catch (e) {
            alert('No se pudo guardar: el almacenamiento está lleno. Usa imágenes más pequeñas.');
        }
    }

    function imageFileToDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function renderGrid() {
        const items = readStore();
        grid.innerHTML = items.map((item, i) => `
            <div class="admin-card" data-index="${i}">
                <img src="${item.src}" alt="${item.alt || 'Imagen ' + (i + 1)}">
                <div class="admin-card-actions">
                    <button type="button" class="admin-remove" data-index="${i}" aria-label="Quitar imagen">Quitar</button>
                </div>
            </div>`).join('');

        const hasImages = items.length > 0;
        empty.hidden = hasImages;
        grid.hidden = !hasImages;

        grid.querySelectorAll('.admin-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = Number(btn.dataset.index);
                const data = readStore();
                data.splice(idx, 1);
                writeStore(data);
                renderGrid();
            });
        });
    }

    fileInput.addEventListener('change', async () => {
        const files = Array.from(fileInput.files);
        if (files.length === 0) return;

        const data = readStore();
        try {
            for (const file of files) {
                const src = await imageFileToDataURL(file);
                data.push({ src, href: '#', alt: file.name.replace(/\.[^.]+$/, '') || 'Imagen' });
            }
        } catch (e) {
            alert('Error al leer una de las imágenes.');
        }
        writeStore(data);
        fileInput.value = '';
        renderGrid();
    });

    resetBtn.addEventListener('click', () => {
        localStorage.removeItem(STORE_KEY);
        renderGrid();
    });

    renderGrid();
})();