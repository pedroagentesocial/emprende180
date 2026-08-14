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
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
