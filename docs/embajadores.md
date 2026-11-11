# Portal de Embajadores

Los Embajadores refieren clientes a varios negocios (Revivi, Venture, las clínicas, Lira Medical, Señor de las Casas...). Cada negocio nos cuenta **hechos** de esos clientes y Emprende180 calcula las comisiones. El Embajador lo ve todo en su teléfono, en `/student/ambassador`, con el mismo inicio de sesión de siempre.

## Quién hace qué

| Pantalla | Quién | Para qué |
| --- | --- | --- |
| `/student/ambassador` (Inicio, Referidos, Equipo, Pagos, Compartir) | El Embajador | Ver lo suyo. Pensado para el teléfono. |
| `/student/ambassadors` | Admin | Activar Embajadores, ver a cada uno, anotar pagos, cambiar patrocinador. |
| `/student/businesses` | Admin | Crear negocios, su secreto de webhook y sus reglas de comisión. |

## Cómo empieza un Embajador

1. Se registra solo en `/subscribe` (si trae el código de otro Embajador, queda anotado quién lo invitó).
2. El admin lo activa en **Embajadores**: se le da un código (o se genera) y un patrocinador. Por defecto, el patrocinador es quien lo invitó.
3. Desde ese momento ve "Mis referidos" en su portal y cobra comisiones.

## Cómo se calcula la comisión

- Genera comisión una **compra**, cada **renovación** y, donde no se paga en caja, cada **cita asistida**.
- **Dos niveles:** el Embajador que trajo al cliente (nivel 1) y quien invitó a ese Embajador (nivel 2).
- **15 días de espera** desde el hecho. Después, la comisión pasa a "Por cobrar".
- **Reembolso dentro de la espera:** la comisión se anula. **Después:** se resta del siguiente pago (el saldo puede quedar en negativo y se arrastra).
- **Reglas por negocio**, nivel, clase (venta o cita) y número de pago (1 = primera compra, 2 = primera renovación...). Así el porcentaje puede bajar con cada renovación.
- **Las reglas no se editan.** Una regla nueva sustituye a la anterior desde su fecha; lo ya ganado no cambia.
- **Pagos:** el admin anota lo pagado, en dinero o en crédito de Revivi. El crédito de Revivi queda "pendiente de abonar" hasta que exista la conexión con clinics.

El cálculo está en `src/lib/commissions.ts` (puro, con pruebas en `tests/`, `npm test`). No se guarda ninguna comisión: se calcula cada vez a partir de los hechos, las reglas y los pagos.

## Conectar un negocio de GoHighLevel

1. En **Negocios**, crea el negocio (fuente: GoHighLevel). Pon el enlace del Embajador si su web lo lee, con `{codigo}` donde va el código: `https://liramedical.com/?ref={codigo}`.
2. Pulsa **Crear secreto nuevo** y cópialo. Solo se enseña una vez.
3. En GHL, crea un workflow por cada momento que cuenta (contacto creado con código, cita marcada como asistida, pago recibido, reembolso) con la acción **Custom Webhook**:
   - Método `POST`, URL `https://www.emprende180.com/api/facts/<identificador>`.
   - Cabecera `Authorization: Bearer <secreto>`.
   - Cuerpo JSON (el contrato de abajo), con los campos de GHL.
4. Guarda el código del Embajador en un campo personalizado del contacto (lo rellena el formulario de la web con el `?ref=`).

## El contrato de un hecho

```json
{
  "event_id": "{{payment.id}}",
  "type": "purchase",
  "referral_ref": "{{contact.id}}",
  "ambassador_code": "{{contact.codigo_embajador}}",
  "occurred_at": "{{payment.created_at}}",
  "amount": "{{payment.amount}}",
  "payment_number": 1,
  "channel": "link",
  "client_name": "{{contact.name}}",
  "consent_at": "{{contact.consentimiento_embajador}}"
}
```

| Campo | Obligatorio | Qué es |
| --- | --- | --- |
| `event_id` | Sí | Id único del hecho en su negocio. Mandarlo dos veces no cuenta dos veces. |
| `type` | Sí | `lead`, `attended`, `purchase`, `renewal`, `refund`, `cancel`. |
| `referral_ref` | Sí | Id del cliente en su negocio (el contacto de GHL). Nunca un correo. |
| `ambassador_code` | La primera vez | El código del Embajador. El primero que llega con un cliente se lo queda. |
| `occurred_at` | No | Cuándo pasó. Por defecto, ahora. |
| `amount` / `amount_cents` | En compra y renovación | En dólares (`"299.00"`) o en centavos. |
| `payment_number` | No | 1 = primera compra, 2 = primera renovación. |
| `original_event_id` | En `refund` / `cancel` | El `event_id` del hecho que deshace. |
| `channel` | No | `link`, `coupon`, `form`, `desk`, `other`. |
| `client_name` | No | Solo si hay `consent_at`. Se guarda cifrado. |
| `consent_at` | No | Cuándo autorizó el cliente que su Embajador vea su nombre. |

Respuestas: `200` guardado (o `"status": "duplicate"`), `400` cuerpo mal formado, `401` negocio o secreto incorrecto, `422` no se puede aplicar (código de Embajador desconocido, reembolso de algo que no existe, compra sin importe). El motivo va en el cuerpo y GHL lo enseña en el historial del workflow.

## Privacidad

- El nombre del cliente solo se guarda con su consentimiento y cifrado con `AMBASSADOR_DATA_KEY` (AES-256-GCM). Sin consentimiento el portal dice "Cliente #4".
- El Embajador ve nombre, negocio, fecha, estado y comisión. Nunca el servicio, la cita ni el teléfono.
- De su equipo ve a los Embajadores, nunca a sus clientes.
- Cada vez que alguien abre una lista con nombres queda una fila en `registro_vistas`.
- El correo de aviso no lleva nombre ni importe.

## Puesta en marcha

1. `npm run db:setup` (añade las tablas nuevas; es idempotente).
2. En Vercel: `AMBASSADOR_DATA_KEY` = `openssl rand -base64 32`. Sin ella, no se guarda ningún nombre.
3. Crear los negocios y sus reglas en **Negocios**. Mientras no haya reglas, el portal avisa de que las comisiones no están configuradas.

## Conectar los negocios de clinics (Revivi, Venture, las clínicas)

Estos no mandan webhook: Emprende180 lee sus hechos de clinics (`/partners/v1/emprende180`), firmados con HMAC.

1. En clinics: `EMPRENDE180_SECRET` (un valor largo al azar) y aplicar la migración `20261110120000_emprende180_partner`.
2. En Emprende180: `CLINICS_API_URL` (la dirección del API de clinics) y `CLINICS_PARTNER_SECRET` (el MISMO valor). Opcional: `CRON_SECRET` y un cron de Vercel a `/api/cron/clinics`.
3. En **Negocios**, un negocio por clínica con fuente **Clinics** y, como identificador, el **slug de la clínica** en clinics (por ejemplo `revivi`). Cada hecho dice en qué clínica pasó y cae en el negocio con ese identificador.
4. Al **activar** a un Embajador, Emprende180 lo da de alta en clinics como afiliado de toda la organización, con 0 % de comisión propia allí (la comisión la calcula Emprende180). Si falla, su ficha lo dice y tiene un botón para reintentar.
5. Un pago en **crédito Revivi** se abona en clinics al anotarlo. Si falla, queda "pendiente de abonar" y se reintenta desde la ficha.

Qué cuenta clinics: `lead` (el referido), `purchase` (cada recibo, antes de impuestos), `renewal` (la parte de un recibo que cobra una membresía renovada, con su número de pago: 2 = primera renovación), `refund`, `cancel` (recibo anulado o cita que deja de estar completada) y `attended` (cita completada sin recibo, las de las clínicas PI). Nunca nombres ni correos.

Cómo sabe clinics quién es el referido: el referido queda pegado a la **ficha del paciente**, no a su correo. Así se puede referir a un paciente sin correo (lo normal en las PI), cambiarle el correo no mueve nada y dos pacientes con el mismo correo no se mezclan. Un lead que llegó por el enlace de la web, antes de existir la ficha, va por correo hasta que reserva; entonces queda pegado a su ficha.

En recepción, **Referred by** (en la ficha del paciente y al crearlo) está en **todas** las clínicas, también las PI, y ofrece a los Embajadores.

Cuándo se lee: al abrir el portal o el admin (como mucho una vez por minuto), con **Sincronizar ahora** en Negocios, y con el cron si existe. Si llega un hecho de una clínica que no tiene negocio aquí, la lectura se detiene ahí y Negocios lo avisa; al crear el negocio, sigue donde se quedó.

## Pendiente

- Los porcentajes de comisión (por nivel y por renovación).
