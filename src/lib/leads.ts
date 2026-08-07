import type { Lead } from "./schema";

/**
 * Persistencia de leads y punto de enganche del autoresponder.
 *
 * Hoy el lead se guarda en dos sitios, los dos reales y consultables:
 *  · En desarrollo, además, en `.leads.jsonl` en la raíz (ignorado por git),
 *    para poder revisar a mano lo que entra mientras se prueba el formulario.
 *  · En producción, como una línea de log estructurada con el prefijo
 *    `LEAD_CAPTURADO`, filtrable desde `vercel logs`.
 *
 * Esto NO es una base de datos, y no pretende serlo: para el volumen de una
 * landing recién lanzada, el aviso por email + el log es suficiente y no
 * añade una dependencia que mantener. El momento de cambiarlo es cuando
 * quieras segmentar, medir cohortes o recuperar carritos.
 */

export interface LeadGuardado extends Lead {
  ip: string;
  userAgent: string;
  /** ISO 8601. */
  capturadoEn: string;
  /** Referer, si el navegador lo manda. Sirve para atribuir la campaña. */
  referer: string | null;
}

export async function guardarLead(lead: LeadGuardado): Promise<void> {
  const registro = {
    nombre: lead.nombre,
    email: lead.email,
    origen: lead.origen,
    idioma: lead.idioma,
    capturadoEn: lead.capturadoEn,
    ip: lead.ip,
    referer: lead.referer,
    userAgent: lead.userAgent.slice(0, 200),
  };

  // Log estructurado: es lo que se consulta en producción.
  console.log("LEAD_CAPTURADO", JSON.stringify(registro));

  // En local, además, a un fichero para poder mirarlo cómodamente.
  if (import.meta.env.DEV) {
    try {
      const { appendFile } = await import("node:fs/promises");
      await appendFile(".leads.jsonl", JSON.stringify(registro) + "\n", "utf8");
    } catch (error) {
      // Que no se pueda escribir el fichero de desarrollo jamás debe tumbar
      // la captura: el lead ya está en el log y en el email.
      console.warn("[leads] No se pudo escribir .leads.jsonl:", error);
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   PUNTO DE INTEGRACIÓN — SECUENCIA DE NUTRICIÓN (FASE SIGUIENTE)
   ═══════════════════════════════════════════════════════════════════════════

   Preparado, NO conectado. Esta función es el único sitio que hay que tocar
   para enchufar el autoresponder que envía los 7 días del mini-curso.

   Ahora mismo `/api/lead` manda a mano el email de bienvenida (el día 1) vía
   Resend. Los días 2 a 7 los tiene que mandar una herramienta de email
   marketing con secuencias programadas, no este endpoint: aquí no hay cron
   por suscriptor, ni gestión de bajas, ni control de rebotes.

   CUANDO LO MONTES:

     1. Elige la herramienta. Cualquiera de estas sirve y todas tienen API:
        · Resend Audiences  — lo más simple si ya usas Resend para el aviso.
        · ConvertKit / Kit  — pensado justo para secuencias de creadores.
        · MailerLite        — plan gratuito generoso para empezar.
        · Brevo             — si además vas a querer SMS.

     2. Crea la secuencia de 7 correos en la herramienta, con el contenido de
        `leadMagnet.dias` del config. La secuencia se dispara al añadir el
        contacto a la lista/tag.

     3. Añade la clave al entorno (`.env` y Vercel):
          NEWSLETTER_API_KEY=...
          NEWSLETTER_LIST_ID=...

     4. Rellena el cuerpo de `suscribirASecuencia()` con la llamada a la API y
        quita el `return` de arriba. Ejemplo con Resend Audiences:

          await fetch(`https://api.resend.com/audiences/${listId}/contacts`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: lead.email,
              first_name: lead.nombre,
              unsubscribed: false,
            }),
          });

     5. Quita el envío manual del email de bienvenida de `/api/lead`, o el
        lead recibirá el día 1 dos veces.

   IMPORTANTE: esta llamada NO debe poder tumbar la captura. Si la API del
   proveedor falla, el lead ya está guardado y ya te ha llegado el aviso: se
   registra el fallo y se sigue. Perder un lead por un 503 ajeno no es opción.
   ═══════════════════════════════════════════════════════════════════════════ */

export async function suscribirASecuencia(lead: LeadGuardado): Promise<void> {
  // Sin conectar todavía. Ver el bloque de arriba para activarlo.
  void lead;
  return;
}
