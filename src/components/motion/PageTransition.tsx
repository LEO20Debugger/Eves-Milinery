"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { CURTAIN, DURATION } from "@/lib/motion";
import { accentClassFor } from "@/lib/utils";
import { nav } from "@/content/site";

function routeLabel(pathname: string) {
  if (pathname === "/") return "Eve's Millinery";
  const match = nav.find((item) => pathname.startsWith(item.href));
  if (match) return match.label;
  return pathname.split("/").filter(Boolean).at(-1)?.replace(/-/g, " ") ?? "";
}

/**
 * Route change curtain. Mounted from `app/template.tsx`, which React remounts
 * on every navigation — that remount is what drives the entrance.
 *
 * The curtain sweeps down over the incoming page and lifts away, with the
 * route's name briefly centred in it, so navigation reads as a deliberate
 * move between rooms rather than a page load.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  const accent = accentClassFor(pathname);

  if (reduced) return <div className={accent}>{children}</div>;

  return (
    <>
      <motion.div
        // Keyed on the path so a new curtain plays for each navigation.
        key={pathname}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center bg-canvas"
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: DURATION.curtain, ease: CURTAIN, delay: 0.1 }}
      >
        <motion.span
          className="font-display text-display-sm font-light text-ink lowercase"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {routeLabel(pathname)}
        </motion.span>
      </motion.div>

      <motion.div
        className={accent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
      >
        {children}
      </motion.div>
    </>
  );
}
