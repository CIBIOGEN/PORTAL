# Página web CIBIOGEN

Sitio institucional de CIBIOGEN (Centro de Investigación en Biotecnología y Genética, UNSAAC).
Se despliega con GitHub Pages en `cibiogen.net.pe`.

## Estructura

- `index.html` — portada (hero sináptico, carrusel de servicios, artículos, quiénes somos, asesores, libros, únete, auspiciadores)
- `articulos.html`, `asesores.html`, `invest.html` — secciones secundarias
- `login.html` — carnet virtual / muro (guardado en localStorage)
- `formulario/` — formulario de postulación (desplegado en `cibiogen.net.pe/formulario`)
- `css/theme.css` — define los 3 temas globales (noche / claro / contraste)
- `css/main.css` — estilos base y componentes (usa variables de theme.css)
- `css/login.css` — estilos propios de la página de login
- `js/theme.js` — botón flotante que cambia el tema (noche → claro → contraste) y lo guarda en localStorage
- `js/carousel.js` — genera y anima el carrusel de servicios (drag + touch)
- `js/synapse.js` — animación de conexiones sinápticas del hero
- `js/slider.js` — slider automático de artículos
- `js/login.js` — lógica del carnet virtual
- `img/` — logo, fotos y recursos

## Temas globales

Cada página carga `css/theme.css` + `css/main.css` y `js/theme.js`.
El tema se guarda en `localStorage` (`cibiogen-theme`) y se aplica a todas las páginas.

## Backend del formulario

Ver `formulario/README.md` (Apps Script: `Codigo.gs` + Spreadsheet + carpeta Drive).