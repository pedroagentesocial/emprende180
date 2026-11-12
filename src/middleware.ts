import { defineMiddleware } from "astro:middleware";
import { currentStudent } from "@lib/auth";
import { harden, isSameOrigin, changesState } from "@lib/security";
import { isPreRegistered } from "@lib/permissions";
import { esFalloDeBase, respuestaSinBase } from "@lib/downtime";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MIDDLEWARE — the door to the student area
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Three jobs, in this order, and all three in ONE place:
 *
 *   1. TURN AWAY state-changing requests that didn't start on our own pages.
 *   2. CHECK who is asking, before anything is rendered.
 *   3. HARDEN the response: caching rules and security headers.
 *
 * ⚠️ WHY HERE AND NOT ON EACH PAGE. Because protecting page by page is a list
 * somebody has to remember to update, and the day someone adds
 * `/student/certificate.astro` without copying the check block, that page is
 * open. Here the rule is the route PREFIX: any new file under `/student` is
 * born protected. The same goes for the cache rule — see
 * `@lib/security`, where signing out and pressing Back is explained in full.
 *
 * ⚠️ WHAT IT DOESN'T DO. It doesn't decide what each student sees INSIDE the
 * area; that's each page's business. It only answers "may they come through the
 * door?".
 *
 * Anyone who hasn't signed in is sent to `/login` with `?next=`, to put them
 * back where they were headed once identified. Without that, anyone arriving
 * from a link to a specific video ends up on the dashboard having to find it
 * again.
 */

const STUDENT_ZONE = "/student";
/** Donde espera un pre-registro hasta que el admin le da acceso. */
const WAITING_PAGE = "/student/espera";

/**
 * The Spanish URLs this area used to live at.
 *
 * ⚠️ THEY ARE HANDLED HERE AND NOT IN `astro.config.mjs` BECAUSE THE CONFIG
 * REDIRECTS DROP THE QUERY STRING. Tested: `/acceso/entrar?t=abc` came out as
 * `/login/verify` with no token — which is precisely the emailed sign-in link
 * that had to survive the rename. Here the search string is carried across.
 *
 * They don't expire: an access link that 404s is a student on the phone.
 */
const LEGACY_PATHS: Record<string, string> = {
  "/acceso": "/login",
  "/acceso/entrar": "/login/verify",
  "/acceso/clave": "/login/password",
  "/alumno": "/student",
  /* ⚠️ `/admin` YA NO EXISTE, y no es que se haya movido: es que no debía ser
     una página. Administrar no es ir a otro sitio, es ver más del mismo portal,
     así que las herramientas viven dentro de `/student` y se pintan según el
     rol. Esta línea recoge marcadores y enlaces viejos. Ver `/student`. */
  "/admin": "/student",
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UN SOLO DOMINIO PARA LA WEB PÚBLICA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ `emprende180.vercel.app` SERVÍA LA WEB ENTERA CON UN 200. Comprobado en
 * vivo el 20-10-2026: la misma portada, las mismas páginas, el mismo formulario
 * de alta, en un segundo dominio.
 *
 * No era una catástrofe —cada página se declara canónica en
 * `www.emprende180.com`, y Google casi siempre hace caso de eso—, pero "casi
 * siempre" no es una forma de llevar un dominio:
 *
 *  1. UN CANONICAL ES UNA SUGERENCIA, no una orden. Google puede elegir otra
 *     URL si le parece mejor, y entonces la marca sale en resultados con un
 *     dominio que no es suyo.
 *  2. LOS ENLACES QUE SE COMPARTEN. Quien copie la barra del navegador desde
 *     ahí reparte `vercel.app`: en un correo, en un mensaje, en un papel.
 *  3. LAS COOKIES Y EL ACCESO NO SE COMPARTEN entre dominios, así que alguien
 *     que entrara por ahí tendría una sesión distinta de la de siempre, y la
 *     vuelta de Google solo está registrada para el dominio bueno.
 *
 * ⚠️ SOLO EL ALIAS DE PRODUCCIÓN, NO `*.vercel.app` ENTERO. Las vistas previas
 * de cada rama viven en direcciones de ese mismo dominio, y mandarlas todas a
 * producción es quedarse sin poder revisar nada antes de publicarlo.
 *
 * ⚠️ SI ALGÚN DÍA EL DOMINIO PROPIO SE CAE (DNS, certificado), esta puerta de
 * atrás deja de existir: `vercel.app` redirige a un sitio que no contesta.
 * Para recuperarla, vaciar este conjunto y desplegar.
 */
const DOMINIO_BUENO = "www.emprende180.com";
const DOMINIOS_VIEJOS = new Set(["emprende180.vercel.app"]);

/** La misma dirección en el dominio bueno, o `null` si ya está en él. */
function aDominioCanonico(url: URL): string | null {
  /* En local el host es `localhost` y no hay nada que redirigir. */
  if (!import.meta.env.PROD) return null;
  if (!DOMINIOS_VIEJOS.has(url.hostname)) return null;

  const destino = new URL(url.href);
  destino.protocol = "https:";
  destino.hostname = DOMINIO_BUENO;
  destino.port = "";
  return destino.href;
}

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    return await atender(context, next);
  } catch (error) {
    /* ⚠️ SOLO LOS FALLOS DE BASE DE DATOS SE CONVIERTEN EN PÁGINA. Cualquier
       otra excepción se vuelve a lanzar para que siga saliendo como un 500 en
       el registro: taparlas todas sería cambiar errores visibles por errores
       silenciosos. Ver `@lib/downtime`. */
    if (!esFalloDeBase(error)) throw error;

    const { pathname } = context.url;
    console.error(`[middleware] Base de datos no disponible en ${pathname}:`, error);

    return respuestaSinBase(
      pathname,
      context.request.headers.get("accept-language"),
      pathname.startsWith("/api/"),
    );
  }
});

/** El middleware de verdad. Vive aparte solo para que el `try` de arriba lo envuelva entero. */
async function atender(
  context: Parameters<Parameters<typeof defineMiddleware>[0]>[0],
  next: Parameters<Parameters<typeof defineMiddleware>[0]>[1],
): Promise<Response> {
  const { pathname } = context.url;

  /* ─── 0. EL DOMINIO, ANTES QUE NADA ──────────────────────────────────────
     Va primero para que ninguna otra regla gaste trabajo en una petición que
     se va a mover de dominio igualmente, y para que la redirección de ruta
     vieja no encadene dos saltos.

     308 y no 301: conserva el método. Un 301 convierte un POST en GET por el
     camino, y por aquí pasan los formularios. */
  const dominio = aDominioCanonico(context.url);
  if (dominio) {
    return harden(context.redirect(dominio, 308), pathname);
  }

  const legacy = LEGACY_PATHS[pathname];
  if (legacy) {
    return harden(context.redirect(legacy + context.url.search, 301), pathname);
  }

  /* ─── 1. CSRF ────────────────────────────────────────────────────────────
     Every POST in this project — signing in, signing out, setting a password,
     registering a student, capturing a lead — is answered by our own pages. A
     POST that arrives from somewhere else is either an attack or a mistake, and
     neither deserves to reach the handler. See `isSameOrigin`. */
  /* ⚠️ LA ÚNICA EXCEPCIÓN: `/api/facts/<negocio>`, el webhook por el que los
     negocios (GoHighLevel) nos cuentan hechos de sus clientes. Lo llama un
     servidor, no una página nuestra, así que nunca trae nuestro origen; a
     cambio exige el secreto del negocio, y sin él contesta 401. No lee la
     cookie de sesión: no hay sesión que un atacante pudiera aprovechar. */
  const isFactsWebhook = pathname.startsWith("/api/facts/");
  if (
    !isFactsWebhook &&
    changesState(context.request.method) &&
    !isSameOrigin(context.request, context.url)
  ) {
    return harden(new Response(null, { status: 403 }), pathname);
  }

  const isStudentZone =
    pathname === STUDENT_ZONE || pathname.startsWith(`${STUDENT_ZONE}/`);

  if (!isStudentZone) return harden(await next(), pathname);

  /* ─── 2. Who is this ─────────────────────────────────────────────────── */
  const student = await currentStudent(context.cookies);

  if (!student) {
    const target = new URL("/login", context.url);
    target.searchParams.set("next", pathname);
    return harden(
      context.redirect(target.pathname + target.search, 302),
      pathname,
    );
  }

  /* ⚠️ AQUÍ YA NO SE COMPRUEBA NINGÚN ROL, y eso es una mejora, no un descuido.
     Con un `/admin` aparte, esta puerta tenía que saber quién podía abrirla.
     Ahora la única puerta es el portal y todo el mundo puede entrar en él: lo
     que cambia es CUÁNTO ve, y eso lo decide `@lib/permissions` dentro de la
     página. Una comprobación menos en el sitio donde equivocarse era más caro. */

  /* Un pre-registro (se apuntó en la web y aún no tiene acceso) solo ve la
     página que le dice que está en espera. Ver `isPreRegistered`. */
  if (isPreRegistered(student) && pathname !== WAITING_PAGE) {
    return harden(context.redirect(WAITING_PAGE, 302), pathname);
  }

  /* The resolved student travels in `locals` so pages don't have to look them
     up again: one request, one session read. */
  context.locals.student = student;

  /* ─── 3. Headers ─────────────────────────────────────────────────────── */
  return harden(await next(), pathname);
}
