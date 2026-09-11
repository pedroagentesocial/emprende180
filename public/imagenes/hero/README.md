# `/public/imagenes/hero` — Las fotos de los dípticos del hero

Las dos primeras pantallas de la home son **dípticos**: dos fotos partidas por
la mitad y una persona en cada lado. La tercera es el **manifiesto**: una sola
foto a pantalla completa. Son cinco fotos.

| Imagen | Mitad | Archivo de banco (hoy) | Archivo de sesión (manda) |
| --- | --- | --- | --- |
| 1 · quién eres | Izquierda | `banco-casa-oficina.webp` | `ella.webp` |
| 1 · quién eres | Derecha | `banco-llamada.webp` | `el.webp` |
| 2 · la frustración | Izquierda | `banco-tiempo.webp` | `ella-2.webp` |
| 2 · la frustración | Derecha | `banco-charla.webp` | `el-2.webp` |
| 3 · el manifiesto | Entera | `banco-llaves.webp` | — |

⚠️ **La tercera no tiene archivo de sesión** porque no pasa por `fotoHero`: es
una plantilla distinta y su ruta se escribe directa en el config. Para
cambiarla se cambia esa línea.

**Se deja el archivo de sesión aquí y ya está.** No hay que tocar código ni
config: en cuanto existe `ella.webp`, esa mitad deja de usar la de banco. Los
cuatro nombres son distintos a propósito, porque si dos mitades compartieran
nombre compartirían foto.

## Cómo tienen que ser

Las **cuatro del díptico**:

- **VERTICALES, 1400×1800 px.** Cada una ocupa media pantalla de alto completo.
  Una horizontal de 16:9 se recorta a una franja central y la persona se pierde.
- **La cara en el tercio de arriba.** El texto se sienta en la banda del 60 al
  75 % de la altura: una cara ahí abajo queda debajo del titular. Es el error
  que hubo que corregir a mano en dos de las cuatro de banco.
- **Con aire y oscuridad en el lado de FUERA** (izquierda en las mitades
  izquierdas, derecha en las derechas): ahí es donde cae el texto, y el velo que
  lo sostiene arranca en ese borde. Una foto clara de lado a lado obliga a tapar
  la foto entera para que se lea.
- **Mirando hacia el centro** del díptico, si se puede. Es lo que hace que las
  dos mitades se lean como una imagen y no como dos fotos pegadas.
- `.webp`, **menos de 150 KB cada una**. Es lo primero que carga la página.

La **del manifiesto** es la excepción: **HORIZONTAL, 2400×1350 px**, porque
ocupa la pantalla entera y no media. Las caras, también en el tercio de arriba:
debajo va el manifiesto y las tres claves.

⚠️ **El `encuadre` del config es para el MÓVIL.** En pantalla grande cada mitad
del díptico mide 720×900 y la foto 1400×1800, casi la misma proporción, así que
apenas se recorta. En un teléfono la foto se queda en una franja de ~150 px de
alto y el recorte se come el 70 % del alto: sin ese número se ven cuerpos sin
cabeza. El valor es la altura a la que está la cara dentro del archivo.

## Qué se ve en cada una

**Imagen 1 — quién eres.** Ella: en su casa, no en una oficina; el titular dice
"tu casa ya es tu oficina" y la foto tiene que estar de acuerdo. Él: hablando
con gente, al teléfono o en una conversación.

**Imagen 2 — la frustración.** Ella: en casa, con tiempo, con el teléfono a
mano; el titular dice "tienes tiempo, contactos y ganas". Él: conversación de
pueblo, sin pose, en la calle o en el negocio de alguien.

## ⚠️ Las cuatro de ahora son de banco

Bajadas de Pexels (licencia libre, sin atribución obligatoria) y retocadas para
que se lean como un juego: recortadas a vertical, dos de ellas bajadas de luz y
de saturación porque venían con blancos quemados que peleaban con el velo navy,
y la de la mesa del comedor **volteada en horizontal** para sacar a la mujer del
borde donde cae el texto.

Ninguna es de un Embajador de verdad. **PRODUCT.md prohíbe el stock por
nombre**: estas cuatro son lo primero de la lista en cuanto haya sesión.

Los originales, por si hace falta rehacer un recorte:

| Archivo | Pexels |
| --- | --- |
| `banco-casa-oficina.webp` | [30539348](https://www.pexels.com/photo/30539348/) |
| `banco-llamada.webp` | [5917337](https://www.pexels.com/photo/5917337/) |
| `banco-tiempo.webp` | [6612273](https://www.pexels.com/photo/6612273/) |
| `banco-charla.webp` | [35085731](https://www.pexels.com/photo/35085731/) |
| `banco-llaves.webp` | [7642037](https://www.pexels.com/photo/7642037/) |

Y cuando lleguen las de verdad, **hace falta el `alt` de cada una** — se escribe
en `src/config/curso.config.ts`, dentro de `copy.heroSlider.slides[].paneles`.
