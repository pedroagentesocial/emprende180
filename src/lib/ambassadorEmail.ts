import { correoMarca } from "@lib/correo";
import { PREVIEW_DEMO } from "@lib/previewDemo";
import { sitio } from "@config/curso.config";
import type { Student } from "@lib/data";
import type { StoredFact } from "@lib/ambassadors";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EL AVISO AL EMBAJADOR: "tienes una nueva compra"
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Lo pide el ticket de reparto de comisiones: cuando un cliente compra con su
 * código, el Embajador recibe un correo.
 *
 * ⚠️ EL CORREO NO LLEVA EL NOMBRE DEL CLIENTE NI EL IMPORTE. Una bandeja de
 * entrada se ve en la pantalla de bloqueo, se reenvía y se queda años; y en un
 * negocio médico, "Ana compró una membresía en Lira" es información protegida.
 * El correo dice en qué negocio y lleva al portal, que es donde se ve todo con
 * sesión iniciada.
 *
 * Sin `RESEND_API_KEY` (desarrollo) se escribe en la consola, como el resto de
 * correos del proyecto. Cinco segundos de plazo: un Resend que no contesta no
 * deja colgado el webhook que nos manda el hecho.
 */

const COPY = {
  es: {
    subject: (b: string) => `Tienes una nueva compra en ${b}`,
    visit: (b: string) => `Uno de tus referidos asistió a su cita en ${b}`,
    hello: (n: string) => `Hola ${n}:`,
    body: [
      "Alguien que llegó con tu código acaba de hacerlo. La comisión queda en espera 15 días y, si no hay reembolso, pasa a lista para cobrar.",
      "Entra a tu portal para ver quién fue y cuándo se te paga.",
    ],
    cta: "Ver mis referidos",
    why: "Recibes este correo porque eres Embajador de Emprende180.",
  },
  en: {
    subject: (b: string) => `You have a new purchase at ${b}`,
    visit: (b: string) => `One of your referrals attended their visit at ${b}`,
    hello: (n: string) => `Hi ${n},`,
    body: [
      "Someone who came with your code just did. The commission is on hold for 15 days and, if there is no refund, it becomes ready to collect.",
      "Open your portal to see who it was and when you get paid.",
    ],
    cta: "See my referrals",
    why: "You get this email because you are an Entrepreneur180 Ambassador.",
  },
} as const;

export async function notifyNewSale(
  ambassador: Student,
  fact: StoredFact,
  businessName: string,
): Promise<void> {
  const lang = ambassador.language;
  const c = COPY[lang];
  const subject = fact.type === "attended" ? c.visit(businessName) : c.subject(businessName);

  const apiKey = import.meta.env.RESEND_API_KEY;
  const from = import.meta.env.NOTIFY_EMAIL_FROM;
  if (!apiKey || !from || PREVIEW_DEMO) {
    console.warn(`[ambassadorEmail] MODO DEMO, sin RESEND_API_KEY. Para ${ambassador.email}: ${subject}`);
    return;
  }

  const mail = correoMarca({
    lang,
    asunto: subject,
    saludo: c.hello(ambassador.name ?? ambassador.email),
    parrafos: [...c.body],
    cta: { texto: c.cta, url: new URL("/student/ambassador/referrals", sitio.url).href },
    porQue: c.why,
  });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [ambassador.email], subject, html: mail.html, text: mail.text }),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) {
    console.error("[ambassadorEmail] Resend rechazó el aviso:", await response.text());
  }
}
