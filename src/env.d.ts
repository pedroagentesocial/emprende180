/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Server-only. Resend key, used to send email. */
  readonly RESEND_API_KEY: string;
  /** Server-only. Recipient of the new-lead notification. */
  readonly NOTIFY_EMAIL_TO: string;
  /** Server-only. Sender address, verified in Resend. */
  readonly NOTIFY_EMAIL_FROM: string;
  /**
   * Server-only. GoHighLevel "Inbound Webhook". Every captured lead is sent
   * there as well as by notification email. Empty → nobody is called.
   * ⚠️ If it is switched on, the privacy notice has to name GoHighLevel as a
   * data processor: it receives identifiable data.
   */
  readonly GHL_WEBHOOK_URL: string;
  /** Public. GA4 measurement ID. Empty → no analytics. */
  readonly PUBLIC_GA4_ID: string;
  /**
   * Server-only. Postgres for the student area. Any provider will do.
   * Without it: in development the area runs in memory; in production it fails
   * at startup, on purpose.
   */
  readonly DATABASE_URL: string;
  /**
   * Server-only. Comma-separated emails that get in as admin.
   * Solves the first-administrator chicken and egg: they cannot register from a
   * panel that nobody can get into yet.
   */
  readonly ADMIN_EMAILS: string;
  /**
   * Development only. Fixed password for the seeded admins when there is no
   * database. See the note in `src/lib/data.ts`: it cannot run in production,
   * because production without `DATABASE_URL` refuses to start.
   */
  readonly DEMO_CLAVE: string;
  /**
   * Cloudflare Turnstile. BOTH or neither: with only one of them the captcha
   * stays off on purpose. See `src/lib/captcha.ts`.
   */
  readonly TURNSTILE_SITE_KEY: string;
  readonly TURNSTILE_SECRET_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


declare global {
  /**
   * What the middleware leaves resolved for the protected pages.
   *
   * ⚠️ It goes INSIDE `declare global`. This file has an `export {}` at the end,
   * so it is a module: a loose `declare namespace App` would stay inside the
   * module and `Astro.locals.student` wouldn't exist for the rest of the
   * project. Four type errors, no more and no less.
   */
  namespace App {
    interface Locals {
      /** Set by `src/middleware.ts` on the `/student` and `/admin` routes. */
      student?: import("@lib/data").Student;
    }
  }

  interface Window {
    /** Injected by GA4. It may not exist: check before calling it. */
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    /**
     * Injected by Cloudflare Turnstile, and only on `/login` and only when the
     * captcha is switched on. Always check before calling: on every other page,
     * and with the captcha off, this is `undefined`.
     */
    turnstile?: {
      render(
        element: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ): string;
      reset(widgetId?: string): void;
    };
  }
}

export {};
