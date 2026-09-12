"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";

/**
 * Mounts Lenis, which is the single largest contributor to the site feeling
 * expensive rather than ordinary.
 *
 * Lenis owns the only scroll RAF loop on the page — every scroll-linked effect
 * reads from `window.scrollY` via Framer's `useScroll`, which Lenis keeps
 * authoritative. Nothing else may attach an unthrottled scroll listener.
 *
 * Under `prefers-reduced-motion` Lenis is never constructed, so scrolling is
 * entirely native and nothing is hijacked.
 */
export default function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      // Long duration + expo-out easing: the scroll should feel weighted,
      // like turning a heavy page, not springy.
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch devices already have momentum scrolling; hijacking it there
      // feels broken rather than luxurious.
      syncTouch: false,
      touchMultiplier: 1.6,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
