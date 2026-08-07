import { useStore } from "@nanostores/react";
import { idioma, type Idioma, type Txt } from "./idioma";
import { formatMoney, formatNumber, interpolar } from "./formato";

/**
 * Acceso al idioma desde las islas de React.
 *
 * Las islas no pueden usar el truco de renderizar los dos idiomas y ocultar uno
 * con CSS: además de nodos de texto tienen `placeholder`, `aria-label` y
 * mensajes de error, que son atributos y no se pueden ocultar. Así que se
 * suscriben al store y vuelven a renderizar. Como el store es un átomo de
 * nanostores, el cambio es un re-render de esos componentes y nada más: el
 * formulario conserva lo que el visitante llevara escrito.
 */
export function useIdioma(inicial?: Idioma): {
  lang: Idioma;
  /** Elige el valor del idioma activo. */
  t: (v: Txt) => string;
  /** Igual, pero además sustituye `{claves}`. */
  ti: (v: Txt, valores: Record<string, string | number>) => string;
  dinero: (cantidad: number, moneda?: string) => string;
  numero: (n: number) => string;
} {
  const store = useStore(idioma);

  /**
   * En el SERVIDOR no existe `document`, así que el store no puede saber el
   * idioma de esta petición: llega por prop desde Astro, que sí lo resolvió
   * con `?lang` y `Accept-Language`.
   *
   * Sin esto, cada isla se renderizaba en el servidor SIEMPRE en español y la
   * página en inglés mostraba las etiquetas del formulario, los acordeones y
   * el banner en español hasta que hidrataban. En el cliente manda el store,
   * que es el que reacciona al selector del header.
   */
  const lang = typeof document === "undefined" ? (inicial ?? store) : store;

  return {
    lang,
    t: (v) => v[lang],
    ti: (v, valores) => interpolar(v[lang], valores),
    dinero: (cantidad, moneda) => formatMoney(cantidad, lang, moneda),
    numero: (n) => formatNumber(n, lang),
  };
}
