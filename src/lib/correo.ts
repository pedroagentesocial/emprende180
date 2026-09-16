import { sitio, contacto, instructor } from "@config/curso.config";
import type { Idioma } from "@i18n/idioma";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EL CORREO DE MARCA — la plantilla que visten todos los correos que salen
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Hasta el 16-09-2026 los correos al lead salían en texto plano: "Hola Ana:",
 * cuatro líneas y "— Emprende180". El cliente pidió "algo más profesional:
 * pie de página, nuestro logo, mensaje de bienvenida y todo". Esto es eso: una
 * sola plantilla —cabecera con el logotipo, tarjeta blanca con el mensaje, el
 * botón y la firma, y un pie navy con la dirección y el correo— y cada correo
 * le pasa solo su texto.
 *
 * ─── POR QUÉ ESTÁ ESCRITO COMO EN 2005 ─────────────────────────────────────
 *
 * Tablas anidadas, estilos en línea, anchos en atributos. No es descuido: es
 * lo único que pintan igual Gmail, Outlook (el de escritorio sigue usando el
 * motor de Word), Apple Mail y el cliente del teléfono. Un `<div>` con flex y
 * una hoja de estilos en el `<head>` se rompe en la mitad de ellos. Las
 * reglas que se siguen aquí:
 *
 *   · 600 px de ancho, que es lo que cabe en cualquier panel de lectura.
 *   · Todo el estilo EN LÍNEA, en cada celda. Gmail se come el `<style>`.
 *   · Sin tipografías web: Montserrat no se carga en un correo. Se pide y se
 *     da una pila de respaldo (Arial / Helvetica); la itálica del remate va en
 *     Georgia, que está en todas partes y se parece al gesto de Fraunces.
 *   · Colores en hexadecimal, sacados de los tokens (`tokens.css`): el navy de
 *     marca #0D2B4D, el navy profundo #001637, el teal #11A79D. Los correos no
 *     saben leer `oklch`.
 *   · Las imágenes con URL ABSOLUTA (`sitio.url` + ruta): un correo no tiene
 *     "raíz del sitio". El logotipo va en el idioma del correo, como en la web.
 *
 * ─── SIEMPRE CON VERSIÓN EN TEXTO ──────────────────────────────────────────
 *
 * `correoMarca` devuelve el HTML y el texto plano, y `lead.ts` manda los dos.
 * El texto no es un extra: es lo que lee quien tiene las imágenes apagadas,
 * lo que indexan los filtros de spam para comparar con el HTML (un correo
 * solo-HTML puntúa peor) y lo que enseña la vista previa del buzón.
 *
 * ⚠️ TODO LO QUE VIENE DEL LEAD SE ESCAPA. El nombre lo escribe el visitante,
 * y "<script>" es un nombre válido para el formulario. `escapar` lo convierte
 * en texto antes de meterlo en el HTML.
 */

export interface CorreoMarca {
  lang: Idioma;
  /** Lo que se ve en la bandeja. */
  asunto: string;
  /**
   * La línea que enseñan Gmail y Apple Mail al lado del asunto. Si no se da,
   * va el primer párrafo. Se pinta oculta al principio del cuerpo.
   */
  preheader?: string;
  /** "Hola Ana:". Ya con el nombre puesto y sin escapar: aquí se escapa. */
  saludo: string;
  /** Los párrafos del mensaje, en texto plano. */
  parrafos: string[];
  /** El botón, si lo hay. Un solo botón por correo. */
  cta?: { texto: string; url: string };
  /** Quién firma. Por defecto, Pedro con su cargo. */
  firma?: { nombre: string; cargo: string };
  /** La línea pequeña del pie: por qué recibes esto. */
  porQue: string;
}

/* Los colores, en hexadecimal. Son los de `tokens.css` pasados a lo que un
   cliente de correo entiende. Si cambia la paleta, cambian aquí a mano. */
const COLOR = {
  navy: "#0D2B4D", // primary-900, el navy de marca
  navyProfundo: "#001637", // primary-950
  teal: "#11A79D", // secondary-500, el teal de marca
  tealOscuro: "#0E8C84", // secondary-600, el color de acción
  fondo: "#F2F4F7", // neutral-100, el gris del lienzo
  linea: "#DCE1E8",
  tinta: "#0D2B4D",
  tintaSuave: "#4A5B70",
  tintaPie: "#B8C7DA", // secondary-200 sobre navy
  blanco: "#FFFFFF",
} as const;

const FUENTE = "Montserrat, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const FUENTE_ACENTO = "Georgia, 'Times New Roman', serif";

export function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Los rótulos fijos del pie, en los dos idiomas. */
const PIE = {
  es: {
    escribenos: "Escríbenos",
    visitanos: "Visítanos",
    web: "Ver la web",
    aviso:
      "Este correo lo manda una persona y se contesta respondiendo aquí mismo.",
  },
  en: {
    escribenos: "Write to us",
    visitanos: "Visit us",
    web: "Visit the website",
    aviso: "This email is sent by a person; just hit reply to answer.",
  },
} as const;

/**
 * Construye el correo. Devuelve el HTML y el texto plano; los dos se mandan.
 */
export function correoMarca(c: CorreoMarca): { html: string; text: string } {
  const lang = c.lang;
  const pie = PIE[lang];
  const nombreSitio = sitio.nombre[lang];
  const logo = lang === "en" ? sitio.logoHorizontalEn : sitio.logoHorizontal;
  const logoBlanco =
    lang === "en" ? sitio.logoHorizontalBlancoEn : sitio.logoHorizontalBlanco;
  const firma = c.firma ?? {
    nombre: instructor.nombre,
    cargo: instructor.rol[lang],
  };
  const preheader = c.preheader ?? c.parrafos[0] ?? "";
  const direccion = `${contacto.direccion.calle}, ${contacto.direccion.ciudad}, ${contacto.direccion.pais[lang]}`;

  const parrafosHtml = c.parrafos
    .map(
      (p) =>
        `<p style="margin:0 0 18px;font-family:${FUENTE};font-size:16px;line-height:26px;color:${COLOR.tinta};">${escapar(p)}</p>`,
    )
    .join("\n");

  const botonHtml = c.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 26px;">
  <tr>
    <td align="center" bgcolor="${COLOR.tealOscuro}" style="border-radius:999px;">
      <a href="${escapar(c.cta.url)}" target="_blank" style="display:inline-block;padding:15px 34px;font-family:${FUENTE};font-size:14px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${COLOR.blanco};text-decoration:none;border-radius:999px;">${escapar(c.cta.texto)}</a>
    </td>
  </tr>
</table>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${escapar(c.asunto)}</title>
</head>
<body style="margin:0;padding:0;background:${COLOR.fondo};">
<!-- El preheader: lo que la bandeja enseña al lado del asunto. Oculto en el cuerpo. -->
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:${COLOR.fondo};">${escapar(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLOR.fondo}" style="background:${COLOR.fondo};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

        <!-- Cabecera: el logotipo -->
        <tr>
          <td align="left" style="padding:0 8px 20px;">
            <a href="${sitio.url}" target="_blank" style="text-decoration:none;">
              <img src="${sitio.url}${logo.src}" width="200" alt="${escapar(nombreSitio)}" style="display:block;width:200px;max-width:100%;height:auto;border:0;">
            </a>
          </td>
        </tr>

        <!-- La tarjeta -->
        <tr>
          <td bgcolor="${COLOR.blanco}" style="background:${COLOR.blanco};border-radius:16px;border:1px solid ${COLOR.linea};padding:40px 40px 28px;">
            <p style="margin:0 0 22px;font-family:${FUENTE};font-size:22px;line-height:30px;font-weight:800;color:${COLOR.navy};">${escapar(c.saludo)}</p>
            ${parrafosHtml}
            ${botonHtml}
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${COLOR.linea};width:100%;">
              <tr>
                <td style="padding-top:22px;">
                  <p style="margin:0;font-family:${FUENTE_ACENTO};font-style:italic;font-size:22px;line-height:28px;color:${COLOR.navy};">${escapar(firma.nombre)}</p>
                  <p style="margin:4px 0 0;font-family:${FUENTE};font-size:14px;line-height:20px;color:${COLOR.tintaSuave};">${escapar(firma.cargo)}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Aire entre la tarjeta y el pie. Una fila espaciadora y no un
             margen: Outlook ignora los márgenes de las celdas. -->
        <tr>
          <td style="height:16px;line-height:16px;font-size:0;">&nbsp;</td>
        </tr>

        <!-- El pie, en navy -->
        <tr>
          <td bgcolor="${COLOR.navyProfundo}" style="background:${COLOR.navyProfundo};border-radius:16px;padding:32px 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-bottom:20px;">
                  <img src="${sitio.url}${logoBlanco.src}" width="150" alt="${escapar(nombreSitio)}" style="display:block;width:150px;height:auto;border:0;">
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:6px;font-family:${FUENTE_ACENTO};font-style:italic;font-size:17px;line-height:24px;color:${COLOR.blanco};">${escapar(sitio.claim[lang])}</td>
              </tr>
              <tr>
                <td style="padding:14px 0 0;font-family:${FUENTE};font-size:13px;line-height:21px;color:${COLOR.tintaPie};">
                  <strong style="color:${COLOR.blanco};">${pie.visitanos}</strong><br>
                  ${escapar(direccion)}<br>
                  <a href="${contacto.mapaUrl}" target="_blank" style="color:${COLOR.teal};text-decoration:none;">Google Maps ↗</a>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 0 0;font-family:${FUENTE};font-size:13px;line-height:21px;color:${COLOR.tintaPie};">
                  <strong style="color:${COLOR.blanco};">${pie.escribenos}</strong><br>
                  <a href="mailto:${contacto.email}" style="color:${COLOR.teal};text-decoration:none;">${contacto.email}</a>
                  &nbsp;·&nbsp;
                  <a href="${sitio.url}" target="_blank" style="color:${COLOR.teal};text-decoration:none;">${pie.web}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:22px 0 0;border-top:1px solid rgba(255,255,255,0.15);font-family:${FUENTE};font-size:12px;line-height:19px;color:${COLOR.tintaPie};">
                  ${escapar(c.porQue)}<br>
                  ${pie.aviso}
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  const text = [
    c.saludo,
    ``,
    ...c.parrafos.flatMap((p) => [p, ``]),
    ...(c.cta ? [`${c.cta.texto}: ${c.cta.url}`, ``] : []),
    `${firma.nombre}`,
    firma.cargo,
    ``,
    `—`,
    nombreSitio,
    direccion,
    contacto.email,
    sitio.url,
    ``,
    c.porQue,
    pie.aviso,
  ].join("\n");

  return { html, text };
}
