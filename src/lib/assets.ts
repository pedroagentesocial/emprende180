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

/**
 * Vídeo de fondo del hero. Si no hay ninguno, el hero cae al mockup del curso.
 *
 * Se exigen las DOS fuentes (webm y mp4): con solo webm, Safari en iPhone —
 * que es media audiencia de esta página — mostraría un hueco negro.
 */
export const heroVideo = (() => {
  const webm = tiene(archivosVideo, "hero.webm");
  const mp4 = tiene(archivosVideo, "hero.mp4");
  const poster = tiene(archivosPoster, "hero-poster.webp");

  return {
    disponible: webm && mp4,
    /** Solo uno de los dos formatos: se avisa en consola, no se usa. */
    incompleto: (webm || mp4) && !(webm && mp4),
    webm: webm ? "/video/hero.webm" : null,
    mp4: mp4 ? "/video/hero.mp4" : null,
    poster: poster ? "/video/hero-poster.webp" : null,
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

if (import.meta.env.DEV && heroVideo.incompleto) {
  console.warn(
    "[assets] En /public/video hay solo uno de hero.webm / hero.mp4. " +
      "Hacen falta los dos (Safari iOS no reproduce WebM). El hero usará el mockup.",
  );
}
