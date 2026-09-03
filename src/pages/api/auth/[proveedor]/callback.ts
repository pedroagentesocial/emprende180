import type { APIRoute } from "astro";
import { configurado, esProveedor, perfilDesdeCodigo } from "@lib/oauth";
import { abrirSesionDeProveedor, internalPath } from "@lib/auth";

export const prerender = false;

/** Las cookies del viaje de ida. Se borran pase lo que pase. */
const COOKIES = [
  "e180_oauth_state",
  "e180_oauth_pkce",
  "e180_oauth_prov",
  "e180_oauth_next",
] as const;

/**
 * La vuelta del proveedor.
 *
 * Termina SIEMPRE en una redirección, nunca en una pantalla propia: quien llega
 * aquí viene de identificarse y espera acabar dentro, o de vuelta en el acceso
 * con un motivo. Una página de error en mitad de un login es un callejón.
 *
 * Los motivos que puede llevar `/login`:
 *
 *   `?error=oauth`       — algo falló por el camino (canceló, expiró, el
 *                          proveedor dijo que no, el correo no está verificado).
 *   `?error=sin-cuenta`  — se identificó bien, pero ese correo no es de ningún
 *                          alumno. Ver la regla de `@lib/oauth`: esto no da de
 *                          alta a nadie.
 *
 * ⚠️ NO SE DICE "esa cuenta no existe" con el correo delante ni se distingue de
 * una cuenta desactivada. El mensaje de `/login` es el mismo para los dos, por
 * lo mismo que el de la contraseña: si el mensaje cambiara, cualquiera podría
 * comprobar qué direcciones compraron el curso.
 */
export const GET: APIRoute = async ({ params, cookies, url, request, redirect }) => {
  const proveedor = params.proveedor;

  const limpiar = () => COOKIES.forEach((c) => cookies.delete(c, { path: "/" }));
  const alAcceso = (motivo: string) => {
    limpiar();
    return redirect(`/login?error=${motivo}`, 303);
  };

  if (!esProveedor(proveedor) || !configurado(proveedor)) {
    return new Response(null, { status: 404 });
  }

  const state = cookies.get("e180_oauth_state")?.value;
  const verificador = cookies.get("e180_oauth_pkce")?.value;
  const esperado = cookies.get("e180_oauth_prov")?.value;
  const destino = internalPath(cookies.get("e180_oauth_next")?.value ?? null);

  /* El `state` tiene que existir en los dos lados y coincidir, y el proveedor
     tiene que ser el mismo con el que se empezó: sin esta comprobación,
     cualquiera puede fabricar una URL de callback y meter a otra persona en una
     sesión que no pidió. */
  const recibido = url.searchParams.get("state");
  if (!state || !verificador || !recibido || recibido !== state) {
    return alAcceso("oauth");
  }
  if (esperado !== proveedor) return alAcceso("oauth");

  /* Canceló, o el proveedor devolvió un error suyo. */
  if (url.searchParams.get("error")) return alAcceso("oauth");

  const codigo = url.searchParams.get("code");
  if (!codigo) return alAcceso("oauth");

  const perfil = await perfilDesdeCodigo(proveedor, codigo, url, verificador);
  if (!perfil) return alAcceso("oauth");

  const alumno = await abrirSesionDeProveedor(
    perfil.email,
    cookies,
    request.headers.get("user-agent"),
  );
  if (!alumno) return alAcceso("sin-cuenta");

  limpiar();
  return redirect(destino, 303);
};
