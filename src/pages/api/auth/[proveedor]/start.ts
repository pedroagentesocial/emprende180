import type { APIRoute } from "astro";
import {
  aleatorio,
  configurado,
  esProveedor,
  urlAutorizacion,
} from "@lib/oauth";
import { internalPath } from "@lib/auth";

export const prerender = false;

/**
 * Arranca el "entrar con…".
 *
 * Genera el `state` y el verificador PKCE, los guarda en cookies de vida corta
 * y manda al proveedor. Todo el porqué está en `@lib/oauth`.
 *
 * ⚠️ LAS COOKIES SON EL ÚNICO ESTADO. No hay tabla ni memoria de por medio: el
 * `state` que se guarda aquí es el que se compara en el callback, y si no
 * coincide, no se entra. En una función serverless, guardar esto "en el
 * servidor" significaría una tabla más y un `state` que sobrevive a un despliegue
 * a medias; en una cookie `httpOnly` de diez minutos no sobrevive a nada, que es
 * exactamente lo que se quiere.
 *
 * `sameSite: "lax"` y no `strict`: la vuelta del proveedor es una navegación de
 * arriba desde otro dominio, y con `strict` el navegador no manda la cookie —el
 * flujo fallaría siempre, y de la forma más difícil de diagnosticar.
 */
export const GET: APIRoute = async ({ params, cookies, url, redirect }) => {
  const proveedor = params.proveedor;

  /* 404 y no 400: si el proveedor no está configurado, esta ruta no existe.
     Contestar otra cosa confirmaría qué integraciones tiene el sitio. */
  if (!esProveedor(proveedor) || !configurado(proveedor)) {
    return new Response(null, { status: 404 });
  }

  const state = aleatorio();
  const verificador = aleatorio();
  const opciones = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: !import.meta.env.DEV,
    path: "/",
    maxAge: 600,
  };

  cookies.set("e180_oauth_state", state, opciones);
  cookies.set("e180_oauth_pkce", verificador, opciones);
  cookies.set("e180_oauth_prov", proveedor, opciones);

  /* A dónde iba antes de que le mandáramos a identificarse. Pasa por
     `internalPath`, que es lo que impide que un `?next=https://otro-sitio`
     convierta nuestro login en un redirector abierto. */
  cookies.set(
    "e180_oauth_next",
    internalPath(url.searchParams.get("next")),
    opciones,
  );

  return redirect(await urlAutorizacion(proveedor, url, state, verificador), 302);
};
