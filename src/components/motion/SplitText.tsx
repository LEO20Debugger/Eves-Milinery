"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";
import { DURATION, EXPO_OUT, VIEWPORT } from "@/lib/motion";

type Props = {
  /** Each string is one line. Line breaks are a design decision, not reflow. */
  lines: readonly string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Animate on mount instead of on scroll — for above-the-fold headings. */
  immediate?: boolean;
};

/**
 * Headline entrance: each line rises out of its own `overflow-hidden` mask.
 *
 * Deliberately per-LINE, not per-letter. Letter-stagger reads as tech-startup;
 * a line rising cleanly out of a mask reads as couture. The whole heading is
 * still one text node per line, so it is selectable and fully readable to
 * assistive technology.
 */
export default function SplitText({
  lines,
  as = "h2",
  className,
  lineClassName,
  delay = 0,
  immediate = false,
}: Props) {
  const reduced = useReducedMotion();
  const Tag = as;
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.h2;

  if (reduced) {
    return (
      <Tag className={className}>
        {lines.map((line) => (
          <span key={line} className={cn("block", lineClassName)}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  const animateProps = immediate
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: VIEWPORT };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      {...animateProps}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08, delayChildren: delay } },
      }}
    >
      {lines.map((line) => (
        <span key={line} className={cn("line-mask", lineClassName)}>
          <motion.span
            className="block"
            variants={{
              hidden: { y: "110%" },
              visible: {
                y: "0%",
                transition: { duration: DURATION.slow, ease: EXPO_OUT },
              },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
