/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CAPTCHA — Cloudflare Turnstile
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ─── WHY TURNSTILE AND NOT reCAPTCHA ───────────────────────────────────────
 *
 * reCAPTCHA is Google's, it sets cookies and it profiles the visitor across
 * every site that uses it. This project loads GA4 ONLY after the visitor accepts
 * measurement cookies (see `src/lib/consent.ts`), and the privacy notice names
 * every processor. Putting reCAPTCHA on the sign-in screen would mean a Google
 * cookie firing before anybody has agreed to anything, on the one screen where
 * refusing it isn't an option.
 *
 * Turnstile doesn't set cookies for the site owner, doesn't sell the traffic,
 * is free at any volume, and most visitors never see a puzzle: it decides from
 * browser signals and only challenges what looks automated.
 *
 * ─── IT IS OFF UNTIL THE TWO KEYS EXIST ────────────────────────────────────
 *
 * With no `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY`, `captchaEnabled` is
 * false: nothing renders, nothing is verified, and every path behaves exactly as
 * it does today. Add the two variables and it turns on everywhere at once —
 * sign-in, the magic-link request, and the no-JavaScript form.
 *
 * That switch is deliberate. A captcha half-wired is worse than none: the paths
 * that check it look protected while the one that doesn't is the one a script
 * will use.
 *
 * ⚠️ WHAT IT COSTS, SAID PLAINLY. Turnstile needs JavaScript. With it enabled,
 * the no-JavaScript fallback on `/login` can no longer sign anybody in — the
 * form posts without a token and the server turns it away. That fallback exists
 * for a real reason (see the note in `login.astro`), so this is a trade, not a
 * free win: it buys protection against scripted credential stuffing and costs
 * the sliver of visitors whose JavaScript never arrives. The rate limits by IP
 * and by email keep working either way.
 *
 * ─── WHERE IT IS ENFORCED ──────────────────────────────────────────────────
 *
 * `POST /api/login`, `POST /api/magic-link` and the form POST handled by
 * `/login`. Three doors, one function: a captcha checked in two of the three is
 * a captcha nobody has to solve.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** The public key. It travels to the browser: it is meant to. */
export const captchaSiteKey = (): string | null =>
  import.meta.env.TURNSTILE_SITE_KEY || null;

/** Both keys present, or the whole thing stays off. */
export const captchaEnabled = (): boolean =>
  !!import.meta.env.TURNSTILE_SITE_KEY && !!import.meta.env.TURNSTILE_SECRET_KEY;

/** The field name Turnstile writes its token into. Fixed by Cloudflare. */
export const CAPTCHA_FIELD = "cf-turnstile-response";

/**
 * Is this token good? Returns `true` when the captcha is switched off, so
 * callers can ask unconditionally instead of each one remembering to check.
 *
 * ⚠️ A NETWORK FAILURE ANSWERS `false`. If Cloudflare can't be reached, the
 * honest reading is "not verified". Answering `true` on error would mean an
 * attacker who can make our verification call fail — a DNS trick, a firewall
 * rule, sheer bad luck — gets the captcha switched off for as long as it lasts.
 */
export async function verifyCaptcha(
  token: string | null | undefined,
  ip?: string,
): Promise<boolean> {
  if (!captchaEnabled()) return true;
  if (!token) return false;

  const body = new URLSearchParams({
    secret: import.meta.env.TURNSTILE_SECRET_KEY,
    response: token,
  });
  /* The visitor's IP is optional and it sharpens Cloudflare's verdict. It is
     the same address the rate limiter already sees. */
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  try {
    const response = await fetch(VERIFY_URL, { method: "POST", body });
    const result = (await response.json()) as { success?: boolean };
    if (!result.success) {
      console.warn("[captcha] Turnstile rejected a token");
    }
    return result.success === true;
  } catch (error) {
    console.error("[captcha] Could not reach Turnstile:", error);
    return false;
  }
}
