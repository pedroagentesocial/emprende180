# `/public/video` — Vídeo del hero / VSL

## Vídeo de fondo del hero (bucle mudo, decorativo)

El hero es a pantalla completa y el vídeo va **detrás del texto**. Hay **dos
cortes**, no uno reescalado, porque un 16:9 dentro de una pantalla vertical se
recorta tanto por los lados que la persona se sale del plano: el visitante de
móvil vería una pared borrosa. Recortar en el encoder cuesta 200 KB y arregla
justo la pantalla que ve la mayoría de la audiencia.

| Archivo | Qué es | Formato | Requisitos |
|---|---|---|---|
| `hero.mp4` | Corte apaisado, ≥768 px | MP4 (H.264) | **1280×640 (2:1)**, 10–14 s, **sin audio**, < 900 KB |
| `hero.webm` | El mismo corte | WebM (VP9) | Opcional pero recomendable: mismos bytes de menos en Chrome/Firefox/Android |
| `hero-poster.webp` | Primer fotograma del apaisado | WebP | 1280×640 |
| `hero-mobile.mp4` | Corte vertical, <768 px | MP4 (H.264) | **540×648**, mismo corte, **sin audio**, < 400 KB |
| `hero-mobile.webm` | El mismo corte vertical | WebM (VP9) | Opcional |
| `hero-poster-mobile.webp` | Primer fotograma del vertical | WebP | 540×648 |

### Reglas que ya aplica el armazón (no hay que hacer nada)

- **El MP4 basta.** El WebM es opcional: si no está, se sirve el MP4 y ya. Antes
  se exigían los dos y, si faltaba uno, no se usaba ninguno; era demasiado duro,
  porque el H.264 lo reproduce todo lo que hay en el mercado.
- **El póster está en el HTML del servidor**, no dentro de la isla de React. Es
  el LCP de la página: tiene que empezar a descargarse antes de que se ejecute
  una línea de JavaScript.
- **El vídeo NO se descarga** si el visitante tiene `prefers-reduced-motion`,
  si tiene el ahorro de datos activado o si la conexión es 2G o peor. En esos
  casos se queda el póster, que es una imagen correcta y no se echa nada de menos.
- **Sí se descarga en móvil**, que es lo contrario de lo que hacía antes. Aquella
  regla existía cuando solo había un corte de 1280×720; con un vertical de menos
  de 400 KB el argumento del coste desaparece.
- El fundido del póster al vídeo se dispara con `playing`, **no** con `canplay`:
  si el navegador rechaza la autoreproducción, no se queda un fotograma
  congelado, se queda el póster.
- Siempre `muted` + `playsinline` + `loop`, nunca con controles.

### El bucle tiene que ser invisible

Si el plano tiene movimiento de cámara (un travelling, un zoom), cortarlo y
ponerlo en `loop` da un salto muy visible cada pocos segundos. La solución que
usa el vídeo actual es un **palíndromo**: el clip va hacia delante y vuelve hacia
atrás, así el último fotograma es igual que el primero y no hay costura.

```
ffmpeg -ss 1 -t 6 -i original.mp4 \
  -filter_complex "[0:v]fps=24,crop=980:490:0:40,scale=1280:640:flags=lanczos,setsar=1,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[out]" \
  -map "[out]" -an -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart hero.mp4
```

### Dónde tiene que caer la persona en el plano

- **Apaisado**: a la **derecha**, en torno al 65–70 % del ancho. La columna de
  texto ocupa la izquierda, y el velo oscuro que la sostiene apaga esa mitad. Si
  el sujeto está centrado, queda debajo del velo y se ve como una mancha.
- **Vertical**: centrado. Ahí el texto lo cubre casi todo y el vídeo es
  atmósfera, no protagonista.

### Sobre el vídeo que hay puesto ahora

Es metraje de archivo de Mixkit (licencia Mixkit: uso comercial, sin
atribución). **La persona que sale no es el instructor.** Se usa como fondo
decorativo y por eso va con `aria-hidden`, sin rótulo y sin pie de foto: en
ningún momento la página dice quién es. En cuanto haya metraje real de Pedro
dando el curso, se sustituyen estos seis archivos y no hay que tocar código.

## VSL (vídeo de ventas, con audio y locución)

| Archivo | Formato | Requisitos |
|---|---|---|
| `vsl.mp4` | MP4 (H.264 + AAC) | 1280×720 o 1920×1080, < 50 MB |
| `vsl-poster.webp` | WebP | 1280×720. Debe verse la cara del instructor y un botón de play |
| `vsl.vtt` | WebVTT | **Subtítulos en español.** No es opcional: la mayoría lo ve sin audio |

Si el VSL pesa más de ~50 MB, no lo pongas aquí — súbelo a Vimeo/YouTube (no listado)
y pásame la URL: lo incrusto con carga diferida (facade) para no penalizar el LCP.
El VSL **nunca** se autoreproduce con audio.
