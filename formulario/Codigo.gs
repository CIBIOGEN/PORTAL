/**
 * CIBIOGEN · Formulario de Postulación — BACKEND
 * Google Apps Script (Web App independiente)
 *
 * Deploy: Implementar > Nueva implementación > Aplicación web
 *   - Ejecutar como: Yo
 *   - Quién tiene acceso: Cualquier persona
 * Copiar la URL /exec en common.js → API_URL
 *
 * Recibe el JSON del formulario, guarda los datos en una Spreadsheet
 * y guarda la carta de intención (PDF) en una carpeta de Google Drive.
 * La URL de la carpeta se escribe en la fila del registro.
 *
 * v1 — migrado del patrón EXPOBIO 2026
 */

// ==================== CONFIGURACIÓN ====================

// ID de la Spreadsheet donde se guardan los datos (de la URL: /d/ESTE_ID/edit)
const SPREADSHEET_ID = 'REEMPLAZA_CON_TU_SPREADSHEET_ID';
// Nombre de la hoja dentro de la Spreadsheet
const SHEET_NAME = 'Postulaciones';

// ID de la carpeta de Google Drive donde se guardan las cartas (de la URL: /drive/folders/ESTE_ID)
const CARPETACARTAS_ID = 'REEMPLAZA_CON_TU_FOLDER_ID';

// Poner en false cuando pase a producción (el campo debug expone internals)
const DEBUG = true;

// ==================== HELPERS DE LOG ====================
function log(msg) {
  try { console.log(msg); } catch (e) {}
}

// ==================== ENTRY POINT ====================
function doPost(e) {
  try {
    log('doPost recibido: body=' + JSON.stringify(e && e.postData && e.postData.contents));
    const body = parseBody(e);

    // ---------- Validaciones ----------
    const nombres = String(body.nombres || '').trim();
    const apellidoPaterno = String(body.apellidoPaterno || '').trim();
    const apellidoMaterno = String(body.apellidoMaterno || '').trim();
    const codigo = String(body.codigo || '').trim();
    const celular = String(body.celular || '').trim();
    const semestre = String(body.semestre || '').trim();

    if (!nombres || !apellidoPaterno || !apellidoMaterno) {
      return respond({ ok: false, mensaje: 'Completa todos tus datos personales.' });
    }
    if (!/^\d{6}$/.test(codigo)) {
      return respond({ ok: false, mensaje: 'El código universitario debe tener 6 dígitos.' });
    }
    if (!/^\d{9}$/.test(celular)) {
      return respond({ ok: false, mensaje: 'El celular debe tener 9 dígitos.' });
    }
    if (!body.cartaBase64 || !body.cartaNombre) {
      return respond({ ok: false, mensaje: 'Adjunta tu carta de intención en PDF.' });
    }

    // ---------- Guardar carta PDF en Drive ----------
    const carpeta = DriveApp.getFolderById(CARPETACARTAS_ID);
    const cartaNombre = String(body.cartaNombre || 'carta.pdf');
    const blob = base64Ablob(body.cartaBase64, cartaNombre);

    if (!blob || blob.getContentType() !== 'application/pdf') {
      return respond({ ok: false, mensaje: 'La carta de intención debe ser un archivo PDF.' });
    }

    const archivo = carpeta.createFile(blob);
    archivo.setDescription('Carta de intención — ' + nombres + ' ' + apellidoPaterno + ' ' + apellidoMaterno);
    log('Carta guardada: ' + archivo.getName() + ' (' + archivo.getId() + ')');

    // ---------- Guardar registro en la Spreadsheet ----------
    const hoja = obtenerHoja();
    const fila = nuevaFila(hoja, {
      nombreCarta: cartaNombre,
      urlCarta: archivo.getUrl(),
      idCarta: archivo.getId(),
      fecha: new Date(),
      nombres: nombres,
      apellidoPaterno: apellidoPaterno,
      apellidoMaterno: apellidoMaterno,
      codigo: codigo,
      celular: celular,
      semestre: semestre
    });

    return respond({
      ok: true,
      mensaje: 'Tu postulación fue registrada correctamente. ¡Gracias por postular a CIBIOGEN!',
      fila: fila
    });

  } catch (err) {
    log('ERROR en doPost: ' + String(err));
    const resp = { ok: false, mensaje: 'Error interno al procesar la postulación.' };
    if (DEBUG) {
      resp.debug = String(err);
      resp.stack = (err && err.stack) ? String(err.stack) : null;
    }
    return respond(resp);
  }
}

// GET no permitido (evita armar el envío pegando la URL en el navegador)
function doGet(e) {
  return respond({ ok: false, mensaje: 'Método no permitido (GET)' });
}

// ==================== HELPERS ====================

function parseBody(e) {
  try {
    return JSON.parse(e.postData.contents);
  } catch (err) {
    return {};
  }
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Convierte el data URL (data:application/pdf;base64,.....) en un Blob. */
function base64Ablob(dataUrl, nombre) {
  try {
    const conComa = String(dataUrl).indexOf(';base64,');
    const b64 = String(dataUrl).substring(conComa + 8);
    const bytes = Utilities.base64Decode(b64, Utilities.Charset.UTF_8);
    return Utilities.newBlob(bytes, 'application/pdf', nombre);
  } catch (err) {
    log('base64Ablob error: ' + String(err));
    return null;
  }
}

/** Devuelve la hoja; si no existe la crea con los encabezados. */
function obtenerHoja() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let hoja = ss.getSheetByName(SHEET_NAME);

  if (!hoja) {
    hoja = ss.insertSheet(SHEET_NAME);
    hoja.appendRow([
      'Fecha',
      'Nombres',
      'Apellido paterno',
      'Apellido materno',
      'Código universitario',
      'Celular',
      'Semestre actual',
      'Nombre de la carta (PDF)',
      'URL de la carta'
    ]);
    hoja.setFrozenRows(1);
  }
  return hoja;
}

/** Escribe una fila nueva y devuelve su número (1-based). */
function nuevaFila(hoja, d) {
  hoja.appendRow([
    d.fecha,
    d.nombres,
    d.apellidoPaterno,
    d.apellidoMaterno,
    d.codigo,
    d.celular,
    d.semestre,
    d.nombreCarta,
    d.urlCarta
  ]);
  return hoja.getLastRow();
}