/* ─────────────────────────────────────────────────────────────────────────
   Blur placeholder generator (LQIP).

   Writes a tiny base64 preview of every image in /public/images into
   `src/content/blur.ts`. `next/image` shows it, stretched and blurred, while
   the real photograph downloads — so a picture resolves into place instead of
   snapping from a flat grey box. On a site that is almost entirely
   photography, this is the single largest perceived-quality difference.

   Each preview is ~20px wide and well under 1KB, so the whole map costs less
   than one small image.

   Run with:  npm run blur
   Re-run whenever images are added or replaced.
   ───────────────────────────────────────────────────────────────────────── */

import { readdirSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";
import sharp from "sharp";

const IMAGE_DIR = join("public", "images");
const OUT_FILE = join("src", "content", "blur.ts");

const files = readdirSync(IMAGE_DIR)
  .filter((file) => [".jpg", ".jpeg", ".png"].includes(extname(file).toLowerCase()))
  .sort();

const entries = [];

for (const file of files) {
  const buffer = await sharp(join(IMAGE_DIR, file))
    // 20px wide is enough to carry colour and rough composition once blurred.
    .resize(20, null, { fit: "inside" })
    .jpeg({ quality: 45 })
    .toBuffer();

  entries.push(`  "/images/${file}": "data:image/jpeg;base64,${buffer.toString("base64")}",`);
}

writeFileSync(
  OUT_FILE,
  `/* GENERATED FILE — do not edit by hand.
   Produced by scripts/generate-blur.mjs. Run \`npm run blur\` after adding or
   replacing any image in /public/images. */

/** Tiny base64 previews, keyed by the same path used in \`src\`. */
export const blurData: Record<string, string> = {
${entries.join("\n")}
};

/**
 * Blur preview for an image path, or undefined if none has been generated.
 *
 * Returning undefined is deliberate: \`next/image\` requires \`blurDataURL\`
 * whenever \`placeholder="blur"\` is set, so callers pair these two so that a
 * missing entry cleanly falls back to no placeholder rather than throwing.
 */
export function blurFor(src: string) {
  return blurData[src];
}
`,
);

console.log(`wrote ${entries.length} blur placeholders to ${OUT_FILE}`);
