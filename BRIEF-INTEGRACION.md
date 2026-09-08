# Brief de integración — Rediseño Emprende180

> Este documento es el contexto completo de una sesión de diseño iterativo
> hecha fuera de este repo (en un entorno de prueba). Se construyeron 11
> componentes nuevos + 1 modificado, **verificados visualmente uno por uno**,
> sección por sección, con retroalimentación directa de Pedro en cada paso.
>
> **Tu primer paso obligatorio:** lee este documento completo, luego abre
> cada archivo nuevo (vienen en esta misma carpeta) y compáralo contra el
> componente real que reemplaza en `src/components/`. Después dame un plan
> de integración antes de tocar nada — hay decisiones de arquitectura que
> requieren tu criterio (ver sección 9, "Decisiones que te toca tomar a ti").

---

## 1. Qué es esto y por qué existe

Emprende180 (`github.com/pedroagentesocial/emprende180`, Astro 5 + Tailwind
v4) ya tenía un sitio funcional y bien construido — ver `PRODUCT.md` y
`DESIGN.md` en la raíz del repo, son reales y siguen vigentes en sus
principios (nada inventado, cero income claims, un solo color de acción,
etc.). Lo que pidió Pedro fue una segunda pasada de **dirección visual**,
inspirada en bossbabe.com (sitio construido por la agencia Lumina Creative
sobre Kajabi), pero **adaptada**: sin la estética femenina de bossbabe,
con la identidad de marca ya existente (navy `#0D2B4D` + teal `#11A79D`,
Montserrat), y sin romper ninguna de las reglas legales/de contenido que
ya estaban documentadas.

Se trabajó **sección por sección**, mostrando capturas reales (Playwright
contra el `astro dev` local) después de cada cambio, hasta que Pedro daba
el visto bueno. Este documento es el resumen de adónde se llegó.

## 2. Qué cambia en el sistema de diseño (afecta a TODO el sitio)

### 2.1 Segunda tipografía: Fraunces (itálica)

- Ya está en `package.json`: `"@fontsource-variable/fraunces": "^5.3.0"`.
- Se usa la variante `soft-italic` (`@fontsource-variable/fraunces/soft-italic.css`).
- **Patrón de uso, repetido en casi todas las secciones nuevas:** dentro de
  un titular en Montserrat bold, UNA frase corta va envuelta en:
  ```astro
  <em class="font-normal italic text-ink-brand" style="font-family:'Fraunces Variable',ui-serif,serif">
    frase corta
  </em>
  ```
- Regla que Pedro repitió varias veces: **nunca dejar una palabra sola en su
  propia línea** ("huérfana"). Cuando eso pasaba, la solución fue casi
  siempre agrandar el contenedor (`max-w-*`) o bajar el tamaño de fuente —
  **nunca acortar la idea**. Si integras esto en componentes con texto
  dinámico (i18n, contenido real más largo/corto que el de prueba), vas a
  tener que revisar esto de nuevo en producción con el texto real.

### 2.2 `Button.astro` — animación "Gumroad" (CAMBIO GLOBAL, ya en el archivo)

El archivo `Button.astro` real **ya viene modificado** en esta entrega
(`Button-MODIFICADO.astro` — renómbralo a `Button.astro` al integrar). El
variante `primary` cambió de un simple cambio de color en hover a esto
(inspirado en un snippet de Uiverse.io que pasó Pedro, con su azul en vez
del rosa original):

```
border border-primary-900 bg-cta text-ink-inverse
hover:-translate-x-1 hover:-translate-y-1 hover:bg-primary-900
hover:shadow-[0.25rem_0.25rem_0_0_var(--color-primary-900)]
active:translate-x-0 active:translate-y-0 active:shadow-none
```

El botón "se levanta" en hover, cambia de teal a navy, y aparece una sombra
sólida navy detrás. Al soltar, vuelve a su sitio. **Esto aplica a TODOS los
`<Button variant="primary">` del sitio real automáticamente** en cuanto
reemplaces el archivo — no hace falta tocar cada sección. Ya se verificó
que no rompe el hero ni ningún botón existente.

⚠️ Pedro fue explícito: esta animación es para **todos los botones excepto
los del header** — el header ya no usa `<Button>` para su nav (ver 3.1), así
que la exclusión es automática, no hay que programarla.

### 2.3 Botón de redes sociales expandible (patrón nuevo, reutilizado 2 veces)

Se construyó un botón de icono circular que se expande en hover mostrando
el nombre de la red (otro snippet de Uiverse.io que pasó Pedro, adaptado a
nuestros colores). Está implementado **duplicado** en `BlogDemo.astro` y en
`FooterDemo.astro` con el mismo array `ICONOS` (paths SVG reales, ya
existían en `RedesMarca.astro`). **Recomendación:** conviene extraerlo a un
componente único (`SocialIconButton.astro` o similar) antes de integrar,
para no mantener el mismo bloque de SVGs en dos archivos. No lo hice yo
mismo porque no quería tocar la arquitectura de componentes sin tu visto
bueno.

---

## 3. Sección por sección — qué se construyó y por qué

Cada bloque de abajo corresponde a un archivo `.astro` de esta entrega.

### 3.1 `HeaderDemo.astro` (reemplaza `Header.astro`)

- Logo a la izquierda (ya no centrado en grid de 3 columnas).
- Nav a la derecha: Home / About / Programs / Resources / Log in — como
  enlaces de texto simples, sin `<Button>`.
- Selector de idioma: píldora deslizante (ES/EN con fondo que se mueve),
  reemplaza el texto plano "ES / EN". **Es solo visual todavía** — no está
  conectado al sistema de i18n real (`LanguageSwitch.tsx`); alterna una
  clase con JS de demo. Hay que conectarlo al selector real.
- Comportamiento de scroll: transparente sobre el hero, se vuelve sólido
  (navy) y `fixed` solo después de pasar el hero (usa un centinela +
  IntersectionObserver, mismo patrón que ya usaba `Header.astro`, pero
  midiendo el hero en vez de un píxel fijo).
- **Pendiente explícito de Pedro:** logo distinto para español y para
  inglés (no el mismo logo con texto que cambia — un archivo de imagen
  distinto por idioma). No existe el arte en inglés todavía
  (`/public/identidad/` solo tiene las versiones en español). Está anotado
  en el propio archivo con `⚠️`.

### 3.2 `HeroSlider.astro` (reemplaza `Hero.astro`)

- Fondo = foto a pantalla completa (antes: navy sólido + video en marco),
  3 slides que rotan cada 6s (autoplay, se pausa con `prefers-reduced-motion`).
- Sin degradado/filtro sobre las fotos — a petición explícita de Pedro,
  aunque eso significa que el contraste del texto blanco puede sufrir con
  fotos muy claras. Avisar si pasa con las fotos reales.
- Contenido alineado a la derecha de la pantalla, pero cada línea de texto
  alineada a la izquierda **dentro** de su propio bloque (no es "todo a la
  derecha", es un bloque cargado a la derecha con texto ragged-left).
- Título con saltos de línea 100% manuales (array de segmentos con
  `salto: true`), NUNCA depende de que el navegador decida dónde envolver
  — esa fue la causa de casi todos los "huérfanos" que hubo que corregir.
- Un solo botón (ya no hay botón secundario de "ver temario" ni enlaces de
  llamada/correo debajo) — copy tipo bossbabe ("LET'S BUILD YOUR BUSINESS
  TOGETHER" → "Construyamos tu red, juntos").
- Subtítulo pequeño en blanco puro (`style="color:#ffffff"`, no el token
  `text-ink-inverse`, porque a ese tamaño se notaba menos blanco).
- **Ya NO menciona "reto de 7 días"** en ninguno de los 3 slides — el copy
  quedó centrado en la identidad ("Ayudamos a gente con talento...") y en
  las 6 habilidades / el Ecosistema, no en el mini-curso gratis.
- **Fotos son placeholder de baja resolución** (800×600–1000×800, las
  mejores que había en el repo). Para producción hacen falta 3 fotos reales
  horizontales de al menos 2400×1350px — con las actuales, a pantalla
  completa en un monitor grande, se van a ver borrosas.

### 3.3 `FormSimpleDemo.astro` (sección nueva, antes del newsletter)

Formulario mínimo: 2 inputs (nombre, correo) + checkbox de consentimiento +
1 botón ("Quiero recibirlas"). A la derecha, una imagen que ocupa TODA la
columna de borde a borde (no es una foto con marco). El formulario no
envía a ningún lado todavía (`href="#"` / sin `action`) — falta decidir el
backend (¿el mismo `api/lead.ts` que ya existe?).

### 3.4 `NewsletterDemo.astro` (sección con el celular animado)

- Tarjeta navy con esquinas rectas (sin `border-radius`) — a diferencia
  del resto del sitio, aquí se pidió explícito.
- Columna izquierda: título centrado con efecto de entrada (`opacity` +
  `scale`, CSS puro, respeta `prefers-reduced-motion`), párrafo, línea
  "VIP" en bold, inputs (nombre + correo) alineados en la misma fila que
  el botón, sin corner radius.
- Columna derecha: mockup de teléfono con un feed de "correos" (imagen +
  remitente "EMPRENDE180" + asunto) que se desplaza en bucle infinito
  (CSS `@keyframes`, sin JS). Los asuntos usados son inventados a modo de
  ejemplo — **hay que reemplazarlos por títulos reales del blog** cuando
  se integre (ver 3.6, ya existen 3 posts reales).
- En mobile, el celular va PRIMERO, el texto después (`order-1`/`order-2`).
- Sin cifra de suscriptores en ningún lado — `cifras.sonReales` sigue en
  `false` en `curso.config.ts`, así que no había número real que mostrar.

### 3.5 `DefinicionEmbajador.astro` (sección "Únete a Emprende180")

Análoga al bloque "HOW WE DEFINE BOSSBABE": collage de 2 fotos (una grande
+ una chica superpuesta, SIN marco ni sombra) a la izquierda, texto a la
derecha. Título con gancho de identidad, ligado a la voz que ya existe en
el sitio real (la sección de Problema ya habla de "Visto. Sin responder.")
— por eso el titular quedó "Un Embajador Emprende180 es a quien sí le
contestan." Cuerpo de texto corto, empoderador, sin rayas largas (Pedro
pidió explícito no usar "—", dijo que "parece de IA"). Botón manda a
`/about`.

### 3.6 `ComoTrabajar.astro` (sección "Cómo trabajar con Emprende180")

3 tarjetas con número gigante de fondo (01/02/03): **Academia, CRM, Plan de
90 Días**. Botones alineados a la misma altura en las 3 tarjetas
(`flex flex-col` + `mt-auto`, para que no dependa de cuánto texto tenga
cada una). ⚠️ Pedro no confirmó si son exactamente 3 ofertas o hay una
cuarta — el grid ya está pensado para agregar una tarjeta más si hace
falta.

### 3.7 `TestimoniosDemo.astro` (banda infinita)

Usa los **6 testimonios reales** de `curso.config.ts` (María González,
Carlos Ramírez, Daniela Martínez, José Hernández, Sofía Rodríguez, Miguel
Torres) — no los de maqueta (`testimonios.muestra.ts`, que nunca se
publican). Banda horizontal con animación infinita (`translateX` en
bucle). Fondo de la sección blanco, tarjetas en el azul suave
(`bg-surface-muted`) — invertido a propósito respecto al patrón normal.
Isotipo de marca (`MarcaAgua`) de fondo, arriba a la derecha. Formato de
tarjeta: avatar con iniciales arriba, comilla grande, cita, "- Nombre,
Contexto" al final.

**Nota de producto, no solo de diseño** (se la di a Pedro durante la
sesión, la dejo aquí para que no se pierda): de los 6 testimonios reales,
solo el de Miguel Torres tiene la estructura completa que pide
`docs/pedir-testimonios.md` (un "antes" + un resultado concreto). Los
otros 5 son genéricos y no tienen foto (`foto: null` en los 6). Vale la
pena pedir mejores citas antes de invertir mucho más en esta sección.

### 3.8 `BlogDemo.astro` (análoga a la sección de podcast)

Estructura de 3 columnas real, calcada de una captura de bossbabe.com que
pasó Pedro (no de mi interpretación de texto): **texto+lista+redes a la
izquierda, foto grande de Pedro al centro, párrafo+segunda foto a la
derecha**. Usa `getCollection("blog")` de verdad — los 3 posts reales que
ya existen en `src/contenido/blog/`, no títulos inventados; la lista
crece sola si se agregan más posts. Cada título abre un **popup real**
(usa `render()` de la content collection, no un modal de mentira) con el
artículo completo, sin salir de la landing. Los botones "Listen on
Spotify/Apple/YouTube" de bossbabe se reemplazaron por las redes sociales
reales de la marca, con el patrón de botón expandible (ver 2.3).

### 3.9 `AcademiaDemo.astro` (análoga a "THE MEMBERSHIP")

Texto a la izquierda (título + 2 párrafos + botón, verticalmente centrado
respecto a la imagen — el eyebrow "LA ACADEMIA" es lo único que se queda
arriba fijo), 2 fotos a la derecha (una dentro de otra, SIN marco ni
sombra, ocupando toda la altura de la columna). **Ya no menciona "diez
videos"** — el copy habla de "cada curso de la Academia a medida que se
publica" porque va a haber varios cursos, no solo Fundamentos. Tampoco
menciona CRM ni "Ecosistema" — eso se dejó exclusivamente para la sección
3.6, a petición de Pedro ("que el CRM tenga su lugar aparte"). Botón manda
a `/login` — el mismo destino que "Log in" en el header.

### 3.10 `RecursosDemo.astro` (sección oscura, dirige a /resources)

Análoga a "FREE BUSINESS BUILDING RESOURCES" de bossbabe, pero con copy
propio (no traducción). Fondo navy, todo centrado, contenedor de texto
ancho (`max-w-6xl`) aunque centrado — se agrandó varias veces para que
ninguna frase se partiera mal. Copy final: "Guías, *respuestas directas* y
trucos rápidos para que *construir tu red* sea más fácil." Botón
"Desbloquear recursos" → `/resources`, **una página que no existe
todavía** — el link "Resources" del header ya apunta ahí también, así que
en cuanto se cree la página, ambos quedan resueltos.

### 3.11 `FooterDemo.astro` (reemplaza `Footer.astro`)

Rediseño completo a petición de Pedro: **sin logo, sin títulos de columna,
mucho más compacto** que el footer real (que si sirve como referencia de
contenido: teléfono, email, WhatsApp — aquí simplificado). Estructura
final, 4 columnas cortas:

1. Redes sociales, en fila horizontal (botón expandible, ver 2.3).
2. Home / About / Programs.
3. Resources / Contact us / Terms & Conditions.
4. Privacy Policy / Disclaimer.

Abajo, una franja con el copyright y un link "Sitemap" (→ `/sitemap.xml`,
que ya existe como ruta real). **"Disclaimer" no tiene página real
todavía** — solo existen `legal.privacidad` y `legal.terminos` en
`curso.config.ts`; el link queda en `href="#"` hasta que se escriba esa
página.

---

## 4. Lo que se QUITÓ a propósito (no lo repongas sin preguntar)

- El mecanismo de **"reto de 7 días"** como CTA principal — Pedro pidió
  quitarlo explícito. Antes de esta sesión aparecía en 4 archivos reales
  (`04-Plan90.astro`, `curso.config.ts`, `lib/leads.ts`, y el hero viejo).
  Hay que decidir qué reemplaza al mini-curso como imán de correo real
  (el formulario de 3.3 y 3.4 capturan correo, pero no tienen la lógica de
  secuencia de 7 emails detrás — o se conecta a algo nuevo, o se decide
  que ya no hace falta esa secuencia).
- Cualquier lenguaje de urgencia falsa (cuentas regresivas, "cupos
  limitados") — esto ya estaba prohibido en `PRODUCT.md`, se mantuvo.
- Rayas largas ("—") en el copy de cara al usuario — Pedro las asoció con
  texto "de IA" y pidió no usarlas en ningún texto nuevo.

## 5. Fotografía — el problema de fondo que atraviesa TODO esto

Casi todas las secciones nuevas usan como placeholder las mismas ~5 fotos
que ya había en `public/imagenes/resultados/` y `secciones/` — son de baja
resolución (800×600 en su mayoría) y al menos una es stock genérico
(la de café). Están repetidas entre secciones distintas (la misma foto de
Pedro aparece en el hero, en Definición de Embajador, en el Blog, en la
Academia...). Esto funciona para aprobar dirección de diseño, pero
**antes de publicar hace falta sesión de fotos real**: Pedro, al menos 2-3
Embajadores en acción, momentos del Ecosistema — todas horizontales,
mínimo 2400px de ancho para el hero, cuadradas o 4:5 para los collages.

## 6. Copy — quién lo escribió y qué falta validar legalmente

Todo el copy nuevo lo escribí yo durante la sesión, con el visto bueno de
Pedro turno a turno, pero **nadie de Emprende180 con criterio legal lo ha
revisado todavía**. En particular:

- "Cada curso de la Academia a medida que se publica" (3.9) es una promesa
  de contenido futuro — si al final solo va a haber un curso por mucho
  tiempo, esta frase se vuelve engañosa y hay que ajustarla.
- El checkbox de consentimiento del formulario simple (3.3) usa el mismo
  texto que ya existía en el formulario real de precio ("Acepto que me
  contacten y he leído el aviso de privacidad") — reusarlo está bien, pero
  confírmalo con quien lleva el cumplimiento antes de publicar.

## 7. Assets técnicos que ya están listos para integrar

- `@fontsource-variable/fraunces` ya en `package.json` — no hace falta
  instalar nada.
- Los 6 testimonios reales, los 3 posts reales del blog, y los paths SVG
  de redes sociales (`facebook`, `instagram`, `tiktok`, `youtube`,
  `linkedin`) ya existían en el repo — todo lo nuevo los reutiliza en vez
  de inventar datos.

## 8. Lo que NO se tocó (sigue como estaba)

Después de la sección "Cómo trabajar" para abajo, el resto de la página
real (`02-Problema.astro`, `03-QueVasALograr.astro`, `05-Temario.astro`,
`06-Instructor.astro`, `09-Precio.astro`, `10-Faq.astro`,
`11-CtaFinal.astro`) **no se rediseñó en esta sesión** — sigue con el
diseño anterior, "reto de 7 días" incluido en algunas de esas secciones.
Es el trabajo que sigue después de integrar esto.

## 9. Decisiones que te toca tomar a ti (Claude Code)

Cosas que requieren tu criterio de arquitectura, no solo copiar y pegar:

1. **Cómo fusionar los archivos "Demo" con los reales.** Estos componentes
   se armaron sueltos, con texto hardcodeado en español y sin pasar por
   `<T>`/i18n, para poder iterar rápido con Pedro. Los reales sí son
   bilingües de verdad. Vas a tener que decidir: ¿migras el copy nuevo al
   patrón `Txt` + `<T>` y lo metes a `curso.config.ts`, o hay alguna razón
   para mantenerlo aparte? Mi recomendación es migrarlo — el resto del
   sitio depende de ese patrón para el selector de idioma real.
2. **Extraer el botón social expandible** a un componente compartido (ver
   2.3) antes de que se use en un tercer sitio.
3. **Conectar el selector de idioma del header nuevo** al sistema real
   (`LanguageSwitch.tsx`) — el de la demo es solo visual.
4. **Decidir el destino real de los 2 formularios nuevos** (3.3 y el de
   3.4) — ¿mismo endpoint que `api/lead.ts`? ¿uno nuevo?
5. **Construir `/resources`** — la página no existe, y ahora dos sitios
   distintos apuntan ahí (el nav del header y la sección 3.10).
6. **Decidir si el reemplazo es sección por sección o todo de una vez** —
   dado el tamaño, probablemente conviene ir por partes con revisión de
   Pedro en cada una, igual que se hizo aquí.

## 10. Archivos incluidos en esta entrega

```
HeaderDemo.astro          → reemplaza src/components/layout/Header.astro
HeroSlider.astro           → reemplaza src/components/hero/Hero.astro
Button-MODIFICADO.astro    → reemplaza src/components/ui/Button.astro (renombrar)
FormSimpleDemo.astro       → sección nueva
NewsletterDemo.astro       → sección nueva
DefinicionEmbajador.astro  → sección nueva
DemoAsimetrica.astro       → sección de ejemplo (early prototype, revisar si sigue haciendo falta)
ComoTrabajar.astro         → sección nueva
TestimoniosDemo.astro      → sección nueva
BlogDemo.astro             → sección nueva
AcademiaDemo.astro         → sección nueva
RecursosDemo.astro         → sección nueva
FooterDemo.astro           → reemplaza src/components/layout/Footer.astro
```

Todas las capturas de pantalla de cada iteración (antes de llegar a la
versión final de cada sección) se compartieron con Pedro en el chat de
diseño, no vienen adjuntas aquí — si hace falta ver el histórico de
decisiones de una sección puntual, pregúntale a Pedro o revisa el chat.
