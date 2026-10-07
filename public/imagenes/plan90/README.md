# `/public/imagenes/plan90` — las fotos del collage de los 90 días

Son las que acompañan a las fases de **"Los 90 días que cambian tu rutina"**
(portada). La lista de fases vive en `copy.plan90Portada.fases`, dentro de
`src/config/curso.config.ts`, y cada una nombra su archivo ahí: **no hay
autodescubrimiento**, si cambias un nombre hay que cambiarlo también en el
config.

Las fases 01, 02 y 03 usan fotos de otras carpetas (`identidad/`,
`resultados/`). Aquí solo están las que no se reutilizan de ningún otro sitio.

## Lo que hay

| Archivo | Fase | Qué se ve |
|---|---|---|
| `mujer-escribiendo.webp` | 05 · Reactivar | Una mujer tomando notas junto a su portátil |
| `grupo-conversando.webp` | 04 · Expandir | Tres mujeres conversando en un sofá, junto a un ventanal |
| `tres-mujeres-cafe.webp` | 06 · Optimizar | Tres mujeres hablando con un café en la mano |
| `mano-lista.webp` | — | Una mano escribiendo una lista. **Sin usar** desde el 07-10-2026 |

`mano-lista.webp` era la foto de la fase 06 hasta que el cliente pidió
cambiarla por gente hablando. Se deja porque pesa 20 KB y es la única foto de
papel suelta que queda; si hace falta una para una fase nueva, está.

## De dónde salen

Todas son de **Pexels** (licencia libre, sin atribución obligatoria, uso
comercial permitido). Se guarda el origen para poder volver al original en
mayor resolución o comprobar la licencia:

| Archivo | Pexels |
|---|---|
| `grupo-conversando.webp` | `pexels.com/photo/15396204` |
| `tres-mujeres-cafe.webp` | `pexels.com/photo/8512136` |

> ⚠️ **Son fotos de banco, no son Embajadores reales.** Da igual mientras
> ilustren una fase, que es lo que hacen: nada en la página dice que estas
> personas estén en el programa. El día que haya fotos propias, entran con el
> mismo nombre de archivo y ya está. Lo que **no** se puede hacer es ponerles
> un nombre o un testimonio debajo: eso sí sería afirmar algo falso. La misma
> regla que el README de `/testimonios`.

## Requisitos

| | |
|---|---|
| Proporción | **4:3 apaisada**, exportadas a **800×600** |
| Peso | **< 80 KB**. Son seis filas en una sola sección de la portada |
| Formato | `.webp`, calidad 82 |
| Encuadre | El config lleva un campo `encuadre` (`object-position`) por si la cara queda fuera al recortar |
