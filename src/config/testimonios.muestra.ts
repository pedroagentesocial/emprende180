import type { Testimonio } from "./curso.config";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MUESTRA DE MAQUETACIÓN — NO SON ALUMNOS REALES Y NO SE PUBLICAN
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Estos seis existen para UNA cosa: poder ver y ajustar el carrusel (el
 * movimiento, el alto de las tarjetas, qué pasa con una cita larga y una corta,
 * cómo se ve en móvil) sin tener que esperar a tener alumnos.
 *
 * Solo se renderizan con `import.meta.env.DEV`, es decir en `npm run dev`.
 * En el sitio publicado NO aparecen nunca: ahí se muestra el bloque honesto
 * hasta que `testimonios` tenga citas reales. La comprobación está en
 * `07-PruebaSocial.astro` y no depende de que nadie se acuerde de nada.
 *
 * Publicarlos como si fueran reales sería publicidad engañosa: en EE. UU. la
 * FTC los multa por unidad desde 2024 (16 CFR 465) y en México los persigue
 * PROFECO. Aparte de eso, se nota.
 *
 * SÍ SIRVEN COMO MOLDE. Fíjate en lo que hacen los seis: cuentan de dónde
 * partía la persona, dan un número o un plazo, mencionan un módulo concreto y
 * están escritos como habla la gente. Ninguno dice «excelente curso». Eso es lo
 * que tienes que pedirle a tus alumnos (ver `docs/pedir-testimonios.md`).
 */
export const testimoniosMuestra: Testimonio[] = [
  {
    nombre: "Daniela Restrepo",
    contexto: {
      es: "Repostería por encargo · Medellín, Colombia",
      en: "Custom baking · Medellín, Colombia",
    },
    resultado: {
      es: "Primer pedido cobrado en la semana 6",
      en: "First paid order in week 6",
    },
    cita: {
      es: "Llevaba dos años diciendo que iba a vender mis pasteles y nunca pasaba de la idea. En el módulo 2 hablé con 14 personas y tres me preguntaron el precio antes de que yo se los diera. Esa semana cobré el primer pedido.",
      en: "I spent two years saying I was going to sell my cakes and never got past the idea. In module 2 I talked to 14 people and three asked me the price before I offered it. That week I got paid for my first order.",
    },
    foto: null,
  },
  {
    nombre: "Andrés Peña",
    contexto: {
      es: "Diseño web freelance · Guadalajara, México",
      en: "Freelance web design · Guadalajara, Mexico",
    },
    resultado: { es: "Subió su precio un 60 %", en: "Raised his prices 60%" },
    cita: {
      es: "Cobraba lo que me daba vergüenza cobrar. Con los números del módulo 5 vi que estaba perdiendo dinero en cada proyecto. Subí el precio y no perdí un solo cliente. El primero que aceptó el precio nuevo ni parpadeó.",
      en: "I charged what I was embarrassed to charge. The numbers in module 5 showed me I was losing money on every project. I raised my price and didn't lose a single client. The first one who paid the new rate didn't even blink.",
    },
    foto: null,
  },
  {
    nombre: "Valeria Ortiz",
    contexto: {
      es: "Asesoría contable · Lima, Perú",
      en: "Bookkeeping services · Lima, Peru",
    },
    resultado: { es: "De 9 ideas a una, en una tarde", en: "From 9 ideas to one, in an afternoon" },
    cita: {
      es: "Mi problema no era falta de ideas, era que tenía nueve y no arrancaba ninguna. El filtro del módulo 1 me dejó una sola en una tarde. Lo difícil no fue elegir: fue soltar las otras ocho, y el curso me obligó a hacerlo.",
      en: "My problem wasn't a lack of ideas, it was having nine and starting none. The filter in module 1 left me with one in a single afternoon. Choosing wasn't the hard part: dropping the other eight was, and the course made me do it.",
    },
    foto: null,
  },
  {
    nombre: "Rodrigo Salazar",
    contexto: {
      es: "Entrenador personal · Monterrey, México",
      en: "Personal trainer · Monterrey, Mexico",
    },
    resultado: { es: "4 clientes en el primer mes", en: "4 clients in the first month" },
    cita: {
      es: "Odio vender. Pensaba que había que ser insistente y por eso no le ofrecía nada a nadie. El módulo 6 es literalmente un guion de preguntas: lo seguí, y cerré cuatro clientes el primer mes sin sentirme un vendedor de nada.",
      en: "I hate selling. I thought you had to be pushy, so I never offered anything to anyone. Module 6 is literally a script of questions: I followed it and closed four clients in the first month without feeling like a salesman.",
    },
    foto: null,
  },
  {
    nombre: "Camila Fuentes",
    contexto: {
      es: "Tienda de plantas en línea · Bogotá, Colombia",
      en: "Online plant shop · Bogotá, Colombia",
    },
    resultado: { es: "Se ahorró $2,100 en inventario", en: "Saved $2,100 on inventory" },
    cita: {
      es: "Iba a pedir inventario para seis meses antes de vender nada. Hice la prueba del módulo 4 con una página y un formulario, y descubrí que lo que la gente quería era otra cosa. Me ahorré $2,100 y tres meses de bodega llena.",
      en: "I was about to order six months of inventory before selling anything. I ran the module 4 test with one page and a form and found out people wanted something else. It saved me $2,100 and three months of a full storeroom.",
    },
    foto: null,
  },
  {
    nombre: "Javier Morales",
    contexto: {
      es: "Taller de carpintería · Santiago, Chile",
      en: "Carpentry workshop · Santiago, Chile",
    },
    resultado: { es: "Dejó de quedarse sin efectivo cada mes", en: "Stopped running out of cash every month" },
    cita: {
      es: "Vendía bien y siempre andaba sin plata, y no entendía por qué. La hoja de flujo de caja del módulo 7 me lo enseñó en veinte minutos: cobraba a 60 días y pagaba materiales al contado. Cambié eso y se acabó el problema.",
      en: "I was selling well and always broke, and I couldn't work out why. The cash-flow sheet in module 7 showed me in twenty minutes: I was getting paid in 60 days and paying for materials up front. I changed that and the problem was gone.",
    },
    foto: null,
  },
];
