/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RESPONSE HARDENING — caching rules, security headers, same-origin check
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Everything in here is applied from ONE place (`src/middleware.ts`) for the
 * same reason the auth gate lives there: a rule you have to remember to repeat
 * on every new page is a rule that will be missing from the page someone adds
 * next month.
 *
 * ─── WHY `no-store` IS NOT OPTIONAL ────────────────────────────────────────
 *
 * ⚠️ THIS IS THE BUG THAT MADE SIGNING OUT LOOK BROKEN.
 *
 * Without a caching rule, the browser keeps the rendered HTML of `/student` in
 * its history cache. Sign out, press Back, and the browser paints the private
 * area again — greeting, name, admin link and all — because it never asks the
 * server whether that page is still allowed. Nothing was leaked from the
 * server; the page was simply still sitting in the browser. On a shared or
 * borrowed computer that is exactly the moment when "I logged out" has to mean
 * something.
 *
 * The same cache is what makes the sign-in screen flash and vanish: a cached
 * `/login` gets painted from history and then replaced the moment the server
 * answers with a redirect.
 *
 * `no-store` fixes both: private pages are never written to any cache, so Back
 * has to ask the server, and the server answers "sign in first".
 *
 * `Vary: Cookie` is the same idea one layer out: it tells every shared cache
 * between us and the visitor that this response depends on who is asking.
 *
 * ─── THE HEADERS, AND WHAT EACH ONE ACTUALLY STOPS ─────────────────────────
 *
 *   · `X-Content-Type-Options: nosniff` — stops the browser from guessing a
 *     content type different from the one we declared. Guessing is how an
 *     uploaded file that we serve as text ends up executed as a script.
 *   · `Referrer-Policy` — the magic link carries a token IN THE URL. This keeps
 *     that URL from being handed to any third party in a `Referer` header.
 *   · `Content-Security-Policy: frame-ancestors` on private pages — only our
 *     own site and GoHighLevel may show the student area or the sign-in inside
 *     a frame; anybody else's iframe stays blank (clickjacking). See
 *     `FRAME_ANCESTORS`.
 *   · `Strict-Transport-Security` in production — once a browser has seen this,
 *     it refuses to talk to us over plain HTTP at all, so the session cookie
 *     can't be captured on an open Wi-Fi by downgrading a single request.
 *
 * There is deliberately NO Content-Security-Policy here. The site runs several
 * inline scripts (language switch before first paint, GA4 after consent), so a
 * useful CSP needs per-request nonces threaded through every layout — a real
 * piece of work, not a header. Adding a permissive `unsafe-inline` policy would
 * buy nothing and read as protection that isn't there.
 */

/**
 * Who may show our private pages inside a frame.
 *
 * ⚠️ IT USED TO BE NOBODY (`X-Frame-Options: DENY`). On 16-11-2026 GoHighLevel
 * got a "Portal de Embajadores" link in its sidebar that opens /login in its
 * own window (an iframe), and DENY left that window blank. Now our own site
 * and GoHighLevel's domains may frame it; every other site still gets a blank
 * frame, so the clickjacking defence stands for everybody else.
 *
 * A white-label GoHighLevel domain (the agency's own app address) is not on
 * this list: add it in `GHL_FRAME_ORIGINS` (space or comma separated, e.g.
 * `https://app.miagencia.com`) or the portal opens blank there again.
 *
 * The session cookie had to change for the same reason: see
 * `EMBEDDABLE_COOKIE`.
 */
const FRAME_ANCESTORS = [
  "'self'",
  "https://app.gohighlevel.com",
  "https://*.gohighlevel.com",
  "https://*.leadconnectorhq.com",
  "https://*.msgsndr.com",
  ...(process.env.GHL_FRAME_ORIGINS || import.meta.env.GHL_FRAME_ORIGINS || "")
    .split(/[\s,]+/)
    .filter((o: string) => /^https:\/\/[a-z0-9*.-]+(:\d+)?$/i.test(o)),
].join(" ");

/**
 * The options of every cookie a page inside GoHighLevel's frame needs.
 *
 * ⚠️ `SameSite=None` + `Partitioned`, NOT `Lax`. Inside GHL's iframe our site
 * is a third party, and a `Lax` cookie is never sent there: the student signs
 * in, lands on /student and is thrown back to the login, forever.
 * `Partitioned` (CHIPS) is what Chrome still allows for a third party: the
 * cookie lives in a jar of its own per top site, so a session opened inside
 * GHL is not the one of emprende180.com and the other way round. Safari may
 * still refuse it inside the frame; on our own site it works everywhere.
 *
 * What `Lax` used to stop (a POST started from another site carrying the
 * session) is now stopped by `isSameOrigin` alone, which the middleware runs
 * on every POST. It was the second lock; now it is the lock.
 */
export const EMBEDDABLE_COOKIE = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  partitioned: true,
} as const;

/** Paths that must never be cached: anything behind, or leading to, a session. */
export function isPrivatePath(pathname: string): boolean {
  return (
    pathname === "/student" ||
    pathname.startsWith("/student/") ||
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    /* ⚠️ /subscribe ENTRÓ EN ESTA LISTA EL 13-10-2026, Y LLEGÓ TARDE. Nació
       como una página de captación y por eso no estaba; desde que CREA LA
       CUENTA y abre sesión es tan sensible como el login.

       Lo que le faltaba, y se vio en la revisión de seguridad:

        · frame-ancestors. Sin él, cualquiera puede meter esta página en un
          iframe invisible sobre otra cosa y conseguir que alguien rellene sus
          datos y marque el consentimiento sin saber dónde está. En un
          formulario que además crea una cuenta, eso no es teórico.
        · Cache-Control. La respuesta abre sesión: no tiene que quedarse en
          ninguna caché compartida por el camino. */
    pathname === "/subscribe" ||
    pathname.startsWith("/api/")
  );
}

/**
 * Adds the headers every response gets, plus the stricter set for private ones.
 *
 * Existing headers are respected: an endpoint that already declared its own
 * `Cache-Control` (the JSON APIs do) keeps it.
 */
export function harden(response: Response, pathname: string): Response {
  const h = response.headers;

  h.set("X-Content-Type-Options", "nosniff");
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (!import.meta.env.DEV) {
    h.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains");
  }

  if (!isPrivatePath(pathname)) return response;

  if (!h.has("Cache-Control")) {
    h.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  }
  /* Belt and braces for proxies that predate `Cache-Control`. Costs two lines
     and removes a whole class of "why is my page cached" question. */
  h.set("Pragma", "no-cache");
  h.set("Expires", "0");
  h.set("Content-Security-Policy", `frame-ancestors ${FRAME_ANCESTORS}`);

  /* `Vary: Cookie` is APPENDED, not set: Astro already sends `Vary: Origin` and
     overwriting it would undo that. */
  const vary = h.get("Vary");
  if (!vary) h.set("Vary", "Cookie");
  else if (!/\bcookie\b/i.test(vary)) h.set("Vary", `${vary}, Cookie`);

  return response;
}

/**
 * Is this request coming from our own pages?
 *
 * ⚠️ THIS IS THE LOCK ON CSRF. Until 16-11-2026 it was the second one, behind
 * a `SameSite=Lax` session cookie; the cookie is now `SameSite=None` so the
 * portal works inside GoHighLevel's frame (see `EMBEDDABLE_COOKIE`), and this
 * check is what keeps "visit this page" from becoming "change this account's
 * password". Do not loosen it.
 *
 * It reads three signals, in order of how much they can be trusted:
 *
 *   1. `Sec-Fetch-Site`, set by the browser itself and impossible for page
 *      JavaScript to forge. `same-origin` is ours; `none` is someone typing the
 *      address; anything else is a third party.
 *   2. `Origin`, which browsers always send on POST.
 *   3. `Referer`, as a last resort for old clients.
 *
 * With NO signal at all, the answer is no. A real browser always sends at least
 * one of the three on a POST, so the only thing this turns away is a script
 * pretending to be a browser — which is the point.
 */
export function isSameOrigin(request: Request, url: URL): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site) return site === "same-origin" || site === "none";

  const origin = request.headers.get("origin");
  if (origin) return origin === url.origin;

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin === url.origin;
    } catch {
      return false;
    }
  }

  return false;
}

/** Methods that change something and therefore need the check above. */
export function changesState(method: string): boolean {
  return method !== "GET" && method !== "HEAD" && method !== "OPTIONS";
}
