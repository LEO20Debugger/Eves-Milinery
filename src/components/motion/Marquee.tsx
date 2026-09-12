"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useScrollVelocityFactor } from "@/lib/hooks";

type Props = {
  items: readonly string[];
  className?: string;
  /** Baseline px per second. Slow is the point. */
  speed?: number;
};

/**
 * A slow ticker whose speed and direction respond to scroll velocity — scroll
 * down and it runs faster; scroll up and it reverses. It keeps drifting when
 * the page is still, so the composition is never completely dead.
 *
 * Implemented with a wrapped x offset rather than a CSS keyframe so scroll
 * velocity can feed into it, and it stays a single compositor transform.
 */
export default function Marquee({ items, className, speed = 28 }: Props) {
  const reduced = useReducedMotion();
  const factor = useScrollVelocityFactor();
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;

    // The track holds two identical copies; wrapping at half its width makes
    // the loop seamless regardless of content length.
    const half = track.scrollWidth / 2;
    if (!half) return;

    const boost = 1 + Math.abs(factor.get()) * 6;
    const direction = factor.get() < -0.02 ? -1 : 1;
    let next = x.get() - (speed / 1000) * delta * boost * direction;

    if (next <= -half) next += half;
    if (next > 0) next -= half;
    x.set(next);
  });

  const content = (
    <>
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex shrink-0 items-center gap-[3vw] pr-[3vw]">
          <span>{item}</span>
          <span aria-hidden className="text-gold/60">
            ·
          </span>
        </span>
      ))}
    </>
  );

  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden py-6 select-none",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <motion.div ref={trackRef} className="flex shrink-0 flex-nowrap" style={{ x }}>
        <div className="flex shrink-0 flex-nowrap">{content}</div>
        {/* Identical second copy makes the wrap seamless — the two halves must
            measure the same for `scrollWidth / 2` to be the wrap point. Hidden
            from assistive tech so the phrase list is not announced twice. */}
        <div aria-hidden className="flex shrink-0 flex-nowrap">
          {content}
        </div>
      </motion.div>
    </div>
  );
}

/** Reads the velocity factor as a plain number. Exported for sibling effects. */
export function useVelocityScale() {
  const factor = useScrollVelocityFactor();
  return useTransform(factor, (v) => 1 + Math.abs(v) * 0.03);
}
