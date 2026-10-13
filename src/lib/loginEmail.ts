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

/**
 * El correo del CÓDIGO de acceso.
 *
 * ⚠️ VA APARTE DE `LOGIN_EMAIL` Y NO LO SUSTITUYE. El del enlace sigue
 * existiendo porque /subscribe manda uno al darse de alta: ahí no es un reto de
 * entrada, es la forma de volver más adelante. Este es el de entrar.
 *
 * ⚠️ EL CÓDIGO VA SOLO EN SU RENGLÓN y con espacios entre los dígitos. Un
 * número de seis cifras pegado dentro de una frase se copia mal desde el móvil:
 * el dedo selecciona la frase entera. Suelto y separado se lee de un vistazo y
 * se teclea sin copiar nada.
 *
 * ⚠️ Y DICE QUE CADUCA. Quien abra el correo media hora después tiene que saber
 * por qué no le funciona, en vez de pensar que el código está mal escrito.
 */
export const CODE_EMAIL = {
  replyTo: contacto.email,

  subject: (lang: Idioma) =>
    lang === "en"
      ? `Your ${sitio.nombre[lang]} code`
      : `Tu código de ${sitio.nombre[lang]}`,

  body: (lang: Idioma, codigo: string) =>
    lang === "en"
      ? [
          `Here's your code to sign in:`,
          ``,
          codigo.split("").join(" "),
          ``,
          `It expires in 10 minutes and can only be used once.`,
          `If you didn't request it, ignore this email: nothing has changed.`,
          ``,
          `— ${sitio.nombre[lang]}`,
        ].join("\n")
      : [
          `Aquí tienes tu código para entrar:`,
          ``,
          codigo.split("").join(" "),
          ``,
          `Caduca en 10 minutos y solo se puede usar una vez.`,
          `Si no lo has pedido, ignora este correo: no ha cambiado nada.`,
          ``,
          `— ${sitio.nombre[lang]}`,
        ].join("\n"),
};
