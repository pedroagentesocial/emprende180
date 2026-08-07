import { useState, useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Txt, Idioma } from "@i18n/idioma";
import { useIdioma } from "@i18n/react";

/**
 * Temario en acordeón, con entrada escalonada.
 *
 * Acordeón y no rejilla porque en móvil ocho módulos desplegados son tres
 * pantallas de scroll entre el lector y el precio. Cerrados ocupan una, y quien
 * quiera detalle lo abre.
 *
 * Cada cabecera muestra el título Y la línea de "qué logras": es lo que de
 * verdad reduce la incertidumbre de "¿qué incluye esto?". Un temario que lista
 * temas vende menos que uno que lista capacidades, así que la capacidad está
 * visible sin necesidad de abrir nada.
 *
 * Accesibilidad: cada cabecera es un <button> real dentro de un heading, con
 * `aria-expanded` y `aria-controls`. Teclado y lectores de pantalla funcionan
 * sin código extra.
 */

export interface ModuloVista {
  numero: number;
  titulo: Txt;
  logras: Txt;
  lecciones?: readonly Txt[];
}

interface Props {
  modulos: readonly ModuloVista[];
  /** Etiquetas "Video" y "Quiz". Cada módulo es un video con su quiz. */
  badges: { video: Txt; quiz: Txt };
  /** Idioma resuelto en el servidor. Sin esto la isla se renderiza en
   *  español aunque la URL pida inglés (ver src/i18n/react.ts). */
  lang?: Idioma;
}

const suave = [0.22, 1, 0.36, 1] as const;

export function TemarioAcordeon({ modulos, badges, lang }: Props) {
  const [abierto, setAbierto] = useState<number | null>(null);
  const reducir = useReducedMotion();
  const baseId = useId();
  const { t } = useIdioma(lang);

  return (
    <ul className="mt-12 grid gap-3">
      {modulos.map((m, i) => {
        const estaAbierto = abierto === i;
        const panelId = `${baseId}-panel-${i}`;
        const botonId = `${baseId}-boton-${i}`;
        // Solo tiene sentido abrir si hay lecciones que enseñar.
        const desplegable = Boolean(m.lecciones?.length);

        const Contenido = (
          <div
            className={[
              "overflow-hidden rounded-2xl border bg-surface transition-colors duration-200",
              estaAbierto ? "border-secondary-400" : "border-line",
            ].join(" ")}
          >
            <h3>
              <button
                id={botonId}
                type="button"
                disabled={!desplegable}
                aria-expanded={desplegable ? estaAbierto : undefined}
                aria-controls={desplegable ? panelId : undefined}
                onClick={() => desplegable && setAbierto(estaAbierto ? null : i)}
                className={[
                  "flex w-full items-start gap-4 p-5 text-left sm:p-6",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                  desplegable ? "cursor-pointer" : "cursor-default",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary-100 text-sm font-bold text-secondary-700"
                >
                  {m.numero}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold text-balance text-ink">
                    {t(m.titulo)}
                  </span>
                  {/* Video + quiz: son datos del curso, no adorno. Refuerzan
                      que cada módulo se cierra con algo, no solo se ve. */}
                  <span className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary-100 px-2 py-0.5 text-[0.7rem] font-bold text-secondary-700">
                      <svg viewBox="0 0 24 24" fill="none" className="size-3" aria-hidden="true">
                        <path d="M5 4.5v15l14-7.5-14-7.5Z" fill="currentColor" />
                      </svg>
                      {t(badges.video)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-[0.7rem] font-bold text-primary-800">
                      <svg viewBox="0 0 24 24" fill="none" className="size-3" strokeWidth="3.5" aria-hidden="true">
                        <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {t(badges.quiz)}
                    </span>
                  </span>
                  <span className="mt-2 flex gap-2 text-base text-pretty text-ink-muted">
                    <span
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-secondary-600"
                    >
                      →
                    </span>
                    <span>{t(m.logras)}</span>
                  </span>
                </span>

                {desplegable && (
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: estaAbierto ? 45 : 0 }}
                    transition={reducir ? { duration: 0 } : { duration: 0.25, ease: suave }}
                    className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-surface-sunken text-xl leading-none text-ink-muted"
                  >
                    +
                  </motion.span>
                )}
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {estaAbierto && desplegable && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={botonId}
                  initial={reducir ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reducir ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={reducir ? { duration: 0 } : { duration: 0.3, ease: suave }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-2 border-t border-line px-5 py-5 pl-[4.25rem] sm:px-6 sm:pl-[4.75rem]">
                    {m.lecciones!.map((l) => (
                      <li key={l.es} className="flex gap-2.5 text-base text-ink-muted">
                        <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-secondary-500" />
                        {t(l)}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

        if (reducir) return <li key={m.numero} className="min-w-0">{Contenido}</li>;

        return (
          <motion.li
            key={m.numero}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: i * 0.05, ease: suave }}
            className="min-w-0"
          >
            {Contenido}
          </motion.li>
        );
      })}
    </ul>
  );
}

export default TemarioAcordeon;
