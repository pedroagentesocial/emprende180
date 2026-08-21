import { sitio, contacto } from "@config/curso.config";
import type { Idioma } from "@i18n/idioma";

/**
 * El texto del correo con el enlace de acceso.
 *
 * Está en su propio archivo porque lo usan los dos caminos que mandan ese
 * enlace —la ruta de API y el POST del formulario— y porque es texto de
 * SERVIDOR: no tiene por qué viajar en el bundle del navegador como haría si
 * viviera en `curso.config.ts`.
 */
export const CORREO_ACCESO = {
  responderA: contacto.email,

  asunto: (lang: Idioma) =>
    lang === "en" ? `Your ${sitio.nombre} access` : `Tu acceso a ${sitio.nombre}`,

  cuerpo: (lang: Idioma, url: string) =>
    lang === "en"
      ? [
          `Here's your link to set your password and get in:`,
          ``,
          url,
          ``,
          `It expires in 20 minutes and can only be used once.`,
          `If you didn't request it, ignore this email: nothing has changed.`,
          ``,
          `— ${sitio.nombre}`,
        ].join("\n")
      : [
          `Aquí tienes tu enlace para poner tu contraseña y entrar:`,
          ``,
          url,
          ``,
          `Caduca en 20 minutos y solo se puede usar una vez.`,
          `Si no lo has pedido tú, ignora este correo: no se ha tocado nada.`,
          ``,
          `— ${sitio.nombre}`,
        ].join("\n"),
} as const;
