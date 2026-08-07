# Cómo conseguir los testimonios reales

La sección 07 de la landing está terminada y publicada, pero enseña el bloque
«Aquí todavía no hay testimonios». En cuanto pegues tres testimonios reales en
`testimonios` de `src/config/curso.config.ts`, la sección cambia sola a la
rejilla de tarjetas. No hay que tocar código.

Este documento es para conseguir esos tres.

---

## Qué tiene que traer cada testimonio

Cuatro cosas. Si falta la primera, no sirve de nada.

1. **Un resultado concreto**, con número o con plazo.
   «Cerré mi primer cliente en la semana 6» convence.
   «Muy buen curso, lo recomiendo» no dice absolutamente nada.
2. **El antes.** De dónde partía. El lector busca a alguien que empezaba donde
   está él, y si no sabe de dónde salió esa persona no puede compararse.
3. **Nombre y apellido reales**, a qué se dedica y de dónde es.
   Un «María G.» sin más pesa la mitad.
4. **Foto real**, cuadrada, 400×400, en `public/imagenes/testimonios/`.
   Sin foto salen las iniciales, que es honesto, pero una cara convierte más.

---

## Las cuatro preguntas que hay que hacer

No preguntes «¿qué te pareció el curso?». Esa pregunta produce elogios, y los
elogios no venden. Pregunta esto, en este orden:

1. ¿Dónde estabas antes de empezar? ¿Qué llevabas intentando y qué no te salía?
2. ¿Qué conseguiste, en concreto? ¿En cuánto tiempo?
3. ¿Qué le dirías a alguien que está hoy donde estabas tú?
4. **¿Hay algo más que quieras contar, que no te haya preguntado?**

Si la respuesta a la 2 no tiene un número ni un plazo, vuelve a preguntar:
«¿cuántos?», «¿cuándo?», «¿cuánto cobraste?».

### Por qué la cuarta va siempre

Las tres primeras son cerradas: sabes qué quieres sacar y las haces para
sacarlo. El riesgo de eso es que solo recoges lo que ya se te había ocurrido
preguntar.

La cuarta no dirige a ningún sitio, y por eso es donde aparece lo que no sabías
que estaba ahí: la objeción que no habías previsto, la parte del curso que
funciona por un motivo distinto al que tú creías, la frase suelta que resulta
ser mejor titular que cualquiera de los tuyos. Cuesta una línea y suele ser de
donde sale el mejor material. **No la quites nunca**, aunque tengas prisa.

---

## Mensaje listo para enviar (español)

> Hola [nombre]:
>
> Estoy armando la página de Fundamentos de Emprende180 y quiero poner casos
> reales, no frases genéricas. ¿Me ayudas con cuatro respuestas cortas? Con dos
> o tres líneas cada una me sobra.
>
> 1. ¿Dónde estabas antes de empezar el curso?
> 2. ¿Qué conseguiste en concreto, y en cuánto tiempo?
> 3. ¿Qué le dirías a alguien que está hoy donde estabas tú?
> 4. ¿Hay algo más que quieras contar, que no te haya preguntado?
>
> Si te parece bien, publicaría tu respuesta con tu nombre y apellido, a qué te
> dedicas, tu ciudad y una foto tuya. Respóndeme «sí, pueden publicarlo con mi
> nombre y mi foto» y con eso me vale como permiso. Si prefieres que no salga la
> foto o el apellido, dímelo y lo ajusto.
>
> Gracias.

## Ready-to-send message (English)

> Hi [name],
>
> I'm putting together the Fundamentos de Emprende180 page and I want real
> cases on it, not generic praise. Could you answer four quick questions? Two
> or three lines each is plenty.
>
> 1. Where were you before you started the course?
> 2. What did you actually achieve, and how long did it take?
> 3. What would you say to someone who is where you were?
> 4. Anything else you'd want to add that I didn't ask about?
>
> If you're happy with it, I'd publish your answer with your full name, what you
> do, your city and a photo. Just reply "yes, you can publish this with my name
> and photo" and that works as permission. If you'd rather leave out the photo
> or the surname, tell me and I'll adjust.
>
> Thanks.

---

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

> **Daniela Restrepo** · Repostería por encargo · Medellín
> *Primer cliente en la semana 6*
> «Llevaba dos años diciendo que iba a vender mis pasteles y nunca pasaba de la
> idea. En el módulo 2 hablé con 14 personas y tres me preguntaron el precio
> antes de que yo se los diera. Esa semana cobré el primer pedido.»

> **Andrés Peña** · Diseño web freelance · Guadalajara
> *Subió su precio un 60 %*
> «Cobraba lo que me daba vergüenza cobrar. Con la calculadora del módulo 5 vi
> que estaba perdiendo dinero en cada proyecto. Subí el precio y no perdí un
> solo cliente.»

Fíjate en lo que hacen: cuentan el antes, dan un número o un plazo, y usan
palabras de persona normal. Ninguno dice «excelente curso, muy recomendado».

---

## Dónde pegarlos

`src/config/curso.config.ts`, en `testimonios`. Sustituye los tres bloques
`[COMPLETAR: …]` por el texto real, en los dos idiomas, y pon la ruta de la foto
en `foto`. Con eso la sección cambia sola.

Las cifras agregadas («X alumnos», «4,8/5») son otra cosa y viven en `cifras`.
No las enciendas (`sonReales: true`) hasta que los tres números sean
verificables uno por uno.
