import type { APIRoute } from "astro";
import { z } from "zod";
import { signInWithPassword, internalPath } from "@lib/auth";
import { consume, clientIp } from "@lib/rateLimit";
import { verifyCaptcha } from "@lib/captcha";

export const prerender = false;

/**
 * POST /api/login — email and password.
 *
 * ⚠️ ONE ERROR MESSAGE FOR THREE FAILURES. No such account, deactivated, or
 * wrong password: all three answer "wrong email or password". Saying "wrong
 * password" would confirm that this email bought the course, and that turns the
 * form into a customer checker.
 *
 * ⚠️ THE LIMIT IS PER IP **AND** PER EMAIL.
 *
 * By IP alone, an attack from a thousand addresses tries a thousand passwords
 * against the same account without ever hitting a ceiling. By email alone,
 * anyone can lock someone else's account by failing ten times on purpose —
 * which is why the email limit is the generous one and the IP limit the strict
 * one: bothering a third party has to be expensive, being locked out of your own
 * account because of a neighbour must not be.
 *
 * The scrypt derivation deliberately takes ~100 ms (see `src/lib/passwords.ts`),
 * so a brute-force attack is already glacial before it reaches these limits.
 * This is the second barrier, not the first.
 */

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(200),
  next: z.string().max(200).optional(),
  /* Turnstile's token. Empty when the captcha is off, and then ignored. */
  captcha: z.string().max(4096).optional(),
});

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

export const POST: APIRoute = async ({ request, clientAddress, cookies }) => {
  const ip = clientIp(request, clientAddress);
  if (!consume(`login-ip:${ip}`, 20, 10 * 60 * 1000).allowed) {
    return json({ ok: false, error: "limit" }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "request" }, 400);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return json({ ok: false, error: "credentials" }, 400);

  const { email, password, next, captcha } = parsed.data;

  /* ⚠️ BEFORE THE PASSWORD CHECK, NOT AFTER. Verifying scrypt costs ~100 ms of
     our CPU by design; doing that for a request that was never going to be
     accepted is handing an attacker a way to burn the server's time for free. */
  if (!(await verifyCaptcha(captcha, ip))) {
    return json({ ok: false, error: "captcha" }, 400);
  }

  if (!consume(`login-email:${email}`, 10, 15 * 60 * 1000).allowed) {
    return json({ ok: false, error: "limit" }, 429);
  }

  const student = await signInWithPassword(
    email,
    password,
    cookies,
    request.headers.get("user-agent"),
  );

  if (!student) return json({ ok: false, error: "credentials" }, 401);

  /* The destination is sanitised by `internalPath`: it comes from the browser
     and ends up in a redirect, so it cannot be another domain's URL. */
  return json({ ok: true, next: internalPath(next ?? null) }, 200);
};

export const ALL: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: "POST" } });
