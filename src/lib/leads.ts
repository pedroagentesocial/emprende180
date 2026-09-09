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
  /**
   * El código que escribió, tal cual, y el cupón si resultó válido.
   *
   * ⚠️ SE GUARDAN LOS DOS. Lo escrito, porque quien llame tiene que ver qué le
   * dijeron aunque el código estuviera mal copiado; lo válido, porque es lo
   * único con lo que se puede prometer un precio. Guardar solo el segundo
   * borraría la pista de una errata que igual hay que honrar.
   */
  cuponEscrito: string | null;
  cuponValido: { codigo: string; descuento: string } | null;
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
    cupon: lead.cuponEscrito,
    cuponValido: lead.cuponValido?.codigo ?? null,
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

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * WEBHOOK — el lead entra en GoHighLevel
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `GHL_WEBHOOK_URL` es la URL de un "Inbound Webhook" de GHL. Sin ella, esto no
 * hace nada y la captura sigue funcionando igual: el correo de aviso y el log
 * son independientes de esto.
 *
 * ⚠️ ESTO NO PUEDE TUMBAR LA CAPTURA, NUNCA. Cuando se llama, el lead YA está
 * guardado y el aviso ya ha salido. Si GHL devuelve un 500, o tarda, o cambia
 * la URL sin avisar, lo que no puede pasar es que la persona que acaba de dejar
 * su correo vea un error: se registra el fallo y se sigue. Perder un lead por
 * un problema ajeno no es una opción.
 *
 * ⚠️ Y POR ESO HAY UN `AbortSignal.timeout`. Sin él, un webhook que no responde
 * deja la función serverless colgada hasta que la mata la plataforma, y el
 * visitante mirando una rueda que gira. Ocho segundos y a otra cosa.
 *
 * ⚠️ LO QUE VIAJA AQUÍ ES UN DATO PERSONAL. Nombre, correo, IP y de dónde vino.
 * Si esto se activa, el aviso de privacidad tiene que nombrar a GoHighLevel
 * como encargado del tratamiento: es un tercero que recibe datos identificables
 * y hay que declararlo.
 *
 * Los nombres de campo son los que GHL reconoce de serie (`first_name`, `email`,
 * `tags`…): así el lead entra ya mapeado en vez de aparecer como un objeto
 * suelto que hay que casar a mano en cada automatización.
 */
export async function enviarAWebhook(lead: LeadGuardado): Promise<void> {
  const url = import.meta.env.GHL_WEBHOOK_URL;
  if (!url) return;

  /* El nombre llega en un solo campo, y GHL espera nombre y apellido por
     separado. Se parte por el primer espacio: quien escribe "María" se queda
     sin apellido, que es correcto, y quien escribe "María López Pérez" tiene
     "López Pérez" de apellido, que también. */
  const [nombre, ...resto] = lead.nombre.trim().split(/\s+/);

  const cuerpo = {
    first_name: nombre ?? lead.nombre,
    last_name: resto.join(" ") || undefined,
    name: lead.nombre,
    email: lead.email,
    /* Opcionales los dos: solo los pide el formulario de informes. Van sin
       normalizar; el teléfono se guarda tal cual lo escribió la persona. */
    phone: lead.telefono || undefined,
    /* De dónde salió, para poder medir qué formulario de la página convierte
       sin tener que mirar el referer a mano. */
    source: `emprende180.com · ${lead.origen}`,
    tags: [
      "emprende180",
      /* ⚠️ LA ETIQUETA DICE A QUÉ SE APUNTÓ, Y NO TODOS SE APUNTAN A LO MISMO.
         Esta línea es la que decide qué automatización de GHL se dispara, así
         que una etiqueta de más aquí son correos que nadie pidió:

           informes ......... preguntó el precio, lo llama una persona.
           guías y lista .... quiere los artículos cuando salgan. NO entran en
                              la secuencia de siete correos: la casilla que
                              marcaron habla de las guías, no del mini-curso, y
                              el permiso vale para lo que dice y para nada más.
           el resto ......... el mini-curso, que es lo que se les ofreció. */
      lead.origen === "informes"
        ? "quiere-empezar"
        : lead.origen === "guias" || lead.origen === "lista"
          ? "lista-articulos"
          : "mini-curso-7-dias",
      `origen:${lead.origen}`,
      /* Una etiqueta con el cupón: en GHL se puede segmentar y automatizar por
         etiqueta, que es como se trabaja allí. */
      ...(lead.cuponValido ? [`cupon:${lead.cuponValido.codigo}`] : []),
    ],
    /* Campos propios. GHL los recoge como custom fields. */
    idioma: lead.idioma,
    referer: lead.referer ?? "directo",
    capturado_en: lead.capturadoEn,
    /* La IP y el momento son la prueba del consentimiento. Si algún día alguien
       reclama que nunca se apuntó, esto es lo que lo responde. */
    ip_consentimiento: lead.ip,
    /* El cupón viaja a GHL para que aparezca en la ficha del contacto: quien
       llame ve el precio prometido sin salir del CRM. */
    cupon: lead.cuponValido?.codigo ?? lead.cuponEscrito ?? undefined,
    cupon_descuento: lead.cuponValido?.descuento ?? undefined,
    cupon_valido: lead.cuponEscrito ? !!lead.cuponValido : undefined,
    /* Quién le recomendó. En el formulario de informes es lo que decide su
       precio, así que tiene que llegar a la ficha del contacto: quien llame
       lo ve sin salir del CRM. */
    recomendado_por: lead.recomendadoPor || undefined,
  };

  try {
    const respuesta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
      signal: AbortSignal.timeout(8000),
    });

    if (!respuesta.ok) {
      /* El cuerpo de la respuesta se recorta: un error de GHL puede devolver
         una página HTML entera y no hace falta llenar el log con ella. */
      const texto = (await respuesta.text().catch(() => "")).slice(0, 300);
      console.error(
        `[leads] El webhook de GHL respondió ${respuesta.status}: ${texto}`,
      );
    }
  } catch (error) {
    console.error("[leads] No se pudo llamar al webhook de GHL:", error);
  }
}
