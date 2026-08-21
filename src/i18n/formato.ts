import { LOCALES, type Idioma } from "./idioma";

/**
 * Formato de dinero y números, por locale.
 *
 * POR QUÉ `es-US` Y NO `es-MX` NI `es-419`
 * Con `es-MX`, `Intl` escribe el importe como «USD 3,990»: antepone el código
 * de divisa porque en México el símbolo $ significa pesos y sería ambiguo.
 * `es-US` es español de Estados Unidos, donde $ ya es el dólar, así que da
 * «$3,990», que es exactamente lo que pide el diseño. Además encaja con el
 * español neutro latino del contenido.
 *
 * Comprobado en los dos locales:
 *   es-US → $3,990 · $490 · $497
 *   en-US → $3,990 · $490 · $497
 */

/** Cachea los formateadores: crear un Intl.NumberFormat no es gratis. */
const cacheMoneda = new Map<string, Intl.NumberFormat>();

/**
 * Importe en la divisa del curso.
 *
 * Sin decimales cuando la cifra es redonda: «$3,990» y no «$3,990.00». Un
 * precio con dos ceros detrás se lee como más caro y ocupa más de lo que
 * aporta. Si algún día hay un precio con céntimos (49.90), se muestran.
 */
export function formatMoney(
  cantidad: number,
  idioma: Idioma,
  moneda = "USD",
): string {
  const tieneDecimales = !Number.isInteger(cantidad);
  const clave = `${idioma}|${moneda}|${tieneDecimales}`;

  let fmt = cacheMoneda.get(clave);
  if (!fmt) {
    fmt = new Intl.NumberFormat(LOCALES[idioma], {
      style: "currency",
      currency: moneda,
      minimumFractionDigits: tieneDecimales ? 2 : 0,
      maximumFractionDigits: tieneDecimales ? 2 : 0,
    });
    cacheMoneda.set(clave, fmt);
  }
  return fmt.format(cantidad);
}

const cacheNumero = new Map<string, Intl.NumberFormat>();

/** Números sueltos (alumnos, valoraciones) con el separador del locale. */
export function formatNumber(n: number, idioma: Idioma): string {
  let fmt = cacheNumero.get(idioma);
  if (!fmt) {
    fmt = new Intl.NumberFormat(LOCALES[idioma]);
    cacheNumero.set(idioma, fmt);
  }
  return fmt.format(n);
}

/**
 * La nota de una reseña: un decimal como mucho, y ninguno si es redonda.
 *
 * "4.8" y "5", nunca "4.80" ni "5.0". Un cero decimal de relleno en una
 * puntuación se lee como precisión falsa, y encima descuadra la columna cuando
 * hay varias notas juntas.
 *
 * OJO CON EL SEPARADOR: el proyecto va en `es-US`, no en `es-ES`, así que el
 * decimal es un PUNTO también en español. Es lo correcto para esta audiencia —
 * hispanohablantes en Estados Unidos, que es de donde son todos los ejemplos y
 * en cuya moneda están los precios—, y por eso el locale sale de `LOCALES` y no
 * se escribe a mano en cada componente: hacerlo a mano fue exactamente cómo
 * aparecieron dos "es-MX" sueltos que había que acordarse de cambiar aquí.
 */
export function formatNota(n: number, idioma: Idioma): string {
  return new Intl.NumberFormat(LOCALES[idioma], {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(n);
}

/**
 * Sustituye `{clave}` por su valor. Para el copy con huecos.
 *
 * Los huecos van con nombre y no por posición porque el orden de las palabras
 * cambia entre idiomas: en inglés «3 payments of $179» y en español «3 pagos
 * de $179» coinciden, pero en cuanto una frase reordena, un `%s` posicional
 * obliga a reescribir la plantilla.
 */
export function interpolar(
  plantilla: string,
  valores: Record<string, string | number>,
): string {
  return plantilla.replace(/\{(\w+)\}/g, (m, k) =>
    k in valores ? String(valores[k]) : m,
  );
}
