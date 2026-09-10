# `/public/imagenes/hero` — Las dos fotos del díptico

La primera pantalla de la home es un **díptico**: dos fotos partidas por la
mitad, una persona en cada lado, el botón en la costura. Aquí van esas dos.

| Archivo     | Quién                | Dónde va          |
| ----------- | -------------------- | ----------------- |
| `ella.webp` | Una Embajadora       | Mitad izquierda   |
| `el.webp`   | Un Embajador         | Mitad derecha     |

**Se dejan aquí y ya está.** No hay que tocar código ni config: mientras no
existan, cada mitad usa una foto de banco que ya está puesta; en cuanto
aparecen, mandan ellas y se ignora el recorte que traía la de banco.

## Cómo tienen que ser

- **VERTICALES.** Cada una ocupa media pantalla de alto completo. Una
  horizontal de 16:9 se recorta a una franja central y la persona se pierde.
  **1400×1800 px** para arriba (3:4 o más alargada).
- **Mirando HACIA EL CENTRO** del díptico: ella hacia su derecha, él hacia su
  izquierda. Es lo que hace que las dos mitades se lean como una sola imagen y
  no como dos fotos pegadas.
- **Con aire en el lado de FUERA** (ella a la izquierda, él a la derecha): ahí
  es donde cae el texto.
- **Oscuras en ese lado de fuera.** El texto blanco se sostiene con un velo que
  arranca en ese borde. Si la foto es clara de lado a lado, el velo tiene que
  taparla entera para que se lea, y entonces ya no se ve la foto.
- `.webp`, **menos de 150 KB cada una**. Es lo primero que carga la página y el
  73 % de la gente llega desde el móvil con datos.

## Qué se ve en ellas

La página le habla a dos personas a la vez, y cada foto es una de ellas:

- **Ella** — en su casa, no en una oficina. El titular de su lado dice "tu casa
  ya es tu oficina": la foto tiene que estar de acuerdo. La mesa de la cocina,
  el sofá, el portátil abierto en el salón.
- **Él** — hablando con gente. El titular de su lado dice "si sabes hablar con
  la gente": al teléfono, en una conversación, en la calle.

⚠️ **Las dos que hay puestas ahora son de banco**, ninguna está hecha en una
casa y ninguna es de un Embajador de verdad. PRODUCT.md prohíbe el stock por
nombre: estas dos son lo primero de la lista en cuanto haya sesión.

Y cuando lleguen, **hace falta el `alt` de cada una** — se escribe en
`src/config/curso.config.ts`, en `copy.heroSlider.slides[0].paneles`.
