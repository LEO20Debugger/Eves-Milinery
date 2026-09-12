"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValueEvent, useReducedMotion, useSpring } from "motion/react";

type Props = {
  value: number;
  suffix?: string;
  className?: string;
};

/**
 * Counts up to `value` when it first enters view. Used for the atelier stats.
 *
 * The true figure is always in the DOM as visually-hidden text, so screen
 * readers and reduced-motion users get the real number rather than whatever
 * frame the animation happens to be on. The rolling digits are decorative.
 */
export default function Counter({ value, suffix = "", className }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  const spring = useSpring(0, { stiffness: 60, damping: 22, mass: 1 });

  useEffect(() => {
    if (inView && !reduced) spring.set(value);
  }, [inView, reduced, spring, value]);

  useMotionValueEvent(spring, "change", (latest) => {
    const node = ref.current;
    if (!node || reduced) return;
    node.textContent = `${Math.round(latest)}${suffix}`;
  });

  return (
    <span className={className}>
      <span className="sr-only">{`${value}${suffix}`}</span>
      <span ref={ref} aria-hidden className="tabular-nums">
        {reduced ? `${value}${suffix}` : `0${suffix}`}
      </span>
    </span>
  );
}
