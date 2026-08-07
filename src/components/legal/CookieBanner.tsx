import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cookies, legalConfig } from "@config/legal.config";
import {
  EVENTO_CONSENTIMIENTO,
  activarAnalitica,
  guardarConsentimiento,
  leerConsentimiento,
} from "@lib/consent";
import { useIdioma } from "@i18n/react";
import type { Idioma } from "@i18n/idioma";

/**
 * Banner de cookies.
 *
 * Decisiones que no son de estilo:
 *
 *  · Las DOS opciones pesan lo mismo visualmente. "Solo las necesarias" no es
 *    un enlace gris escondido en una esquina: es un botón del mismo tamaño que
 *    el de aceptar. Un banner en el que rechazar cuesta más que aceptar no es
 *    consentimiento libre.
 *  · No hay X ni "cerrar". Cerrar sin elegir dejaría el estado ambiguo y
 *    volvería a preguntar en cada visita.
 *  · Se ancla ABAJO, y por encima del CTA fijo de móvil mientras está visible,
 *    para no tapar contenido ni pelearse con él.
 *  · Aparece con un retardo corto: si salta a la vez que el hero, lo primero
 *    que ve el visitante es una petición burocrática en vez de la promesa.
 *
 * `role="dialog"` con `aria-live`, pero SIN trampa de foco: no es modal a
 * propósito. Bloquear la página entera hasta responder sobre cookies es
 * hostil, y además tampoco sería consentimiento libre.
 */

const ID_GA4 = import.meta.env.PUBLIC_GA4_ID;

export function CookieBanner({ lang }: { lang?: Idioma }) {
  const [visible, setVisible] = useState(false);
  const { t } = useIdioma(lang);
  const reducir = useReducedMotion();

  useEffect(() => {
    const estado = leerConsentimiento();

    if (estado === "aceptado") {
      activarAnalitica(ID_GA4);
      return;
    }
    if (estado === "rechazado") return;

    // Sin respuesta: preguntar, pero dejando ver la página primero.
    const temporizador = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(temporizador);
  }, []);

  // El enlace "Preferencias de cookies" del pie reabre el banner.
  useEffect(() => {
    const alCambiar = (e: Event) => {
      const estado = (e as CustomEvent<string>).detail;
      setVisible(estado === "sin-respuesta");
    };
    window.addEventListener(EVENTO_CONSENTIMIENTO, alCambiar);
    return () => window.removeEventListener(EVENTO_CONSENTIMIENTO, alCambiar);
  }, []);

  const responder = (estado: "aceptado" | "rechazado") => {
    guardarConsentimiento(estado);
    setVisible(false);
    if (estado === "aceptado") activarAnalitica(ID_GA4);
  };

  const botonBase =
    "min-h-11 flex-1 rounded-full px-5 py-3 text-sm font-semibold transition-colors duration-200 " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-inverse sm:flex-none";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label={t(cookies.titulo)}
          aria-live="polite"
          initial={reducir ? { opacity: 0 } : { y: "110%" }}
          animate={reducir ? { opacity: 1 } : { y: 0 }}
          exit={reducir ? { opacity: 0 } : { y: "110%" }}
          transition={
            reducir ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
          }
          // z-55: por encima del CTA fijo (z-40) y por debajo del modal legal (z-60).
          className="fixed inset-x-0 bottom-0 z-[55] border-t border-primary-800 bg-primary-950 text-ink-inverse shadow-xl"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="container-page flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
            <p className="text-sm text-pretty text-secondary-200">
              {t(cookies.texto)}{" "}
              <a
                href={`/legal/${legalConfig.privacidad.slug}`}
                data-legal={legalConfig.privacidad.slug}
                className="font-semibold text-ink-inverse underline underline-offset-4 hover:text-secondary-300"
              >
                {t(cookies.masInfo)}
              </a>
            </p>

            <div className="flex shrink-0 gap-3">
              {/* Rechazar pesa lo mismo que aceptar. A propósito. */}
              <button
                type="button"
                onClick={() => responder("rechazado")}
                className={`${botonBase} border border-primary-700 bg-transparent text-ink-inverse hover:bg-primary-900`}
              >
                {t(cookies.soloEsenciales)}
              </button>
              <button
                type="button"
                onClick={() => responder("aceptado")}
                className={`${botonBase} bg-cta text-ink-inverse hover:bg-cta-hover`}
              >
                {t(cookies.aceptarTodo)}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CookieBanner;
