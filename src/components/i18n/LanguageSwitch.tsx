import { useStore } from "@nanostores/react";
import { IDIOMAS, cambiarIdioma, idioma, type Idioma } from "@i18n/idioma";

/**
 * Selector ES | EN del header.
 *
 * Es un grupo de radio, no un botón que alterna: con dos idiomas un toggle
 * funcionaría, pero un radiogroup dice cuál está activo a un lector de pantalla
 * sin depender del color, y aguanta si algún día entra un tercer idioma.
 *
 * Cambiar de idioma no recarga: `cambiarIdioma` actualiza <html lang> (el CSS
 * hace el resto), lo guarda y reescribe `?lang=` con `replaceState`, que no
 * toca el scroll ni ensucia el historial con una entrada por cada clic.
 */

const ETIQUETAS: Record<Idioma, { corta: string; larga: Record<Idioma, string> }> = {
  es: { corta: "ES", larga: { es: "Ver en español", en: "View in Spanish" } },
  en: { corta: "EN", larga: { es: "Ver en inglés", en: "View in English" } },
};

/**
 * ─── LA PÍLDORA QUE SE DESLIZA ───────────────────────────────────────────
 *
 * El rediseño pide que el fondo del idioma activo se DESPLACE de un lado al
 * otro en vez de encenderse y apagarse. Se hace con un solo elemento absoluto
 * que se mueve con `translate`, que es una propiedad que el compositor mueve
 * solo: cero recálculo de maquetación por cada clic.
 *
 * ⚠️ EL COMPONENTE SIGUE SIENDO EL DE SIEMPRE. La demo del rediseño traía un
 * selector nuevo, visual, que alternaba una clase con JavaScript de mentira y
 * no cambiaba el idioma de nada. Este cambia `<html lang>`, lo guarda y
 * reescribe la URL. Lo que se ha adoptado es el aspecto, no el mecanismo.
 *
 * `tono` existe porque ahora también vive sobre una foto: en el hero, la
 * cabecera es transparente y el borde claro no se ve.
 */
export function LanguageSwitch({
  lang,
  tono = "claro",
}: {
  lang?: Idioma;
  tono?: "claro" | "oscuro";
}) {
  const store = useStore(idioma);
  // Igual que el resto de islas: en el servidor el store no sabe el idioma.
  const actual = typeof document === "undefined" ? (lang ?? store) : store;

  const oscuro = tono === "oscuro";
  /* Cuál de los dos está activo decide a dónde se desliza la píldora. Con dos
     idiomas basta un 0 o un 100 %; con tres habría que calcularlo. */
  const indice = IDIOMAS.indexOf(actual);

  return (
    <div
      role="radiogroup"
      aria-label={actual === "es" ? "Idioma" : "Language"}
      className={[
        "relative flex items-center gap-1 rounded-full border p-1",
        oscuro ? "border-white/30 bg-white/10" : "border-line bg-surface-muted",
      ].join(" ")}
    >
      {/* La píldora. `aria-hidden` porque el estado ya lo dice `aria-checked`
          de cada botón: para quien escucha, esto no existe. */}
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute top-1 bottom-1 left-1 w-12 rounded-full",
          "transition-transform duration-300 ease-[var(--ease-out-soft)]",
          oscuro ? "bg-white/90" : "bg-surface shadow-xs",
        ].join(" ")}
        style={{ transform: `translateX(${indice * 100}%)` }}
      />
      {IDIOMAS.map((l) => {
        const activo = l === actual;
        return (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={activo}
            onClick={() => cambiarIdioma(l)}
            className={[
              /* 48×48 reales, no 44. WCAG 2.5.5 pide 44, pero dos botones
                 pegados de 44 con 2 px de separación se fallan mutuamente:
                 el dedo que apunta a ES cae en EN. Con 48 y algo de aire, el
                 objetivo real deja de solaparse con el vecino. */
              /* `relative` para quedar por encima de la píldora, que va detrás. */
              "relative min-h-12 min-w-12 rounded-full px-3 text-sm font-bold transition-colors duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2",
              oscuro
                ? "focus-visible:outline-focus-inverse"
                : "focus-visible:outline-focus",
              activo
                ? oscuro
                  ? "text-primary-950"
                  : "text-ink"
                : oscuro
                  ? "text-white/80 hover:text-white"
                  : "text-ink-subtle hover:text-ink",
            ].join(" ")}
          >
            {/* El nombre accesible se compone del texto visible MÁS la
                aclaración. Con `aria-label="Ver en español"` a secas, el nombre
                accesible no contenía el "ES" que se ve, y eso incumple el
                criterio 2.5.3 de WCAG: quien navega por voz dice "pulsa ES" y
                el comando no encuentra el botón. */}
            {ETIQUETAS[l].corta}
            <span className="sr-only"> · {ETIQUETAS[l].larga[actual]}</span>
          </button>
        );
      })}
    </div>
  );
}

export default LanguageSwitch;
