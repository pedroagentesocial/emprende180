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

/**
 * Va dentro del texto: "Necesitas [COMPLETAR: X horas] a la semana".
 *
 * ⚠️ SIN LOS DOS PUNTOS, Y ESO ERA UN BUG DE VERDAD.
 *
 * Esta constante era `"[COMPLETAR:"`. Pero en el config conviven dos formas de
 * escribir el marcador —`[COMPLETAR: …]` y `[COMPLETAR (HECHO): …]`— y la
 * segunda NO contiene la subcadena `"[COMPLETAR:"`. Resultado: tres respuestas
 * de preguntas frecuentes, las tres reguladas (licencia, compensación, zonas de
 * operación), no las detectaba nadie. No salían resaltadas, no levantaban el
 * aviso y se publicaron tal cual: el visitante leía «[COMPLETAR (HECHO):
 * describe el modelo real de compensación…]» debajo de "¿Cómo gana un
 * Embajador?".
 *
 * Cortando en `[COMPLETAR` entran las dos formas y cualquier otra que se
 * invente después: `[COMPLETAR (FACT)`, `[COMPLETAR — …`, lo que sea.
 */
export const MARCA_COMPLETAR = "[COMPLETAR";

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
    // Mismo motivo que en `MARCA_COMPLETAR`: sin exigir los dos puntos justo
    // después, para que `[COMPLETAR (HECHO): …]` también se resalte.
    /\[COMPLETAR\b[^\]]*\]/g,
    (m) =>
      `<mark class="rounded-xs bg-warning-50 px-1 font-semibold text-warning-700">${m}</mark>`,
  );
