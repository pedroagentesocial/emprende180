import { repo, type Coupon } from "@lib/data";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CUPONES — comprobar uno sin poder romper nada
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Este archivo existe por UNA razón concreta, y conviene que quede escrita:
 * el formulario de la landing es lo más valioso que hay en la página, y hasta
 * ahora NO tocaba la base de datos. Consultar un cupón la mete en un camino
 * donde antes no estaba, y ahí hay dos maneras de perder un lead:
 *
 *  1. Sin `DATABASE_URL` en producción, `repo()` LANZA a propósito (ver la nota
 *     de `src/lib/data.ts`). Si esa excepción sube, el formulario de la landing
 *     deja de funcionar el día que se despliegue sin base de datos.
 *  2. Con la base caída o lenta, una consulta sin red de seguridad convierte
 *     una errata en un cupón en un 500 para alguien que quería apuntarse.
 *
 * Por eso todo lo de aquí está envuelto y NUNCA lanza. Un cupón que no se puede
 * comprobar se trata como un cupón que no se reconoce: el lead entra igual, con
 * el código anotado tal cual lo escribió, y quien llame decidirá. Perder un
 * descuento es un problema pequeño; perder un lead es el problema.
 */

export interface CuponComprobado {
  /** Lo que escribió el visitante, tal cual, para que quien llame lo vea. */
  escrito: string;
  /** El cupón, si es válido y usable ahora mismo. */
  valido: Coupon | null;
}

/** Lo legible: "20% de descuento" o "50 de descuento". */
export const describirCupon = (c: Coupon): string =>
  c.kind === "percent" ? `${c.value}%` : `${c.value}`;

/**
 * ¿Vale este código? Devuelve siempre algo, nunca lanza.
 *
 * Si el cupón es usable, además le suma uno a "veces que alguien lo escribió":
 * es la cuenta que mide el alcance del canal. La otra —cuántos de esos acabaron
 * comprando— sale de las altas, y las dos juntas son lo que dice si un cupón
 * atrae y cierra o solo atrae.
 */
export async function comprobarCupon(
  codigo: string | undefined | null,
): Promise<CuponComprobado | null> {
  const escrito = (codigo ?? "").trim();
  if (!escrito) return null;

  try {
    const r = repo();
    const valido = await r.findUsableCoupon(escrito);
    if (valido) await r.recordCouponRequest(valido.code);
    return { escrito, valido };
  } catch (error) {
    /* Sin base de datos, o con la base caída. El lead sigue su camino con el
       código escrito y sin verificar: ver la nota de arriba. */
    console.warn("[cupones] No se pudo comprobar el código:", error);
    return { escrito, valido: null };
  }
}
