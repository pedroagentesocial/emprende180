import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Vídeo decorativo del hero.
 *
 * Tres reglas, todas por el mismo motivo — que el móvil no pague la factura:
 *
 *  1. En pantallas de menos de 768 px NO se descarga el vídeo. Se muestra solo
 *     el póster. Un loop de 2 MB sobre datos móviles retrasa el LCP en la
 *     única pantalla que ve el 73 % de los compradores.
 *  2. Con `prefers-reduced-motion: reduce` tampoco se reproduce: póster fijo.
 *     Un fondo en bucle es justo el tipo de movimiento que esa preferencia
 *     existe para eliminar.
 *  3. Siempre `muted` + `playsInline` + `loop` y sin controles. Un vídeo con
 *     sonido automático hace que la gente cierre la pestaña, no que se quede.
 *
 * Al ser decorativo lleva `aria-hidden`: no aporta nada a quien usa lector de
 * pantalla y solo añadiría ruido.
 */
interface HeroVideoProps {
  webm: string;
  mp4: string;
  poster: string | null;
}

export function HeroVideo({ webm, mp4, poster }: HeroVideoProps) {
  const reducir = useReducedMotion();
  const [reproducir, setReproducir] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reducir) {
      setReproducir(false);
      return;
    }
    const mq = window.matchMedia("(min-width: 768px)");
    const aplicar = () => setReproducir(mq.matches);
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => mq.removeEventListener("change", aplicar);
  }, [reducir]);

  const clases =
    "aspect-[4/3] w-full rounded-2xl object-cover shadow-lg";

  if (!reproducir) {
    return poster ? (
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        className={clases}
        width={1920}
        height={1440}
        fetchPriority="high"
        decoding="async"
      />
    ) : (
      <div aria-hidden="true" className={`${clases} bg-surface-sunken`} />
    );
  }

  return (
    <video
      ref={ref}
      aria-hidden="true"
      className={clases}
      poster={poster ?? undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    >
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}

export default HeroVideo;
