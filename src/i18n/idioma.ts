import { atom } from "nanostores";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * IDIOMA — es-US / en-US
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * CÓMO SE CAMBIA DE IDIOMA SIN RECARGAR
 *
 * La página se renderiza en el servidor con AMBOS idiomas en el HTML: cada
 * texto sale como dos elementos, uno `data-t="es"` y otro `data-t="en"`, y el
 * CSS oculta el que no toca según el atributo `lang` de <html> (ver global.css).
 * Cambiar de idioma es cambiar UN atributo. Instantáneo, sin recargar, sin
 * tocar el scroll y sin re-hidratar las islas de React.
 *
 * El coste es que el HTML lleva los dos idiomas: unos +8 KB comprimidos. A
 * cambio no hace falta un router de cliente, ni volver a montar el formulario
 * al cambiar de idioma (que perdería lo que el visitante llevara escrito).
 *
 * Las islas de React NO usan ese truco: reciben el objeto {es, en} y se
 * suscriben a este store, porque además de texto tienen que cambiar
 * `placeholder`, `aria-label` y los mensajes de error, que son atributos y no
 * nodos de texto.
 *
 * PRECEDENCIA al resolver el idioma inicial:
 *   1. `?lang=` en la URL      — para compartir el enlace ya en un idioma.
 *   2. Lo guardado en el navegador — la elección explícita del visitante manda.
 *   3. `navigator.language`    — primera visita.
 *   4. es                      — el mercado principal.
 */

export const IDIOMAS = ["es", "en"] as const;
export type Idioma = (typeof IDIOMAS)[number];

/** Locales completos. `es-US` y no `es-MX`: con es-MX, Intl escribe "USD 3,990". */
export const LOCALES: Record<Idioma, string> = {
  es: "es-US",
  en: "en-US",
};

/** Para `og:locale`. */
export const OG_LOCALES: Record<Idioma, string> = {
  es: "es_US",
  en: "en_US",
};

export const IDIOMA_POR_DEFECTO: Idioma = "es";

/** Clave en localStorage. Cambiarla reinicia la preferencia de todo el mundo. */
export const CLAVE_IDIOMA = "e180-idioma";

/** Texto en los dos idiomas. Es el tipo de TODO valor textual del config. */
export interface Txt {
  es: string;
  en: string;
}

/**
 * Construye un `Txt` resolviendo cada idioma por separado.
 *
 * Para textos que dependen de algo que hay que formatear por locale (dinero,
 * números, fechas): `construirTxt(l => formatMoney(497, l))`.
 */
export const construirTxt = (fn: (l: Idioma) => string): Txt => ({
  es: fn("es"),
  en: fn("en"),
});

/**
 * ¿Este texto sigue siendo un placeholder EN ALGUNO de los dos idiomas?
 *
 * Basta con que uno lo sea: publicar con el español real y el inglés en
 * "PLACEHOLDER" es exactamente el fallo que estos avisos existen para evitar.
 */
export const esPlaceholder = (v: Txt, marca = "PLACEHOLDER"): boolean =>
  v.es.startsWith(marca) || v.en.startsWith(marca);

/** Igual, pero para un marcador que puede estar en cualquier posición. */
export const contienePendiente = (v: Txt, marca: string): boolean =>
  v.es.includes(marca) || v.en.includes(marca);

export const esIdioma = (v: unknown): v is Idioma =>
  typeof v === "string" && (IDIOMAS as readonly string[]).includes(v);

/**
 * Resuelve el idioma en el SERVIDOR, para que el primer pintado ya salga bien
 * y los buscadores vean la página en el idioma de la URL.
 *
 * Ojo: aquí no hay `localStorage`. Solo puede mirar la URL y la cabecera
 * `Accept-Language`. La preferencia guardada la aplica el cliente justo
 * después, en el script de <head>, antes del primer pintado.
 */
export function resolverIdiomaServidor(url: URL, acceptLanguage?: string | null): Idioma {
  const param = url.searchParams.get("lang");
  if (esIdioma(param)) return param;

  if (acceptLanguage) {
    // "en-US,en;q=0.9,es;q=0.8" → el primer idioma que conozcamos.
    const preferidos = acceptLanguage
      .split(",")
      .map((p) => p.split(";")[0]?.trim().slice(0, 2).toLowerCase())
      .filter(Boolean);
    for (const p of preferidos) if (esIdioma(p)) return p;
  }

  return IDIOMA_POR_DEFECTO;
}

// ─── Store de cliente ────────────────────────────────────────────────────────

/**
 * Se inicializa con lo que ya haya puesto el script de <head> en <html lang>,
 * así el store y el DOM nunca arrancan diciendo cosas distintas.
 */
function idiomaInicial(): Idioma {
  if (typeof document === "undefined") return IDIOMA_POR_DEFECTO;
  const enHtml = document.documentElement.lang?.slice(0, 2);
  return esIdioma(enHtml) ? enHtml : IDIOMA_POR_DEFECTO;
}

export const idioma = atom<Idioma>(idiomaInicial());

/** Evento para lo que no puede suscribirse al store (título, meta). */
export const EVENTO_IDIOMA = "e180:idioma";

/** Cambia el idioma: DOM, almacenamiento y URL, en ese orden. */
export function cambiarIdioma(nuevo: Idioma) {
  if (!esIdioma(nuevo) || idioma.get() === nuevo) return;

  idioma.set(nuevo);
  document.documentElement.lang = nuevo;
  window.dispatchEvent(new CustomEvent(EVENTO_IDIOMA, { detail: nuevo }));

  try {
    localStorage.setItem(CLAVE_IDIOMA, nuevo);
  } catch {
    /* Modo privado: se pierde la preferencia, no la funcionalidad. */
  }

  // La URL se actualiza SIN navegar, para que copiar el enlace ya lleve el
  // idioma que se está viendo. `replaceState` no toca el scroll ni el historial.
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", nuevo);
    window.history.replaceState({}, "", url);
  } catch {
    /* ignorar */
  }
}

/** Elige el valor del idioma activo. Para usar fuera de React. */
export const t = (v: Txt, l: Idioma = idioma.get()): string => v[l];
