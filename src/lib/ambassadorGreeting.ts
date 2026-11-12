import { ambassadorCopy } from "@config/ambassadorArea";
import type { Book } from "@lib/ambassadorBook";
import { money, shortDate } from "@lib/ambassadorFormat";
import type { Txt } from "@i18n/idioma";

/**
 * La frase de la bienvenida del Embajador: lo más útil que se le puede decir
 * en una línea, en este orden de prioridad: lo que puede cobrar ya, lo que
 * lleva este mes, lo que viene en camino, o que empiece a compartir.
 */
export function greetingLine(book: Book): { line: Txt; vars: Record<string, string | number | Txt> } {
  const h = ambassadorCopy.home;
  const { summary, stats } = book;
  const month = stats.monthly.at(-1)?.earnedCents ?? 0;
  if (summary.availableCents > 0) {
    return { line: h.greetReady, vars: { cobrar: money(summary.availableCents), mes: money(month) } };
  }
  if (month > 0) return { line: h.greetMonth, vars: { mes: money(month) } };
  if (summary.next) {
    return { line: h.greetWaiting, vars: { espera: money(summary.waitingCents), fecha: shortDate(summary.next.date) } };
  }
  if (book.referrals.length === 0) return { line: h.greetStart, vars: {} };
  return { line: h.greetQuiet, vars: {} };
}
