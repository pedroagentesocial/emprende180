import type { APIRoute } from "astro";
import { signOut } from "@lib/auth";

export const prerender = false;

/**
 * POST /api/logout — ends the session.
 *
 * It is a POST and not a GET on purpose. With a GET, any `<img
 * src="/api/logout">` on any page would sign the visitor out: annoying, free
 * and impossible to defend against. A POST from our own form doesn't fire by
 * itself, the cookie is `sameSite: lax` so it doesn't travel on another
 * domain's POST, and the middleware checks the origin on top of that.
 *
 * It deletes the session row AS WELL AS the cookie: with only the cookie gone,
 * the token would still be valid for anyone who had copied it.
 *
 * ⚠️ WHY THE REDIRECT IS A 303. Because it turns a POST into a GET. With a 302
 * the browser may repeat the POST when the page is reloaded — and a re-sent
 * sign-out is one more request, whereas a re-sent sign-in is a second session.
 * 303 leaves the visitor on a plain page they can safely refresh.
 *
 * The screen they land on is not cached: `no-store` for `/login` comes from the
 * middleware, and it is what stops the browser from painting the private area
 * again when they press Back.
 */
export const POST: APIRoute = async ({ cookies, redirect }) => {
  await signOut(cookies);
  return redirect("/login?signedout=1", 303);
};

export const ALL: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: "POST" } });
