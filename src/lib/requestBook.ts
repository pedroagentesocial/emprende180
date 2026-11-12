import { loadBook, type Book } from "@lib/ambassadorBook";
import type { Student } from "@lib/data";

/**
 * El libro del Embajador, UNA vez por petición (12-11-2026).
 *
 * La página lo necesita para sus números y el marco para los avisos de la
 * campana. Sin esto se leería dos veces en cada pantalla. Solo la versión sin
 * nombres de clientes (`withNames: false`): la de Referidos, que sí los lleva
 * y deja rastro, se sigue pidiendo aparte.
 */
export function cachedBook(locals: App.Locals, student: Student): Promise<Book> {
  locals.bookCache ??= new Map();
  let hit = locals.bookCache.get(student.id);
  if (!hit) {
    hit = loadBook(student, { viewer: student, withNames: false });
    locals.bookCache.set(student.id, hit);
  }
  return hit;
}
