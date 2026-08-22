import sharp from "sharp";
import { writeFileSync } from "node:fs";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EL FAVICON — el isotipo, legible a 16 px
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Ejecutar con `npm run marca:favicon`. Lee el isotipo original y escribe todo
 * lo que hace falta en `public/`.
 *
 * ─── POR QUÉ NO VALÍA EL QUE HABÍA ─────────────────────────────────────────
 *
 * Era el isotipo tal cual: trazo fino, navy, sobre fondo transparente. A 512 px
 * es precioso y a 16 —que es donde vive un favicon— pasan dos cosas:
 *
 *  1. El trazo se cierra sobre sí mismo y el dibujo se convierte en una mancha.
 *  2. Con el fondo transparente, en una pestaña de navegador en modo oscuro el
 *     navy queda casi negro sobre casi negro. La marca desaparece justo en la
 *     mitad de los navegadores que hay hoy.
 *
 * ─── LO QUE SE HACE EN SU LUGAR ────────────────────────────────────────────
 *
 * Una BALDOSA: fondo navy de la marca, esquinas redondeadas y el isotipo BLANCO
 * encima, con aire alrededor. Se lee igual de bien en pestaña clara y en
 * oscura, porque la baldosa lleva su propio fondo, y a 16 px lo que se
 * reconoce es la silueta, que es de lo que va un favicon.
 *
 * El margen es del 18% a cada lado y no es un número al azar: con el isotipo a
 * sangre, las esquinas redondeadas se comen el filamento de la bombilla.
 *
 * ─── LOS TAMAÑOS, Y POR QUÉ CADA UNO ───────────────────────────────────────
 *
 *  · favicon.ico (16+32) — lo piden solos los navegadores viejos y Windows al
 *    anclar la página; sin él, cada visita deja un 404 en los registros.
 *  · favicon-32 / favicon-16 — los que usa un navegador de hoy.
 *  · favicon-512 — el que se queda para el manifiesto y los buscadores.
 *  · apple-touch-icon (180) — la pantalla de inicio de un iPhone. Sin
 *    transparencia a propósito: iOS la rellena de negro.
 */

const ORIGEN = "public/identidad/isotipo-blanco.png";
const NAVY = { r: 13, g: 43, b: 77, alpha: 1 }; // #0D2B4D, primary-900

/** Baldosa navy con esquinas redondeadas y el isotipo blanco centrado. */
async function baldosa(tamano) {
  const radio = Math.round(tamano * 0.22);
  const margen = Math.round(tamano * 0.18);
  const interior = tamano - margen * 2;

  const mascara = Buffer.from(
    `<svg width="${tamano}" height="${tamano}">
       <rect width="${tamano}" height="${tamano}" rx="${radio}" ry="${radio}" fill="#fff"/>
     </svg>`,
  );

  const marca = await sharp(ORIGEN)
    .resize(interior, interior, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  return sharp({
    create: { width: tamano, height: tamano, channels: 4, background: NAVY },
  })
    .composite([
      { input: marca, top: margen, left: margen },
      /* La máscara va al final y con `dest-in`: recorta lo ya compuesto, que es
         la única forma de que el redondeo se coma también el fondo. */
      { input: mascara, blend: "dest-in" },
    ])
    .png()
    .toBuffer();
}

/**
 * Un .ico con dos imágenes PNG dentro.
 *
 * El formato no tiene misterio: seis bytes de cabecera, dieciséis por cada
 * imagen, y los PNG pegados detrás. Se escribe a mano porque sharp no exporta
 * .ico y meter una dependencia por 30 líneas no sale a cuenta.
 */
function ico(pngs) {
  const cabecera = Buffer.alloc(6);
  cabecera.writeUInt16LE(0, 0); // reservado
  cabecera.writeUInt16LE(1, 2); // 1 = icono
  cabecera.writeUInt16LE(pngs.length, 4);

  let desplazamiento = 6 + pngs.length * 16;
  const entradas = [];

  for (const { tamano, datos } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(tamano >= 256 ? 0 : tamano, 0); // ancho (0 = 256)
    e.writeUInt8(tamano >= 256 ? 0 : tamano, 1); // alto
    e.writeUInt8(0, 2); // colores de la paleta
    e.writeUInt8(0, 3); // reservado
    e.writeUInt16LE(1, 4); // planos
    e.writeUInt16LE(32, 6); // bits por píxel
    e.writeUInt32LE(datos.length, 8);
    e.writeUInt32LE(desplazamiento, 12);
    entradas.push(e);
    desplazamiento += datos.length;
  }

  return Buffer.concat([cabecera, ...entradas, ...pngs.map((p) => p.datos)]);
}

console.log("Generando el favicon desde", ORIGEN);

const t16 = await baldosa(16);
const t32 = await baldosa(32);
const t180 = await baldosa(180);
const t512 = await baldosa(512);

writeFileSync("public/favicon-16.png", t16);
writeFileSync("public/favicon-32.png", t32);
writeFileSync("public/favicon.png", t512);
writeFileSync("public/identidad/apple-touch-icon.png", t180);
writeFileSync(
  "public/favicon.ico",
  ico([
    { tamano: 16, datos: t16 },
    { tamano: 32, datos: t32 },
  ]),
);

console.log("  ✓ public/favicon.ico (16 + 32)");
console.log("  ✓ public/favicon-16.png");
console.log("  ✓ public/favicon-32.png");
console.log("  ✓ public/favicon.png (512)");
console.log("  ✓ public/identidad/apple-touch-icon.png (180)");
