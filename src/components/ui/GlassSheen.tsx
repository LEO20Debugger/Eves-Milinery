"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useHasFinePointer } from "@/lib/hooks";

/**
 * Specular response for a `.glass` surface.
 *
 * This is what makes glass read as a material rather than as a translucent
 * rectangle, and it is the one behaviour the design language is actually named
 * for. Two layers:
 *
 * 1. A soft highlight that follows the pointer across the panel, so the
 *    surface looks like it is catching light from wherever you are.
 * 2. A narrow band travelling along the top edge as the page scrolls — the
 *    glint you get from a bevel moving past a light source.
 *
 * The pointer layer is driven by CSS custom properties written directly to the
 * node, never React state: a mousemove handler that re-renders would be a
 * frame-rate disaster. Both layers are `opacity`/`transform` only.
 *
 * The parent must be `position: relative` and clip its overflow — every
 * `.glass` surface on this site already is.
 */
export default function GlassSheen() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fine = useHasFinePointer();

  const { scrollYProgress } = useScroll();
  // One slow pass of the edge glint across the whole page scroll.
  const glintX = useTransform(scrollYProgress, [0, 1], ["-40%", "140%"]);

  useEffect(() => {
    const node = ref.current;
    const parent = node?.parentElement;
    if (!node || !parent || reduced || !fine) return;

    const onMove = (event: MouseEvent) => {
      const bounds = parent.getBoundingClientRect();
      node.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
      node.style.setProperty("--my", `${event.clientY - bounds.top}px`);
      node.style.setProperty("--sheen", "1");
    };
    const onLeave = () => node.style.setProperty("--sheen", "0");

    parent.addEventListener("mousemove", onMove, { passive: true });
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, fine]);

  if (reduced) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      {/* Pointer-following highlight. */}
      <div
        className="absolute inset-0 opacity-[var(--sheen,0)] transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(240px circle at var(--mx, 50%) var(--my, 0px), rgb(255 255 255 / 0.55), transparent 65%)",
        }}
      />

      {/* Edge glint travelling along the top bevel as the page scrolls. */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          x: glintX,
          background:
            "linear-gradient(90deg, transparent, rgb(255 255 255 / 0.95) 45%, rgb(255 255 255 / 0.95) 55%, transparent)",
          width: "45%",
        }}
      />
    </div>
  );
}
