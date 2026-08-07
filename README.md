# Emprende180

Landing one-page de conversión para vender el curso online de emprendimiento.
Un solo objetivo: capturar leads con el mini-curso gratuito y vender el curso.

> **El "180" es un giro de 180°, no 180 días.** El claim de la marca es
> "Tu giro de 180° empieza aquí". Nunca escribir "en 180 días".

**Estado:** en producción y funcionando. Las 10 secciones están construidas; lo
pendiente son los HECHOS marcados `[COMPLETAR: …]` (instructor, testimonios,
cifras, URL de pago), que la propia página resalta en ámbar, y las fotos.

## En producción

- **Web:** https://emprende180.vercel.app
- **Repo:** https://github.com/pedroagentesocial/emprende180 (privado)

Despliegue manual con `vercel --prod`. También puedes conectar el repo en el
panel de Vercel para que despliegue solo en cada push a `main`.

> **Las variables de entorno todavía no están puestas en Vercel.** El formulario
> funciona y responde `200`, pero el lead solo queda en los logs: no salen
> correos. Se arregla con `vercel env add` para las cuatro claves de
> `.env.example`, y un redespliegue.

## Bilingüe (es-US / en-US)

Cada valor textual del config es `{ es, en }`. El árbol de claves no cambió;
solo se envolvieron los valores.

**Cómo cambia de idioma sin recargar.** El servidor renderiza los DOS idiomas
y el CSS oculta el que no toca según el `lang` de `<html>`. Cambiar de idioma
es cambiar un atributo: instantáneo, sin perder el scroll y sin re-montar el
formulario (no se pierde lo escrito). Coste: unos +12 KB comprimidos de HTML.

Las islas de React no usan ese truco, porque además de texto tienen
`placeholder`, `aria-label` y mensajes de error, que son atributos: se
suscriben al store de nanostores y vuelven a renderizar. **Reciben el idioma
resuelto como prop**: en el servidor no hay `document`, así que sin esa prop se
renderizaban siempre en español aunque la URL pidiera inglés.

Precedencia al resolver el idioma: `?lang=` → preferencia guardada →
`navigator.language` / `Accept-Language` → `es`.

- **`?lang=es` / `?lang=en`** para compartir el enlace ya traducido por campaña.
- **hreflang** con una URL por idioma más `x-default`, y `<title>`/description
  por idioma. El JSON-LD se emite solo en el idioma servido.
- **`formatMoney`** con `Intl.NumberFormat`: `$3,990` y `$490` en los dos
  locales. Se usa `es-US` y no `es-MX` porque con `es-MX` Intl escribe
  «USD 3,990»: allí el signo `$` significa pesos y añade el código de divisa
  para desambiguar. Ningún componente escribe un `$` a mano.
- Los mensajes de validación de zod también son bilingües, y el email de
  bienvenida sale en el idioma en que la persona rellenó el formulario.

## Stack

Astro 5 (`output: "server"`) · TypeScript strict · Tailwind v4 con `@theme` ·
React islands solo donde hay interactividad · Motion · Montserrat autoalojada ·
deploy en Vercel.

## Empezar

```bash
npm install
cp .env.example .env    # rellenar las claves
npm run dev             # http://localhost:4321
npm run check           # astro check — debe dar 0 errores
npm run build
```

Sin las variables de Resend el formulario **sigue funcionando**: el lead se
guarda y se registra en consola (y en `.leads.jsonl` en local), solo no salen
los correos. Nunca se pierde un lead en silencio.

## Legal y consentimiento

Dos documentos, `/legal/privacidad` y `/legal/terminos`, que son **páginas
reales e indexables**. El modal es solo comodidad: intercepta los enlaces con
`data-legal`, pide el fragmento a `/legal/parcial/<slug>` y lo muestra sobre un
`<dialog>` nativo (trampa de foco real, Esc, scroll de fondo bloqueado). Si el
JS falla, o el usuario abre en pestaña nueva, el navegador va a la página
completa. Un documento legal que solo existe dentro de un modal no es citable.

- **El consentimiento del formulario es obligatorio, sin premarcar, y enlaza al
  aviso de privacidad.** Sin ese enlace no sería consentimiento informado.
- **GA4 no se carga hasta que el visitante acepta** en el banner de cookies.
  Rechazar pesa lo mismo que aceptar, y el pie lleva un enlace para cambiar de
  opinión: un consentimiento que no se puede retirar no vale.
- Los textos legales son un **esqueleto con marcadores `[COMPLETAR: …]`** que la
  propia página resalta en ámbar. No están listos para publicar: tienen que
  pasar por un abogado del país donde tributas.

## Identidad

Extraída de `marca-originales/` — ver `public/identidad/README.md` para el detalle.
Cuatro colores de marca (`#0D2B4D` navy, `#11A79D` teal, `#A7E1DA` teal claro,
`#F2F4F7` off-white), convertidos a OKLCH y expandidos en rampas de 11 pasos.
Tipografía Montserrat. Todo vive en `src/styles/tokens.css`.

Cada par de colores en uso real está verificado contra WCAG AA:

```bash
npm run marca:paleta    # imprime las rampas y la tabla de contrastes
npm run marca:assets    # regenera logos/favicons desde marca-originales/
```

Los PNG originales viven en `marca-originales/`, **fuera de `public/`**: pesan
2 MB, no los referencia ninguna página, y ahí dentro Vercel los serviría al
público, guía de marca incluida.

## El motor de conversión

El imán no es un PDF: es un **mini-curso gratuito de 7 días por email**. Un PDF
se descarga y se olvida; una secuencia de 7 correos crea el hábito de abrirte, y
quien lleva 7 días leyéndote llega al precio ya convencido.

**Un único formulario en toda la página**, el del cierre (sección 11). La
sección 4 presenta el mini-curso día a día y manda hacia él con un botón: dos
formularios idénticos compiten por la misma conversión sin sumarla, y quien ve
el primero y no lo rellena llega al segundo con la sensación de que ya se lo
pidieron.

`POST /api/lead`, defensas de la más barata a la más cara:

1. **Rate limit** por IP — 10 intentos / 10 min, en memoria.
2. **Validación zod** — el mismo esquema que corrió en el navegador.
3. **Honeypot + tiempo mínimo** de relleno — responde `200` para no enseñarle
   nada al bot.
4. **Deduplicación por email** — el doble envío es idempotente, no un error.
5. **Guardar** — antes de notificar: si Resend falla, el lead ya existe.
6. **Notificar** — aviso interno ("Nuevo lead — mini-curso") + día 1 al lead.

La **secuencia de nutrición** de los días 2–7 está *preparada, no conectada*:
`suscribirASecuencia()` en `src/lib/leads.ts` documenta exactamente qué tocar.

## Mapa

```
public/
  identidad/       logo + guía de marca  → fuente de la paleta
  imagenes/        instructor · curso · testimonios · og
  video/           hero loop o VSL (opcional)
scripts/           generación de assets y verificación de paleta
src/
  config/curso.config.ts    FUENTE ÚNICA de contenido — todo marcado // SWAP
  styles/tokens.css         identidad · global.css
  components/
    sections/      01…12 en orden de decisión
    ui/            LeadForm · Button · Input · Modal · Accordion · Section
    placeholder/   cajas "AQUÍ VA …"
  lib/
    schema.ts      validación zod compartida cliente ↔ servidor
    rateLimit.ts   límite por IP + antiduplicado
    leads.ts       persistencia + enganche del autoresponder
  pages/index.astro · api/lead.ts
```

## Móvil primero

Verificado a 320, 360, 390 y 430 px, en ES y EN: **cero overflow horizontal**,
cero inputs por debajo de 16 px y cero targets pequeños que no sean excepciones
de WCAG (enlaces en línea dentro de una frase, honeypot, skip link).

- **CTA fijo**: el hueco se reserva SIEMPRE por debajo de md, no al aparecer la
  barra. Alternarlo valía 0,15 de CLS.
- **Con el teclado abierto la barra se esconde**, detectado por foco en un
  campo y no por altura de viewport (iOS Safari y Android Chrome no coinciden).
  Si no, se monta sobre el botón de enviar.
- **La fuente se precarga**: sin eso, Montserrat llegaba tras el primer pintado
  y el reflow costaba 0,147 de CLS. Ahora **CLS 0**.
- Sin `-webkit-tap-highlight-color`, con `touch-action: manipulation` y con
  `:active` visible: el feedback al tocar es inmediato, no un recuadro gris que
  aparece con retardo y encima del elemento.
- Ni un solo `100vh` en el proyecto: la barra del navegador móvil lo rompe.

**Lighthouse móvil (build de producción con gzip):** 96 / 100 / 100 / 100 en
los dos idiomas. LCP 2,4 s · TBT 50 ms · CLS 0.

## Precio: estrategia de ancla

Precio de lanzamiento **$490**, cifra ancla **$3,990**. Ambas en
`curso.precio`, formateadas con `formatMoney`.

El **desglose** es lo que sostiene el ancla: cada componente con su valor, y la
suma tiene que dar la referencia. La sección lo comprueba al construir y
**avisa en pantalla si no cuadra**, para que no se descuadre en silencio el día
que alguien toque un número.

**Framing** (`curso.precio.framing`), y esto es legal, no estético:

- `lanzamiento` (activo) — la cifra alta es el precio FUTURO: «precio de
  fundadores, después subirá a $3,990». Es verdad desde el día uno y no hay que
  demostrar ningún histórico.
- `descuento` — la cifra alta es el precio anterior, tachado, con «Ahorras
  $3,500 (88%)». **Solo si el curso se ofreció de verdad a $3,990**: PROFECO
  (México) y la FTC (EE. UU.) exigen que el precio tachado haya sido real y
  vigente.

**Sin cuenta atrás.** Un contador que se reinicia al recargar es el truco que
más rápido quema la confianza, y basta un F5 para descubrirlo. La urgencia sale
de `precio.urgencia` y solo se pinta si el dato es real (cupos, fecha); si no,
queda la nota honesta de precio de lanzamiento.

El JSON-LD declara `offers.price` con el precio que se paga HOY, no la
referencia: si no, Google mostraría en los resultados una cifra distinta de la
de la página.

## Orden de decisión de las secciones

No es estético: es la secuencia de preguntas que se hace quien entra, en el
orden en que se las hace. Cambiarlo rompe el argumento.

| # | Sección | Pregunta que responde | CTA |
|---|---|---|---|
| 01 | Hero | ¿de qué va esto y es para mí? | email gratis |
| 02 | Problema + para quién | ¿me entiende? ¿es para mí de verdad? | — |
| 03 | Qué vas a lograr | ¿qué me llevo? (resultado, no temario) | email gratis |
| 04 | Primera captura | aún no compro → captúrame el email | **formulario** |
| 05 | Temario | ¿qué incluye exactamente? | — |
| 06 | Instructor | ¿quién eres tú? ¿qué NO cubres? | — |
| 07 | Prueba social | ¿le funciona a gente como yo? | — |
| 08 | Garantía | ¿y si me equivoco? | — |
| 09 | Precio | ¿cuánto? | **comprar** |
| 10 | FAQ | última objeción | — |
| 11 | Cierre | decido | comprar + formulario |

Dos decisiones que no son obvias y conviene no deshacer:

- **La garantía va ANTES del precio.** El miedo aparece justo al ver la cifra;
  si la reversión de riesgo llega después, el lector ya ha decidido que no.
- **El hero pide el email, no la compra.** Quien lleva 8 segundos en la página
  no está listo para pagar. La compra se pide en la 9, con el temario, el
  instructor y la garantía ya vistos.

## Reglas del proyecto

- **Nada de texto de venta dentro de un componente.** Todo sale de `curso.config.ts`.
- **Nada de colores literales.** Todo sale de `tokens.css` vía utilidades de
  Tailwind (`bg-cta`, `text-ink-muted`, `border-line`…). Nunca `bg-[#hex]`.
- **No se declara la duración del curso de pago.** Ni días, ni semanas, ni horas.
  El único plazo que se dice es el del mini-curso gratis, porque ahí el plazo
  *es* la promesa.
- **Mobile-first.** Objetivo táctil mínimo 44 px (`min-h-11`); inputs a 16 px
  para que iOS no haga zoom al enfocar.
- **`prefers-reduced-motion` en toda animación**, declarado en el propio
  componente (`useReducedMotion()`), con la red de seguridad de `global.css`.
- **Animación de entrada:** `Reveal.astro` (un solo IntersectionObserver para
  toda la página, cero JS por bloque) para los fundidos; Motion solo donde hay
  que orquestar de verdad — `StaggerList`, acordeones, formulario, sticky.
  El estado oculto lo activa una clase que pone el propio script: **si el JS
  falla, el contenido se ve.** Nunca una sección invisible en una página de venta.
- **Un solo objetivo.** El CTA `primary` es siempre comprar; nada más lo usa.
- **Nada inventado.** Ni escasez, ni valoraciones, ni testimonios. El JSON-LD
  solo emite `aggregateRating` cuando `cifras.sonReales` es `true`.
