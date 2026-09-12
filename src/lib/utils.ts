import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** `3` -> `03`. Used for the numbered section eyebrows. */
export function pad(n: number, width = 2) {
  return String(n).padStart(width, "0");
}

/**
 * Each route runs on its own jewel tone.
 *
 * The returned class reassigns `--color-accent`, which every accent utility on
 * the site resolves against — so one class re-tints a whole page's eyebrows,
 * hover states, underline wipes, focus rings and progress marks. Applied by
 * `PageTransition`; Nav and Footer sit outside it and stay on fuchsia so the
 * site's furniture reads as constant while the rooms change colour.
 */
export function accentClassFor(pathname: string) {
  if (pathname.startsWith("/collections")) return "accent-marigold";
  if (pathname.startsWith("/gele")) return "accent-emerald";
  if (pathname.startsWith("/atelier")) return "accent-gold";
  return "accent-fuchsia";
}
