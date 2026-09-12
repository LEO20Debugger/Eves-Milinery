"use client";

import Image from "next/image";
import { motion, useReducedMotion, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { DURATION, EXPO_OUT, VIEWPORT } from "@/lib/motion";
import { useScrollVelocityFactor } from "@/lib/hooks";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  /** Wrapper sizing — the frame the image is revealed inside. */
  frameClassName?: string;
  sizes?: string;
  priority?: boolean;
  delay?: number;
  /** Skew the image into the direction of scroll. Use sparingly. */
  velocity?: boolean;
};

/**
 * The signature image entrance: the frame opens upward via `clip-path` while
 * the photograph inside counter-scales from 1.2 back to 1, so the image
 * appears to settle into its frame rather than slide into it.
 *
 * Only `clip-path`, `transform` and `opacity` are animated — never layout
 * properties — so this stays on the compositor at 60fps.
 */
export default function MaskReveal({
  src,
  alt,
  width,
  height,
  className,
  frameClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  delay = 0,
  velocity = false,
}: Props) {
  const reduced = useReducedMotion();
  const factor = useScrollVelocityFactor();
  // Capped hard at 4 degrees. Past that it reads as a bug, not as momentum.
  const skewY = useTransform(factor, (v) => (velocity && !reduced ? v * 4 : 0));

  const transition = { duration: DURATION.slow, ease: EXPO_OUT, delay };

  return (
    <motion.div
      className={cn("relative overflow-hidden bg-ink-raised", frameClassName)}
      initial={reduced ? undefined : { clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={reduced ? undefined : { clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={VIEWPORT}
      transition={transition}
      style={{ skewY }}
    >
      <motion.div
        className="h-full w-full"
        initial={reduced ? undefined : { scale: 1.2 }}
        whileInView={reduced ? undefined : { scale: 1 }}
        viewport={VIEWPORT}
        transition={transition}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className={cn("h-full w-full object-cover", className)}
        />
      </motion.div>
    </motion.div>
  );
}
