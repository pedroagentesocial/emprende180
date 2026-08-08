import { motion, useReducedMotion } from "motion/react";
import type { Txt, Idioma } from "@i18n/idioma";
import { useIdioma } from "@i18n/react";

/**
 * Lista con entrada escalonada.
 *
 * Los elementos llegan como DATOS bilingües `{es, en}`, no como hijos de
 * Astro, por dos razones: Motion solo puede escalonar hijos que él mismo
 * renderiza, y así el componente puede cambiar de idioma suscribiéndose al
 * store sin volver a montarse.
 *
 * El escalonado es de 60 ms: lo justo para que el ojo perciba una cascada. Por
 * encima de ~100 ms, una lista de seis elementos tarda más de medio segundo en
 * aparecer entera y se siente lenta.
 */

export type VarianteLista = "check" | "cross" | "bullet" | "numerada" | "plana";

export interface ItemLista {
  texto: Txt;
  detalle?: Txt;
}

interface StaggerListProps {
  items: ItemLista[];
  /** Idioma resuelto en el servidor. Sin esto la isla se renderiza en
   *  español aunque la URL pida inglés (ver src/i18n/react.ts). */
  lang?: Idioma;
  variante?: VarianteLista;
  /** Sobre fondo oscuro. */
  inverso?: boolean;
  columnas?: boolean;
  className?: string;
}

/**
 * ⚠️ `reducir` NO puede cambiar el ÁRBOL que se renderiza, solo la transición.
 *
 * Antes había aquí un `if (reducir) return <ul>…</ul>` con marcado distinto, y
 * hacía invisible media página a quien navega con «reducir movimiento»:
 *
 *   · El servidor no puede saber esa preferencia, así que renderizaba SIEMPRE
 *     la rama animada, y Motion hornea `style="opacity:0"` en el HTML.
 *   · El cliente con la preferencia activada devolvía la rama estática, sin
 *     `style`.
 *   · React NO parchea las discrepancias de ATRIBUTOS al hidratar (lo dice su
 *     propio aviso: "this won't be patched up"). El `opacity:0` del servidor se
 *     quedaba en el DOM y ya nadie lo quitaba: la lista no aparecía jamás.
 *
 * Con el mismo árbol en los dos casos no hay discrepancia, Motion toma el
 * control y con `duration: 0` salta a visible sin un solo píxel de movimiento,
 * que es justo lo que pide la preferencia.
 */
const variantes = (reducir: boolean) => ({
  contenedor: {
    oculto: {},
    visible: { transition: { staggerChildren: reducir ? 0 : 0.06 } },
  },
  elemento: {
    /* `y: 16` SIEMPRE, también con `reducir`. Si variara con la preferencia,
       el servidor escribiría `translateY(16px)` y el cliente `none`, y vuelve
       la discrepancia que este comentario existe para evitar. Con `duration:
       0` el salto de 16 px ocurre en un solo fotograma, antes de que se vea:
       no es movimiento, y la preferencia queda respetada igual. */
    oculto: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reducir
        ? { duration: 0 }
        : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
    },
  },
});

function Icono({
  variante,
  inverso,
  indice,
}: {
  variante: VarianteLista;
  inverso: boolean;
  indice: number;
}) {
  const base = "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full";

  if (variante === "check") {
    return (
      <span
        aria-hidden="true"
        className={`${base} ${inverso ? "bg-secondary-500/20 text-secondary-300" : "bg-secondary-100 text-secondary-700"}`}
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-3.5" strokeWidth="3.5">
          <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }

  if (variante === "cross") {
    return (
      <span
        aria-hidden="true"
        className={`${base} ${inverso ? "bg-error-500/20 text-error-500" : "bg-error-50 text-error-600"}`}
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-3.5" strokeWidth="3.5">
          <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeLinecap="round" />
        </svg>
      </span>
    );
  }

  if (variante === "numerada") {
    return (
      <span
        aria-hidden="true"
        className={`${base} text-xs font-bold ${inverso ? "bg-secondary-500/20 text-secondary-300" : "bg-secondary-100 text-secondary-700"}`}
      >
        {indice + 1}
      </span>
    );
  }

  if (variante === "bullet") {
    return (
      <span
        aria-hidden="true"
        className={`mt-2.5 size-1.5 shrink-0 rounded-full ${inverso ? "bg-secondary-400" : "bg-secondary-600"}`}
      />
    );
  }

  return null;
}

export function StaggerList({
  items,
  variante = "check",
  inverso = false,
  columnas = false,
  className = "",
  lang,
}: StaggerListProps) {
  const reducir = useReducedMotion();
  const { t } = useIdioma(lang);

  const clasesUl = ["grid gap-4", columnas ? "sm:grid-cols-2 sm:gap-x-8" : "", className].join(" ");

  const Contenido = ({ item, i }: { item: ItemLista; i: number }) => (
    <>
      <Icono variante={variante} inverso={inverso} indice={i} />
      <div>
        <p className={inverso ? "text-ink-inverse" : "text-ink"}>{t(item.texto)}</p>
        {item.detalle && (
          <p className={`mt-1 text-sm ${inverso ? "text-secondary-200" : "text-ink-muted"}`}>
            {t(item.detalle)}
          </p>
        )}
      </div>
    </>
  );

  // Mismo árbol con y sin `reducir`. Ver el bloque de `variantes`.
  const { contenedor, elemento } = variantes(Boolean(reducir));

  return (
    <motion.ul
      className={clasesUl}
      variants={contenedor}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {items.map((item, i) => (
        // La clave es el texto en español y no el traducido: si cambiara con el
        // idioma, React desmontaría y volvería a montar toda la lista, y la
        // animación de entrada se repetiría en cada cambio.
        <motion.li key={item.texto.es} variants={elemento} className="flex gap-3">
          <Contenido item={item} i={i} />
        </motion.li>
      ))}
    </motion.ul>
  );
}

export default StaggerList;
