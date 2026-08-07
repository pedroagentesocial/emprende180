// Procesa los originales de marca a los assets que usa el sitio. Temporal.
import sharp from "sharp";
import fs from "node:fs";

const ID = "public/identidad";
// Los originales viven FUERA de public/: pesan 2 MB y no se referencian nunca,
// así que servirlos sería desplegar la guía de marca entera al público.
const ORIG = "marca-originales";
const LOGO = `${ORIG}/empren de logo copia.png`;
const ISO = `${ORIG}/favicon emprende.png`;
const NAVY = "#0D2B4D";

const meta = async (f) => {
  const m = await sharp(f).metadata();
  console.log(`  ${f.split("/").pop().padEnd(28)} ${m.width}×${m.height} ${m.format} ${m.hasAlpha ? "alpha" : "sin alpha"}`);
  return m;
};

console.log("ORIGINALES");
await meta(LOGO); await meta(ISO); await meta(`${ORIG}/identidad emprende.png`);

/** Recorta el margen blanco/transparente sobrante. */
const recortar = (f) => sharp(f).trim({ threshold: 10 });

/**
 * Versión monocroma clara: el navy pasa a blanco, el teal se conserva.
 * Es la variante "sobre fondo oscuro" que la propia guía muestra en la
 * tarjeta de visita (bombilla y "EMPRENDE" en blanco, "180" en teal).
 */
/** Recolorea navy→blanco conservando el tamaño original (sin recortar). */
async function recortarBlanco(fuente) {
  return recolorear(sharp(fuente).ensureAlpha());
}

async function versionClara(entrada, salida, ancho) {
  const buf = await recolorear(
    recortar(entrada)
      .ensureAlpha()
      .resize({ width: ancho, fit: "inside", withoutEnlargement: false }),
  );
  await sharp(buf).png({ compressionLevel: 9, palette: true, colors: 64 }).toFile(salida);
  console.log(`  ✓ ${salida}`);
}

async function recolorear(pipeline) {
  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });

  // El navy del original está "matteado" contra blanco: los bordes suavizados
  // son navy mezclado con blanco. Un umbral binario dejaría un halo azul de
  // los píxeles intermedios, así que el mapeo es continuo: se calcula cuánta
  // tinta cubría el píxel y esa cobertura pasa a ser el alfa del blanco.
  const NAVY_AVG = (0x0d + 0x2b + 0x4d) / 3; // ≈ 44.3

  // Se clasifica por MATIZ, no por canales sueltos: mezclar con blanco baja la
  // saturación pero deja el matiz intacto, así que un borde suavizado del navy
  // sigue midiendo ~212°. El cerebro del logo es un degradado teal que llega
  // hasta un azul-verdoso (#099BB2 ≈ 188°); comparar canales lo confundía con
  // el navy y lo blanqueaba. El corte en 200° separa las dos familias limpio.
  const matiz = (r, g, b) => {
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    if (d === 0) return null; // acromático
    let h;
    if (max === r) h = 60 * (((g - b) / d) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
    return h < 0 ? h + 360 : h;
  };

  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a < 4) continue;

    const h = matiz(r, g, b);
    if (h === null || h < 200 || h > 260) continue; // teal (≈176–192°) intacto

    const avg = (r + g + b) / 3;
    const cobertura = Math.min(1, Math.max(0, (255 - avg) / (255 - NAVY_AVG)));
    data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
    data[i + 3] = Math.round(a * cobertura);
  }
  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9, palette: true, colors: 64 })
    .toBuffer();
}

async function emitir(entrada, base, ancho, { webp = true } = {}) {
  const img = recortar(entrada).resize({ width: ancho, withoutEnlargement: false });
  await img.clone().png({ compressionLevel: 9, palette: true, colors: 64 }).toFile(`${base}.png`);
  if (webp) await img.clone().webp({ quality: 92 }).toFile(`${base}.webp`);
  console.log(`  ✓ ${base}.png${webp ? " + .webp" : ""}`);
}

console.log("\nGENERANDO");
// Lockup completo (bombilla + EMPRENDE180 + claim). Cabecera y footer.
// Sin WebP: en arte plano de 2 tintas el PNG con paleta pesa menos.
await emitir(LOGO, `${ID}/logo`, 320, { webp: false }); // pie: ~100 px CSS → 2x sobrado
await versionClara(LOGO, `${ID}/logo-blanco.png`, 320);

// Isotipo: solo la bombilla. Cabecera compacta en móvil.
await emitir(ISO, `${ID}/isotipo`, 512, { webp: false });
await versionClara(ISO, `${ID}/isotipo-blanco.png`, 512);

/* ───────────────────────────────────────────────────────────────────────────
   LOCKUP HORIZONTAL (derivado)

   La guía solo trae el lockup vertical: bombilla arriba, "EMPRENDE180" debajo
   y el claim al pie. A la altura de un header sticky (~40 px) ese formato deja
   el nombre en unos 20 px de ancho, ilegible.

   Se compone uno horizontal RECORTANDO las piezas del arte oficial — no se
   redibuja, no se recolorea, no se re-tipografía. Solo cambia la disposición.
   Bandas medidas sobre el original de 1670×1814:
     bombilla + casquillo  y 281–1156, x 491–1199
     "EMPRENDE180"         y 1310–1442
     claim                 y 1485–1534   → se recorta junto al wordmark

   ⚠ Es un asset DERIVADO. Si el diseñador tiene una versión horizontal
   oficial, sustitúyela: manda la suya.
   ─────────────────────────────────────────────────────────────────────────── */
const ICONO = { left: 491, top: 281, width: 709, height: 876 };
const TEXTO = { left: 192, top: 1310, width: 1303, height: 225 };

async function lockupHorizontal(fuente, salida, { blanco = false } = {}) {
  const ALTO = 120;          // header: ~36 px CSS de alto → 2x con margen
  const ALTO_TEXTO = 78;     // el wordmark pesa menos que el icono
  const HUECO = 24;

  const base = blanco
    ? await sharp(await recortarBlanco(fuente)).toBuffer()
    : fuente;

  const icono = await sharp(base).extract(ICONO)
    .resize({ height: ALTO }).png().toBuffer();
  const texto = await sharp(base).extract(TEXTO)
    .resize({ height: ALTO_TEXTO }).png().toBuffer();

  const wIcono = (await sharp(icono).metadata()).width;
  const wTexto = (await sharp(texto).metadata()).width;

  await sharp({
    create: { width: wIcono + HUECO + wTexto, height: ALTO, channels: 4,
              background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: icono, left: 0, top: 0 },
      { input: texto, left: wIcono + HUECO, top: Math.round((ALTO - ALTO_TEXTO) / 2) },
    ])
    .png({ compressionLevel: 9, palette: true, colors: 64 })
    .toFile(salida);
  console.log(`  ✓ ${salida}`);
}

await lockupHorizontal(LOGO, `${ID}/logo-horizontal.png`);
await lockupHorizontal(LOGO, `${ID}/logo-horizontal-blanco.png`, { blanco: true });

// Favicon: el isotipo cuadrado sobre fondo transparente.
await sharp(await recortar(ISO).png().toBuffer())
  .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9, palette: true, colors: 64 })
  .toFile("public/favicon.png");
console.log("  ✓ public/favicon.png (512)");

// Apple touch icon: fondo navy sólido (iOS no admite transparencia).
await sharp(await recortar(ISO).png().toBuffer())
  .resize(150, 150, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .extend({ top: 15, bottom: 15, left: 15, right: 15, background: NAVY })
  .flatten({ background: NAVY })
  .png({ compressionLevel: 9, palette: true, colors: 64 })
  .toFile(`${ID}/apple-touch-icon.png`);
console.log(`  ✓ ${ID}/apple-touch-icon.png (180, fondo navy)`);

console.log("\nTAMAÑOS FINALES");
for (const f of [
  `${ID}/logo.png`, `${ID}/logo-blanco.png`, `${ID}/logo-horizontal.png`, `${ID}/logo-horizontal-blanco.png`,
  `${ID}/isotipo.png`, `${ID}/isotipo-blanco.png`,
  "public/favicon.png", `${ID}/apple-touch-icon.png`,
]) {
  const m = await sharp(f).metadata();
  console.log(`  ${f.padEnd(38)} ${String(m.width).padStart(4)}×${String(m.height).padEnd(4)} ${(fs.statSync(f).size / 1024).toFixed(1)} KB`);
}

/* ───────────────────────────────────────────────────────────────────────────
   IMAGEN OG PROVISIONAL (1200×630)

   Sin ella, compartir el enlace en WhatsApp o LinkedIn enseña una preview
   rota, que es peor que no tener imagen.

   Es deliberadamente el lockup blanco sobre el navy de marca, sin texto
   añadido: el propio logotipo ya trae "EMPRENDE180" y el claim compuestos en
   Montserrat. Componer texto aquí obligaría a renderizarlo con una fuente del
   sistema (Montserrat no está instalada como fuente del SO), y una preview con
   la tipografía equivocada se nota más que una sin frase.

   SWAP: sustituir por una pieza diseñada con la promesa del curso en texto
   grande. Ver public/imagenes/og/README.md.
   ─────────────────────────────────────────────────────────────────────────── */
{
  const logoOg = await sharp(await recortarBlanco(LOGO))
    .resize({ width: 560, height: 430, fit: "inside" })
    .png()
    .toBuffer();

  await sharp({
    create: { width: 1200, height: 630, channels: 4, background: NAVY },
  })
    .composite([{ input: logoOg, gravity: "centre" }])
    .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
    .toFile("public/imagenes/og/og.jpg");

  const { size } = fs.statSync("public/imagenes/og/og.jpg");
  console.log(`  ✓ public/imagenes/og/og.jpg (1200×630, ${(size / 1024).toFixed(1)} KB)`);
}
