import type { APIRoute } from "astro";
import { z } from "zod";
import { repo } from "@lib/datos";
import {
  crearEnlaceAcceso,
  esAdminPorConfig,
  rolDe,
  MAX_PETICIONES_HORA,
} from "@lib/acceso";
import { consumir, ipDe } from "@lib/rateLimit";
import { sitio, contacto } from "@config/curso.config";
import type { Idioma } from "@i18n/idioma";

export const prerender = false;

/**
 * POST /api/acceso — pide un enlace mágico.
 *
 * ⚠️ RESPONDE LO MISMO EXISTA O NO EL ALUMNO, Y ESO ES LA MITAD DEL DISEÑO.
 *
 * Si contestara "ese correo no está dado de alta", este endpoint sería un
 * comprobador de clientes: cualquiera podría ir probando direcciones para
 * averiguar quién compró el curso. Así que la respuesta es siempre la misma
 * —"si ese correo está dado de alta, te acaba de llegar un enlace"— y el correo
 * solo sale si el alumno existe de verdad.
 *
 * ⚠️ PEDIR EL ENLACE NO DA DE ALTA A NADIE. Solo se manda a quien ya existe,
 * porque el alta la hace un administrador después de cobrar. La única
 * excepción es un email de `ADMIN_EMAILS`: ese sí se crea al vuelo, porque es
 * el arranque del sistema y no hay panel al que entrar todavía.
 */

const esquema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  idioma: z.enum(["es", "en"]).default("es"),
  destino: z.string().max(200).optional(),
});

/** El texto del correo. Va en el servidor: no tiene por qué llegar al bundle. */
const CORREO: Record<Idioma, { asunto: string; cuerpo: (url: string) => string }> = {
  es: {
    asunto: `Tu acceso a ${sitio.nombre}`,
    cuerpo: (url) =>
      [
        `Aquí tienes tu acceso al área de alumnos:`,
        ``,
        url,
        ``,
        `El enlace caduca en 20 minutos y solo se puede usar una vez.`,
        `Si no lo has pedido tú, ignora este correo: no se ha tocado nada.`,
        ``,
        `— ${sitio.nombre}`,
      ].join("\n"),
  },
  en: {
    asunto: `Your ${sitio.nombre} access`,
    cuerpo: (url) =>
      [
        `Here's your access to the student area:`,
        ``,
        url,
        ``,
        `The link expires in 20 minutes and can only be used once.`,
        `If you didn't request it, ignore this email: nothing has changed.`,
        ``,
        `— ${sitio.nombre}`,
      ].join("\n"),
  },
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

export const POST: APIRoute = async ({ request, clientAddress, url }) => {
  // Límite por IP, barato y antes de tocar la base.
  const ip = ipDe(request, clientAddress);
  if (!consumir(`acceso:${ip}`, 15, 10 * 60 * 1000).permitido) {
    return json({ ok: false, error: "limite" }, 429);
  }

  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return json({ ok: false, error: "peticion" }, 400);
  }

  const parsed = esquema.safeParse(cuerpo);
  if (!parsed.success) return json({ ok: false, error: "email" }, 400);

  const { email, idioma } = parsed.data;
  const r = repo();

  /* La respuesta neutra. Se devuelve en todos los caminos a partir de aquí,
     incluido el de "no existe": ver la nota de arriba. */
  const neutra = () => json({ ok: true }, 200);

  // Límite por EMAIL: el de IP no protege al dueño del buzón, que es quien
  // recibiría los correos si alguien decide usar esto para molestarle.
  const haceUnaHora = new Date(Date.now() - 3_600_000);
  if ((await r.contarPeticiones(email, haceUnaHora)) >= MAX_PETICIONES_HORA) {
    console.warn(`[acceso] Demasiadas peticiones para ${email}`);
    return neutra();
  }
  await r.registrarPeticion(email);

  let alumno = await r.alumnoPorEmail(email);

  // Arranque: el primer admin no tiene panel donde darse de alta.
  if (!alumno && esAdminPorConfig(email)) {
    alumno = await r.crearAlumno({
      email,
      nombre: null,
      rol: rolDe(email),
      idioma,
    });
    console.log(`[acceso] Admin creado desde ADMIN_EMAILS: ${email}`);
  }

  if (!alumno || !alumno.activo) {
    /* Ni correo ni pista. Queda en el log para poder detectar a alguien que
       pagó y todavía no está de alta. */
    console.log(`[acceso] Petición para un email sin alta activa: ${email}`);
    return neutra();
  }

  const enlace = await crearEnlaceAcceso(alumno, url);

  const apiKey = import.meta.env.RESEND_API_KEY;
  const from = import.meta.env.NOTIFY_EMAIL_FROM;

  /* Sin credenciales de correo el enlace se escribe en la consola. Es lo que
     permite probar el flujo entero en desarrollo sin montar un buzón, y en
     producción no puede pasar: no hay Resend, no hay envío, y quien administra
     lo ve en los logs.

     ⚠️ EN DESARROLLO EL ENLACE TAMBIÉN VUELVE EN LA RESPUESTA, y solo ahí. Sin
     eso, probar el circuito completo obliga a leer la consola del servidor y a
     pegar la URL a mano en cada intento. `import.meta.env.DEV` es una constante
     que Vite sustituye por `false` al compilar, así que esta rama entera
     desaparece del bundle de producción: no es una condición que se pueda
     colar por una variable mal puesta. */
  if (!apiKey || !from) {
    console.warn(
      `[acceso] MODO DEMO — sin RESEND_API_KEY. Enlace para ${email}:\n  ${enlace}`,
    );
    return import.meta.env.DEV ? json({ ok: true, enlace }, 200) : neutra();
  }

  try {
    const respuesta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [alumno.email],
        reply_to: contacto.email,
        subject: CORREO[alumno.idioma].asunto,
        text: CORREO[alumno.idioma].cuerpo(enlace),
      }),
    });
    if (!respuesta.ok) {
      console.error("[acceso] Resend rechazó el envío:", await respuesta.text());
    }
  } catch (error) {
    console.error("[acceso] Error al contactar con Resend:", error);
  }

  return neutra();
};

export const ALL: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: "POST" } });
