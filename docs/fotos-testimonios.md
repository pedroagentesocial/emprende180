# Fotos de los testimonios

Deja aquí las seis fotos y luego cambia el `foto: null` de cada ficha en
`src/config/curso.config.ts` por su ruta. Al lado de cada `null` ya está escrito
el nombre de archivo que le toca, en un comentario `// SWAP`.

## Los seis archivos

| Archivo | Persona |
|---|---|
| `miguel-torres.webp` | Miguel Torres · Texas |
| `daniela-martinez.webp` | Daniela Martínez · Utah |
| `carlos-ramirez.webp` | Carlos Ramírez · Utah |
| `maria-gonzalez.webp` | María González · Utah |
| `jose-hernandez.webp` | José Hernández · Nevada |
| `sofia-rodriguez.webp` | Sofía Rodríguez · California |

## Cómo tienen que ser

- **Cuadradas.** La tarjeta las recorta a un círculo de 44 px con
  `object-cover`, así que una foto apaisada pierde media cara por los lados.
- **400×400 basta.** Se pintan a 44 px, y a 88 px en pantallas de doble
  densidad. Subir una de 3.000 px no se ve mejor, solo pesa.
- **La cara centrada y de cerca.** A 44 px, un plano entero de cuerpo no es una
  persona, es una mancha.
- **`.webp`.** Pesa la mitad que un `.jpg` a la misma calidad y lo entiende
  cualquier navegador desde 2020. Si solo tienes `.jpg`, cambia también la
  extensión en el config y funciona igual.

Para convertir: `npx sharp-cli -i foto.jpg -o miguel-torres.webp resize 400 400`
(`sharp` ya está instalado en el proyecto).

## Si falta alguna

No pasa nada. Con `foto: null` la tarjeta pinta las iniciales sobre un círculo
teal, que es una solución y no un hueco. Se pueden mezclar: unas con foto y
otras con iniciales.

## El permiso

Antes de publicar la cara de alguien hace falta su «sí» por escrito, y hay que
guardarlo — una captura del WhatsApp o del email vale. Es lo mismo que ya aplica
al nombre y a la cita; ver `docs/pedir-testimonios.md`. Si un día alguien se
arrepiente, se quita el mismo día: basta con borrar su ficha del config.
