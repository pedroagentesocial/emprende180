import { useEffect, useState } from "react";
import type { Idioma, Txt } from "@i18n/idioma";
import { useIdioma } from "@i18n/react";

/**
 * Cuenta atrás hasta una fecha REAL.
 *
 * LAS TRES COSAS QUE LO SEPARAN DE UN CONTADOR FALSO
 * ──────────────────────────────────────────────────
 * 1. Cuenta hacia un instante FIJO que vive en el config, no hacia
 *    "ahora + 24 h". Recargar no lo reinicia, abrirlo en otro navegador da el
 *    mismo número y dos personas distintas ven lo mismo. Un contador que se
 *    reinicia con F5 es el truco que más rápido quema la confianza, y basta
 *    una recarga para descubrirlo.
 * 2. Cuando la fecha pasa, DESAPARECE. No se queda en 00:00:00 ni arranca otro
 *    ciclo. Si el precio no ha subido, en desarrollo sale un aviso.
 * 3. No hay parpadeos ni pulsos. Un número que cambia ya llama la atención.
 *
 * HIDRATACIÓN: el tiempo restante depende de `Date.now()`, que en el servidor
 * y en el cliente son instantes distintos. Renderizarlo en el servidor sería
 * la discrepancia de hidratación de manual (React la nombra explícitamente).
 * Así que hasta que monta se pinta el hueco con su alto reservado, y los
 * dígitos aparecen en el cliente. Cero discrepancia y cero salto de layout.
 *
 * ACCESIBILIDAD: los dígitos van `aria-hidden`. Anunciar un cambio por segundo
 * convertiría al lector de pantalla en una radio y taparía el resto de la
 * tarjeta. En su lugar hay una frase estática que dice la fecha y a cuánto
 * sube el precio, que es la información que de verdad importa.
 */

export interface EtiquetasContador {
  titulo: Txt;
  dias: Txt;
  horas: Txt;
  minutos: Txt;
  segundos: Txt;
  alternativa: Txt;
}

interface Props {
  /** Instante de cierre en ISO 8601 con zona horaria. */
  fechaCierre: string;
  /** La frase alternativa, ya interpolada en Astro (fecha + precio futuro). */
  alternativa: Txt;
  etiquetas: EtiquetasContador;
  /** Idioma resuelto en el servidor. Ver src/i18n/react.ts. */
  lang?: Idioma;
}

function restante(objetivo: number) {
  const ms = objetivo - Date.now();
  if (ms <= 0) return null;
  const seg = Math.floor(ms / 1000);
  return {
    dias: Math.floor(seg / 86400),
    horas: Math.floor((seg % 86400) / 3600),
    minutos: Math.floor((seg % 3600) / 60),
    segundos: seg % 60,
  };
}

const dosDigitos = (n: number) => String(n).padStart(2, "0");

export function Contador({ fechaCierre, alternativa, etiquetas, lang }: Props) {
  const { t } = useIdioma(lang);
  const objetivo = new Date(fechaCierre).getTime();

  /** `undefined` = todavía no ha montado. `null` = la fecha ya pasó. */
  const [tiempo, setTiempo] = useState<ReturnType<typeof restante> | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!Number.isFinite(objetivo)) return;
    setTiempo(restante(objetivo));
    const id = setInterval(() => {
      const t = restante(objetivo);
      setTiempo(t);
      if (!t) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [objetivo]);

  // Fecha inválida en el config, o ya pasó: no se pinta nada. Ver punto 2.
  if (!Number.isFinite(objetivo) || tiempo === null) return null;

  const celdas = tiempo
    ? [
        { valor: String(tiempo.dias), etiqueta: etiquetas.dias },
        { valor: dosDigitos(tiempo.horas), etiqueta: etiquetas.horas },
        { valor: dosDigitos(tiempo.minutos), etiqueta: etiquetas.minutos },
        { valor: dosDigitos(tiempo.segundos), etiqueta: etiquetas.segundos },
      ]
    : null;

  return (
    <div className="mt-6 rounded-2xl border border-secondary-200 bg-secondary-50 px-4 py-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-secondary-700">
        {t(etiquetas.titulo)}
      </p>

      {/* El hueco se reserva SIEMPRE: antes de montar está vacío, y aun así la
          tarjeta no cambia de alto cuando llegan los dígitos.
          4.25rem = 68px, que es lo que miden las celdas (2xl + etiqueta +
          padding). Estaba en `min-h-16` (64px) y esos 4 px de diferencia bastaban
          para empujar la tarjeta entera y meter 0.008 de CLS: la columna del
          precio es `justify-center`, así que cualquier cambio de alto mueve
          todo lo que hay dentro. Medido, no estimado. */}
      {/* CUATRO CELDAS QUE TIENEN QUE CABER EN 320 px.
          Esto era una fila con `min-w-14` (56px) por celda y dos puntos entre
          ellas: 296 px de ancho mínimo que no se podía negociar. Y como no se
          podía, el `min-content` de la columna del grid de la sección de precio
          se iba a 381 px dentro de un contenedor de 348: el panel entero se
          ensanchaba y la tarjeta, que es `overflow-hidden`, recortaba las
          cifras del desglose. Se veía "$2,19" en lugar de "$2,190", que en una
          página de precios es de lo peor que puede pasar.

          Ahora las celdas reparten el ancho disponible (`flex-1 min-w-0`) en
          vez de imponerlo. Los dos puntos solo aparecen de `sm` para arriba: en
          móvil son 72 px de decoración que le quitan sitio a los números, y la
          separación entre celdas ya dice lo mismo. De `sm` en adelante vuelve
          el diseño de siempre, ancho fijo y dos puntos incluidos. */}
      <div
        className="mt-3 flex min-h-[4.25rem] items-center justify-center gap-1.5 sm:gap-2"
        aria-hidden="true"
      >
        {celdas?.map((c, i) => (
          <div
            key={i}
            className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none"
          >
            {i > 0 && (
              <span className="hidden pb-4 text-2xl font-bold text-secondary-400 sm:block">
                :
              </span>
            )}
            <div className="min-w-0 flex-1 rounded-xl bg-surface px-1 py-1.5 text-center shadow-sm sm:min-w-14 sm:flex-none sm:px-2">
              <span className="block text-xl font-extrabold tabular-nums text-ink sm:text-2xl">
                {c.valor}
              </span>
              <span className="block text-[0.6rem] font-semibold uppercase tracking-wide text-ink-subtle sm:text-[0.65rem]">
                {t(c.etiqueta)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* La versión que sí se lee en voz alta. Ver la nota de accesibilidad. */}
      <p className="sr-only">{t(alternativa)}</p>
    </div>
  );
}

export default Contador;
