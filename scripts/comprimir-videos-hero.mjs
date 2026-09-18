// Comprime los vídeos del hero a 1280×720, CRF 23 (la receta aprobada con
// hero-1 el 16-09-2026: SSIM 0,987, −75 %). Deja cada resultado en
// `public/video/hero-N-comprimido.mp4`; los originales se mueven a
// `video-originales/` aparte, fuera de public/.
// Uso: node scripts/comprimir-videos-hero.mjs
import { spawnSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import ffprobePath from "ffprobe-static";

const CASOS = [
  ["hero-2.mp4", "hero-2-comprimido.mp4"],
  ["hero-3.mov", "hero-3-comprimido.mp4"],
  ["hero-4.mp4", "hero-4-comprimido.mp4"],
];

const probe = (f) => {
  const r = spawnSync(ffprobePath.path, [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height",
    "-show_entries", "format=duration,size,bit_rate",
    "-of", "json", f,
  ], { encoding: "utf8" });
  return JSON.parse(r.stdout);
};

const ssim = (orig, comp) => {
  const s = spawnSync(ffmpegPath, [
    "-i", `public/video/${orig}`,
    "-i", `public/video/${comp}`,
    "-lavfi", "[1:v]scale=1920:1080:flags=lanczos[b];[0:v][b]ssim",
    "-f", "null", "-",
  ], { encoding: "utf8" });
  const m = s.stderr.match(/SSIM.*All:([\d.]+)/);
  return m ? Number(m[1]) : null;
};

for (const [orig, comp] of CASOS) {
  console.log(`Comprimiendo ${orig}…`);
  const t = spawnSync(ffmpegPath, [
    "-y",
    "-i", `public/video/${orig}`,
    "-vf", "scale=1280:720:flags=lanczos",
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "23",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-an",
    `public/video/${comp}`,
  ], { encoding: "utf8" });

  if (t.status !== 0) {
    console.error(`✗ ${orig}: ffmpeg falló`);
    console.error(t.stderr?.toString().slice(-400));
    continue;
  }

  const antes = probe(`public/video/${orig}`);
  const despues = probe(`public/video/${comp}`);
  const ahorro = 100 * (1 - despues.format.size / antes.format.size);
  const s = ssim(orig, comp);
  console.log(
    `✓ ${comp.padEnd(24)} ${despues.streams[0].width}×${despues.streams[0].height}  ` +
    `${(despues.format.size / 1048576).toFixed(2)} MB (antes ${(antes.format.size / 1048576).toFixed(2)})  ` +
    `−${ahorro.toFixed(0)} %  SSIM: ${s === null ? "?" : s.toFixed(3)}`,
  );
}
