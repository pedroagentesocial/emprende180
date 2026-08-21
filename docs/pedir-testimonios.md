# Cómo conseguir los testimonios reales

La sección 07 de la landing está terminada y publicada, pero enseña el bloque
«Aquí todavía no hay testimonios». En cuanto pegues tres testimonios reales en
`testimonios` de `src/config/curso.config.ts`, la sección cambia sola a la
rejilla de tarjetas. No hay que tocar código.

Este documento es para conseguir esos tres.

---

## Qué tiene que traer cada testimonio

Cinco cosas. Si falta la primera, no sirve de nada.

1. **Un resultado concreto**, con número o con plazo, y de algo que la persona
   **hizo**. «Pedí mi primer referido en la semana 2» convence.
   «Muy buen curso, lo recomiendo» no dice absolutamente nada.
2. **El antes.** De dónde partía. El lector busca a alguien que empezaba donde
   está él, y si no sabe de dónde salió esa persona no puede compararse.
3. **Nombre y apellido reales**, a qué se dedica y de dónde es.
   Un «María G.» sin más pesa la mitad.
4. **Foto real**, cuadrada, 400×400, en `public/imagenes/testimonios/`.
   Sin foto salen las iniciales, que es honesto, pero una cara convierte más.
5. **Las estrellas que ponga la persona**, de 1 a 5. Es una pregunta más en el
   mensaje y es lo que hace que la tarjeta se lea como una reseña y no como una
   cita suelta.

### Las estrellas no se rellenan a ojo

`estrellas` es lo que puso el alumno, no lo que te gustaría que hubiera puesto.
Poner cinco donde había cuatro es alterar una reseña, y eso vale lo mismo que
inventarla entera.

Y si alguien te da un 4, **publícalo con su 4**. Una banda con seis cincos
seguidos se lee como comprada; un 4 entre cincos es lo que hace creíbles a los
cincos. La nota media de la cabecera sale de estas cifras, así que un 4,8 dice
más que un 5,0.

### `fuente`: de dónde sale la reseña

- `"directo"` — la persona te la mandó por WhatsApp o por email. **Es lo que
  toca hoy**, y es lo que está puesto. El resumen dice «4.8 de 5 en 6
  valoraciones», sin nombrar ninguna plataforma.
- `"google"` — la reseña **está publicada en Google** y `url` apunta a ella.
  Entonces, y solo entonces, aparece el logotipo de Google en la tarjeta y en el
  resumen.

La insignia de Google vale algo justamente porque quien la ve puede pinchar y
comprobarla en un sitio que tú no controlas. Sin enlace que abrir es una
credencial prestada, y encima del texto equivocado es publicidad engañosa por
partida doble (la reseña y la plataforma). Si un día quieres las de Google, el
camino es pedirle al alumno que la deje **allí** y luego pegar aquí el permalink.

---

## Las cinco preguntas que hay que hacer

No preguntes «¿qué te pareció el curso?». Esa pregunta produce elogios, y los
elogios no venden. Pregunta esto, en este orden:

1. ¿Dónde estabas antes de empezar? ¿Qué llevabas intentando y qué no te salía?
2. ¿Qué conseguiste, en concreto? ¿En cuánto tiempo?
3. ¿Qué le dirías a alguien que está hoy donde estabas tú?
4. Del 1 al 5, ¿cuántas estrellas le pones?
5. **¿Hay algo más que quieras contar, que no te haya preguntado?**

Si la respuesta a la 2 no tiene un número ni un plazo, vuelve a preguntar:
«¿cuántos?», «¿cuándo?».

La 4 va **después** de las abiertas y no antes, y eso no es casual: preguntada
la primera, la nota se convierte en el marco y todo lo que responda después lo
escribe para justificarla. Preguntada al final, puntúa lo que acaba de contar.

### Por qué la última va siempre

Las primeras son cerradas: sabes qué quieres sacar y las haces para sacarlo. El
riesgo de eso es que solo recoges lo que ya se te había ocurrido preguntar.

La última no dirige a ningún sitio, y por eso es donde aparece lo que no sabías
que estaba ahí: la objeción que no habías previsto, la parte del curso que
funciona por un motivo distinto al que tú creías, la frase suelta que resulta
ser mejor titular que cualquiera de los tuyos. Cuesta una línea y suele ser de
donde sale el mejor material. **No la quites nunca**, aunque tengas prisa.

---

## Mensaje listo para enviar (español)

> Hola [nombre]:
>
> Estoy armando la página de Fundamentos de Emprende180 y quiero poner casos
> reales, no frases genéricas. ¿Me ayudas con cinco respuestas cortas? Con dos
> o tres líneas cada una me sobra.
>
> 1. ¿Dónde estabas antes de empezar el curso? ¿Qué llevabas intentando que no
>    te terminaba de salir?
> 2. ¿Qué conseguiste en concreto, y en cuánto tiempo?
> 3. ¿Qué le dirías a alguien que está hoy donde estabas tú?
> 4. Del 1 al 5, ¿cuántas estrellas le pones?
> 5. ¿Hay algo más que quieras contar, que no te haya preguntado?
>
> Contéstame con tus palabras, tal cual se te ocurra. No lo escribas «bonito»:
> lo que funciona es que suene a ti.
>
> Si te parece bien, publicaría tu respuesta con tu nombre y apellido, a qué te
> dedicas, tu ciudad, tus estrellas y una foto tuya. Respóndeme «sí, pueden
> publicarlo con mi nombre y mi foto» y con eso me vale como permiso. Si
> prefieres que no salga la foto o el apellido, dímelo y lo ajusto. Y si algún
> día quieres que lo quite, me escribes y lo quito el mismo día.
>
> Gracias.

## Ready-to-send message (English)

> Hi [name],
>
> I'm putting together the Fundamentos de Emprende180 page and I want real
> cases on it, not generic praise. Could you answer five quick questions? Two
> or three lines each is plenty.
>
> 1. Where were you before you started the course? What had you been trying
>    that wasn't quite working?
> 2. What did you actually achieve, and how long did it take?
> 3. What would you say to someone who is where you were?
> 4. Out of 5, how many stars would you give it?
> 5. Anything else you'd want to add that I didn't ask about?
>
> Answer in your own words, however it comes out. Don't write it "nicely" —
> what works is that it sounds like you.
>
> If you're happy with it, I'd publish your answer with your full name, what you
> do, your city, your star rating and a photo. Just reply "yes, you can publish
> this with my name and photo" and that works as permission. If you'd rather
> leave out the photo or the surname, tell me and I'll adjust. And if you ever
> want it taken down, message me and it's gone the same day.
>
> Thanks.

### Si además quieres la reseña en Google

Va en un mensaje **aparte y después**, nunca en el mismo. Pedir las dos cosas a
la vez baja la respuesta de las dos: son dos esfuerzos distintos y el segundo
hace que el primero parezca un trámite.

> Gracias otra vez, [nombre]. Una última cosa y ya te dejo en paz: si te animas
> a dejar eso mismo como reseña en Google, ahí lo ve gente que no me conoce de
> nada y pesa muchísimo más que en mi propia página. Te dejo el enlace directo:
> [enlace]. Sin problema si prefieres no hacerlo.

Cuando la deje, copia el enlace de esa reseña y cambia en la ficha
`fuente: "directo"` por `fuente: "google"` más `url: "…"`. El logotipo de Google
aparece solo.

---

## Lo que NO puede aparecer: cuánto ganó nadie

Ni en la cita, ni en la etiqueta de resultado, ni «me pagó el carro», ni «ya
reemplacé mi sueldo». Ninguna cifra de ingresos, ningún rango, ningún «un
Embajador promedio».

Un testimonio que dice cuánto ganó alguien es una **declaración de ingresos**.
La FTC exige poder documentar que esa cifra es lo que consigue un Embajador
normal, no el mejor de todos, y en un programa de referidos es por donde más
fácil se cae. No es un detalle de redacción: es la diferencia entre una página
que se puede defender y una que no.

Si un alumno te manda un testimonio con una cifra, no lo tires: agradécele y
**publica la parte de lo que hizo**. «Ordené 60 contactos y hablé con 12 en dos
semanas» convierte igual y se sostiene sola.

## El permiso no es opcional

Publicar el nombre y la foto de alguien sin su consentimiento expreso es un
problema legal, no un descuido. **Guarda el «sí» por escrito** (captura del
WhatsApp o del email) antes de publicar nada. Si un día esa persona se
arrepiente, retíralo el mismo día.

---

## Cómo se ve uno bueno

Hay seis escritos en `testimoniosMuestra` (`src/config/curso.config.ts`) que
sirven de molde y que puedes ver moviéndose en el carrusel con `npm run dev`.
**No son alumnos reales y no se publican nunca**: el código los descarta al
compilar para producción.

Dos de ellos, para tenerlos a mano:

> **Daniela Restrepo** · Estilista · Houston, Texas
> *Pidió su primer referido en la semana 2*
> «Llevo doce años detrás de una silla oyendo a la gente contarme su vida, y
> nunca se me ocurrió que ahí había algo. El curso 6 me dio las palabras
> exactas para preguntar. La primera vez me temblaba la voz y aun así funcionó.»

> **Andrés Peña** · Mecánico · Phoenix, Arizona
> *Reconoció 4 situaciones en un mes*
> «En el taller me llegan carros chocados todas las semanas y yo solo veía el
> golpe. Después del curso 5 empecé a oír lo que me contaban mientras
> esperaban.»

Fíjate en lo que hacen: cuentan el antes, dan un número o un plazo, mencionan un
curso concreto y usan palabras de persona normal. Ninguno dice «excelente
curso», y **ninguno dice cuánto ganó**.

---

## Dónde pegarlos

`src/config/curso.config.ts`, en `testimonios`. Sustituye los bloques
`[COMPLETAR: …]` por el texto real, en los dos idiomas. Una ficha completa queda
así:

```ts
{
  nombre: "Daniela Restrepo",
  contexto: { es: "Estilista · Houston, Texas", en: "Hair stylist · Houston, Texas" },
  resultado: { es: "Pidió su primer referido en la semana 2", en: "…" },
  cita: { es: "…", en: "…" },
  foto: "/imagenes/testimonios/daniela.webp",  // o null → iniciales
  estrellas: 5,          // lo que puso ELLA, de 1 a 5
  fuente: "directo",     // "google" solo si está publicada allí, con `url`
}
```

Con eso la sección cambia sola: desaparece el bloque de «todavía no hay
testimonios» y aparece la banda con el resumen de puntuación encima. La nota
media se calcula de estas `estrellas`, así que no hay que escribirla en ningún
sitio.

El recuento de **alumnos** es otra cosa y vive en `cifras`. No lo enciendas
(`sonReales: true`) hasta que el número sea verificable: si sigue en `false`, la
cabecera enseña solo la nota y las valoraciones, que es correcto.
