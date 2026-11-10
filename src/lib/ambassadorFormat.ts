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
