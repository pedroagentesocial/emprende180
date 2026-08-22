import { defineMiddleware } from "astro:middleware";
import { currentStudent } from "@lib/auth";
import { harden, isSameOrigin, changesState } from "@lib/security";

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

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const legacy = LEGACY_PATHS[pathname];
  if (legacy) {
    return harden(context.redirect(legacy + context.url.search, 301), pathname);
  }

  /* ─── 1. CSRF ────────────────────────────────────────────────────────────
     Every POST in this project — signing in, signing out, setting a password,
     registering a student, capturing a lead — is answered by our own pages. A
     POST that arrives from somewhere else is either an attack or a mistake, and
     neither deserves to reach the handler. See `isSameOrigin`. */
  if (changesState(context.request.method) && !isSameOrigin(context.request, context.url)) {
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

  /* The resolved student travels in `locals` so pages don't have to look them
     up again: one request, one session read. */
  context.locals.student = student;

  /* ─── 3. Headers ─────────────────────────────────────────────────────── */
  return harden(await next(), pathname);
});
