import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Idioma, Txt } from "@i18n/idioma";
import { useIdioma } from "@i18n/react";

/**
 * Carrusel de testimonios.
 *
 * POR QUÉ SCROLL NATIVO Y NO UN TRACK CON `transform`
 * ───────────────────────────────────────────────────
 * La pista es un contenedor con `overflow-x: auto` y `scroll-snap`. Eso da
 * gratis y bien hecho lo que reimplementar con transform da mal: arrastre con
 * el dedo con la inercia del sistema, rueda horizontal del trackpad, scroll con
 * teclado, y la barra de desplazamiento cuando el sistema la muestra. Los
 * botones y los puntos solo llaman a `scrollTo`. Nada de física a mano.
 *
 * ACCESIBILIDAD, que en un carrusel es la mitad del trabajo
 * ─────────────────────────────────────────────────────────
 * · WCAG 2.2.2 (Pause, Stop, Hide): cualquier cosa que se mueva sola más de
 *   cinco segundos necesita un control para pararla. De ahí el botón de pausa,
 *   que no es un adorno: sin él esto sería un fallo de accesibilidad.
 * · El avance automático se detiene solo al pasar el ratón por encima, al
 *   entrar el foco del teclado y cuando el carrusel no está en pantalla. Que
 *   una tarjeta cambie mientras alguien la está leyendo es lo peor que puede
 *   hacer un carrusel.
 * · `prefers-reduced-motion` desactiva el avance automático por completo y deja
 *   los saltos instantáneos. Sigue funcionando entero, solo que a mano.
 * · La pista es `tabIndex={0}`: es una región desplazable, y el teclado tiene
 *   que poder recorrerla sin depender de los botones.
 *
 * NO hay `aria-live`. Con avance automático, anunciar cada cambio convierte al
 * lector de pantalla en una radio. Cada tarjeta es un `role="group"` con su
 * posición, que es lo que sirve para orientarse.
 */

export interface TestimonioVista {
  nombre: string;
  contexto: Txt;
  cita: Txt;
  foto: string | null;
  resultado?: Txt;
}

export interface EtiquetasCarrusel {
  etiqueta: Txt;
  rol: Txt;
  anterior: Txt;
  siguiente: Txt;
  posicion: Txt;
  irA: Txt;
  pausar: Txt;
  reanudar: Txt;
}

interface Props {
  items: readonly TestimonioVista[];
  etiquetas: EtiquetasCarrusel;
  /** Idioma resuelto en el servidor. Sin esto la isla se renderiza en español
   *  aunque la URL pida inglés (ver src/i18n/react.ts). */
  lang?: Idioma;
}

/** Cada cuánto avanza. Seis segundos es lo que cuesta leer una cita entera. */
const INTERVALO = 6000;

/** Iniciales para cuando no hay foto. Mejor eso que un avatar de stock. */
function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0] ?? "")
    .join("")
    .toUpperCase();
}

export function TestimoniosCarrusel({ items, etiquetas, lang }: Props) {
  const { t, ti } = useIdioma(lang);
  const reducir = useReducedMotion();
  const baseId = useId();

  const pista = useRef<HTMLUListElement>(null);
  const [indice, setIndice] = useState(0);
  const [pausaManual, setPausaManual] = useState(false);
  const [interactuando, setInteractuando] = useState(false);
  const [visible, setVisible] = useState(false);
  /** Falso en el servidor y en el primer render del cliente. Ver el botón de
   *  pausa, abajo: es lo que evita la discrepancia al hidratar. */
  const [montado, setMontado] = useState(false);

  const total = items.length;

  /** El avance automático solo corre si TODO está a favor. */
  const avanzando = !reducir && !pausaManual && !interactuando && visible;

  /* ── Dónde empieza cada tarjeta dentro de la pista ──────────────────────
     Con rectángulos y no con `offsetLeft`. `offsetLeft` se mide contra el
     `offsetParent`, que aquí NO es la pista (es estática, así que el navegador
     la salta y sube al ancestro posicionado más cercano), y además no descuenta
     el padding lateral de la pista: la primera tarjeta acababa a 16 px de donde
     tenía que estar y perdía su margen contra el borde de la pantalla.
     La diferencia de rectángulos más el scroll actual es exacta siempre. */
  const posicionDe = (el: HTMLElement, carta: HTMLElement) => {
    const padIzq = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    return (
      el.scrollLeft +
      carta.getBoundingClientRect().left -
      el.getBoundingClientRect().left -
      padIzq
    );
  };

  const irA = useCallback(
    (i: number) => {
      const el = pista.current;
      if (!el) return;
      const carta = el.children[i] as HTMLElement | undefined;
      if (!carta) return;
      el.scrollTo({
        left: posicionDe(el, carta),
        behavior: reducir ? "auto" : "smooth",
      });
    },
    [reducir],
  );

  const siguiente = useCallback(() => {
    const el = pista.current;
    if (!el) return;
    /* Si ya se ve el final de la pista, la siguiente es volver al principio.
       Con 3 tarjetas visibles las últimas nunca llegan a quedar la primera, así
       que contar solo índices dejaría el carrusel atascado al final. */
    const alFinal = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    irA(alFinal ? 0 : Math.min(indice + 1, total - 1));
  }, [indice, irA, total]);

  const anterior = useCallback(() => {
    irA(Math.max(indice - 1, 0));
  }, [indice, irA]);

  /* ── Qué tarjeta manda ahora ────────────────────────────────────────────
     Se recalcula desde el scroll (no al revés) para que arrastrar con el dedo
     actualice los puntos igual que pulsar los botones. Con rAF para no hacer
     el trabajo en cada evento de scroll. */
  useEffect(() => {
    const el = pista.current;
    if (!el) return;

    let pendiente = 0;
    const alHacerScroll = () => {
      cancelAnimationFrame(pendiente);
      pendiente = requestAnimationFrame(() => {
        const izq = el.getBoundingClientRect().left;
        let cerca = 0;
        let mejor = Infinity;
        for (let i = 0; i < el.children.length; i++) {
          const c = el.children[i] as HTMLElement;
          const d = Math.abs(c.getBoundingClientRect().left - izq);
          if (d < mejor) {
            mejor = d;
            cerca = i;
          }
        }
        setIndice(cerca);
      });
    };

    el.addEventListener("scroll", alHacerScroll, { passive: true });
    return () => {
      cancelAnimationFrame(pendiente);
      el.removeEventListener("scroll", alHacerScroll);
    };
  }, []);

  useEffect(() => setMontado(true), []);

  /* ── Parar cuando no se ve ──────────────────────────────────────────────
     Un carrusel girando fuera de pantalla gasta batería y, peor, hace que al
     volver a él la tarjeta no sea la que el visitante dejó. */
  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setVisible(Boolean(e?.isIntersecting)),
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── El avance ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!avanzando) return;
    const id = setInterval(siguiente, INTERVALO);
    return () => clearInterval(id);
  }, [avanzando, siguiente]);

  const pausar = () => setPausaManual((p) => !p);

  return (
    <div
      role="region"
      aria-roledescription={t(etiquetas.rol)}
      aria-label={t(etiquetas.etiqueta)}
      className="mt-12"
      onMouseEnter={() => setInteractuando(true)}
      onMouseLeave={() => setInteractuando(false)}
      onFocusCapture={() => setInteractuando(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setInteractuando(false);
        }
      }}
    >
      {/* La pista. `-mx-4 px-4` deja que las tarjetas lleguen al borde de la
          pantalla en móvil sin romper el contenedor, y `pb-4` reserva el sitio
          de la barra de scroll donde el sistema la dibuja siempre. */}
      <ul
        ref={pista}
        tabIndex={0}
        className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 [scrollbar-width:thin] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus sm:-mx-6 sm:px-6"
      >
        {items.map((item, i) => (
          <li
            key={`${item.nombre}-${i}`}
            role="group"
            aria-roledescription={t(etiquetas.rol)}
            aria-label={ti(etiquetas.posicion, { n: i + 1, total })}
            className="min-w-0 shrink-0 basis-[86%] snap-start sm:basis-[46%] lg:basis-[31.5%]"
          >
            <figure className="relative flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-sm">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-5 top-3 select-none font-display text-6xl leading-none text-secondary-100"
              >
                &rdquo;
              </span>

              {item.resultado && (
                <p className="mb-4 inline-flex max-w-full self-start rounded-full bg-secondary-100 px-3 py-1 text-xs font-bold break-words text-secondary-700">
                  {t(item.resultado)}
                </p>
              )}

              <blockquote className="flex-1 text-base text-pretty text-ink">
                <p>«{t(item.cita)}»</p>
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                {item.foto ? (
                  <img
                    src={item.foto}
                    alt=""
                    width="400"
                    height="400"
                    loading="lazy"
                    decoding="async"
                    className="size-11 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-100 text-sm font-bold text-primary-900"
                  >
                    {iniciales(item.nombre)}
                  </span>
                )}
                {/* `min-h-10` reserva las DOS líneas que ocupa la ubicación
                    más larga. Sin eso, la tarjeta con una ubicación corta tiene
                    el pie 20 px más bajo que las demás y, como todas miden lo
                    mismo y el pie va abajo, el filete horizontal queda
                    desalineado entre tarjetas vecinas. Se nota. */}
                <span className="min-w-0">
                  <span className="block font-semibold text-ink">
                    {item.nombre}
                  </span>
                  <span className="block min-h-10 text-sm text-ink-subtle">
                    {t(item.contexto)}
                  </span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {/* Controles. Los puntos van en medio para que en móvil los dos botones
          queden en los extremos, donde llega el pulgar. */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={anterior}
          disabled={indice === 0}
          aria-label={t(etiquetas.anterior)}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-35"
        >
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <ul className="flex items-center gap-2">
          {items.map((item, i) => (
            <li key={`punto-${item.nombre}-${i}`} className="relative grid place-items-center">
              <button
                type="button"
                onClick={() => irA(i)}
                aria-label={ti(etiquetas.irA, { n: i + 1 })}
                aria-current={i === indice ? "true" : undefined}
                className="grid size-11 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                {/* El punto activo es una píldora que SE DESPLAZA de una
                    posición a otra, no dos puntos que se encienden y apagan.
                    Es el trabajo para el que existe `layoutId` en Motion y da
                    la referencia de "vas por aquí" que un carrusel necesita. */}
                {i === indice && (
                  <motion.span
                    layoutId={`${baseId}-punto`}
                    aria-hidden="true"
                    className="absolute h-2.5 w-6 rounded-full bg-secondary-600"
                    transition={
                      reducir
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 34 }
                    }
                  />
                )}
                <span
                  aria-hidden="true"
                  className={[
                    "size-2.5 rounded-full transition-colors",
                    i === indice ? "bg-transparent" : "bg-line-strong",
                  ].join(" ")}
                />
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={siguiente}
          aria-label={t(etiquetas.siguiente)}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* WCAG 2.2.2. Solo aparece si de verdad hay algo que pausar: con
          `prefers-reduced-motion` no hay avance automático, así que un botón
          de pausa ahí solo sería una promesa falsa.

          El envoltorio se renderiza SIEMPRE, con su alto reservado, y el botón
          espera a `montado`. El servidor no puede conocer la preferencia de
          movimiento, así que si el botón dependiera solo de `reducir` el
          servidor lo pintaría y el cliente con la preferencia activa lo
          quitaría al hidratar: un aviso de discrepancia en consola y un salto
          de layout. Reservando el hueco, no hay ni lo uno ni lo otro. */}
      <div className="mt-3 flex min-h-11 justify-center">
        {montado && !reducir && (
          <button
            type="button"
            onClick={pausar}
            aria-pressed={pausaManual}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-ink-subtle transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="currentColor">
              {pausaManual ? (
                <path d="M8 5v14l11-7z" />
              ) : (
                <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
              )}
            </svg>
            {t(pausaManual ? etiquetas.reanudar : etiquetas.pausar)}
          </button>
        )}
      </div>
    </div>
  );
}

export default TestimoniosCarrusel;
