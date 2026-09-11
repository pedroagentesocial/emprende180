import { sitio, contacto } from "@config/curso.config";
import type { Idioma } from "@i18n/idioma";

/**
 * The text of the email carrying the access link.
 *
 * It lives in its own file because both paths that send that link use it — the
 * API route and the form POST — and because it is SERVER text: there is no
 * reason for it to travel in the browser bundle, which is what would happen if
 * it lived in `curso.config.ts`.
 */
export const LOGIN_EMAIL = {
  replyTo: contacto.email,

  subject: (lang: Idioma) =>
    lang === "en" ? `Your ${sitio.nombre[lang]} access` : `Tu acceso a ${sitio.nombre[lang]}`,

  body: (lang: Idioma, url: string) =>
    lang === "en"
      ? [
          `Here's your link to set your password and get in:`,
          ``,
          url,
          ``,
          `It expires in 20 minutes and can only be used once.`,
          `If you didn't request it, ignore this email: nothing has changed.`,
          ``,
          `— ${sitio.nombre[lang]}`,
        ].join("\n")
      : [
          `Aquí tienes tu enlace para poner tu contraseña y entrar:`,
          ``,
          url,
          ``,
          `Caduca en 20 minutos y solo se puede usar una vez.`,
          `Si no lo has pedido tú, ignora este correo: no se ha tocado nada.`,
          ``,
          `— ${sitio.nombre[lang]}`,
        ].join("\n"),
} as const;
