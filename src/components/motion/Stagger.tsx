"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ElementType, ReactNode } from "react";
import { VIEWPORT, riseChild, staggerParent } from "@/lib/motion";

type ParentProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  stagger?: number;
  delayChildren?: number;
};

/**
 * Section-level orchestration. Children animate as one gesture rather than as
 * a scatter of independently delayed elements — the difference is the whole
 * reason a section feels composed.
 *
 * Pair with `<StaggerItem>` for children.
 */
export function Stagger({
  children,
  className,
  as = "div",
  stagger = 0.08,
  delayChildren = 0,
}: ParentProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  if (reduced) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      variants={staggerParent(stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  if (reduced) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag className={className} variants={riseChild}>
      {children}
    </MotionTag>
  );
}
