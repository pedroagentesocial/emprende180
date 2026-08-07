import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Txt, Idioma } from "@i18n/idioma";
import { useIdioma } from "@i18n/react";

/**
 * CTA fijo inferior — solo móvil.
 *
 * Por qué existe: en móvil el usuario pasa por 12 secciones de scroll. Sin
 * esto, el botón de compra solo está disponible en 3 puntos concretos de la
 * página. Con esto, siempre está a un pulgar de distancia.
 *
 * Por qué NO aparece de entrada: taparía el hero, que es justo donde se decide
 * si sigue leyendo. Aparece al dejar atrás el hero y se esconde al llegar a la
 * sección de oferta, donde ya hay un CTA grande a la vista (dos botones
 * iguales compitiendo en pantalla restan claridad).
 *
 * Accesibilidad y movimiento:
 *  · Con `prefers-reduced-motion: reduce` aparece sin deslizamiento.
 *  · Respeta `safe-area-inset-bottom` (barra de gestos de iOS).
 *  · Se oculta a lectores de pantalla mientras no está visible.
 */
interface StickyCtaProps {
  texto: Txt;
  /** Idioma resuelto en el servidor. Sin esto la isla se renderiza en
   *  español aunque la URL pida inglés (ver src/i18n/react.ts). */
  lang?: Idioma;
  href: string;
  /** Texto pequeño a la izquierda: precio, plazas, fecha límite. */
  nota?: Txt;
  /** id del elemento tras el cual aparece. Por defecto, el hero. */
  observarDesde?: string;
  /** id del elemento al llegar al cual se esconde. */
  ocultarEn?: string;
}

export function StickyCta({
  texto,
  href,
  nota,
  observarDesde = "inicio",
  ocultarEn = "oferta",
  lang,
}: StickyCtaProps) {
  const [visible, setVisible] = useState(false);
  /** El teclado del móvil está levantado: la barra estorba, se esconde. */
  const [tecladoAbierto, setTecladoAbierto] = useState(false);
  const reducir = useReducedMotion();
  const { t } = useIdioma(lang);

  useEffect(() => {
    const hero = document.getElementById(observarDesde);
    const oferta = document.getElementById(ocultarEn);

    // Sin hero no hay referencia para decidir: se deja oculto antes que
    // arriesgarse a tapar contenido.
    if (!hero) return;

    let heroFuera = false;
    let ofertaDentro = false;

    const actualizar = () => setVisible(heroFuera && !ofertaDentro);

    const obsHero = new IntersectionObserver(
      ([entry]) => {
        heroFuera = !entry!.isIntersecting;
        actualizar();
      },
      { rootMargin: "-80px 0px 0px 0px" },
    );
    obsHero.observe(hero);

    let obsOferta: IntersectionObserver | undefined;
    if (oferta) {
      obsOferta = new IntersectionObserver(
        ([entry]) => {
          ofertaDentro = entry!.isIntersecting;
          actualizar();
        },
        { threshold: 0.25 },
      );
      obsOferta.observe(oferta);
    }

    return () => {
      obsHero.disconnect();
      obsOferta?.disconnect();
    };
  }, [observarDesde, ocultarEn]);

  /**
   * Esconde la barra mientras el visitante escribe en un campo.
   *
   * En un celular el teclado ocupa media pantalla, y la barra fija acabaría
   * montada justo encima del botón de enviar del formulario: el único botón
   * que hay que poder pulsar en ese momento. Se detecta por el foco y no por
   * la altura del viewport, porque `visualViewport` se comporta distinto en
   * iOS Safari y en Android Chrome y no es fiable para esto.
   */
  useEffect(() => {
    const esCampo = (el: EventTarget | null) =>
      el instanceof HTMLElement &&
      (el.matches("input:not([type=checkbox]):not([type=radio])") ||
        el.matches("textarea, select"));

    const alEnfocar = (e: FocusEvent) => {
      if (esCampo(e.target)) setTecladoAbierto(true);
    };
    const alDesenfocar = (e: FocusEvent) => {
      if (esCampo(e.target)) setTecladoAbierto(false);
    };

    document.addEventListener("focusin", alEnfocar);
    document.addEventListener("focusout", alDesenfocar);
    return () => {
      document.removeEventListener("focusin", alEnfocar);
      document.removeEventListener("focusout", alDesenfocar);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && !tecladoAbierto && (
        <motion.div
          initial={reducir ? { opacity: 0 } : { y: "100%" }}
          animate={reducir ? { opacity: 1 } : { y: 0 }}
          exit={reducir ? { opacity: 0 } : { y: "100%" }}
          transition={reducir ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 shadow-sticky backdrop-blur-md md:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            {nota && (
              <p className="min-w-0 flex-1 text-xs leading-tight text-ink-muted">
                {t(nota)}
              </p>
            )}
            <a
              href={href}
              data-track="sticky"
              className={[
                "inline-flex min-h-11 items-center justify-center rounded-full",
                // Mismo color de acción que el resto de CTA de la página.
                "bg-cta px-6 py-3 text-base font-semibold text-ink-inverse",
                "shadow-cta motion-safe:active:scale-[0.98]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                nota ? "shrink-0" : "flex-1",
              ].join(" ")}
            >
              {t(texto)}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default StickyCta;
