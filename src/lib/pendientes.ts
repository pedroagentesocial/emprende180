import type { Txt } from "@i18n/idioma";

/**
 * Marcadores de contenido pendiente.
 *
 * El proyecto distingue dos cosas que se parecen pero no son iguales:
 *
 *  · COPY — titulares, dolores, beneficios, temario, FAQ, garantía. Lo escribe
 *    quien monta la página. Se puede reescribir, pero no bloquea el lanzamiento.
 *
 *  · HECHO — nombre del instructor, sus años de experiencia, testimonios,
 *    número de alumnos, precio, horas semanales. Esto NO se inventa nunca: se
 *    marca con `[COMPLETAR: …]` y se queda visible en la página, resaltado en
 *    ámbar, hasta que el cliente lo rellene.
 *
 * La diferencia importa: un titular flojo cuesta conversión, un dato inventado
 * cuesta credibilidad y, según qué se invente, puede ser publicidad engañosa.
 */

/** Va dentro del texto: "Necesitas [COMPLETAR: X horas] a la semana". */
export const MARCA_COMPLETAR = "[COMPLETAR:";

/** El valor entero es un placeholder, no solo una parte. */
export const MARCA_PLACEHOLDER = "PLACEHOLDER";

/** ¿Queda un hueco de HECHO sin rellenar, en cualquiera de los dos idiomas? */
export const tienePendiente = (v: Txt): boolean =>
  v.es.includes(MARCA_COMPLETAR) || v.en.includes(MARCA_COMPLETAR);

/** ¿El valor completo es un placeholder? (testimonios, sobre todo) */
export const esPlaceholderTotal = (v: Txt): boolean =>
  v.es.startsWith(MARCA_PLACEHOLDER) || v.en.startsWith(MARCA_PLACEHOLDER);

/** Cualquiera de las dos cosas. Es lo que usan las secciones para avisar. */
export const faltaPorRellenar = (v: Txt): boolean =>
  tienePendiente(v) || esPlaceholderTotal(v);

/**
 * Resalta los `[COMPLETAR: …]` para que canten en pantalla.
 * Devuelve HTML, así que se pinta con `set:html`.
 */
export const resaltarPendientes = (texto: string): string =>
  texto.replace(
    /\[COMPLETAR:[^\]]*\]/g,
    (m) =>
      `<mark class="rounded-xs bg-warning-50 px-1 font-semibold text-warning-700">${m}</mark>`,
  );
