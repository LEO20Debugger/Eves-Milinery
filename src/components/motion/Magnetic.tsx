"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { FOLLOW_SPRING } from "@/lib/motion";
import { useHasFinePointer } from "@/lib/hooks";

type Props = {
  children: ReactNode;
  className?: string;
  /** How far the element is allowed to travel toward the cursor, in px. */
  strength?: number;
};

/**
 * Pulls its child gently toward the cursor while hovered. Used only on the
 * primary calls to action — applied broadly it stops reading as craft and
 * starts reading as a template.
 *
 * Skipped entirely on touch devices and under reduced motion.
 */
export default function Magnetic({ children, className, strength = 14 }: Props) {
  const reduced = useReducedMotion();
  const fine = useHasFinePointer();
  const ref = useRef<HTMLDivElement>(null);

  const x = useSpring(useMotionValue(0), FOLLOW_SPRING);
  const y = useSpring(useMotionValue(0), FOLLOW_SPRING);

  if (reduced || !fine) {
    return <div className={className}>{children}</div>;
  }

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    // Offset from the element's centre, normalised, then capped at `strength`.
    const dx = event.clientX - (bounds.left + bounds.width / 2);
    const dy = event.clientY - (bounds.top + bounds.height / 2);
    x.set((dx / (bounds.width / 2)) * strength);
    y.set((dy / (bounds.height / 2)) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
