"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ElementType, ReactNode } from "react";
import { DURATION, EXPO_OUT, VIEWPORT } from "@/lib/motion";

type Props = {
  children: ReactNode;
  /** Seconds. Prefer `Stagger` over hand-tuned delays where possible. */
  delay?: number;
  /** Distance in px the element rises from. */
  distance?: number;
  as?: ElementType;
  className?: string;
};

/**
 * The workhorse entrance: fade and rise, once, as the element enters view.
 *
 * Under reduced motion the element renders in its final state immediately —
 * as every animated component here must.
 */
export default function Reveal({
  children,
  delay = 0,
  distance = 28,
  as = "div",
  className,
}: Props) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  if (reduced) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  const variants: Variants = {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.reveal, ease: EXPO_OUT, delay },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </MotionTag>
  );
}
