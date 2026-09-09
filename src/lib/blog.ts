import type { Txt } from "@i18n/idioma";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BLOG — lo que comparten el listado y el artículo
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Vive aquí y no dentro de cada página porque la regla de "qué se publica" tiene
 * que ser UNA. Si el listado y la página del artículo decidieran por su cuenta,
 * el día que una de las dos se olvide de filtrar borradores, un artículo a medio
 * escribir queda accesible por su URL aunque no salga en la lista.
 */

/** Un borrador no se publica, y lo del futuro tampoco: ver `articulosPublicados`. */
interface ArticuloMinimo {
  data: { borrador: boolean; fecha: Date };
}

/**
 * Los artículos que de verdad se pueden leer, del más nuevo al más viejo.
 *
 * ⚠️ SE FILTRAN DOS COSAS, Y LA SEGUNDA NO ES OBVIA:
 *
 *  1. LOS BORRADORES. Para poder escribir a medias en la rama principal.
 *  2. LAS FECHAS FUTURAS. Un artículo fechado mañana no sale hasta mañana, y eso
 *     convierte el campo `fecha` en una programación de publicación gratis: se
 *     escriben cuatro un domingo, se fechan de lunes a jueves y aparecen solos.
 *     Sin esto, poner una fecha futura solo servía para colarlo al principio de
 *     la lista.
 *
 * Se le pasa `getCollection` en vez de importarlo aquí para que este archivo no
 * dependa de `astro:content` y se pueda probar como una función normal.
 */
export async function articulosPublicados<T extends ArticuloMinimo>(
  getCollection: (nombre: "blog") => Promise<T[]>,
): Promise<T[]> {
  const ahora = Date.now();
  return (await getCollection("blog"))
    .filter((a) => !a.data.borrador && a.data.fecha.getTime() <= ahora)
    .sort((a, b) => b.data.fecha.getTime() - a.data.fecha.getTime());
}

/**
 * El titular en los dos idiomas, para los sitios donde aparece suelto.
 *
 * Devuelve un `Txt` y no una cadena a propósito: la portada pinta LOS DOS
 * idiomas a la vez y esconde el que no toca con CSS, así que un texto resuelto
 * en el servidor se quedaría fijo al cambiar de idioma con el selector. Pasando
 * por `<T>`, el cambio es inmediato y sin recargar.
 *
 * Sin `tituloEn`, las dos versiones son la misma y no pasa nada.
 */
export const tituloBilingue = (a: {
  data: { titulo: string; tituloEn?: string };
}): Txt => ({ es: a.data.titulo, en: a.data.tituloEn ?? a.data.titulo });

/**
 * La fecha, escrita como la escribiría una persona: "24 de agosto de 2026".
 *
 * En el idioma DEL ARTÍCULO, no en el de la interfaz: la fecha va pegada a un
 * texto que está en un idioma concreto, y "August 24, 2026" encima de un titular
 * en español se lee como un descuido.
 */
export const formatearFecha = (fecha: Date, idioma: "es" | "en"): string =>
  new Intl.DateTimeFormat(idioma === "es" ? "es-ES" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(fecha);

/** Minutos de lectura, redondeando hacia arriba y con un mínimo de uno. */
export const minutosDeLectura = (texto: string): number =>
  Math.max(1, Math.round(texto.trim().split(/\s+/).length / 200));

export const blogCopy = {
  titulo: { es: "Blog", en: "Blog" },
  descripcion: {
    es: "Ideas prácticas sobre cómo se detecta una oportunidad, cómo se pide un referido y cómo se construye una red que trabaja para ti.",
    en: "Practical ideas on spotting an opportunity, asking for a referral, and building a network that works for you.",
  },
  entradilla: {
    es: "Lo que vamos aprendiendo del Ecosistema, escrito para que sirva aunque no compres nada.",
    en: "What we keep learning from the ecosystem, written to be useful even if you never buy a thing.",
  },
  leer: { es: "Leer el artículo", en: "Read the article" },
  volver: { es: "Volver al blog", en: "Back to the blog" },
  minutos: { es: "{n} min de lectura", en: "{n} min read" },
  /**
   * El aviso de idioma. Ver la nota de `src/content.config.ts`: cada artículo se
   * publica en un solo idioma, y decirlo es mejor que dejar que alguien pulse y
   * se encuentre algo que no puede leer.
   */
  enOtroIdioma: {
    es: "Este artículo está en inglés.",
    en: "This article is in Spanish.",
  },
} satisfies Record<string, Txt>;
