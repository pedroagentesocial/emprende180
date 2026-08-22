// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

// SWAP: dominio de producción cuando se conecte el dominio propio en Vercel.
const SITE_URL = "https://emprende180.vercel.app";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  output: "server",

  /**
   * ⚠️ SIN ESTO, `Astro.url` EN PRODUCCIÓN ES `https://localhost`. No es una
   * exageración: está comprobado contra el despliegue real.
   *
   * Desde Astro 5.14, si no se declara esta lista el framework NO se fía de la
   * cabecera `X-Forwarded-Host` (bien, evita ataques de host injection) pero
   * TAMPOCO del `Host` normal, y se queda con `localhost` como último recurso.
   * Detrás del proxy de Vercel, que es donde vive esto, esas dos cabeceras son
   * la única forma de saber por qué dominio ha entrado alguien.
   *
   * Lo que rompía, y por eso esto no es cosmético:
   *
   *  1. EL ENLACE DE ACCESO POR CORREO. Se construye con `new URL("/login/verify",
   *     Astro.url)`, así que cada enlace enviado desde producción habría salido
   *     como `https://localhost/login/verify?t=…`: inservible para todo el
   *     mundo. Se habría descubierto el día de encender Resend, pareciendo un
   *     problema del correo.
   *  2. LA COMPROBACIÓN DE ORIGEN de los POST, la nuestra y la de Astro. Un
   *     navegador que no manda `Sec-Fetch-Site` (Safari viejo, los navegadores
   *     dentro de Instagram o Facebook) caía al plan B, comparar `Origin` con
   *     `Astro.url.origin`, y `https://emprende180.vercel.app` nunca es igual a
   *     `https://localhost`. Resultado: 403 al enviar el formulario de la
   *     landing. Comprobado en producción: 403 con `Origin`, 403 con `Referer`.
   *
   * Los patrones son restrictivos a propósito: solo el dominio del proyecto y
   * sus despliegues. `**.vercel.app` a secas se fiaría del `.vercel.app` de
   * cualquiera.
   */
  security: {
    allowedDomains: [
      { hostname: "emprende180.vercel.app", protocol: "https" },
      { hostname: "emprende180-git-main-pedroagentesocials-projects.vercel.app", protocol: "https" },
      /* SWAP: el dominio propio, en cuanto se conecte. Dejarlo puesto desde ya
         no abre nada: mientras el DNS no apunte aquí, nadie entra por él. */
      { hostname: "emprende180.com", protocol: "https" },
      { hostname: "**.emprende180.com", protocol: "https" },
    ],
  },

  adapter: vercel({
    /**
     * Vercel Web Analytics, desactivado.
     *
     * Con `enabled: true` el adaptador inyecta `/_vercel/insights/script.js`,
     * pero si la función no está activada en el proyecto ese script da 404 en
     * cada visita: un error de consola en producción y un punto menos en
     * Lighthouse, a cambio de nada.
     *
     * Para activarlo: enciéndelo primero en Vercel (Project → Analytics) y
     * luego pon esto en `true`. Es cookieless, así que no necesita pasar por
     * el banner de consentimiento como sí hace GA4.
     */
    webAnalytics: { enabled: false },
    imageService: true,
  }),
  /**
   * El idioma vive en `?lang=`, no en el path: la página se sirve con los dos
   * idiomas dentro y se cambia con un atributo (ver src/i18n/idioma.ts). Por eso
   * `/en` nunca ha existido como ruta.
   *
   * Pero es la URL que cualquiera escribe a mano para ver la versión en inglés,
   * y hasta ahora daba un 404. Estos redirects la recogen y la mandan a la URL
   * buena, en vez de dejar al visitante en una página de error.
   */
  redirects: {
    "/en": "/?lang=en",
    "/es": "/?lang=es",

    /**
     * ⚠️ LAS URLs VIEJAS DEL ÁREA DE ALUMNOS (`/acceso`, `/alumno`…) NO ESTÁN
     * AQUÍ, Y ES A PROPÓSITO. Estas redirecciones PIERDEN la query: probado,
     * `/acceso/entrar?t=abc` acaba en `/login/verify` sin el token, que es
     * exactamente el enlace de correo que había que salvar. Se resuelven en
     * `src/middleware.ts`, que sí puede arrastrar `?t=`.
     */
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
