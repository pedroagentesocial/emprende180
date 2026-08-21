/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EL MANDO DE PARADA DE TODO LO QUE SE MUEVE SOLO
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * En la página hay dos cosas que se desplazan sin parar y comparten el mismo
 * CSS (`[data-banda]` / `[data-banda-pista]` en global.css): la banda de
 * testimonios y las tres tiras de anuncios. Este módulo es su botón de pausa,
 * y vive aquí y no dentro de un componente por el mismo motivo por el que el
 * movimiento vive en un solo bloque de CSS: dos implementaciones de lo mismo
 * acaban desincronizándose, y esta en concreto es la que hace que la página
 * cumpla la WCAG.
 *
 * ─── WCAG 2.2.2 (NIVEL A), Y POR QUÉ EL HOVER NO BASTA ─────────────────────
 *
 * Todo lo que se mueve solo durante más de cinco segundos tiene que poder
 * pararse. La banda de testimonios ya tenía botón; las tiras de anuncios NO:
 * se paraban al pasar el cursor y al tabular dentro, y ninguna de las dos
 * cosas existe en un teléfono. O sea que en la pantalla por la que entra el
 * 73 % de esta audiencia había tres tiras de texto en movimiento perpetuo y
 * ninguna forma de detenerlas. Eso es exactamente el fallo que la norma
 * describe, y no es un tecnicismo: quien lee despacio, quien tiene dislexia o
 * quien simplemente va en un autobús no puede leer una frase que se desplaza.
 *
 * Ahora las cuatro llevan el mismo mando.
 *
 * ─── POR QUÉ SE MUEVE UN ATRIBUTO Y NO EL DOM ──────────────────────────────
 *
 * Parar una animación CSS con `animation-play-state` la deja EXACTAMENTE donde
 * estaba. Cualquier cosa que altere el marcado de la pista la reiniciaría desde
 * el principio, y una tira que salta al pulsar "pausa" se lee como un error.
 *
 * ─── IDEMPOTENTE A PROPÓSITO ───────────────────────────────────────────────
 *
 * `montarBandas()` recorre TODAS las bandas del documento, y la llaman los dos
 * componentes. En una página que tenga las dos (la portada, cuando haya
 * testimonios) se ejecutaría dos veces y cada botón acabaría con dos escuchas:
 * un clic pausaría y reanudaría en el mismo gesto, o sea que el botón dejaría
 * de funcionar justo donde más falta hace. `data-montada` lo impide.
 */

/** Marca el idioma activo con el formato en que Astro deja los `data-*`. */
function claveIdioma(base: string): string {
  return document.documentElement.lang === "en" ? `${base}En` : `${base}Es`;
}

function montarBanda(banda: HTMLElement) {
  /* Ya montada por el otro componente: no se duplica la escucha. */
  if (banda.dataset.montada) return;

  const boton = banda.querySelector<HTMLButtonElement>("[data-banda-pausa]");
  if (!boton) return;

  banda.dataset.montada = "1";
  if (!banda.dataset.pausada) banda.dataset.pausada = "false";

  const iconoPausa = boton.querySelector<SVGElement>("[data-icono-pausa]");
  const iconoPlay = boton.querySelector<SVGElement>("[data-icono-play]");

  const pintar = () => {
    const pausada = banda.dataset.pausada === "true";

    /* El rótulo dice lo que el botón VA A HACER, no en qué estado está: es lo
       que espera quien lo oye en un lector de pantalla. El estado lo lleva
       `aria-pressed`, que es su sitio. */
    const etiqueta =
      boton.dataset[claveIdioma(pausada ? "etiquetaReanudar" : "etiquetaPausar")];
    if (etiqueta) boton.setAttribute("aria-label", etiqueta);

    boton.setAttribute("aria-pressed", String(pausada));
    iconoPausa?.classList.toggle("hidden", pausada);
    iconoPlay?.classList.toggle("hidden", !pausada);
  };

  boton.addEventListener("click", () => {
    banda.dataset.pausada = banda.dataset.pausada === "true" ? "false" : "true";
    pintar();
  });

  /* Al cambiar de idioma sin recargar hay que reescribir el `aria-label`: lo
     pone JavaScript, así que el truco de CSS de `<T>` no lo alcanza. */
  window.addEventListener("e180:idioma", pintar);
  pintar();
}

/** Monta el mando de parada de todas las bandas del documento. */
export function montarBandas() {
  document.querySelectorAll<HTMLElement>("[data-banda]").forEach(montarBanda);
}
