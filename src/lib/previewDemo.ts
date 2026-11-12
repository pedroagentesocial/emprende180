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
/* ⚠️ CADA VARIABLE SE NOMBRA ENTERA (`import.meta.env.X`). El compilador solo
   sustituye las que se escriben así; leídas con un índice (`env[k]`) llegaban
   vacías al build de Vercel y el modo no se encendía. El `process.env` de
   respaldo es el de la función, en tiempo de ejecución. Con `||` y no
   `??`: el build deja la variable que no conoce como texto VACÍO, y `??`
   no salta al respaldo con un texto vacío. */
const run = (k: string): string | undefined => globalThis.process?.env?.[k];
const flag = run("PREVIEW_DEMO") || import.meta.env.PREVIEW_DEMO;
const target = run("VERCEL_ENV") || import.meta.env.VERCEL_ENV;
const branch = run("VERCEL_GIT_COMMIT_REF") || import.meta.env.VERCEL_GIT_COMMIT_REF;

export const PREVIEW_DEMO: boolean = flag === "1" && target === "preview" && branch !== "main";

if (flag === "1" && !PREVIEW_DEMO) {
  /* Solo booleanos: ningún valor de variable va al log. */
  console.warn(`[previewDemo] PREVIEW_DEMO=1 pero no se enciende: preview=${target === "preview"} rama-no-main=${branch !== "main"}`);
}

/** El código de seis dígitos de las cuentas de ejemplo. */
export const DEMO_CODE = "123456";

/** La cuenta de admin del preview: un correo de ejemplo, no el de nadie. */
export const DEMO_ADMIN_EMAIL = "admin@demo.emprende180.com";

/** ¿Se usa el código fijo? En `astro dev` y en el modo demo. */
export const FIXED_CODE: boolean = Boolean(import.meta.env.DEV) || PREVIEW_DEMO;

/** Diagnóstico (solo verdadero / falso, ningún valor) para la cabecera del login fuera de producción. */
export const DEMO_DIAG = `build:${import.meta.env.PREVIEW_DEMO === "1"} run:${run("PREVIEW_DEMO") === "1"} preview:${target === "preview"} notMain:${branch !== "main"} branchKnown:${!!branch} on:${PREVIEW_DEMO} buildType:${typeof import.meta.env.PREVIEW_DEMO}`;
export const IS_PRODUCTION = target === "production";
