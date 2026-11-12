/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EL MODO DEMO DEL PREVIEW (12-11-2026)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Para enseñar una rama en su preview de Vercel sin tocar producción: el
 * preview y producción comparten la misma base de datos, y abrir el panel ahí
 * con el código nuevo cambiaría a los alumnos reales.
 *
 * Con el modo demo, ESE deployment:
 *
 *   · usa los datos de ejemplo EN MEMORIA (los mismos de `astro dev`: Laura,
 *     Marta, sus comisiones...), nunca `DATABASE_URL`;
 *   · entra con el código fijo `DEMO_CODE` en las cuentas de ejemplo;
 *   · no manda ningún correo.
 *
 * ⚠️ SOLO SE ENCIENDE SI SE CUMPLEN LAS TRES:
 *
 *   1. `PREVIEW_DEMO=1` en las variables de Vercel (puesta solo para Preview
 *      y solo para la rama que se enseña),
 *   2. Vercel dice que este deployment es un PREVIEW (`VERCEL_ENV`),
 *   3. y la rama no es `main`.
 *
 * Producción no cumple la 2 nunca, así que aunque alguien copie la variable
 * a Production no pasa nada.
 *
 * Los datos viven en la memoria del servidor: si nadie lo usa un rato, Vercel
 * lo apaga y al volver se empieza de cero (hay que entrar otra vez).
 */
const env = (k: string): string | undefined =>
  (import.meta.env as Record<string, string | undefined>)[k] ?? globalThis.process?.env?.[k];

export const PREVIEW_DEMO: boolean =
  env("PREVIEW_DEMO") === "1" && env("VERCEL_ENV") === "preview" && env("VERCEL_GIT_COMMIT_REF") !== "main";

/** El código de seis dígitos de las cuentas de ejemplo. */
export const DEMO_CODE = "123456";

/** La cuenta de admin del preview: un correo de ejemplo, no el de nadie. */
export const DEMO_ADMIN_EMAIL = "admin@demo.emprende180.com";

/** ¿Se usa el código fijo? En `astro dev` y en el modo demo. */
export const FIXED_CODE: boolean = Boolean(import.meta.env.DEV) || PREVIEW_DEMO;
