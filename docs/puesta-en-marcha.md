# Puesta en marcha del portal

Todo lo que hay que hacer UNA vez para que el área de alumnos funcione en
producción. Son unos veinte minutos. El orden importa: cada paso da algo que
necesita el siguiente.

Mientras no exista `DATABASE_URL`, el portal contesta una página de "volvemos
enseguida" en vez de romperse, y **la landing sigue funcionando entera**,
formulario de contacto incluido. No hay prisa por hacerlo mal.

---

## 1. La base de datos

El proyecto no usa el SDK de ningún proveedor: solo `DATABASE_URL`. Eso quiere
decir que sirve cualquier Postgres, y que cambiar de proveedor es cambiar una
línea.

**Neon** es la recomendación, y por dos razones concretas, no por marca:

- La capa gratuita da 0,5 GB, y este portal con 200 alumnos ocupa **menos de un
  megabyte**. No es que quepa: es que no se le nota.
- No archiva el proyecto por estar quieto. Supabase, en gratis, **pausa** los
  proyectos tras unos días sin actividad, y hay que despertarlos a mano desde el
  panel. Para una base que solo se toca cuando alguien entra al portal, eso es
  justo el fallo que no quieres: el primer alumno que vuelva tras dos semanas se
  encuentra la puerta cerrada.

### Cómo

1. Panel de Vercel → proyecto `emprende180` → pestaña **Storage** → **Create
   Database** → **Neon**. Hacerlo desde ahí, y no desde neon.com, importa:
   Vercel **pone la variable de entorno sola**, en los tres entornos, y no hay
   que copiar ninguna contraseña a mano.
2. Plan **Free**. Región: la más cercana a donde corre la función, que hoy es
   **iad1 (Washington)**, así que **US East**. Cada consulta cruza esa distancia,
   y con la base en Europa se pagan unos 100 ms de ida y vuelta en cada una.
3. Al conectarla, marca los tres entornos (Production, Preview, Development).
4. **Redespliega.** Esto no es opcional y no es evidente: las variables se
   incrustan AL COMPILAR, no se leen en cada petición. Comprobado buscando el
   valor de `ADMIN_EMAILS` dentro de la función ya compilada, y ahí está. Una
   variable añadida después de un despliegue no existe para ese despliegue.
   Cualquier push vale, o el botón **Redeploy** en el panel.
5. Para trabajar en local con la misma base:
   ```bash
   vercel env pull .env.local
   ```
   Baja las variables del proyecto a `.env.local`, que está en `.gitignore` y no
   pisa tu `.env`.

Si prefieres crear la base fuera de Vercel, copia la cadena y añádela como
`DATABASE_URL` en Project Settings → Environment Variables. El resto es igual,
el redespliegue incluido.

> **Usa siempre la cadena CON POOLER** si el proveedor te ofrece las dos (en Neon
> el host lleva `-pooler`). En serverless cada petición puede abrir su propia
> conexión, y un Postgres pequeño se queda sin sitio enseguida. El pooler es lo
> que hace que 200 personas entrando a la vez no tumben nada. La aplicación ya
> está configurada para hablar con un pooler: `prepare: false` y `max: 1` en
> `src/lib/data.ts`.

### Crear las tablas

Con la cadena ya en `.env.local` (o en `.env`):

```bash
npm run db:setup
```

Mira `.env.local` primero, que es donde escribe `vercel env pull`, y si no
encuentra nada ahí prueba con `.env`. O apuntando a una base concreta sin tocar
ningún archivo:

```bash
npm run db:setup -- "postgres://usuario:clave@host/base?sslmode=require"
```

Se conecta, aplica `db/schema.sql` y te dice qué hay dentro. **Se puede repetir
sin miedo**: todo es `IF NOT EXISTS`, no borra nada y no toca ninguna fila. De
hecho hay que repetirlo cada vez que se despliegue algo que añada una columna.

---

## 2. El primer admin

Problema del huevo y la gallina: el primer administrador no puede darse de alta
desde un panel en el que todavía no puede entrar nadie. Se resuelve con una
variable:

```
ADMIN_EMAILS=pedro@agentesocial.com
```

Con eso puesto, pides el enlace desde `/login` con ese correo y la cuenta se crea
sola, ya con rol de admin. **A partir del segundo, todos se dan de alta desde el
propio portal** y esta variable ya solo sirve de red de seguridad: una dirección
que esté en la lista no puede ser degradada a alumno ni desactivada desde el
panel, así que no hay manera de quedarse fuera de casa.

Admite varios separados por comas.

---

## 3. El correo

Sin esto, los enlaces de acceso se escriben en el registro del servidor en vez de
enviarse, y no hay forma de que un alumno entre.

```
RESEND_API_KEY=re_...
NOTIFY_EMAIL_FROM="Emprende180 <no-reply@emprende180.com>"
NOTIFY_EMAIL_TO=hola@emprende180.com
```

El dominio de `NOTIFY_EMAIL_FROM` tiene que estar verificado en Resend (registros
SPF y DKIM en el DNS). Sin verificar, Resend acepta la llamada y el correo acaba
en spam o no llega, que es peor que un error.

Resend regala 3.000 correos al mes y 100 al día. Con 200 alumnos, entre altas y
enlaces perdidos, no vas a acercarte.

> **⚠️ ENVIAR Y RECIBIR SON DOS COSAS DISTINTAS, Y ESTO COSTÓ UN RATO.**
> Verificar el dominio en Resend habilita **enviar** desde `@emprende180.com`.
> **No crea ningún buzón.** Si el dominio no tiene registros MX, una dirección
> como `hola@emprende180.com` no existe: Resend dice "enviado" y el correo no
> llega a ninguna parte. Pasó de verdad, con los avisos de leads.
>
> Así que `NOTIFY_EMAIL_TO` tiene que ser una dirección que **reciba** de
> verdad. Y si la página publica `hola@emprende180.com` como contacto, ese buzón
> tiene que existir: cada visitante que escriba allí está escribiendo al vacío.
> Se comprueba en un segundo:
>
> ```bash
> node -e "require('dns').promises.resolveMx('emprende180.com').then(console.log).catch(()=>console.log('sin MX: no recibe correo'))"
> ```

---

## 4. Lo demás

| Variable | Para qué | ¿Obligatoria? |
|---|---|---|
| `GHL_ALUMNOS_WEBHOOK_URL` | Avisar a GoHighLevel de cada alta, baja y reactivación | No, pero es lo que da el curso al alumno |
| `GHL_WEBHOOK_URL` | Los leads del formulario de la landing | No |
| `PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | Captcha en las tres puertas de acceso | No. Actívalo si empieza a entrar basura |
| `PUBLIC_CRM_URL` + `PUBLIC_ACADEMY_URL` | A dónde llevan las dos puertas del alumno | Sí, o las puertas no llevan a ninguna parte |
| `DEMO_CLAVE` | Contraseña de las cuentas de prueba en local | **Nunca en producción** |

En `/student/settings` hay una pantalla que dice cuáles están puestas y cuáles
no. Enseña el NOMBRE de la variable, nunca el valor: una pantalla que enseña
secretos es un secreto menos.

---

## 4 bis. Dos trampas al poner variables desde Windows

Las dos costaron tiempo de verdad, así que quedan escritas.

**El BOM invisible.** En PowerShell, pasar un valor por tubería le mete delante
un carácter invisible (U+FEFF, el BOM):

```powershell
"re_xxx" | vercel env add RESEND_API_KEY production   # ← mete un BOM al principio
```

Con la clave así, Resend contesta `Cannot convert argument to a ByteString
because the character at index 7 has a value of 65279`. El 65279 ES el BOM.
Cuesta reconocerlo porque el valor se ve perfecto en el panel. Lo que sí
funciona es redirigir desde un archivo escrito sin BOM:

```powershell
[System.IO.File]::WriteAllText($f, "re_xxx", (New-Object System.Text.UTF8Encoding($false)))
cmd /c "vercel env add RESEND_API_KEY production < $f"
```

Detalle curioso: `ADMIN_EMAILS` con BOM funcionaba igual, porque `.trim()` de
JavaScript sí borra el U+FEFF. Una cabecera HTTP no perdona nada.

**`vercel redeploy` no recompila.** Reutiliza la compilación anterior, y como las
variables se incrustan al compilar, un `redeploy` después de tocarlas no cambia
absolutamente nada. Hay que usar `vercel deploy --prod`, o un push, o destildar
"use existing build cache" en el panel.

---

## 5. Comprobar que quedó bien

```bash
npm run db:setup     # conecta y cuenta lo que hay
npm run check        # 0 errores de tipos
npm run build        # compila
```

Y en el navegador, con el sitio ya desplegado:

1. `/login` carga y pide el correo.
2. Pides enlace con el correo de `ADMIN_EMAILS` → llega el correo → entras.
3. Dentro ves Inicio, Alumnos, Agentes, Cupones y Ajustes.
4. Das de alta a alguien de prueba, entras con ese otro correo en una ventana de
   incógnito, y compruebas que **no** ve nada de administración.
5. Lo borras.

---

## Cuánto aguanta esto

Con 200 alumnos, ninguna de las capas gratuitas se roza:

| | Gratis da | Esto gasta |
|---|---|---|
| Base de datos (Neon) | 0,5 GB | menos de 1 MB con 200 alumnos y su historial |
| Correo (Resend) | 3.000/mes | unos 200 el mes de las altas, luego casi ninguno |
| Hosting (Vercel Hobby) | 100 GB de tráfico | la landing es estática y ligera |

El cuello de botella no es el tamaño: es **la concurrencia**. Doscientas personas
no entran a la vez salvo que mandes un correo a todas al mismo tiempo. Si algún
día lo haces, escalona el envío.

Y una condición del plan gratuito de Vercel que conviene tener escrita: **Hobby
es para uso no comercial**. Un portal de un curso de pago no lo es. Para hacerlo
bien hay que estar en Pro (20 $/mes). La base de datos y el correo sí pueden
seguir en gratis.

---

## Qué pasa cuando algo falla

Está probado, no supuesto. Con la base de datos parada a propósito:

| | Antes | Ahora |
|---|---|---|
| Landing | 200 | 200 |
| Formulario de contacto | captura | captura, con el cupón anotado sin verificar |
| Portal | **500** con pantalla de error | **503** con una página que explica qué pasa |
| Rutas de API | 500 | 503 con `{"error":"unavailable"}` |

Y cuando la base vuelve, el portal se recupera **solo**, sin reiniciar nada y sin
que nadie tenga que volver a entrar: las sesiones viven en la base, no en la
memoria del servidor.

Los errores de programación **siguen saliendo como 500**. La página de "volvemos
enseguida" solo aparece ante fallos reconocibles de base de datos, y eso es a
propósito: una red que se traga todos los errores es una manera cara de no
enterarse de nada. Ver `src/lib/downtime.ts`.
