import type { APIRoute } from "astro";
import { salir } from "@lib/acceso";

export const prerender = false;

/**
 * POST /api/salir — cierra la sesión.
 *
 * Es POST y no GET a propósito. Con un GET, cualquier `<img src="/api/salir">`
 * en cualquier página cerraría la sesión del visitante: molesto, gratis y sin
 * que se pueda hacer nada. Un POST desde un formulario propio no se dispara
 * solo, y la cookie es `sameSite: lax`, así que tampoco viaja en un POST de
 * otro dominio.
 *
 * Borra la fila de la sesión ADEMÁS de la cookie: si solo se borrara la cookie,
 * el token seguiría siendo válido para quien lo hubiera copiado.
 */
export const POST: APIRoute = async ({ cookies, redirect }) => {
  await salir(cookies);
  return redirect("/acceso?salida=1", 303);
};

export const ALL: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: "POST" } });
