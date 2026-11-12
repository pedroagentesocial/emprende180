import { construirTxt, LOCALES, type Txt } from "@i18n/idioma";
import { formatMoney } from "@i18n/formato";

/**
 * Importes y fechas del portal de Embajadores, en los DOS idiomas.
 *
 * Todo texto de la plataforma se pinta en los dos idiomas y el CSS esconde el
 * que no toca (ver `<T>`), así que una cifra o una fecha también tiene que
 * llegar como `Txt`: "$1,299.50" y "1299,50 US$" no son el mismo texto.
 */

/** Centavos → "$1,299.50" (sin decimales si la cifra es redonda). */
export const money = (cents: number): Txt =>
  construirTxt((l) => formatMoney(Math.round(cents) / 100, l));

/** "3 nov 2026" / "Nov 3, 2026". */
export const shortDate = (d: Date): Txt =>
  construirTxt((l) =>
    new Intl.DateTimeFormat(LOCALES[l], { day: "numeric", month: "short", year: "numeric" }).format(d),
  );

/** "3 nov" / "Nov 3", para las semanas de la gráfica. */
export const dayMonth = (d: Date): Txt =>
  construirTxt((l) =>
    new Intl.DateTimeFormat(LOCALES[l], { day: "numeric", month: "short", timeZone: "UTC" }).format(d),
  );

/** "nov" / "Nov", para el eje de la gráfica mensual. */
export const monthShort = (d: Date): Txt =>
  construirTxt((l) =>
    new Intl.DateTimeFormat(LOCALES[l], { month: "short", timeZone: "UTC" }).format(d).replace(".", ""),
  );

/** "Noviembre de 2026" / "November 2026", para el título de cada mes. */
export const monthLong = (d: Date): Txt =>
  construirTxt((l) => {
    const s = new Intl.DateTimeFormat(LOCALES[l], { month: "long", year: "numeric", timeZone: "UTC" }).format(d);
    return s.charAt(0).toUpperCase() + s.slice(1);
  });

/** Una cifra corta para el eje de una gráfica: "$1.2k", "$350". */
export const moneyAxis = (cents: number): string => {
  const usd = cents / 100;
  if (Math.abs(usd) >= 1000) return `$${(usd / 1000).toFixed(usd >= 10_000 ? 0 : 1)}k`;
  return `$${Math.round(usd)}`;
};
