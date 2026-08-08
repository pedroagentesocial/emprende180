import type { Testimonio } from "./curso.config";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MUESTRA DE MAQUETACIÓN — NO SON ALUMNOS REALES Y NO SE PUBLICAN
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Estos seis existen para UNA cosa: poder ver y ajustar el carrusel (el
 * movimiento, el alto de las tarjetas, qué pasa con una cita larga y una corta,
 * cómo se ve en móvil) sin tener que esperar a tener Embajadores formados.
 *
 * Solo se renderizan con `import.meta.env.DEV`, es decir en `npm run dev`.
 * En el sitio publicado NO aparecen nunca: ahí se muestra el bloque honesto
 * hasta que `testimonios` tenga citas reales. La comprobación está en
 * `07-PruebaSocial.astro`, se resuelve al compilar y no depende de que nadie se
 * acuerde de nada.
 *
 * Publicarlos como si fueran reales sería publicidad engañosa: en EE. UU. la
 * FTC los multa por unidad desde 2024 (16 CFR 465) y en México los persigue
 * PROFECO. Aparte de eso, se nota.
 *
 * ⚠️ FÍJATE EN LO QUE NINGUNO DICE: cuánto dinero ganó. Eso es deliberado y
 * tiene que seguir siéndolo cuando los sustituyas por los reales. Una cifra de
 * ingresos en un testimonio es una declaración de ingresos, la FTC exige poder
 * documentar que es representativa de lo que consigue un Embajador normal, y
 * en un programa de referidos es el punto por donde más fácil se cae. Los seis
 * hablan de lo que la persona HIZO: contactos ordenados, conversaciones
 * tenidas, referidos pedidos. Eso convierte igual y se puede sostener.
 *
 * SÍ SIRVEN COMO MOLDE en todo lo demás: cuentan de dónde partía la persona,
 * dan un número o un plazo, mencionan un curso concreto y están escritos como
 * habla la gente. Ninguno dice «excelente curso». Eso es lo que tienes que
 * pedirle a tus Embajadores (ver `docs/pedir-testimonios.md`).
 */
export const testimoniosMuestra: Testimonio[] = [
  {
    nombre: "Daniela Restrepo",
    contexto: {
      es: "Estilista · Houston, Texas",
      en: "Hair stylist · Houston, Texas",
    },
    resultado: {
      es: "Pidió su primer referido en la semana 2",
      en: "Asked for her first referral in week 2",
    },
    cita: {
      es: "Llevo doce años detrás de una silla oyendo a la gente contarme su vida, y nunca se me ocurrió que ahí había algo. El curso 6 me dio las palabras exactas para preguntar. La primera vez me temblaba la voz y aun así funcionó.",
      en: "I've spent twelve years behind a chair listening to people tell me their lives, and it never occurred to me there was anything there. Course 6 gave me the exact words to ask. The first time my voice shook and it still worked.",
    },
    foto: null,
  },
  {
    nombre: "Andrés Peña",
    contexto: {
      es: "Mecánico · Phoenix, Arizona",
      en: "Mechanic · Phoenix, Arizona",
    },
    resultado: {
      es: "Reconoció 4 situaciones en un mes",
      en: "Spotted 4 situations in one month",
    },
    cita: {
      es: "En el taller me llegan carros chocados todas las semanas y yo solo veía el golpe. Después del curso 5 empecé a oír lo que me contaban mientras esperaban. En un mes reconocí cuatro situaciones que antes se me habrían pasado enteras.",
      en: "Wrecked cars come into my shop every week and all I ever saw was the damage. After course 5 I started actually hearing what people told me while they waited. In a month I spotted four situations that would have gone right past me before.",
    },
    foto: null,
  },
  {
    nombre: "Valeria Ortiz",
    contexto: {
      es: "Asistente administrativa · Orlando, Florida",
      en: "Administrative assistant · Orlando, Florida",
    },
    resultado: {
      es: "60 contactos ordenados en una tarde",
      en: "60 contacts sorted in one afternoon",
    },
    cita: {
      es: "Yo tenía a la gente en notas del celular, en WhatsApp y en la cabeza, o sea en ningún lado. Con el curso 7 metí 60 contactos al CRM en una tarde. Lo importante no fue meterlos: fue ver por primera vez con quién no hablaba hace ocho meses.",
      en: "My people were in phone notes, in WhatsApp and in my head, which is to say nowhere. With course 7 I put 60 contacts into the CRM in one afternoon. The point wasn't entering them: it was seeing for the first time who I hadn't spoken to in eight months.",
    },
    foto: null,
  },
  {
    nombre: "Rodrigo Salazar",
    contexto: {
      es: "Entrenador personal · Los Ángeles, California",
      en: "Personal trainer · Los Angeles, California",
    },
    resultado: {
      es: "3 personas le escribieron a él",
      en: "3 people messaged him first",
    },
    cita: {
      es: "Odio perseguir gente. El curso 8 no va de publicar más, va de publicar algo que haga que te escriban. Cambié cómo contaba las cosas y en dos semanas me escribieron tres personas que yo no habría contactado nunca.",
      en: "I hate chasing people. Course 8 isn't about posting more, it's about posting something that makes people message you. I changed how I told things and within two weeks three people wrote to me who I never would have reached out to.",
    },
    foto: null,
  },
  {
    nombre: "Camila Fuentes",
    contexto: {
      es: "Recepcionista de clínica · Chicago, Illinois",
      en: "Clinic receptionist · Chicago, Illinois",
    },
    resultado: {
      es: "Entendió dónde encajaba en la semana 1",
      en: "Understood where she fit in week 1",
    },
    cita: {
      es: "Entré sin entender qué era esto exactamente y con la mosca detrás de la oreja, la verdad. Los tres primeros cursos me dejaron claro quién hace qué y qué NO me tocaba a mí. Saber dónde acaba mi parte fue lo que me hizo animarme.",
      en: "I came in not really understanding what this was and honestly a bit suspicious. The first three courses made clear who does what and what was NOT mine to do. Knowing where my part ends is what made me go for it.",
    },
    foto: null,
  },
  {
    nombre: "Javier Morales",
    contexto: {
      es: "Conductor de reparto · Miami, Florida",
      en: "Delivery driver · Miami, Florida",
    },
    resultado: {
      es: "Terminó con su plan de 90 días escrito",
      en: "Finished with his 90-day plan written",
    },
    cita: {
      es: "Me había apuntado antes a cosas que sonaban bien y a las tres semanas ya no sabía qué hacer. Aquí el curso 10 te obliga a escribir el plan: a quién llamas cada semana y cómo sabes si vas bien. Es lo único que me ha hecho seguir después del mes.",
      en: "I'd signed up before for things that sounded good and three weeks later I had no idea what to do next. Here course 10 makes you write the plan down: who you call each week and how you know it's working. It's the only thing that's kept me going past month one.",
    },
    foto: null,
  },
];
