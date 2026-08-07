import { cookies } from "@config/legal.config";

/**
 * Consentimiento de cookies de medición.
 *
 * Regla del sitio: **Google Analytics NO se carga hasta que el visitante dice
 * que sí.** No es una preferencia estética. Cargar analítica antes de preguntar
 * y enseñar después un banner que solo se puede aceptar es exactamente lo que
 * sancionan RGPD, LGPD y compañía, y además es deshonesto: el banner sugiere
 * una decisión que ya se tomó sin ti.
 *
 * Se guarda en `localStorage`, no en una cookie: la preferencia es puramente
 * de cliente, no hace falta mandarla al servidor en cada petición.
 */

export type EstadoConsentimiento = "aceptado" | "rechazado" | "sin-respuesta";

export const EVENTO_CONSENTIMIENTO = "e180:consentimiento";

export function leerConsentimiento(): EstadoConsentimiento {
  if (typeof localStorage === "undefined") return "sin-respuesta";
  try {
    const v = localStorage.getItem(cookies.claveAlmacenamiento);
    return v === "aceptado" || v === "rechazado" ? v : "sin-respuesta";
  } catch {
    // Modo privado de Safari, almacenamiento bloqueado por el usuario, etc.
    // Sin poder recordar la respuesta, lo seguro es no cargar analítica.
    return "sin-respuesta";
  }
}

export function guardarConsentimiento(estado: "aceptado" | "rechazado") {
  try {
    localStorage.setItem(cookies.claveAlmacenamiento, estado);
  } catch {
    /* Si no se puede guardar, se volverá a preguntar. Aceptable. */
  }
  window.dispatchEvent(
    new CustomEvent(EVENTO_CONSENTIMIENTO, { detail: estado }),
  );
}

/** Reabre el banner: el enlace "Preferencias de cookies" del pie. */
export function reabrirPreferencias() {
  try {
    localStorage.removeItem(cookies.claveAlmacenamiento);
  } catch {
    /* ignorar */
  }
  window.dispatchEvent(
    new CustomEvent(EVENTO_CONSENTIMIENTO, { detail: "sin-respuesta" }),
  );
}

/**
 * Carga GA4 una sola vez, y solo tras el consentimiento.
 * Idempotente: llamarla dos veces no duplica el script ni los eventos.
 */
export function activarAnalitica(idMedicion: string) {
  if (!idMedicion) return;
  const w = window as Window & { __e180ga?: boolean };
  if (w.__e180ga) return;
  w.__e180ga = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${idMedicion}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  // gtag necesita `arguments`, así que no puede ser una función flecha.
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag as typeof window.gtag;
  gtag("js", new Date());
  gtag("config", idMedicion, { anonymize_ip: true });
}
