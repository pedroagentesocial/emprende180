import type { APIRoute } from "astro";
import { correoMarca } from "@lib/correo";
import { plantillasCorreo } from "@lib/correoPlantillas";
import type { Idioma } from "@i18n/idioma";

export const prerender = false;

/**
 * GET /dev/correo?tipo=informes|lista|minicurso&lang=es|en&formato=html|text
 *
 * Vista previa de los correos que salen de `/api/lead`, SOLO en desarrollo:
 * en producción responde 404 y no existe. Sirve para mirar la plantilla en
 * el navegador sin mandar un correo de verdad ni tener Resend configurado.
 */
export const GET: APIRoute = ({ url }) => {
  if (!import.meta.env.DEV) return new Response(null, { status: 404 });

  const tipo = url.searchParams.get("tipo") ?? "informes";
  const lang: Idioma = url.searchParams.get("lang") === "en" ? "en" : "es";
  const formato = url.searchParams.get("formato") ?? "html";
  const grupo = plantillasCorreo[tipo as keyof typeof plantillasCorreo];
  if (!grupo) return new Response("tipo desconocido", { status: 400 });

  const plantilla = grupo[lang]("Ana María");
  const correo = correoMarca(plantilla);
  return new Response(formato === "text" ? correo.text : correo.html, {
    headers: {
      "Content-Type": `${formato === "text" ? "text/plain" : "text/html"}; charset=utf-8`,
      "X-Asunto": encodeURIComponent(plantilla.asunto),
    },
  });
};
