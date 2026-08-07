# `/public/identidad` — Marca

**✅ Identidad extraída y aplicada.** De esta carpeta salió toda la paleta que
vive en `src/styles/tokens.css` y todos los assets de logo del sitio.

## Originales entregados

Están en **`marca-originales/`**, en la raíz del proyecto y **no** dentro de
`public/`. Pesan 2 MB entre los tres y no los referencia ninguna página: si
vivieran aquí, Vercel los serviría públicamente y cualquiera podría descargarse
la guía de marca entera.

| Archivo | Qué es |
|---|---|
| `identidad emprende.png` | **Guía de marca.** La fuente de verdad: declara la paleta con sus HEX y la tipografía |
| `empren de logo copia.png` | Lockup vertical completo, 1670×1814, con alfa |
| `favicon emprende.png` | Isotipo (solo la bombilla), 846×1022, con alfa |

**No los borres ni los renombres.** `npm run marca:assets` los vuelve a
procesar, así que si algún día cambia el logo basta con reemplazarlos ahí y
relanzar ese comando.

## Paleta extraída

La guía declara cuatro colores. El script de muestreo confirmó que son los
mismos que hay en los píxeles del logo (el navy del logo mide #082D5D–#0A2A4C y
el teal #0DA7A9–#04A39F: la dispersión es compresión del PNG, no otro color).

| HEX | Rol | Token | OKLCH |
|---|---|---|---|
| `#0D2B4D` | Navy — primario | `--color-primary-900` | `oklch(0.287 0.0718 253.9)` |
| `#11A79D` | Teal — secundario / acción | `--color-secondary-500` | `oklch(0.657 0.1122 187.2)` |
| `#A7E1DA` | Teal claro | `--color-secondary-200` | `oklch(0.868 0.0599 186.9)` |
| `#F2F4F7` | Off-white — neutro | `--color-neutral-100` | `oklch(0.966 0.0045 258.3)` |

Esos cuatro pasos son exactos; el resto de cada rampa está interpolado en OKLCH
con el tono fijo. **La marca solo tiene dos tonos**, así que no se inventó un
tercer color: `--color-accent-*` apunta al teal, que es el color de acción de la
marca. Ver la cabecera de `src/styles/tokens.css` para el detalle completo.

**Tipografía:** Montserrat (Bold / SemiBold / Regular / Light), autoalojada con
`@fontsource-variable/montserrat`.

## Assets generados

Los crea `npm run marca:assets` a partir de los originales. No los edites a
mano: se sobrescriben.

| Archivo | Uso |
|---|---|
| `logo.png` (720×693) | Lockup vertical oficial. Footer |
| `logo-blanco.png` | Igual, navy→blanco. Para fondos oscuros |
| `logo-horizontal.png` (955×200) | **Derivado.** Header |
| `logo-horizontal-blanco.png` | Igual, para fondos oscuros |
| `isotipo.png` (512×632) | Solo la bombilla |
| `isotipo-blanco.png` | Igual, para fondos oscuros |
| `apple-touch-icon.png` (180×180) | Icono de iOS, fondo navy sólido |
| `../favicon.png` (512×512) | Favicon, en la raíz de `/public` |

### ⚠ Sobre `logo-horizontal.png`

Es un asset **derivado**, no oficial. La guía solo trae el lockup vertical, y a
la altura de un header sticky (~36 px) ese formato deja el nombre en unos 20 px
de ancho: ilegible. Se compuso uno horizontal **recortando las piezas del arte
original** y colocándolas en fila — no se redibujó, no se recoloreó y no se
re-tipografió nada.

**Si el diseñador tiene una versión horizontal oficial, sustitúyela:** manda la
suya. Basta con dejarla como `logo-horizontal.png` y ajustar `sitio.logoHorizontal`
en `src/config/curso.config.ts` si cambian las dimensiones.

### Sobre la versión blanca

El navy pasa a blanco y el teal se conserva — es la variante que la propia guía
muestra en la tarjeta de visita. La conversión clasifica los píxeles **por matiz
HSL** (navy ≈ 212°, teal 176–192°) y no por canales sueltos, porque el cerebro
del logo es un degradado que llega hasta un azul-verdoso (#099BB2 ≈ 188°) que un
criterio por canales confundía con el navy y blanqueaba. El alfa se calcula por
cobertura, para que no quede halo en los bordes suavizados.

## Lo que aún falta (opcional)

| Archivo | Por qué ayudaría |
|---|---|
| `logo.svg` | Nítido a cualquier tamaño y ~2 KB en vez de 56. Es la mejora de rendimiento más barata que queda en el sitio |
| `logo-horizontal.svg` | Versión horizontal oficial, si existe |
| Fuentes propias `.woff2` | Solo si la marca usa una tipografía que no sea Montserrat |
