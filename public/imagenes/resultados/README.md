# `/public/imagenes/resultados` — fondos de "Qué sabrás hacer al terminar"

Las seis tarjetas de la sección de resultados pueden llevar una **foto de
fondo**. Hoy no hay ninguna, así que cada tarjeta pinta un fondo de marca
(navy + la trama de puntos) con su icono. **La sección funciona sin fotos**: no
hay huecos ni cajas rotas.

## Cómo se ponen

Deja el archivo con el número del resultado, en orden:

| Archivo | Tarjeta |
|---|---|
| `01.webp` | Sabrás qué es esto y dónde encajas tú |
| `02.webp` | Reconocerás una oportunidad cuando la tengas delante |
| `03.webp` | Pedirás referidos sin que se te caiga la cara |
| `04.webp` | Tendrás tus contactos organizados |
| `05.webp` | Publicarás para que te escriban a ti |
| `06.webp` | Sabrás qué se puede decir y qué no |

Eso es todo. **No hay que tocar código ni config.** También valen `.avif`,
`.jpg` y `.png`, en ese orden de preferencia. Se pueden mezclar: las que tengan
foto la usan, las que no conservan el fondo de marca y su icono.

## Requisitos

| | |
|---|---|
| Proporción | **4:3 apaisada** (p. ej. 1200×900). La tarjeta recorta con `object-fit: cover` |
| Peso | **< 180 KB** cada una. Son seis: 6 × 400 KB es más de 2 MB en una sola sección |
| Formato | WebP a calidad 72–78. Se cargan con `loading="lazy"`, están por debajo del pliegue |

## Qué foto funciona aquí y cuál no

El texto va **encima**, en blanco, sobre un velo navy que ocupa la mitad
inferior. Con eso:

- **Sirve**: planos con espacio "vacío" abajo, poca gente y poco detalle fino.
  Manos, un escritorio, una conversación de dos, una libreta, un celular.
- **No sirve**: caras grandes en el centro (el texto les cae encima), collages,
  capturas de pantalla con letra pequeña, cualquier cosa con texto dentro.

**Nada de stock genérico.** PRODUCT.md lo prohíbe, y con razón: seis fotos de
gente sonriendo en una oficina se reconocen a un kilómetro y no dicen nada de
este negocio. Si no hay fotos reales del Ecosistema, de Pedro grabando o de
Embajadores trabajando, **es mejor dejarlo sin fotos**: el fondo de marca es más
honesto que una plantilla.

No hace falta que las seis existan. Una foto real vale más que seis de relleno.
