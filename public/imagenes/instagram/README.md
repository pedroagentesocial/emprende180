# `/public/imagenes/instagram` — las seis publicaciones de la portada

La sección "La comunidad, en Instagram" de la portada enseña **seis
publicaciones elegidas a mano**, no un feed en vivo: cero scripts de terceros,
cero cookies, y tú decides qué se ve.

## Cómo se cambia una publicación

1. Guarda la imagen de la publicación como `01.webp` … `06.webp` (la que
   quieras sustituir). **800×1000 px**, vertical 4:5, menos de 120 KB. Vale `.jpg`
   si no hay otra, pero pesa el doble.
2. En `src/config/curso.config.ts`, dentro de `copy.instagram.publicaciones`,
   pon en la misma posición el enlace de la publicación
   (`https://www.instagram.com/p/XXXXXXXX/`) y una frase de `alt` que diga
   qué se ve.

Eso es todo. Ritmo sugerido: renovar dos o tres al mes.

## Las tres de ahora

| Archivo | Publicación |
| --- | --- |
| `01.webp` | https://www.instagram.com/emprende180academy/p/Dc6-wPOlVbZ/ |
| `02.webp` | https://www.instagram.com/emprende180academy/p/Dbvj5xICdEb/ |
| `03.webp` | https://www.instagram.com/emprende180academy/p/DbtMQI3HQz9/ |

Son las tres que había en la cuenta el 16-09-2026, bajadas a tamaño completo
(1080×1350). Con tres o menos la rejilla va en tres columnas; a partir de la
cuarta pasa a seis. Para añadir la cuarta: `04.webp` aquí y su entrada en
`copy.instagram.publicaciones`.
