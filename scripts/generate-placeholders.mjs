/* ─────────────────────────────────────────────────────────────────────────
   Placeholder image generator.

   The atelier has no photography yet. This script scans the source tree for
   every `/images/*.jpg` reference and writes a tonal, grainy, warm-dark
   placeholder at the exact dimensions the layout expects — so the site reads
   as composed rather than broken, and a real photograph drops in later by
   filename with zero layout change.

   Run with:  npm run placeholders
   Existing files are never overwritten, so real photography is safe.
   ───────────────────────────────────────────────────────────────────────── */

import { readdirSync, readFileSync, existsSync, mkdirSync, writeFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import sharp from "sharp";

const SRC_DIR = "src";
const OUT_DIR = join("public", "images");

/* Aspect ratios by filename convention. Order matters — first match wins. */
const SHAPES = [
  [/^hero\./, { width: 2400, height: 1350 }], // 16:9 full-bleed
  [/^og\./, { width: 1200, height: 630 }], // social card
  [/^process-/, { width: 1800, height: 1200 }], // 3:2 process steps
  [/-02\./, { width: 1800, height: 1200 }], // 3:2 detail shots
  [/^atelier-/, { width: 1200, height: 1500 }], // 4:5 portrait
  [/./, { width: 1200, height: 1500 }], // 4:5 default
];

function shapeFor(filename) {
  return SHAPES.find(([re]) => re.test(filename))[1];
}

/* Deterministic PRNG so regenerating produces identical files. */
function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* The palette placeholders are drawn from — all dark, all in the same jewel
   family as the site's aubergine ground and its fuchsia/marigold/emerald
   accents, so a grid of them reads as one shoot rather than as stock. */
const TONES = [
  [[32, 18, 34], [126, 52, 84]], // plum into fuchsia
  [[26, 16, 28], [104, 64, 40]], // aubergine into bronze
  [[24, 20, 34], [58, 106, 96]], // ink-violet into emerald
  [[36, 20, 30], [138, 86, 52]], // wine into marigold
  [[22, 14, 24], [88, 48, 78]], // deep plum into mauve
];

function render(name, { width, height }) {
  const seed = hashString(name);
  const rand = mulberry32(seed);
  const [from, to] = TONES[seed % TONES.length];

  // Gradient angle varies per image so a grid of them doesn't look tiled.
  const angle = rand() * Math.PI * 2;
  const ax = Math.cos(angle);
  const ay = Math.sin(angle);

  const buf = Buffer.allocUnsafe(width * height * 3);
  const cx = width / 2;
  const cy = height / 2;
  const maxR = Math.hypot(cx, cy);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Projection onto the gradient axis, normalised to 0..1.
      const nx = (x / width - 0.5) * 2;
      const ny = (y / height - 0.5) * 2;
      let t = (nx * ax + ny * ay) * 0.5 + 0.5;
      t = Math.min(1, Math.max(0, t));
      // Ease so the falloff looks photographic rather than linear.
      t = t * t * (3 - 2 * t);

      // Vignette — darkens the corners, the way a lens would.
      const vignette = 1 - 0.45 * Math.pow(Math.hypot(x - cx, y - cy) / maxR, 2.2);

      // Film grain.
      const grain = (rand() - 0.5) * 11;

      const i = (y * width + x) * 3;
      for (let c = 0; c < 3; c++) {
        const v = (from[c] + (to[c] - from[c]) * t) * vignette + grain;
        buf[i + c] = v < 0 ? 0 : v > 255 ? 255 : v;
      }
    }
  }

  return sharp(buf, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

/* ── Collect every image path referenced in the source tree ─────────────── */
function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else if ([".ts", ".tsx"].includes(extname(full))) files.push(full);
  }
  return files;
}

const referenced = new Set();
for (const file of walk(SRC_DIR)) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(/\/images\/([\w-]+\.(?:jpg|jpeg|png))/g)) {
    referenced.add(match[1]);
  }
}
// Referenced indirectly (built by the metadata route, not a string literal).
referenced.add("hero.jpg");
referenced.add("og.jpg");

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const created = [];
const skipped = [];

for (const name of [...referenced].sort()) {
  const dest = join(OUT_DIR, name);
  if (existsSync(dest)) {
    skipped.push(name);
    continue;
  }
  const shape = shapeFor(name);
  const data = await render(name, shape);
  writeFileSync(dest, data);
  created.push(`${name}  ${shape.width}×${shape.height}`);
}

/* ── Document what the real photography needs to be ─────────────────────── */
const manifest = [...referenced].sort().map((name) => {
  const { width, height } = shapeFor(name);
  const ratio = width > height ? (width / height === 1.5 ? "3:2" : "16:9") : "4:5";
  return `| \`${name}\` | ${ratio} | ${width}×${height} |`;
});

writeFileSync(
  join(OUT_DIR, "README.md"),
  `# Photography

Every file below is currently an auto-generated placeholder. Replace each one
with real photography **at the same filename and the same aspect ratio** and the
site needs no other change.

Shoot at or above the listed pixel dimensions — \`next/image\` will downscale,
but it cannot invent detail. Export as JPEG, sRGB, quality 80–90.

| File | Ratio | Minimum size |
| --- | --- | --- |
${manifest.join("\n")}

To regenerate placeholders for newly added pieces:

\`\`\`bash
npm run placeholders
\`\`\`

Existing files are never overwritten, so real photography is safe to leave in place.
`,
);

console.log(`created ${created.length} placeholder(s)`);
for (const c of created) console.log("  +", c);
if (skipped.length) console.log(`kept ${skipped.length} existing file(s)`);
