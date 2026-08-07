import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { copy } from "@config/curso.config";
import { useIdioma } from "@i18n/react";

/**
 * Modal accesible sobre <dialog> nativo.
 *
 * Se usa <dialog showModal()> porque el navegador ya resuelve gratis lo que
 * cuesta caro a mano: foco atrapado dentro, resto de la página inerte, cierre
 * con Escape y capa superior sin pelearse con los z-index.
 *
 * Motion solo pinta la entrada/salida; con `prefers-reduced-motion: reduce`
 * aparece y desaparece sin transición.
 *
 * OJO: nunca abrir esto en respuesta al scroll o a un temporizador en móvil.
 * En una landing de conversión, un modal que interrumpe la lectura resta.
 */
interface ModalProps {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  children: ReactNode;
}

export function Modal({ abierto, onCerrar, titulo, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reducir = useReducedMotion();
  const { t } = useIdioma();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (abierto && !dialog.open) {
      dialog.showModal();
      // Bloquea el scroll de fondo: en iOS <dialog> no lo hace por sí solo.
      document.body.style.overflow = "hidden";
    } else if (!abierto && dialog.open) {
      dialog.close();
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  /* Esc y el botón "atrás" cierran el <dialog> sin pasar por `onCerrar`, así
     que el estado del padre hay que sincronizarlo desde los eventos nativos.
     Se escuchan los DOS: "cancel" es el que dispara Esc y llega primero, y
     depender solo de "close" dejaba el diálogo cerrado pero el estado en
     abierto, con el scroll del fondo bloqueado para siempre. */

  const transicion = reducir
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <dialog
      ref={dialogRef}
      aria-label={titulo}
      onClose={onCerrar}
      onCancel={onCerrar}
      onClick={(e) => {
        // Clic en el backdrop (fuera del panel) → cerrar.
        if (e.target === dialogRef.current) onCerrar();
      }}
      className="m-0 max-h-none max-w-none bg-transparent p-0 backdrop:bg-neutral-950/60 backdrop:backdrop-blur-sm"
      style={{ width: "100%", height: "100%" }}
    >
      <AnimatePresence>
        {abierto && (
          <div className="grid min-h-full place-items-end p-0 sm:place-items-center sm:p-6">
            <motion.div
              initial={reducir ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducir ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              transition={transicion}
              className="w-full max-w-lg rounded-t-2xl bg-surface p-6 shadow-xl sm:rounded-2xl"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <h2 className="text-2xl font-bold text-ink">{titulo}</h2>
                <button
                  type="button"
                  onClick={onCerrar}
                  aria-label={t(copy.ui.cerrar)}
                  className="-mr-2 -mt-1 grid size-11 shrink-0 place-items-center rounded-full text-2xl leading-none text-ink-muted hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  ×
                </button>
              </div>
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </dialog>
  );
}

export default Modal;
