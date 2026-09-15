# `/public/imagenes/recursos` — las tres fotos del aviso de /resources

Montadas como las del cierre de la portada: una grande y dos acompañantes.
Cada archivo viene **ya recortado a la proporción de su hueco**, para que
`object-fit: cover` no tenga nada que cortar y la cara quede donde se dejó.

| Archivo | Hueco | Medida | Pexels | Nota |
| --- | --- | --- | --- | --- |
| `aviso-cafe.webp` | principal, 68 % × 56 % | 1100×660 (5:3) | [36765293](https://www.pexels.com/photo/36765293/) | **Volteada en horizontal** para que la mujer caiga a la izquierda, lejos de la foto que se monta encima |
| `aviso-sofa.webp` | secundaria, 46 % × 50 % | 900×720 (5:4) | [6248760](https://www.pexels.com/photo/6248760/) | Recorte por la derecha del original |
| `aviso-charla.webp` | terciaria, 52 % × 40 % | 960×540 (16:9) | [8937482](https://www.pexels.com/photo/8937482/) | Recorte con 80 px menos por arriba |

Licencia Pexels (libre, sin atribución obligatoria). Ninguna es de una
Embajadora de verdad: se cambian en cuanto haya sesión. Los `alt` viven en
`copy.recursos.fotos`, en `src/config/curso.config.ts`.
