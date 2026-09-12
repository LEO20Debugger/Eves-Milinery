"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useHasFinePointer } from "@/lib/hooks";

const SIZE = 14;

/**
 * The custom cursor.
 *
 * A small ring that follows with a spring, grows and inverts over interactive
 * elements, and becomes a labelled disc over anything carrying a
 * `data-cursor` attribute (used on gallery items to say "View" or "Drag").
 *
 * Mounts only on fine-pointer devices and only when motion is allowed; the
 * native cursor is hidden via a class on <html> so it is never hidden unless
 * this component is actually running.
 */
export default function Cursor() {
  const reduced = useReducedMotion();
  const fine = useHasFinePointer();
  const enabled = fine && !reduced;

  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { stiffness: 380, damping: 32, mass: 0.5 });
  const y = useSpring(mouseY, { stiffness: 380, damping: 32, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("has-custom-cursor");

    let shown = false;
    const onMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      if (!shown) {
        shown = true;
        setVisible(true);
      }

      // `closest` on the event target keeps this to one cheap DOM walk per
      // move, with no listeners attached to individual elements.
      const target = event.target as Element | null;
      const interactive = target?.closest?.(
        "a, button, input, textarea, select, [role='button'], [data-cursor]",
      );
      setHovering(Boolean(interactive));
      setLabel(interactive?.getAttribute("data-cursor") ?? null);
    };

    const onLeave = () => {
      shown = false;
      setVisible(false);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[80] flex items-center justify-center"
      style={{ x, y }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full border border-bone"
        animate={{
          width: label ? 84 : hovering ? 46 : SIZE,
          height: label ? 84 : hovering ? 46 : SIZE,
          backgroundColor: label ? "#ede7dd" : hovering ? "rgba(237,231,221,0.12)" : "transparent",
          opacity: visible ? 1 : 0,
          // Keeps the ring centred on the pointer at every size.
          x: "-50%",
          y: "-50%",
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              className="eyebrow text-ink"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
