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

export function LanguageSwitch({ lang }: { lang?: Idioma }) {
  const store = useStore(idioma);
  // Igual que el resto de islas: en el servidor el store no sabe el idioma.
  const actual = typeof document === "undefined" ? (lang ?? store) : store;

  return (
    <div
      role="radiogroup"
      aria-label={actual === "es" ? "Idioma" : "Language"}
      className="flex items-center gap-1 rounded-full border border-line bg-surface-muted p-1"
    >
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
              "min-h-12 min-w-12 rounded-full px-3 text-sm font-bold transition-colors duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
              activo
                ? "bg-surface text-ink shadow-xs"
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
