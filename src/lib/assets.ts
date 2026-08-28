/**
 * Detección de assets opcionales en `/public`.
 *
 * `import.meta.glob` lo resuelve Vite **en tiempo de compilación** leyendo el
 * disco, así que esto funciona igual en local y en Vercel. Un `fs.existsSync`
 * en el componente NO valdría: en producción el código corre dentro de una
 * función serverless donde `public/` no existe como carpeta, y devolvería
 * siempre `false` sin avisar.
 *
 * El glob es perezoso (sin `eager`), así que Vite no importa ni empaqueta los
 * vídeos: solo se usan las CLAVES para saber qué archivos hay. Las rutas que se
 * sirven son las públicas de siempre (`/video/hero.mp4`).
 */

const archivosVideo = Object.keys(
  import.meta.glob("../../public/video/*.{mp4,webm}"),
);

const archivosPoster = Object.keys(
  import.meta.glob("../../public/video/*.{webp,jpg,png}"),
);

const tiene = (lista: string[], nombre: string) =>
  lista.some((ruta) => ruta.endsWith(`/${nombre}`));

/** Ruta pública del archivo si existe, `null` si no. */
const ruta = (lista: string[], nombre: string) =>
  tiene(lista, nombre) ? `/video/${nombre}` : null;

export interface FuenteVideo {
  /** Obligatorio: es el formato que reproduce todo el mundo. */
  mp4: string;
  /** Opcional. Si está, se ofrece ANTES que el mp4 (mismo corte, menos bytes). */
  webm: string | null;
  /** Opcional, pero muy recomendable: es lo que se ve mientras carga. */
  poster: string | null;
}

const fuente = (base: string): FuenteVideo | null => {
  const mp4 = ruta(archivosVideo, `${base}.mp4`);
  if (!mp4) return null;
  return {
    mp4,
    webm: ruta(archivosVideo, `${base}.webm`),
    poster: ruta(archivosPoster, `${base}-poster.webp`),
  };
};

/**
 * ─── EL VÍDEO DE INTRODUCCIÓN (VSL) ──────────────────────────────────────
 *
 * `vsl.mp4` + `vsl-poster.webp` en `/public/video/`.
 *
 * AQUÍ HUBO UN VÍDEO DE FONDO Y SE QUITÓ. El hero llevaba un bucle mudo de
 * archivo (una persona cualquiera dando clase) que hacía de papel pintado.
 * Cuando llegó el vídeo real de Pedro dejó de tener sentido por dos motivos, y
 * los dos son de fondo, no de gusto:
 *
 *   · Era metraje de stock, o sea una persona que no tiene nada que ver con
 *     este negocio, en una página cuyo PRODUCT.md prohíbe el stock.
 *   · Un vídeo con locución y rótulos NO PUEDE ser papel pintado. Puesto en
 *     bucle y mudo detrás del titular, sus textos pelean con el h1 y se pierde
 *     justo lo que lo hace valioso, que es lo que dice.
 *
 * Así que el vídeo real no va de fondo: va DELANTE, con su botón de play, su
 * sonido y sus controles. Ver `VideoVsl.astro`.
 *
 * `disponible` es false si falta el mp4, y entonces el hero se queda solo con
 * su columna de texto sobre el fondo de marca. No se rompe nada.
 */
export const vsl = (() => {
  const fuenteVsl = fuente("vsl");
  return {
    disponible: fuenteVsl !== null,
    ...fuenteVsl,
    /** Subtítulos. Ver el aviso de más abajo: no son opcionales. */
    subtitulos: tiene(
      Object.keys(import.meta.glob("../../public/video/*.vtt")),
      "vsl.vtt",
    )
      ? "/video/vsl.vtt"
      : null,
  };
})();

/**
 * Portada del curso. Si el cliente deja una imagen real, manda ella; si no, el
 * hero pinta un visual construido con los datos reales del curso (10 videos,
 * quiz, certificación) en vez de una caja punteada vacía.
 */
const archivosCurso = Object.keys(
  import.meta.glob("../../public/imagenes/curso/*.{webp,jpg,png,avif}"),
);

export const portadaCurso = (() => {
  const nombre = ["portada.webp", "portada.avif", "portada.jpg", "portada.png"].find(
    (n) => tiene(archivosCurso, n),
  );
  return nombre ? `/imagenes/curso/${nombre}` : null;
})();

/**
 * Retrato del instructor.
 *
 * ⚠️ ESTO FALTABA, Y ES UN FALLO QUE MERECE QUEDAR ESCRITO. La sección del
 * instructor usaba `PlaceholderImage`, un componente que NO comprueba nada:
 * pinta el hueco punteado siempre. O sea que la foto real podía estar en su
 * carpeta, con su nombre correcto, y la página seguía enseñando el recuadro de
 * "aquí va la foto" para siempre. No había forma de que apareciera.
 *
 * Ahora la sección pregunta primero si el archivo existe (esto) y solo cae al
 * hueco si no está. Es el mismo patrón que el vídeo, los logos y los fondos de
 * los resultados: dejar el archivo en su sitio es todo lo que hay que hacer.
 */
const archivosInstructor = Object.keys(
  import.meta.glob("../../public/imagenes/instructor/*.{webp,avif,jpg,png}"),
);

export const fotoInstructor = (() => {
  const nombre = [
    "instructor.webp",
    "instructor.avif",
    "instructor.jpg",
    "instructor.png",
  ].find((n) => tiene(archivosInstructor, n));
  return nombre ? `/imagenes/instructor/${nombre}` : null;
})();

/**
 * Fondos de las tarjetas de "Qué sabrás hacer al terminar" (sección 03).
 *
 * Se buscan por POSICIÓN: `01`, `02`… hasta `06`, en la carpeta
 * `/public/imagenes/resultados/`. El número es el del resultado en
 * `curso.transformaciones`, así que dejar la foto en su sitio es todo lo que
 * hay que hacer: no se toca código ni config.
 *
 * MIENTRAS NO HAYA NINGUNA, la sección no se rompe ni deja huecos: cada tarjeta
 * pinta un fondo de marca generado (navy + la trama de puntos) con su icono
 * encima. En cuanto aparece una foto, esa tarjeta la usa y esconde el icono; las
 * que sigan sin foto conservan el fondo generado. Se pueden mezclar.
 *
 * POR QUÉ NO HAY FOTOS DE STOCK PUESTAS YA: PRODUCT.md prohíbe el stock, y seis
 * fotos genéricas de gente en una oficina son exactamente "el landing de
 * plantilla" del que habla su lista de anti-referencias. Es mejor un fondo de
 * marca honesto que seis fotos que no son de este negocio.
 */
const archivosResultados = Object.keys(
  import.meta.glob("../../public/imagenes/resultados/*.{webp,avif,jpg,png}"),
);

/**
 * Logos de la sección de aliados.
 *
 * Se buscan por el `archivo` que declara cada marca en `aliados.marcas`. Hay
 * dos variantes por marca y las dos son opcionales:
 *
 *   `<archivo>.webp`         — versión para fondo CLARO (el logo en navy)
 *   `<archivo>-blanco.webp`  — versión para fondo OSCURO
 *
 * Si no hay archivo, la sección no deja un hueco: pinta el nombre de la marca
 * como logotipo tipográfico. Queda intencionado, y en cuanto llegue el logo de
 * verdad entra solo.
 */
const archivosAliados = Object.keys(
  import.meta.glob("../../public/imagenes/aliados/*.{webp,avif,png,svg}"),
);

export function logoAliado(
  archivo: string,
  variante: "claro" | "oscuro" = "claro",
): string | null {
  const base = variante === "oscuro" ? `${archivo}-blanco` : archivo;
  const nombre = [`${base}.svg`, `${base}.webp`, `${base}.avif`, `${base}.png`].find(
    (n) => tiene(archivosAliados, n),
  );
  return nombre ? `/imagenes/aliados/${nombre}` : null;
}

/**
 * Proporciones reales de cada logo de aliado, para poder poner `width`/`height`
 * en el `<img>`.
 *
 * ⚠️ ESTO NO ES OPCIONAL AUNQUE EL ALTO LO FIJE EL CSS. Con `h-9 w-auto` el
 * navegador sabe el alto desde el primer momento pero NO el ancho, así que
 * reserva cero hasta que la imagen llega y entonces empuja lo que tenga al
 * lado: un salto de layout en la primera sección después del hero. Con los dos
 * atributos puestos calcula `36 × (640/158)` antes de descargar nada.
 *
 * Se declaran aquí, y no en `curso.config.ts`, porque son un dato del ARCHIVO y
 * no del negocio: quien añade un logo nuevo toca esta tabla, no la config.
 * Medir con `sharp(...).metadata()`. Si falta una entrada, el `<img>` sale sin
 * atributos —como antes— en lugar de romperse.
 */
const MEDIDAS_ALIADOS: Record<string, { w: number; h: number }> = {
  senordelascasas: { w: 640, h: 158 },
  /* Medidos con `sharp(...).metadata()` sobre los .webp ya recortados. Sin
     estas dos entradas los logos salían sin `width`/`height` y la fila de la
     banda se recolocaba al cargarlos: se veía en la auditoría de anchos, seis
     imágenes sin dimensiones. */
  boltwatts: { w: 909, h: 205 },
  skilledtrademanpower: { w: 643, h: 219 },
};

export const medidasAliado = (archivo: string) =>
  MEDIDAS_ALIADOS[archivo] ?? null;

export function fondoResultado(indice: number): string | null {
  const n = String(indice + 1).padStart(2, "0");
  const nombre = [`${n}.webp`, `${n}.avif`, `${n}.jpg`, `${n}.png`].find((f) =>
    tiene(archivosResultados, f),
  );
  return nombre ? `/imagenes/resultados/${nombre}` : null;
}

if (import.meta.env.DEV && vsl.disponible && !vsl.poster) {
  console.warn(
    "[assets] Hay /video/vsl.mp4 pero no /video/vsl-poster.webp. Sin póster, el " +
      "hero no tiene qué enseñar hasta que alguien pulse play, y el vídeo pesa " +
      "demasiado para cargarlo solo. Saca un fotograma en el que se vea la cara.",
  );
}

if (import.meta.env.DEV && vsl.disponible && !vsl.subtitulos) {
  console.warn(
    "[assets] El vídeo de introducción no tiene subtítulos (/video/vsl.vtt). " +
      "NO son opcionales: la mayoría de la gente lo va a ver sin sonido, y sin " +
      "pista de texto ese público se queda sin el mensaje entero. Además es lo " +
      "que hace el vídeo accesible para quien no oye.",
  );
}
