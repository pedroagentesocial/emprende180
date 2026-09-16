import type { APIRoute } from "astro";
import {
  crearLeadSchema,
  idiomaDelPayload,
  mensaje,
  formatearErrores,
  HONEYPOT_FIELD,
  TIMESTAMP_FIELD,
  MIN_MS_RELLENO,
  type LeadResponse,
} from "@lib/schema";
import { consume, isRecentDuplicate, clientIp } from "@lib/rateLimit";
import { comprobarCupon, describirCupon } from "@lib/cupones";
import {
  guardarLead,
  suscribirASecuencia,
  enviarAWebhook,
  type LeadGuardado,
} from "@lib/leads";
import { leadMagnet, contacto, sitio } from "@config/curso.config";
import { correoMarca } from "@lib/correo";
import { plantillaPara } from "@lib/correoPlantillas";
import type { Idioma } from "@i18n/idioma";

export const prerender = false;

/**
 * POST /api/lead — captura del mini-curso gratuito.
 *
 * Es el único endpoint de la página y el único objetivo de conversión, así que
 * su trabajo es no perder nunca un lead legítimo y no dejar pasar basura.
 *
 * Orden de las defensas, de la más barata a la más cara:
 *   1. Rate limit por IP        — descarta antes de parsear nada.
 *   2. Validación zod           — el mismo esquema que corrió en el navegador.
 *   3. Honeypot + tiempo mínimo — bots; se responde 200 para no enseñarles nada.
 *   4. Deduplicación por email  — doble envío = idempotente, no error.
 *   5. Guardar                  — pase lo que pase después, el lead ya existe.
 *   6. Avisar + dar bienvenida  — en paralelo, porque el tiempo de respuesta
 *                                 al lead es parte de la conversión.
 */

const json = (body: LeadResponse, status: number, headers?: HeadersInit) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...headers,
    },
  });

/**
 * Respuesta de éxito. Idéntica para humanos y para bots descartados.
 * En el idioma en que se envió el formulario: el navegador ya tiene el texto,
 * pero si el servidor devolviera otro idioma se vería en el mensaje de error.
 */
const exito = (lang: Idioma = "es") =>
  json({ ok: true, mensaje: leadMagnet.exito.titulo[lang] }, 200);

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // ── 1 · Rate limit ────────────────────────────────────────────────────────
  // 10 intentos cada 10 minutos por IP. El número está alto a propósito: detrás
  // de una misma IP pública puede haber una oficina entera o media operadora
  // móvil (CGNAT), y bloquear leads legítimos cuesta más caro que dejar pasar
  // unos cuantos intentos de más. Un script hace cientos, no diez.
  const ip = clientIp(request, clientAddress);
  const limite = consume(`lead:${ip}`, 10, 10 * 60 * 1000);
  /* Idioma provisional para los mensajes de error: el payload aún no está
     validado, pero esto solo decide en qué idioma se redacta el aviso. */
  let lang: Idioma = "es";

  if (!limite.allowed) {
    return json(
      {
        ok: false,
        mensaje: mensaje(lang, "demasiadosIntentos"),
        reintentarEn: limite.retryAfter,
      },
      429,
      { "Retry-After": String(limite.retryAfter) },
    );
  }

  // ── 2 · Validación ────────────────────────────────────────────────────────
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, mensaje: mensaje(lang, "peticionMala") }, 400);
  }

  lang = idiomaDelPayload(payload);
  const resultado = crearLeadSchema(lang).safeParse(payload);
  if (!resultado.success) {
    return json(
      {
        ok: false,
        mensaje: mensaje(lang, "revisaDatos"),
        errores: formatearErrores(resultado.error),
      },
      400,
    );
  }

  const lead = resultado.data;

  // ── 3 · Bots ──────────────────────────────────────────────────────────────
  // Honeypot relleno, o formulario enviado más rápido de lo que un humano
  // tarda en escribir. En ambos casos se responde OK a propósito: si devolvemos
  // un error, el bot reintenta con otra estrategia; si "funciona", se va.
  const relleno = lead[TIMESTAMP_FIELD];
  const demasiadoRapido = relleno !== undefined && relleno < MIN_MS_RELLENO;

  if (lead[HONEYPOT_FIELD] || demasiadoRapido) {
    console.warn(
      `[lead] Descartado (${lead[HONEYPOT_FIELD] ? "honeypot" : "demasiado rápido"}) desde ${ip}`,
    );
    return exito(lead.idioma);
  }

  // ── 4 · Doble envío ───────────────────────────────────────────────────────
  // Mismo email dentro de la ventana → ya está capturado. No se vuelve a
  // guardar ni se reenvían correos, pero el usuario ve éxito: para él la
  // operación salió bien las dos veces.
  if (isRecentDuplicate(lead.email)) {
    console.log(`[lead] Envío duplicado ignorado: ${lead.email}`);
    return exito(lead.idioma);
  }

  // ── 5 · Guardar ───────────────────────────────────────────────────────────
  // Primero persistir. Si Resend falla después, el lead NO se pierde.
  /* El cupón, comprobado contra la tabla. Nunca lanza y nunca bloquea: ver
     `src/lib/cupones.ts`. Va con `await` —y no como los webhooks— porque su
     resultado tiene que viajar dentro del aviso y del payload de GHL. */
  const cupon = await comprobarCupon(lead.cupon);

  const guardado: LeadGuardado = {
    ...lead,
    ip,
    userAgent: request.headers.get("user-agent") ?? "desconocido",
    referer: request.headers.get("referer"),
    capturadoEn: new Date().toISOString(),
    cuponEscrito: cupon?.escrito ?? null,
    cuponValido: cupon?.valido
      ? { codigo: cupon.valido.code, descuento: describirCupon(cupon.valido) }
      : null,
  };

  try {
    await guardarLead(guardado);
  } catch (error) {
    console.error("[lead] Fallo al guardar:", error);
    return json(
      {
        ok: false,
        mensaje: mensaje(lang, "noRegistrado").replace(
          "{email}",
          contacto.email,
        ),
      },
      500,
    );
  }

  // Enganche del autoresponder. Preparado, sin conectar (ver src/lib/leads.ts).
  // Nunca puede tumbar la captura: se registra el fallo y se sigue.
  suscribirASecuencia(guardado).catch((error) =>
    console.error("[lead] Fallo al suscribir a la secuencia:", error),
  );

  /* El lead entra en GoHighLevel. Va SIN `await` a propósito: la respuesta al
     visitante no tiene por qué esperar a que conteste un servidor ajeno, y el
     lead ya está guardado pase lo que pase con el webhook. Si no hay
     `GHL_WEBHOOK_URL`, no hace nada. Ver `enviarAWebhook`. */
  enviarAWebhook(guardado).catch((error) =>
    console.error("[lead] Fallo al llamar al webhook:", error),
  );

  // ── 6 · Notificar ─────────────────────────────────────────────────────────

  /* Los dos formularios que reparten los artículos del blog. Se tratan igual
     entre ellos y distinto del resto: ni entran en el mini-curso ni los llama
     nadie. Ver `CONFIRMACION_LISTA`. */
  const esLista = lead.origen === "guias" || lead.origen === "lista";

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.NOTIFY_EMAIL_TO;
  const from = import.meta.env.NOTIFY_EMAIL_FROM;

  // Modo demo: sin credenciales el formulario sigue siendo plenamente usable.
  // El lead ya está guardado y logueado; solo no salen los correos.
  if (!apiKey || !to || !from) {
    console.warn(
      "[lead] MODO DEMO — sin RESEND_API_KEY / NOTIFY_EMAIL_TO / NOTIFY_EMAIL_FROM. " +
        "Lead guardado, emails NO enviados.",
    );
    return exito(lead.idioma);
  }

  /* El remitente CON NOMBRE. La variable de entorno puede traer solo la
     dirección ("hola@emprende180.com"); en la bandeja eso se lee como la
     dirección pelada. Si no trae nombre, se le pone el del sitio en el idioma
     del lead: "Emprende180 <hola@…>" / "Entrepreneur180 <hola@…>". */
  const remitente = (lang: Idioma) =>
    from.includes("<") ? from : `${sitio.nombre[lang]} <${from}>`;

  const enviar = (cuerpo: Record<string, unknown>) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cuerpo),
    });

  try {
    const [aviso, bienvenida] = await Promise.all([
      // Aviso interno. El asunto lleva el origen para saber qué formulario de
      // la página está convirtiendo sin abrir el mensaje.
      enviar({
        from: remitente("es"),
        to: [to],
        reply_to: lead.email,
        // El aviso interno va siempre en español: lo lees tú, no el lead.
        /* El cupón va EN EL ASUNTO cuando lo hay: quien llama tiene que verlo
           en la lista del buzón, sin abrir el correo. */
        /* El asunto dice de qué formulario viene, y el de informes se marca
           aparte: no es el mismo lead. Quien pide precio está mucho más
           abajo en el embudo que quien pide siete correos gratis, y hay que
           poder distinguirlos en la bandeja sin abrir el mensaje. */
        subject:
          lead.origen === "informes"
            ? `QUIERE EMPEZAR — ${lead.nombre}${lead.telefono ? ` · ${lead.telefono}` : ""}`
            : esLista
              ? `Nuevo lead — lista · ${lead.nombre} · ${lead.origen}`
              : cupon?.valido
                ? `Nuevo lead — mini-curso · ${lead.nombre} · cupón ${cupon.valido.code}`
                : `Nuevo lead — mini-curso · ${lead.nombre} · ${lead.origen}`,
        text: [
          `Nombre:  ${lead.nombre}`,
          `Email:   ${lead.email}`,
          ...(lead.telefono ? [`Tel:     ${lead.telefono}`] : []),
          /* Quién le recomendó va JUNTO A LOS DATOS DE CONTACTO y no al final:
             en el formulario de informes es lo que decide qué precio se le
             dice, así que quien llame tiene que verlo antes de marcar. */
          ...(lead.recomendadoPor ? [`Le mandó: ${lead.recomendadoPor}`] : []),
          `Origen:  ${lead.origen}`,
          `Idioma:  ${lead.idioma}`,
          ...(cupon
            ? [
                cupon.valido
                  ? `Cupón:   ${cupon.valido.code} — ${describirCupon(cupon.valido)} de descuento`
                  : `Cupón:   "${cupon.escrito}" — NO es válido (caducado, agotado o mal escrito)`,
              ]
            : []),
          `Referer: ${guardado.referer ?? "directo"}`,
          `IP:      ${ip}`,
          `Fecha:   ${guardado.capturadoEn}`,
          ``,
          `Responder a este correo escribe directamente al lead.`,
        ].join("\n"),
      }),

      /* El correo que recibe la persona, y cuál es DEPENDE DE LO QUE PIDIÓ:
         ver las tres plantillas de arriba y `plantillaPara`. Sale en HTML (la
         plantilla de marca) y en texto plano a la vez, y con `reply_to` al
         correo de contacto: responder al correo escribe a una persona.

         ⚠️ A QUIEN PIDE INFORMACIÓN SE LE MANDA UN ACUSE, NO UNA SECUENCIA.
         Hasta el 16-09-2026 no se le mandaba nada, para que le escribiera
         una persona y punto; el cliente pidió una bienvenida, y el acuse dice
         justo eso: que le va a escribir alguien. No lo mete en ninguna
         cadencia, que es lo que haría que marcara spam. */
      (() => {
        const plantilla = plantillaPara(lead.origen)[lead.idioma](lead.nombre);
        const correo = correoMarca(plantilla);
        return enviar({
          from: remitente(lead.idioma),
          to: [lead.email],
          reply_to: contacto.email,
          subject: plantilla.asunto,
          html: correo.html,
          text: correo.text,
        });
      })(),
    ]);

    if (!aviso.ok) {
      // El lead ya está guardado, así que esto no es un error para el usuario:
      // se registra para poder recuperarlo del log.
      console.error(
        "[lead] Resend rechazó el aviso interno:",
        await aviso.text(),
      );
    }
    if (!bienvenida.ok) {
      console.error(
        "[lead] Falló el email de bienvenida:",
        await bienvenida.text(),
      );
    }
  } catch (error) {
    // Igual: el lead está a salvo. No se le muestra un error a quien ya se
    // registró correctamente.
    console.error("[lead] Error al contactar con Resend:", error);
  }

  return exito(lead.idioma);
};

/** Cualquier otro método: 405. */
export const ALL: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: "POST" } });
