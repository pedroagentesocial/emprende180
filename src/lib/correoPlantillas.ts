import { leadMagnet, sitio } from "@config/curso.config";
import type { CorreoMarca } from "@lib/correo";
import type { Idioma } from "@i18n/idioma";

/**
 * ─── LOS CORREOS QUE RECIBE LA PERSONA ─────────────────────────────────────
 *
 * Tres, y cuál le llega DEPENDE DE LO QUE PIDIÓ. Los tres visten la misma
 * plantilla de marca (`@lib/correo`: logotipo, tarjeta, botón, firma y pie con
 * la dirección) y salen en HTML y en texto plano a la vez. Están aquí y no en
 * `curso.config.ts` porque son texto de servidor: nunca llegan al navegador.
 *
 * Van en el idioma en que la persona rellenó el formulario: recibir el correo
 * en otro idioma es la forma más rápida de que lo marquen como spam.
 *
 *   informes   — quien pulsó "Comenzar el Día 1" y dejó sus datos para que le
 *                escriban. Hasta el 16-09-2026 NO recibía nada automático (la
 *                idea era que le escribiera una persona y punto); el cliente
 *                pidió una bienvenida en regla, así que ahora recibe un acuse
 *                que dice qué va a pasar —le escribe alguien del equipo— y qué
 *                es esto, sin meterlo en ninguna secuencia.
 *   lista      — quien se apuntó a las guías o a la lista. Un acuse sin
 *                cadencia prometida: sale cuando hay algo escrito.
 *   minicurso  — la bienvenida del reto de 7 días. TODO: desaparece de aquí
 *                cuando la secuencia del autoresponder esté conectada, o el
 *                lead recibirá el día 1 dos veces.
 *
 * ⚠️ SIN "UN SOLO PAGO" NI CUOTAS. El cliente lo quitó de toda la web el
 * 16-09-2026; lo que se dice del programa es lo mismo que dice el hero: 90
 * días, 2 horas al día, sin inversión inicial.
 */
export type Plantilla = (nombre: string) => CorreoMarca;

const ACUSE_INFORMES: Record<Idioma, Plantilla> = {
  es: (n) => ({
    lang: "es",
    asunto: `${n}, recibimos tu solicitud`,
    preheader:
      "Ya tenemos tus datos. Te escribe alguien del equipo, en persona.",
    saludo: `Hola, ${n}:`,
    parrafos: [
      "Gracias por dar el primer paso. Ya tenemos tus datos y en breve te escribe alguien del equipo, en persona, para contarte cómo se entra en Emprende180 y resolver lo que quieras preguntar.",
      "Mientras tanto, esto es lo que hay detrás: un programa de 90 días para construir un negocio propio con método, constancia y acompañamiento real. Solo 2 horas al día. Sin inversión inicial.",
      "Si prefieres adelantarte, responde a este correo y cuéntanos desde dónde nos escribes y qué te gustaría saber.",
    ],
    cta: { texto: "Ver cómo funciona", url: `${sitio.url}/programs` },
    porQue:
      "Recibes este correo porque dejaste tu nombre y tu correo en emprende180.com pidiendo información. Si no fuiste tú, ignóralo: no te volveremos a escribir.",
  }),
  en: (n) => ({
    lang: "en",
    asunto: `${n}, we got your request`,
    preheader:
      "We have your details. Someone from the team will write to you personally.",
    saludo: `Hi ${n},`,
    parrafos: [
      "Thanks for taking the first step. We have your details, and someone from the team will write to you personally soon to explain how to join Entrepreneur180 and answer anything you want to ask.",
      "In the meantime, here is what is behind it: a 90-day program to build a business of your own, with method, consistency and real support. Just 2 hours a day. No upfront investment.",
      "If you would rather get ahead, reply to this email and tell us where you are writing from and what you would like to know.",
    ],
    cta: { texto: "See how it works", url: `${sitio.url}/programs` },
    porQue:
      "You are receiving this email because you left your name and email on emprende180.com asking for information. If that was not you, ignore it: we will not write again.",
  }),
};

const CONFIRMACION_LISTA: Record<Idioma, Plantilla> = {
  es: (n) => ({
    lang: "es",
    asunto: `${n}, ya estás en la lista`,
    preheader: "La próxima guía que escriba te llega a ti.",
    saludo: `Hola, ${n}:`,
    parrafos: [
      "Apuntado. La próxima guía que escriba te llega a ti.",
      "No hay más correos que ese: ni ofertas, ni una serie de siete días. Te das de baja cuando quieras, desde cualquiera de ellos.",
      "Si quieres preguntar algo, responde aquí mismo.",
    ],
    cta: { texto: "Leer lo publicado", url: `${sitio.url}/resources` },
    porQue:
      "Recibes este correo porque te apuntaste a las guías en emprende180.com. Si no fuiste tú, ignóralo y no te volveremos a escribir.",
  }),
  en: (n) => ({
    lang: "en",
    asunto: `${n}, you're on the list`,
    preheader: "The next guide I write goes to you.",
    saludo: `Hi ${n},`,
    parrafos: [
      "You're in. The next guide I write goes to you.",
      "That's the only email you'll get: no offers, no seven-day series. Unsubscribe whenever you like, from any of them.",
      "If you want to ask something, just hit reply.",
    ],
    cta: { texto: "Read what's published", url: `${sitio.url}/resources` },
    porQue:
      "You are receiving this email because you signed up for the guides on emprende180.com. If that was not you, ignore it and we will not write again.",
  }),
};

const BIENVENIDA: Record<Idioma, Plantilla> = {
  es: (n) => ({
    lang: "es",
    asunto: `${n}, empezamos: ${leadMagnet.nombre.es}`,
    saludo: `Hola, ${n}:`,
    parrafos: [
      `Ya estás dentro de "${leadMagnet.nombre.es}".`,
      leadMagnet.promesa.es,
      "Mañana te llega el día 1. Un consejo: mueve este correo a tu bandeja principal para que no se te pierdan los siguientes.",
      "Si tienes cualquier duda, responde aquí mismo.",
    ],
    porQue:
      "Recibes este correo porque te apuntaste al reto gratuito en emprende180.com. Te das de baja cuando quieras, desde cualquiera de los correos.",
  }),
  en: (n) => ({
    lang: "en",
    asunto: `${n}, here we go: ${leadMagnet.nombre.en}`,
    saludo: `Hi ${n},`,
    parrafos: [
      `You're in: "${leadMagnet.nombre.en}".`,
      leadMagnet.promesa.en,
      "Day 1 arrives tomorrow. One tip: drag this email to your primary inbox so the rest don't get buried.",
      "Any questions, just hit reply.",
    ],
    porQue:
      "You are receiving this email because you signed up for the free challenge on emprende180.com. Unsubscribe whenever you like, from any of the emails.",
  }),
};

/** Las tres, por nombre, para la vista previa de /dev/correo. */
export const plantillasCorreo = {
  informes: ACUSE_INFORMES,
  lista: CONFIRMACION_LISTA,
  minicurso: BIENVENIDA,
} as const;

/** Qué plantilla le toca a cada origen del formulario. */
export const plantillaPara = (origen: string): Record<Idioma, Plantilla> =>
  origen === "informes"
    ? ACUSE_INFORMES
    : origen === "guias" || origen === "lista"
      ? CONFIRMACION_LISTA
      : BIENVENIDA;
