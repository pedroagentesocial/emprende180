// Generador de rampas OKLCH + verificación WCAG. Temporal, se borra tras usarlo.

const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const unlin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

function rgb2oklch([R, G, B]) {
  const r = lin(R), g = lin(G), b = lin(B);
  const l = Math.cbrt(0.4122214708*r + 0.5363325363*g + 0.0514459929*b);
  const m = Math.cbrt(0.2119034982*r + 0.6806995451*g + 0.1073969566*b);
  const s = Math.cbrt(0.0883024619*r + 0.2817188376*g + 0.6299787005*b);
  const L = 0.2104542553*l + 0.7936177850*m - 0.0040720468*s;
  const A = 1.9779984951*l - 2.4285922050*m + 0.4505937099*s;
  const Bb= 0.0259040371*l + 0.7827717662*m - 0.8086757660*s;
  let H = Math.atan2(Bb, A) * 180 / Math.PI; if (H < 0) H += 360;
  return { L, C: Math.hypot(A, Bb), H };
}

function oklch2rgb({ L, C, H }) {
  const a = C * Math.cos(H * Math.PI / 180), b = C * Math.sin(H * Math.PI / 180);
  const l_ = (L + 0.3963377774*a + 0.2158037573*b) ** 3;
  const m_ = (L - 0.1055613458*a - 0.0638541728*b) ** 3;
  const s_ = (L - 0.0894841775*a - 1.2914855480*b) ** 3;
  const r = +4.0767416621*l_ - 3.3077115913*m_ + 0.2309699292*s_;
  const g = -1.2684380046*l_ + 2.6097574011*m_ - 0.3413193965*s_;
  const bl= -0.0041960863*l_ - 0.7034186147*m_ + 1.7076147010*s_;
  return [r, g, bl].map((v) => Math.round(Math.min(1, Math.max(0, unlin(v))) * 255));
}

const enGamut = (c) => {
  const a = c.C * Math.cos(c.H * Math.PI/180), b = c.C * Math.sin(c.H * Math.PI/180);
  const l_ = (c.L + 0.3963377774*a + 0.2158037573*b) ** 3;
  const m_ = (c.L - 0.1055613458*a - 0.0638541728*b) ** 3;
  const s_ = (c.L - 0.0894841775*a - 1.2914855480*b) ** 3;
  const rgb = [
    +4.0767416621*l_ - 3.3077115913*m_ + 0.2309699292*s_,
    -1.2684380046*l_ + 2.6097574011*m_ - 0.3413193965*s_,
    -0.0041960863*l_ - 0.7034186147*m_ + 1.7076147010*s_,
  ];
  return rgb.every((v) => v >= -0.001 && v <= 1.001);
};

const lum = ([r, g, b]) => 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b);
const contraste = (c1, c2) => {
  const [a, b] = [lum(c1), lum(c2)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
};

const hex = (rgb) => "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
const fmt = (c) => `oklch(${c.L.toFixed(3)} ${c.C.toFixed(4)} ${c.H.toFixed(1)})`;

const PASOS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/** Construye una rampa: L fijado por paso, C escalada por curva de campana. */
function rampa(hue, Lmap, Cmax, Cpico = 550) {
  const out = {};
  for (const p of PASOS) {
    const L = Lmap[p];
    // Campana: máximo croma hacia el centro, se apaga en los extremos.
    const t = 1 - Math.abs(Math.log(p / Cpico)) / Math.log(950 / 50) * 2.4;
    let C = Cmax * Math.max(0.06, Math.min(1, t));
    let c = { L, C, H: hue };
    while (!enGamut(c) && c.C > 0) { c.C -= 0.002; c = { L, C: c.C, H: hue }; }
    out[p] = c;
  }
  return out;
}

// ── Anclas reales de la guía de marca ───────────────────────────────────────
const NAVY = rgb2oklch(hex2rgb("#0D2B4D"));   // primario
const TEAL = rgb2oklch(hex2rgb("#11A79D"));   // secundario / acción
const AQUA = rgb2oklch(hex2rgb("#A7E1DA"));   // teal claro
const OFFW = rgb2oklch(hex2rgb("#F2F4F7"));   // neutro claro

console.log("ANCLAS");
for (const [n, c] of [["#0D2B4D navy", NAVY], ["#11A79D teal", TEAL], ["#A7E1DA aqua", AQUA], ["#F2F4F7 off-white", OFFW]])
  console.log(`  ${n.padEnd(20)} ${fmt(c)}`);

// Navy: #0D2B4D es un color oscuro → ancla en el paso 900.
const primary = rampa(NAVY.H, {
  50: 0.972, 100: 0.938, 200: 0.880, 300: 0.805, 400: 0.690,
  500: 0.575, 600: 0.470, 700: 0.385, 800: 0.330, 900: NAVY.L, 950: 0.205,
}, 0.115, 600);
primary[900] = NAVY; // exacto

// Teal: #11A79D ancla en 500; #A7E1DA cae de forma natural en 200.
// 600 bajado a L .548 para que texto blanco encima llegue a 4.5:1 (era 4.17).
const secondary = rampa(TEAL.H, {
  50: 0.978, 100: 0.950, 200: AQUA.L, 300: 0.800, 400: 0.730,
  500: TEAL.L, 600: 0.548, 700: 0.462, 800: 0.390, 900: 0.325, 950: 0.235,
}, 0.135, 500);
secondary[500] = TEAL; // exacto
secondary[200] = AQUA; // exacto

// Neutros: tintados con el tono del navy para que "pertenezcan" a la marca.
// 400 bajado a L .638: es el borde de los inputs y WCAG 1.4.11 exige 3:1
// contra el fondo para elementos de interfaz no textuales.
const neutral = rampa(NAVY.H, {
  50: 0.985, 100: OFFW.L, 200: 0.925, 300: 0.872, 400: 0.638,
  500: 0.565, 600: 0.450, 700: 0.378, 800: 0.288, 900: 0.222, 950: 0.155,
}, 0.014, 400);
neutral[100] = OFFW; // exacto

for (const [nombre, r] of [["primary (navy)", primary], ["secondary (teal)", secondary], ["neutral", neutral]]) {
  console.log(`\n── ${nombre} ──`);
  for (const p of PASOS) console.log(`  ${String(p).padStart(3)}  ${fmt(r[p])}  ${hex(oklch2rgb(r[p]))}`);
}

// ── Verificación WCAG ───────────────────────────────────────────────────────
const rgbDe = (c) => oklch2rgb(c);
const W = [255, 255, 255];
const pares = [
  ["ink (navy-900) sobre blanco",           rgbDe(primary[900]), W, 4.5],
  ["ink sobre surface-muted (#F2F4F7)",     rgbDe(primary[900]), rgbDe(neutral[100]), 4.5],
  ["ink-muted (neutral-600) sobre blanco",  rgbDe(neutral[600]), W, 4.5],
  ["ink-subtle (neutral-500) sobre blanco", rgbDe(neutral[500]), W, 4.5],
  ["blanco sobre CTA teal-600",             W, rgbDe(secondary[600]), 4.5],
  ["blanco sobre CTA teal-700",             W, rgbDe(secondary[700]), 4.5],
  ["blanco sobre navy-900 (sección osc.)",  W, rgbDe(primary[900]), 4.5],
  ["teal-200 (aqua) sobre navy-900",        rgbDe(secondary[200]), rgbDe(primary[900]), 4.5],
  ["teal-300 sobre navy-900",               rgbDe(secondary[300]), rgbDe(primary[900]), 4.5],
  ["teal-700 sobre blanco (texto marca)",   rgbDe(secondary[700]), W, 4.5],
  ["borde input (neutral-400) s/ blanco",   rgbDe(neutral[400]), W, 3.0],
  ["borde input s/ surface-muted",          rgbDe(neutral[400]), rgbDe(neutral[100]), 3.0],
  ["foco (teal-600) sobre blanco",          rgbDe(secondary[600]), W, 3.0],
  ["foco (teal-300) sobre navy-900",        rgbDe(secondary[300]), rgbDe(primary[900]), 3.0],
  ["error-600 sobre blanco",                hex2rgb("#C81E2E"), W, 4.5],
  ["blanco sobre error-600",                W, hex2rgb("#C81E2E"), 4.5],
  ["success-700 sobre blanco",              hex2rgb("#0F7A3D"), W, 4.5],
];
console.log("\n── CONTRASTE WCAG ──");
for (const [n, a, b, min] of pares) {
  const r = contraste(a, b);
  console.log(`  ${r >= min ? "OK  " : "FALLA"} ${r.toFixed(2)}:1  (min ${min})  ${n}`);
}

console.log("\n── ESTADOS (OKLCH) ──");
for (const [n, h] of [["error-50","#FDF2F3"],["error-500","#E23B49"],["error-600","#C81E2E"],["error-700","#A31624"],
                      ["success-50","#EFF9F3"],["success-500","#18A054"],["success-600","#128A46"],["success-700","#0F7A3D"],
                      ["warning-50","#FEF8EC"],["warning-500","#D98A0B"],["warning-600","#B87209"]]) {
  const c = rgb2oklch(hex2rgb(h));
  console.log(`  ${n.padEnd(12)} ${h}  ${fmt(c)}`);
}
