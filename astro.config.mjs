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
    webAnalytics: { enabled: true },
    imageService: true,
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
