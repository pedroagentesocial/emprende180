import { z } from "zod";
import type { Idioma } from "@i18n/idioma";

/**
 * Validación compartida cliente ↔ servidor.
 *
 * El mismo esquema valida en el navegador (feedback inmediato, sin ida y
 * vuelta) y en `/api/lead` (el navegador nunca es de fiar). Una sola
 * definición: si cambia una regla, cambia en los dos sitios a la vez.
 */

/** Campo trampa. Un bot rellena todo lo que encuentra; una persona no lo ve. */
export const HONEYPOT_FIELD = "empresa_web";

/** Nombre del campo con el instante de renderizado, para detectar envíos instantáneos. */
export const TIMESTAMP_FIELD = "ts";

/** Un humano no rellena y envía un formulario en menos de esto. */
export const MIN_MS_RELLENO = 2500;

export const ORIGENES = [
  "hero",
  "lead-magnet",
  "cierre",
  "modal",
  "footer",
] as const;

/**
 * Mensajes de validación, por idioma.
 *
 * Van aquí y no en `curso.config.ts` porque son parte del contrato del
 * esquema: si un mensaje cambia hay que verlo al lado de la regla que lo
 * produce. Un error de formulario en el idioma equivocado es de los fallos que
 * peor sientan, porque llega justo cuando la persona ya se estaba esforzando.
 */
const MENSAJES: Record<Idioma, Record<string, string>> = {
  es: {
    nombreCorto: "Escribe tu nombre",
    nombreLargo: "Ese nombre es demasiado largo",
    nombreEnlace: "Escribe tu nombre, no un enlace",
    emailVacio: "Necesitamos tu email para enviarte el mini-curso",
    emailLargo: "Ese email es demasiado largo",
    emailInvalido: "Revisa el email: parece que falta algo",
    consentimiento: "Necesitamos tu permiso para escribirte",
    revisaDatos: "Revisa los datos del formulario.",
    peticionMala: "Petición mal formada.",
    demasiadosIntentos: "Demasiados intentos. Espera un momento y vuelve a probar.",
    noRegistrado: "No pudimos registrarte. Escríbenos a {email} y lo resolvemos.",
  },
  en: {
    nombreCorto: "Enter your name",
    nombreLargo: "That name is too long",
    nombreEnlace: "Enter your name, not a link",
    emailVacio: "We need your email to send you the mini-course",
    emailLargo: "That email is too long",
    emailInvalido: "Check the email, something looks off",
    consentimiento: "We need your permission to email you",
    revisaDatos: "Check the form fields.",
    peticionMala: "Malformed request.",
    demasiadosIntentos: "Too many attempts. Give it a moment and try again.",
    noRegistrado: "We couldn't sign you up. Email us at {email} and we'll sort it out.",
  },
};

export const mensaje = (lang: Idioma, clave: string) =>
  MENSAJES[lang][clave] ?? MENSAJES.es[clave] ?? clave;

/**
 * El esquema es una FÁBRICA porque los mensajes dependen del idioma.
 * El cliente la llama con el idioma activo; el servidor, con el que venga en
 * el propio envío (ver `idiomaDelPayload`).
 */
export const crearLeadSchema = (lang: Idioma = "es") => {
  const m = (k: string) => mensaje(lang, k);
  return z.object({
  nombre: z
    .string()
    .trim()
    .min(2, m("nombreCorto"))
    .max(80, m("nombreLargo"))
    // Sin URLs: es el patrón de spam más común en campos de nombre.
    .refine((v) => !/https?:\/\/|www\./i.test(v), "Escribe tu nombre, no un enlace"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, m("emailVacio"))
    .max(254, m("emailLargo"))
    .email(m("emailInvalido")),

  /** Qué formulario de la página generó el lead. Para saber cuál convierte. */
  origen: z.enum(ORIGENES).default("lead-magnet"),

  /** Consentimiento explícito. Obligatorio (RGPD). */
  consentimiento: z
    .boolean()
    .refine((v) => v === true, m("consentimiento")),

  /**
   * Honeypot. Debe llegar vacío; si trae algo, es un bot.
   *
   * A propósito NO se valida como "máximo 0 caracteres": eso devolvería un 400
   * con un error sobre un campo que la persona no puede ver y, peor, le diría
   * al bot que ha sido detectado. La decisión se toma en `/api/lead`, que
   * responde 200 como si todo hubiera ido bien.
   */
  [HONEYPOT_FIELD]: z.string().optional(),

  /**
   * Milisegundos desde que se pintó el formulario. Mismo criterio que el
   * honeypot: se acepta cualquier valor aquí y se decide en el endpoint.
   */
  [TIMESTAMP_FIELD]: z.number().int().nonnegative().optional(),

  /**
   * Idioma en el que la persona rellenó el formulario. Determina en qué
   * idioma se le manda el email de bienvenida: recibirlo en otro idioma es
   * la forma más rápida de que lo marque como spam.
   */
    idioma: z.enum(["es", "en"]).default("es"),
  });
};

/** Esquema por defecto, en español. Para tipos y para usos sin idioma. */
export const leadSchema = crearLeadSchema("es");

/**
 * Lee el idioma de un payload sin validar nada más.
 * Solo decide en qué idioma se redactan los mensajes de error, así que un
 * valor manipulado no tiene ningún efecto de seguridad.
 */
export function idiomaDelPayload(payload: unknown): Idioma {
  const v = (payload as { idioma?: unknown } | null)?.idioma;
  return v === "en" ? "en" : "es";
}

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

/** Campos que el formulario puede pintar en rojo. */
export type CampoLead = "nombre" | "email" | "consentimiento";

/** Orden de foco al fallar la validación: se enfoca el primero que tenga error. */
export const ORDEN_CAMPOS: CampoLead[] = ["nombre", "email", "consentimiento"];

export interface LeadResponse {
  ok: boolean;
  mensaje: string;
  /** Errores por campo, para pintarlos junto al input correspondiente. */
  errores?: Partial<Record<CampoLead, string>>;
  /** Segundos que faltan para poder reintentar. Solo en respuestas 429. */
  reintentarEn?: number;
}

/** Aplana los errores de zod al formato que espera el formulario. */
export function formatearErrores(
  error: z.ZodError,
): Partial<Record<CampoLead, string>> {
  const salida: Partial<Record<CampoLead, string>> = {};
  for (const issue of error.issues) {
    const campo = issue.path[0];
    if (
      typeof campo === "string" &&
      ORDEN_CAMPOS.includes(campo as CampoLead) &&
      !salida[campo as CampoLead]
    ) {
      salida[campo as CampoLead] = issue.message;
    }
  }
  return salida;
}
