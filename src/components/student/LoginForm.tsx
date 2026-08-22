import { useEffect, useRef, useState } from "react";
import { studentCopy } from "@config/studentArea";
import type { Idioma } from "@i18n/idioma";
import { useIdioma } from "@i18n/react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SIGN IN — email and password, with recovery
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Two modes in one card, not two pages:
 *
 *   · SIGNIN — email + password. The normal one.
 *   · RESET  — email only; a link is sent so another password can be set.
 *
 * They live together because whoever presses "forgot it?" has already typed
 * their email: switching mode keeps it, so they don't have to type it again. A
 * separate page would force them to, which is exactly the friction that is least
 * welcome at the moment somebody is already annoyed.
 *
 * ⚠️ THE CARD'S HEADING IS IN HERE AND NOT IN THE PAGE, for that same reason:
 * it has to say "Entrar" in one mode and "Recupera tu acceso" in the other, and
 * a heading that contradicts the form under it is worse than no heading.
 *
 * ⚠️ THE SIGN-IN ERROR MESSAGE IS ONE — "wrong email or password" — for all
 * three possible failures. See `/api/login`.
 *
 * ⚠️ AND THE RECOVERY ONE DOESN'T CONFIRM THE EMAIL EXISTS. It says "if that
 * address is registered…", which is what the server answers in both cases. Were
 * it to say "we can't find that email", it would be a customer checker: anybody
 * could work out who bought the course.
 */

interface Props {
  lang?: Idioma;
  /** Where to go back to after signing in. Set by the middleware. */
  next?: string;
  /** Which mode it starts in. Decided by the server through `?reset=1`. */
  initialMode?: "signin" | "reset";
  /**
   * Where the form submits without JavaScript. Computed by the server so it can
   * carry `?lang=`: without it, the answer to the POST is rendered in the
   * browser's language and somebody reading in Spanish gets the error in
   * English.
   */
  action?: string;
  /**
   * Turnstile's public key, or nothing when the captcha is off.
   *
   * It is resolved on the server and passed down rather than read here: an
   * island can only see `PUBLIC_*` variables, and making this one public would
   * put the switch that turns the captcha on in a different place from the
   * secret that verifies it. Two switches for one feature is how a feature ends
   * up half on. See `src/lib/captcha.ts`.
   */
  captchaSiteKey?: string | null;
}

type Mode = "signin" | "reset";
type State = "ready" | "working" | "sent";

const IS_EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

export function LoginForm({
  lang,
  next,
  initialMode = "signin",
  action = "/login",
  captchaSiteKey = null,
}: Props) {
  const { t } = useIdioma(lang);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  /* The eye. Not remembered between loads on purpose: nobody wants their
     password left in plain sight because three screens ago they tapped an eye. */
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState<State>("ready");
  const [error, setError] = useState<string | null>(null);

  /* ─── The captcha ────────────────────────────────────────────────────────
     Rendered from an effect and not by Turnstile's own auto-discovery. The
     difference matters: auto-discovery injects an iframe into the container as
     soon as its script loads, which can be BEFORE React hydrates this island —
     and React then finds children it never rendered. Rendering it after mount
     means there is no moment when the two disagree.

     The token is single use. A wrong password burns it, so the widget is reset
     on every failure; without that, the second attempt always fails and it looks
     like the password is wrong twice. */
  const captchaBox = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState("");

  useEffect(() => {
    if (!captchaSiteKey) return;
    let cancelled = false;

    const render = () => {
      if (cancelled || !captchaBox.current || widgetId.current !== null) return;
      const id = window.turnstile?.render(captchaBox.current, {
        sitekey: captchaSiteKey,
        callback: (token: string) => setCaptchaToken(token),
        "expired-callback": () => setCaptchaToken(""),
        "error-callback": () => setCaptchaToken(""),
      });
      if (id) widgetId.current = id;
    };

    if (window.turnstile) {
      render();
      return () => {
        cancelled = true;
      };
    }

    /* The script is loaded `async` by the page. Waiting for it with an interval
       rather than a load event keeps this component from having to know how the
       page chose to load it. */
    const timer = window.setInterval(() => {
      if (!window.turnstile) return;
      window.clearInterval(timer);
      render();
    }, 200);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [captchaSiteKey]);

  const resetCaptcha = () => {
    setCaptchaToken("");
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  };

  /* Both fields share one class string, and that is the point: two inputs that
     differ by a pixel of padding are the thing that makes a form feel
     home-made. `pl-11` is the slot for the leading icon; the password adds
     `pr-12` for the eye on the other side. */
  const field = [
    "min-h-12 w-full rounded-xl border py-3 pl-11 pr-4 text-base",
    "border-line-strong bg-surface text-ink placeholder:text-ink-subtle",
    "transition-colors focus:border-secondary-500",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
    "disabled:opacity-60",
  ].join(" ");

  const labelClass = "block text-sm font-semibold text-ink";

  /* The icon sitting inside a field. A plain colour is enough: it marks the
     field, it doesn't report state. */
  const fieldIcon =
    "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle";

  async function onSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (state === "working") return;

    if (!IS_EMAIL.test(email.trim())) {
      setError(t(studentCopy.errorEmail));
      return;
    }

    if (captchaSiteKey && !captchaToken) {
      setError(t(studentCopy.errorCaptcha));
      return;
    }

    setError(null);
    setState("working");

    try {
      if (mode === "reset") {
        const r = await fetch("/api/magic-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            language: lang ?? "es",
            next,
            captcha: captchaToken,
          }),
        });
        /* A 429 also counts as sent: saying "you've asked too many times" would
           confirm that this email exists. */
        if (r.ok || r.status === 429) {
          setState("sent");
          return;
        }
        resetCaptcha();
        setError(t(studentCopy.errorGeneral));
        setState("ready");
        return;
      }

      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          next,
          captcha: captchaToken,
        }),
      });
      const data = await r.json().catch(() => ({}));

      if (r.ok && data.ok) {
        /* `location.assign` and not a client-side router: the session has just
           arrived in a cookie and the destination page is rendered on the
           server. A real navigation is needed for the server to see it. */
        window.location.assign(data.next ?? "/student");
        return;
      }

      resetCaptcha();
      setError(
        t(
          r.status === 429
            ? studentCopy.errorLimit
            : data.error === "captcha"
              ? studentCopy.errorCaptcha
              : studentCopy.errorCredentials,
        ),
      );
      setState("ready");
    } catch {
      resetCaptcha();
      setError(t(studentCopy.errorGeneral));
      setState("ready");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-2xl border border-secondary-300 bg-secondary-50 p-6 text-center">
        <p className="text-base text-pretty text-ink">{t(studentCopy.linkSent)}</p>
      </div>
    );
  }

  const resetting = mode === "reset";

  /* Switching mode is a real LINK to the same page, not a button. With the
     island alive, `onClick` cancels the navigation and only changes state.
     Without it, the link navigates and the server starts in the requested mode —
     which is the difference between somebody without JavaScript being able to
     recover their password or being locked out for good. */
  const withMode = (reset?: boolean) => {
    const url = new URL(action, "http://x");
    if (reset) url.searchParams.set("reset", "1");
    else url.searchParams.delete("reset");
    return url.pathname + (url.search || "");
  };
  const modeHref = resetting ? withMode() : withMode(true);

  return (
    /* ⚠️ `method="POST"` and `action` are NOT decorative even though this
       component intercepts the submit. While the island hasn't hydrated, the
       browser uses whatever the markup says: without them it did a GET and the
       password ended up IN THE URL. With them, the worst case is a reload that
       works. The server handles this POST in `src/pages/login.astro`. */
    <form
      method="POST"
      action={action}
      onSubmit={onSubmit}
      noValidate
      className="text-left"
    >
      {/* Tells the server which button was pressed when there is no JavaScript. */}
      <input type="hidden" name="mode" value={mode} />
      {next && <input type="hidden" name="next" value={next} />}

      {/* ─── The card's head ─────────────────────────────────────────────────
          It changes with the mode, which is why it lives inside the island. The
          rule underneath separates "what this box is" from "what you do in it",
          and it is the only line in the card that isn't a field. */}
      <h2 className="text-xl font-extrabold text-ink">
        {t(resetting ? studentCopy.forgotTitle : studentCopy.cardTitle)}
      </h2>
      <p className="mt-1.5 text-sm text-pretty text-ink-muted">
        {t(resetting ? studentCopy.forgotText : studentCopy.cardText)}
      </p>

      <div className="mt-5 mb-5 h-px bg-line" />

      <label htmlFor="login-email" className={labelClass}>
        {t(studentCopy.emailLabel)}
      </label>

      <div className="relative mt-2">
        <span aria-hidden="true" className={fieldIcon}>
          {/* Envelope. Same strokes as `sobre` in `Icono.astro`: this island is
              React and can't call an Astro component, so the two are copies on
              purpose. Change one, change the other. */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <rect x="2.8" y="5.2" width="18.4" height="13.6" rx="2.6" />
            <path d="m3.6 7.6 7.2 5a2 2 0 0 0 2.4 0l7.2-5" />
          </svg>
        </span>

        <input
          id="login-email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail((e.target as HTMLInputElement).value);
            setError(null);
          }}
          required
          autoComplete="email"
          inputMode="email"
          placeholder="maria@email.com"
          disabled={state === "working"}
          className={field}
        />
      </div>

      {!resetting && (
        <div className="mt-4">
          <label htmlFor="login-password" className={labelClass}>
            {t(studentCopy.passwordLabel)}
          </label>

          {/* ─── THE EYE TO REVEAL THE PASSWORD ──────────────────────────────
              Same gesture as in `/login/password`, but HERE IT IS DONE WITH
              REACT STATE and not with the delegated listener in `BaseLayout`.

              The reason is concrete: this `<input>` is controlled, so React
              repaints it on every keystroke. An outside script changing the
              DOM's `type` would be fighting the render cycle, and that is the
              class of bug that only shows up sometimes. With `type` derived from
              state, the render and the button always agree.

              `pr-12` reserves the button's slot so a long password doesn't run
              underneath it exactly when it was tapped to be read. */}
          <div className="relative mt-2">
            <span aria-hidden="true" className={fieldIcon}>
              {/* Padlock. Same strokes as `candado` in `Icono.astro`. */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <rect x="4.2" y="10.4" width="15.6" height="9.6" rx="2.6" />
                <path d="M8.2 10.4V7.8a3.8 3.8 0 0 1 7.6 0v2.6" />
              </svg>
            </span>

            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => {
                setPassword((e.target as HTMLInputElement).value);
                setError(null);
              }}
              required
              /* `current-password` so the password manager offers the saved one
                 instead of proposing a new one. */
              autoComplete="current-password"
              disabled={state === "working"}
              className={`${field} pr-12`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-controls="login-password"
              aria-pressed={showPassword}
              aria-label={t(
                showPassword ? studentCopy.password.hide : studentCopy.password.show,
              )}
              className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-ink-subtle transition-colors hover:text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-5"
              >
                {showPassword ? (
                  <>
                    <path d="M2.5 12S6 5.8 12 5.8c1.2 0 2.3.25 3.3.65M20 8.9c.9 1.2 1.5 2.3 1.5 3.1 0 0-3.5 6.2-9.5 6.2-1.4 0-2.7-.34-3.8-.85" />
                    <path d="M9.9 9.9a2.6 2.6 0 0 0 3.7 3.7" />
                    <path d="M3.5 3.5l17 17" />
                  </>
                ) : (
                  <>
                    <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" />
                    <circle cx="12" cy="12" r="2.6" />
                  </>
                )}
              </svg>
            </button>
          </div>

          {/* Under the field and aligned with it: it is the question you ask
              while looking at the password box, so the answer belongs directly
              underneath, where the eye already is. Still a real
              `<a href="?reset=1">` — without JavaScript it navigates and the
              server opens in recovery mode. */}
          <a
            href={modeHref}
            onClick={(e) => {
              e.preventDefault();
              setMode("reset");
              setError(null);
            }}
            className="mt-2 inline-flex min-h-9 items-center text-sm font-semibold text-ink-brand underline underline-offset-4 hover:text-secondary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {t(studentCopy.forgot)}
          </a>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-error-500">
          {error}
        </p>
      )}

      {/* The captcha. Nothing renders at all when it is switched off, so the
          card doesn't keep a hole for a feature that isn't there. */}
      {captchaSiteKey && <div ref={captchaBox} className="mt-5" />}

      {/* ⚠️ TEAL, NOT NAVY, AND IT IS A RULE RATHER THAN A PREFERENCE. The
          project has ONE call-to-action colour (`--color-cta`): if something is
          pressable and primary, it is teal — the header's "Inscribirme al
          curso", the landing forms, and this. */}
      <button
        type="submit"
        disabled={state === "working"}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-cta px-6 text-base font-bold text-ink-inverse shadow-cta transition-colors hover:bg-cta-hover hover:shadow-cta-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-60 disabled:shadow-none"
      >
        {t(
          state === "working"
            ? resetting
              ? studentCopy.sending
              : studentCopy.signingIn
            : resetting
              ? studentCopy.sendLink
              : studentCopy.signIn,
        )}
      </button>

      {/* The way back only exists in recovery mode. Signing in doesn't need a
          link under the button: its way out is the one under the password. */}
      {resetting && (
        <a
          href={modeHref}
          onClick={(e) => {
            e.preventDefault();
            setMode("signin");
            setError(null);
          }}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full text-center text-sm font-semibold text-ink-brand underline underline-offset-4 hover:text-secondary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {t(studentCopy.backToSignIn)}
        </a>
      )}
    </form>
  );
}

export default LoginForm;
