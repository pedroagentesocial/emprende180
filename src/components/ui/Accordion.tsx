import { useState, useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Txt, Idioma } from "@i18n/idioma";
import { useIdioma } from "@i18n/react";
import { resaltarPendientes } from "@lib/pendientes";

/**
 * Acordeón para las FAQs. Isla de React: necesita estado abierto/cerrado.
 *
 * Accesibilidad: cada cabecera es un <button> real dentro de un heading, con
 * `aria-expanded` y `aria-controls`. Se navega con Tab y se activa con Enter
 * o Espacio sin código extra.
 *
 * Movimiento: con `prefers-reduced-motion: reduce` el panel aparece y
 * desaparece sin animar — nada de altura animada ni fundidos.
 */
export interface AccordionItem {
  pregunta: Txt;
  respuesta: Txt;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Idioma resuelto en el servidor. Sin esto la isla se renderiza en
   *  español aunque la URL pida inglés (ver src/i18n/react.ts). */
  lang?: Idioma;
  /** Índice abierto de inicio. `null` = todos cerrados. */
  inicial?: number | null;
}

export function Accordion({ items, inicial = null, lang }: AccordionProps) {
  const [abierto, setAbierto] = useState<number | null>(inicial);
  const reducir = useReducedMotion();
  const baseId = useId();
  const { t } = useIdioma(lang);

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const estaAbierto = abierto === i;
        const panelId = `${baseId}-panel-${i}`;
        const botonId = `${baseId}-boton-${i}`;

        return (
          <div key={item.pregunta.es}>
            <h3>
              <button
                id={botonId}
                type="button"
                aria-expanded={estaAbierto}
                aria-controls={panelId}
                onClick={() => setAbierto(estaAbierto ? null : i)}
                className="flex min-h-11 w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                <span className="text-base font-semibold text-ink sm:text-lg">
                  {t(item.pregunta)}
                </span>
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: estaAbierto ? 45 : 0 }}
                  transition={reducir ? { duration: 0 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-sunken text-xl leading-none text-ink-muted"
                >
                  +
                </motion.span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {estaAbierto && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={botonId}
                  initial={reducir ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reducir ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={reducir ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  {/* Las respuestas mezclan copy real con HECHOS que el
                      cliente tiene que rellenar. Se resaltan en ámbar para que
                      un `[COMPLETAR: X horas]` no se cuele a producción
                      disfrazado de texto normal. El HTML lo genera nuestro
                      propio helper desde el config: no hay entrada de usuario. */}
                  <p
                    className="pb-5 pr-10 text-base leading-relaxed text-ink-muted"
                    dangerouslySetInnerHTML={{
                      __html: resaltarPendientes(t(item.respuesta)),
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
