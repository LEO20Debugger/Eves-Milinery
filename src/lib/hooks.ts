"use client";

import { useEffect, useState } from "react";
import {
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "motion/react";

/**
 * A smoothed, signed measure of how fast the page is currently scrolling,
 * normalised to roughly -1..1.
 *
 * This is the effect most responsible for the site feeling physical rather
 * than scripted: images skew very slightly into the direction of travel and
 * the marquee changes speed and direction with the scroll. Consumers must
 * keep the resulting deformation small — past about 4 degrees it stops
 * reading as momentum and starts reading as a broken transform.
 */
export function useScrollVelocityFactor(): MotionValue<number> {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothed = useSpring(velocity, {
    stiffness: 260,
    damping: 50,
    mass: 0.4,
  });
  return useTransform(smoothed, [-2200, 0, 2200], [-1, 0, 1], { clamp: true });
}

/**
 * True only on devices with a real pointer. The custom cursor, the hover
 * preview list and the magnetic buttons are all meaningless on touch and are
 * skipped entirely rather than degraded.
 */
export function useHasFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    setFine(query.matches);
    const onChange = (event: MediaQueryListEvent) => setFine(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return fine;
}
