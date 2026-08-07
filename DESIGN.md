# Sistema de diseño — Emprende180

Todo vive en `src/styles/tokens.css` vía `@theme` de Tailwind v4. **Ningún
componente escribe un color, una fuente ni un radio literal.** Si un valor no
está aquí, no se usa.

## Origen de la identidad

No es una paleta elegida: está **extraída de la guía de marca real** que hay en
`public/identidad/identidad emprende.png`, y verificada muestreando los píxeles
del logo. Ver la cabecera de `tokens.css` para la trazabilidad de cada color.

## Color

Estrategia: **Committed**. El navy carga las superficies oscuras y todo el
texto; el teal es el único color de acción y no se usa para nada más.

| HEX | Rol | Token | OKLCH |
|---|---|---|---|
| `#0D2B4D` | Navy, primario | `--color-primary-900` | `oklch(0.287 0.0718 253.9)` |
| `#11A79D` | Teal, acción | `--color-secondary-500` | `oklch(0.657 0.1122 187.2)` |
| `#A7E1DA` | Teal claro | `--color-secondary-200` | `oklch(0.868 0.0599 186.9)` |
| `#F2F4F7` | Off-white | `--color-neutral-100` | `oklch(0.966 0.0045 258.3)` |

Esos cuatro pasos son exactos; el resto de cada rampa está interpolado en OKLCH
con el tono fijo.

- **La marca solo tiene dos tonos.** No se inventó un tercero:
  `--color-accent-*` apunta al teal.
- Los neutrales llevan el tono del navy (253.9°) con croma 0.005–0.014. **No hay
  gris puro ni negro puro** en ninguna parte.
- Las sombras van tintadas con el navy; la del CTA, con el teal.
- Los estados (éxito/error) son verde y rojo por convención universal: un error
  con color de marca deja de leerse como error.

**Un solo color de CTA en toda la página**: `--color-cta` (teal-600). Botones,
envío del formulario y CTA fijo de móvil usan el mismo. Si algo es pulsable y
principal, es teal.

### Contraste

Cada par de uso real está medido contra WCAG AA con `npm run marca:paleta`
(17 pares, 0 fallos). Dos luminosidades se apartaron de la interpolación limpia
justo por eso y están marcadas en el archivo:

- `secondary-600` bajó a L .548 para que el blanco encima llegue a 4.69:1.
- `neutral-400` bajó a L .638 porque es el borde de los inputs y WCAG 1.4.11
  exige 3:1 en controles.

**No cambiar esas dos sin volver a medir.**

## Tipografía

**Montserrat**, la que especifica la guía de marca. Autoalojada con
`@fontsource-variable/montserrat`: cero peticiones a terceros, cero bloqueo de
render, cero fuga de IP de los visitantes.

Es geométrica y directa, que es exactamente la voz de la marca. No se le busca
pareja: una familia con contraste fuerte de peso manda más que un dúo tímido.

- Titulares con `clamp()` fluido. El h1 usa `--text-hero` (2.25→4.5rem).
- Cuerpo a 65–75ch (`--container-read`, 42rem).
- Interlineado del cuerpo generoso (1.65): se lee en pantalla pequeña.
- Sobre fondo navy, el interlineado sube: el texto claro pesa menos.

## Movimiento

- Curvas de salida exponenciales. **Nada de rebote ni elástico.**
- Entrada al scroll: `Reveal.astro`, un solo IntersectionObserver para toda la
  página. Motion solo donde hay que orquestar de verdad (escalonados,
  acordeones, formulario, CTA fijo, banner).
- `prefers-reduced-motion` en cada componente, con red de seguridad global.
- El estado oculto lo aplica una clase que pone el propio script: **si el JS
  falla, el contenido se ve**.

## Layout

- `--container-page` 72rem, `--container-read` 42rem.
- Ritmo vertical variable por sección: las secciones de argumento respiran más
  que las de trámite.
- Objetivo táctil mínimo 44 px (`min-h-11`). Inputs a 16 px o iOS hace zoom.

## Prohibiciones del proyecto

- Etiqueta diminuta en mayúsculas encima de **cada** título de sección. Un
  kicker puntual es voz; repetirlo como gramática es andamiaje.
- Rejillas de tarjetas idénticas (icono + título + texto en bucle).
- Texto con degradado, bordes laterales de color como acento, glassmorphism
  decorativo.
- Raya (—) en el texto de cara al usuario. Coma, dos puntos o punto.
- Centrarlo todo. La alternancia entre centrado y alineado a la izquierda es
  parte del ritmo.
