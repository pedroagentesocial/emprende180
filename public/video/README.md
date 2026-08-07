# `/public/video` — Video del hero / VSL

Opcional. Si no hay video, el hero usa la imagen de `/public/imagenes/curso/portada.webp`.

## Video de fondo del hero (loop mudo, decorativo)

| Archivo | Formato | Requisitos |
|---|---|---|
| `hero.webm` | WebM (VP9) | 1920×1080, 6–12 s, **sin audio**, < 2 MB |
| `hero.mp4` | MP4 (H.264) | Mismo corte. Respaldo para Safari/iOS |
| `hero-poster.webp` | WebP | 1920×1080. Primer fotograma. Se muestra mientras carga y **siempre** en móvil |

Reglas de reproducción que ya aplica el armazón:

- En móvil (< 768 px) **no se descarga el video**: se muestra solo el poster.
- Con `prefers-reduced-motion: reduce` **no se reproduce**: solo el poster.
- Siempre `muted` + `playsinline` + `loop`, nunca con controles.

## VSL (video de ventas, con audio y locución)

| Archivo | Formato | Requisitos |
|---|---|---|
| `vsl.mp4` | MP4 (H.264 + AAC) | 1280×720 o 1920×1080, < 50 MB |
| `vsl-poster.webp` | WebP | 1280×720. Debe verse la cara del instructor y un botón de play |
| `vsl.vtt` | WebVTT | **Subtítulos en español.** No es opcional: la mayoría lo ve sin audio |

Si el VSL pesa más de ~50 MB, no lo pongas aquí — súbelo a Vimeo/YouTube (no listado)
y pásame la URL: lo incrusto con carga diferida (facade) para no penalizar el LCP.
El VSL **nunca** se autoreproduce con audio.
