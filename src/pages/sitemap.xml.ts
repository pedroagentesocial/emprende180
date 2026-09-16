import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { articulosPublicados } from "@lib/blog";
import { documentosPorSlug } from "@config/legal.config";
import { IDIOMAS } from "@i18n/idioma";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * /sitemap.xml — el mapa que se genera al pedirlo, no al compilar
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ NO SE USA `@astrojs/sitemap`, Y LA RAZÓN ES EL BLOG. Esa integración
 * escribe el mapa AL COMPILAR, y aquí los artículos se publican por fecha: uno
 * fechado el 1 de septiembre aparece solo ese día, sin desplegar nada. Un mapa
 * generado en el despliegue anterior no lo tendría, y Google tardaría en
 * encontrarlo justo el tiempo que tarde alguien en volver a desplegar.
 *
 * Generado en cada petición, el artículo entra en el mapa el mismo día que se
 * publica. Cuesta una consulta a la colección, que ya está en memoria.
 *
 * ⚠️ LO QUE NO ENTRA: nada de `/student` ni de `/login`. No es solo que no haya
 * que indexarlo (para eso ya está el `noindex` del layout): es que un mapa del
 * sitio es una lista de puertas, y las puertas privadas no se anuncian.
 *
 * `lastmod` solo donde se sabe de verdad. Inventarse una fecha de modificación
 * para que parezca fresco es la clase de señal que Google aprendió a ignorar
 * hace años.
 */
export const prerender = false;

/** El dominio configurado, sin barra final. */
const base = (import.meta.env.SITE ?? "https://emprende180.vercel.app").replace(
  /\/$/,
  "",
);

interface Entrada {
  ruta: string;
  prioridad: string;
  frecuencia: string;
  lastmod?: string;
}

export const GET: APIRoute = async () => {
  const articulos = await articulosPublicados(getCollection);

  const entradas: Entrada[] = [
    { ruta: "/", prioridad: "1.0", frecuencia: "weekly" },

    /* Las tres páginas fijas. Faltaban las dos primeras desde que existen y
       nadie lo había notado, porque un mapa incompleto no da error: solo
       hace que Google tarde más en llegar. Sin `lastmod`: no se sabe de
       verdad cuándo cambian. */
    { ruta: "/about", prioridad: "0.8", frecuencia: "monthly" },
    { ruta: "/programs", prioridad: "0.8", frecuencia: "monthly" },
    { ruta: "/resources", prioridad: "0.7", frecuencia: "weekly" },

    /* El blog solo entra si tiene algo. Con cero artículos `/blog` contesta
       404, y anunciar en el mapa una dirección que devuelve 404 es la forma más
       tonta de gastar el presupuesto de rastreo. */
    ...(articulos.length > 0
      ? ([
          {
            ruta: "/blog",
            prioridad: "0.8",
            frecuencia: "weekly",
            lastmod: articulos[0]!.data.fecha.toISOString().slice(0, 10),
          },
        ] satisfies Entrada[])
      : []),

    ...articulos.map((a) => ({
      ruta: `/blog/${a.id}`,
      prioridad: "0.7",
      frecuencia: "monthly",
      lastmod: a.data.fecha.toISOString().slice(0, 10),
    })),

    ...Object.keys(documentosPorSlug).map((slug) => ({
      ruta: `/legal/${slug}`,
      prioridad: "0.3",
      frecuencia: "yearly",
    })),
  ];

  /* ─── UNA ENTRADA POR IDIOMA, CON SUS ALTERNATIVAS ────────────────────────
     El `canonical` de cada página lleva `?lang=` (ver BaseLayout), así que la
     URL que Google tiene que encontrar aquí es ESA, no la pelada: un mapa que
     anuncia `/about` y una página que se declara `/about?lang=es` son dos
     direcciones distintas para el rastreador. Cada ruta sale dos veces, una
     por idioma, y cada una lista a la otra como `xhtml:link hreflang` y al
     español como `x-default`, igual que el `<head>`. */
  const conIdioma = (ruta: string, lang: string) =>
    `${base}${ruta}?lang=${lang}`;
  const alternativas = (ruta: string) =>
    [
      ...IDIOMAS.map(
        (l) =>
          `    <xhtml:link rel="alternate" hreflang="${l}" href="${conIdioma(ruta, l)}" />`,
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${conIdioma(ruta, "es")}" />`,
    ].join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entradas
  .flatMap((e) =>
    IDIOMAS.map(
      (lang) => `  <url>
    <loc>${conIdioma(e.ruta, lang)}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""}
    <changefreq>${e.frecuencia}</changefreq>
    <priority>${e.prioridad}</priority>
${alternativas(e.ruta)}
  </url>`,
    ),
  )
  .join("\n")}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      /* Una hora: lo bastante para no regenerarlo en cada rastreo y lo bastante
         poco para que un artículo publicado hoy no espere a mañana. */
      "Cache-Control": "public, max-age=3600",
    },
  });
};
