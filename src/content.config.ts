import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EL BLOG
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Archivos markdown en `src/contenido/blog/`. Sin gestor de contenidos, sin
 * base de datos y sin panel: se escribe un archivo, se hace push y está
 * publicado. Un CMS para un blog que escribe una persona es una cuenta más que
 * pagar, un servicio más que puede caerse y un sitio más donde buscar cuando
 * algo no sale.
 *
 * ─── UN ARTÍCULO, UN IDIOMA ────────────────────────────────────────────────
 *
 * ⚠️ AQUÍ SE ROMPE LA REGLA DEL RESTO DE LA PÁGINA, Y A PROPÓSITO. Toda la
 * landing se pinta en los dos idiomas a la vez y el CSS esconde el que no toca.
 * Para un titular de ocho palabras eso cuesta nada; para un artículo de mil
 * palabras significaría escribirlo DOS VECES antes de poder publicarlo.
 *
 * Y esa es exactamente la fricción que mata un blog. Así que cada artículo
 * declara su idioma y se publica solo. El que lea en otro idioma ve el artículo
 * igualmente, con un aviso de en qué idioma está: mejor eso que no publicarlo.
 *
 * ─── QUÉ HACE QUE UN ARTÍCULO SEA PUBLICABLE ───────────────────────────────
 *
 * El esquema de abajo. Si falta un campo o una fecha está mal escrita, la
 * compilación FALLA con el nombre del archivo. Es deliberado: es preferible que
 * no despliegue a que se publique un artículo sin descripción y salga en Google
 * con un trozo de texto cortado a mitad.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/contenido/blog" }),
  schema: z.object({
    /** El titular. Es lo que se ve en Google, así que dice de qué va. */
    titulo: z.string().min(10).max(120),

    /**
     * ─── EL TITULAR, TRADUCIDO ────────────────────────────────────────────
     *
     * Opcional, y NO convierte el artículo en bilingüe: el cuerpo sigue en el
     * idioma que diga `idioma` y la página del artículo lo avisa.
     *
     * Existe porque el titular aparece en sitios donde va SOLO, sin el texto
     * al lado: el teléfono de la portada es una bandeja de entrada con tres
     * asuntos y nada más. Con la web en inglés, esos tres asuntos en español
     * eran lo único de la sección que no estaba traducido, y ahí no cabe un
     * aviso de idioma que lo explique.
     *
     * Traducir un titular no es inventar contenido: es el mismo titular. Lo
     * que no se traduce a la ligera es el artículo.
     *
     * Si falta, se usa el original. La web no se rompe por no ponerlo.
     */
    tituloEn: z.string().min(10).max(120).optional(),

    /**
     * Dos líneas. Salen en el listado y como `<meta description>`.
     *
     * ⚠️ NO ES EL PRIMER PÁRRAFO REPETIDO. Google enseña esto debajo del
     * titular, y es lo que decide si alguien pulsa. Un resumen que empieza
     * "En este artículo vamos a hablar de…" no ha dicho nada todavía.
     */
    resumen: z.string().min(40).max(300),

    /** `YYYY-MM-DD`. Se usa para ordenar y se muestra. */
    fecha: z.coerce.date(),

    /** En qué idioma está escrito. Ver la nota de arriba. */
    idioma: z.enum(["es", "en"]).default("es"),

    /**
     * Para agrupar y para que el lector sepa qué se va a encontrar. Pocas y
     * repetidas: veinte etiquetas usadas una vez cada una no agrupan nada.
     */
    etiquetas: z.array(z.string()).default([]),

    /**
     * ⚠️ MIENTRAS ESTÉ EN `true` NO SE PUBLICA, ni siquiera con el archivo
     * subido. Es lo que permite escribir a medias sin miedo: un artículo a
     * medio hacer en la rama principal no sale a la calle.
     */
    borrador: z.boolean().default(false),

    /**
     * Imagen de portada, opcional, en `/public/imagenes/blog/`.
     * Sin ella el artículo se ve perfectamente: no se inventa una de archivo.
     */
    portada: z.string().optional(),
    portadaAlt: z.string().optional(),
  }),
});

export const collections = { blog };
