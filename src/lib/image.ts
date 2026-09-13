import { blurFor } from "@/content/blur";

/**
 * Spreadable `next/image` props that make a photograph resolve out of a tiny
 * blurred preview instead of snapping in from a flat grey box.
 *
 * Returns an empty object when no preview has been generated for the path.
 * That matters: `next/image` throws if `placeholder="blur"` is set without a
 * `blurDataURL`, so the two are always supplied together or not at all — a
 * newly added image with no preview yet degrades quietly rather than crashing
 * the page.
 *
 * Regenerate previews with `npm run blur` after adding or replacing images.
 */
export function blurProps(src: string) {
  const blurDataURL = blurFor(src);
  return blurDataURL ? ({ placeholder: "blur", blurDataURL } as const) : {};
}
