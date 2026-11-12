import { aliados } from "@config/curso.config";
import { logoAliado, medidasAliado } from "@lib/assets";
import type { Business } from "@lib/ambassadors";
import type { Txt } from "@i18n/idioma";

/**
 * La cara de un negocio en el portal del Embajador (12-11-2026): su logo, qué
 * hace y su web, para que el Embajador lo reconozca y pueda visitarlo antes de
 * recomendarlo.
 *
 * No se guarda nada nuevo: se cruza el negocio con la banda de aliados de la
 * web (`aliados.marcas` en el config), que ya tiene logo y rubro. Si el aliado
 * no tiene web propia, se usa la de su enlace de Embajador sin el código.
 *
 * ⚠️ UN RUBRO TODAVÍA "[COMPLETAR: ...]" NO SE ENSEÑA: aquí lo leería un
 * Embajador, no el cliente que revisa la web.
 */
export interface BusinessBrand {
  logo: string | null;
  w: number | null;
  h: number | null;
  tagline: Txt | null;
  website: string | null;
  /** "revivimedspa.com", para enseñarlo junto al botón. */
  host: string | null;
}

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();

function originOf(template: string | null): string | null {
  if (!template) return null;
  try {
    return new URL(template.replaceAll("{codigo}", "x")).origin;
  } catch {
    return null;
  }
}

export function brandOf(b: Business): BusinessBrand {
  const name = norm(b.name);
  const slug = norm(b.slug);
  const match = aliados.marcas.find((m) => {
    const n = norm(m.nombre);
    return n === name || m.logo === slug || m.logo.startsWith(slug) || n.startsWith(slug);
  });
  const logo = match ? logoAliado(match.logo) : null;
  const size = match ? medidasAliado(match.logo) : null;
  const tagline = match && !match.rubro.es.includes("[COMPLETAR") ? match.rubro : null;
  const website = match?.url ?? originOf(b.linkTemplate);
  let host: string | null = null;
  try {
    host = website ? new URL(website).host.replace(/^www\./, "") : null;
  } catch {
    host = null;
  }
  return { logo, w: size?.w ?? null, h: size?.h ?? null, tagline, website, host };
}
