import type { APIRoute } from "astro";
import { z } from "zod";
import { sendMagicLink } from "@lib/auth";
import { LOGIN_EMAIL } from "@lib/loginEmail";
import { consume, clientIp } from "@lib/rateLimit";
import { verifyCaptcha } from "@lib/captcha";

export const prerender = false;

/**
 * POST /api/magic-link — asks for the link that lets you set a password.
 *
 * The React island on `/login` uses this. The same work, without JavaScript, is
 * done by the form's own POST to `/login`; both call `sendMagicLink`, so the
 * decision about who gets an email lives in ONE place.
 *
 * ⚠️ IT ANSWERS THE SAME WHETHER THE STUDENT EXISTS OR NOT, AND THAT IS HALF
 * THE DESIGN.
 *
 * If it replied "that email isn't registered", this endpoint would be a customer
 * checker: anyone could try addresses to find out who bought the course.
 *
 * ⚠️ ASKING FOR THE LINK REGISTERS NOBODY. See `sendMagicLink`.
 */

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  language: z.enum(["es", "en"]).default("es"),
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

export const POST: APIRoute = async ({ request, clientAddress, url }) => {
  // Limit by IP, cheap and before touching the database.
  const ip = clientIp(request, clientAddress);
  if (!consume(`magic-link:${ip}`, 15, 10 * 60 * 1000).allowed) {
    return json({ ok: false, error: "limit" }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "request" }, 400);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return json({ ok: false, error: "email" }, 400);

  const { email, language, captcha } = parsed.data;

  /* This endpoint SENDS EMAIL to an address a stranger types, which makes it the
     one worth automating against: not to get in, but to use us as a mailer
     against somebody else's inbox. The captcha is checked before anything is
     written or sent. */
  if (!(await verifyCaptcha(captcha, ip))) {
    return json({ ok: false, error: "captcha" }, 400);
  }

  const { devLink } = await sendMagicLink(email, language, url, LOGIN_EMAIL);

  /* `link` is only ever filled in during development with no Resend configured.
     In production it is always `null`, so the response is identical whether the
     student exists or not. */
  return json(devLink ? { ok: true, link: devLink } : { ok: true }, 200);
};

export const ALL: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: "POST" } });
