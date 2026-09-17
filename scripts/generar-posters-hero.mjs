// Genera los pósters de los cuatro vídeos del hero desde su primer fotograma.
// Temporal: los vídeos se cambiaron el 16-09-2026 y los pósters quedaron
// viejos (1 y 2) o borrados (3) o nunca existieron (4). El póster tiene que
// ser el primer fotograma del vídeo que anuncia, o hay salto al arrancar.
// Uso: node scripts/generar-posters-hero.mjs
import { spawnSync } from "node:child_process";
import { statSync } from "node:fs";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";

const CASOS = [
  ["hero-1.mp4", "hero-1-poster.webp"],
  ["hero-2.mp4", "hero-2-poster.webp"],
  ["hero-3.mov", "hero-3-poster.webp"],
  ["hero-4.mp4", "hero-4-poster.webp"],
];

for (const [video, poster] of CASOS) {
  const fotograma = spawnSync(
    ffmpegPath,
    [
      "-ss", "0.5",
      "-i", `public/video/${video}`,
      "-frames:v", "1",
      "-f", "image2pipe",
      "-vcodec", "png",
      "-",
    ],
    { encoding: "buffer", maxBuffer: 50 * 1024 * 1024 },
  );

  if (fotograma.status !== 0) {
    console.error(`✗ ${video}: ffmpeg falló`);
    console.error(fotograma.stderr?.toString().slice(-400));
    continue;
  }

  await sharp(fotograma.stdout)
    .resize({ width: 1280 })
    .webp({ quality: 75 })
    .toFile(`public/video/${poster}`);

  const { width, height } = await sharp(`public/video/${poster}`).metadata();
  console.log(
    `✓ ${poster.padEnd(22)} ${width}×${height}  ${(statSync(`public/video/${poster}`).size / 1024).toFixed(0)} KB`,
  );
}
