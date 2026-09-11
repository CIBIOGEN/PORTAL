# CIBIOGEN · Formulario de Postulación (aislado)

Formulario de postulación al Centro de Investigación en Biología y Genética (CIBIOGEN) de la UNSAAC. Proyecto aislado (se mantiene separado de la página principal del portal, que está incompleto).

Recicla la arquitectura del formulario de inscripción de EXPOBIO 2026 (validación, subida de PDF a base64, envío a Google Apps Script).

## Campos del formulario
- Nombres
- Apellido paterno
- Apellido materno
- Código universitario (6 dígitos, ej. 231234)
- Celular (9 dígitos)
- Semestre actual
- Carta de intención (solo PDF)

## Archivos
- `index.html` — formulario principal
- `style.css` — estilos transparentes (glassmorphism) sobre fondo azul marino con patrón ADN
- `common.js` — validación, lectura del PDF en base64 y envío vía Apps Script
- `cibiogen.png` — logo circular con fondo transparente (procesado desde `cibiogen.jpg`)
- `ADN.png` — patrón de fondo

## Diseño
- Las tarjetas del formulario usan `backdrop-filter: blur()` con fondo translúcido, dejando visible el patrón ADN.
- El logo `cibiogen.png` es circular con transparencia.

## Pendiente / configuración

### 1. Imágenes
El logo `cibiogen.png` se generó a partir de la copia existente en Portal de Biología (`cibiogen.jpg`). Cuando tengas la imagen definitiva del centro, reemplázala en el mismo formato (PNG circular con fondo transparente) o actualiza las referencias.

### 2. Backend (Google Apps Script)
El envío usa una Web App de Apps Script (igual que EXPOBIO). Configúralo así:

1. Crea un proyecto en `script.google.com`.
2. Escribe una función `doPost(e)` que reciba el JSON (incluye `cartaBase64`, la carta en base64, y `cartaNombre`) y guarde los datos en una Spreadsheet. Guarda la carta decodificada como PDF en Google Drive si la necesitas.
3. Despliega como Web App con acceso "Cualquier persona".
4. Copia la URL `/exec` en `common.js` → `API_URL`.

### 3. Nota sobre el campo "Semestre actual"
Quedó como texto libre (ej. `VII`, `2026-II`). Si prefieres un listado fijo, cambia el `<input>` por un `<select>` en `index.html`.
