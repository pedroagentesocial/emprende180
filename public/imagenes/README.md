# `/public/imagenes` — Imágenes del sitio

Regla general para **todas** las imágenes:

- **Formato:** `.webp` de preferencia (o `.avif`). `.jpg` solo si no hay otra.
  PNG únicamente cuando haga falta transparencia.
- **Peso:** < 200 KB por imagen. El hero, < 150 KB. El 73 % de los compradores
  llega desde el celular con datos móviles.
- **Nombres:** en minúsculas, sin espacios ni acentos → `pedro-garcia.webp`,
  no `Foto Pedro (1).PNG`.
- **Cada imagen necesita un `alt`.** Escríbelo junto al archivo o dímelo, y lo
  pongo en `src/config/curso.config.ts`.

## Subcarpetas

### `instructor/`
Foto(s) de quien da el curso. Es una de las imágenes que más pesa en la conversión:
la gente compra a personas, no a marcas.

- `instructor.webp` — retrato principal. **800×1000 px** (vertical 4:5), cara nítida,
  mirando a cámara, fondo limpio.
- `instructor-cuadrado.webp` — **400×400 px**, recorte cuadrado para el bloque de
  autoridad y el schema.
- Opcional: fotos en contexto (dando una charla, en su negocio). Sirven como
  evidencia visual de credibilidad.

### `curso/`
Qué se ve del producto.

- `portada.webp` — **1200×800 px**. La imagen "héroe" del curso.
- `mockup-*.webp` — **1200×800 px**. El curso en un laptop/celular.
- `modulo-*.webp` — **800×600 px**. Capturas reales de las lecciones (una por módulo
  si las hay). Las capturas reales convierten más que los mockups genéricos.
- `plataforma.webp` — **1200×800 px**. Cómo se ve el área de alumnos por dentro.

### `testimonios/`
Avatares de los alumnos.

- **400×400 px**, cuadrados, recorte centrado en la cara.
- Un archivo por persona, nombrado igual que en el config:
  `maria-lopez.webp`, `juan-perez.webp`.
- Caras reales > avatares de stock. Si no hay foto, se muestran las iniciales.

### `og/`
Imagen para compartir en redes (WhatsApp, Facebook, LinkedIn, X).

- `og.jpg` — **1200×630 px exactos**, < 300 KB, formato JPG o PNG (WebP tiene
  soporte irregular en los scrapers de redes).
- Debe llevar el logo + la promesa del curso en texto grande. Se lee a tamaño
  miniatura en el chat de WhatsApp: mínimo 60 px de altura de texto.
- Opcional: `og-cuadrado.jpg` de 1200×1200 para Instagram/WhatsApp status.
