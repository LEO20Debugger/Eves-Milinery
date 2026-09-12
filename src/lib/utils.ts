import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** `3` -> `03`. Used for the numbered section eyebrows. */
export function pad(n: number, width = 2) {
  return String(n).padStart(width, "0");
}
