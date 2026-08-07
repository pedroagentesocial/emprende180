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
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
