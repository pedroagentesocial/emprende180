# `/public/imagenes/instagram` — las seis publicaciones de la portada

La sección "La comunidad, en Instagram" de la portada enseña **seis
publicaciones elegidas a mano**, no un feed en vivo: cero scripts de terceros,
cero cookies, y tú decides qué se ve.

## Cómo se cambia una publicación

1. Guarda la imagen de la publicación como `01.webp` … `06.webp` (la que
   quieras sustituir). **800×800 px**, cuadrada, menos de 120 KB. Vale `.jpg`
   si no hay otra, pero pesa el doble.
2. En `src/config/curso.config.ts`, dentro de `copy.instagram.publicaciones`,
   pon en la misma posición el enlace de la publicación
   (`https://www.instagram.com/p/XXXXXXXX/`) y una frase de `alt` que diga
   qué se ve.

Eso es todo. Ritmo sugerido: renovar dos o tres al mes.

## ⚠️ Las seis de ahora son PLACEHOLDERS

Cuadrados de color con el usuario escrito, generados en el proyecto el
16-09-2026 mientras el cliente pasa las publicaciones reales. Todos enlazan al
perfil, no a una publicación. Se sustituyen uno a uno según lleguen.
