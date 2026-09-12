import type { Transition, Variants } from "motion/react";

/* ── Easing ───────────────────────────────────────────────────────────────
   Two curves carry the entire site. EXPO_OUT for anything entering the
   viewport; CURTAIN for full-surface wipes (menu, page transition).
   Tuning the feel of the site starts here.
   ────────────────────────────────────────────────────────────────────── */
export const EXPO_OUT = [0.16, 1, 0.3, 1] as const;
export const CURTAIN = [0.76, 0, 0.24, 1] as const;

export const DURATION = {
  hover: 0.6,
  reveal: 1.1,
  slow: 1.4,
  curtain: 0.9,
} as const;

/** Spring used by everything that follows the cursor. */
export const FOLLOW_SPRING: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 0.8,
};

export const ENTER: Transition = {
  duration: DURATION.reveal,
  ease: EXPO_OUT,
};

/* ── Shared variants ──────────────────────────────────────────────────────
   Sections orchestrate their children with staggerChildren so a section
   resolves as one gesture rather than a scatter of separate animations.
   ────────────────────────────────────────────────────────────────────── */
export const staggerParent = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/** Fade and rise. The workhorse. */
export const riseChild: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: ENTER },
};

/** A line of type rising out of an overflow-hidden mask. */
export const lineChild: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: DURATION.slow, ease: EXPO_OUT } },
};

/** Image wipe: the frame opens upward while the photo settles back to 1:1. */
export const maskChild: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: DURATION.slow, ease: EXPO_OUT },
  },
};

export const maskImageChild: Variants = {
  hidden: { scale: 1.2 },
  visible: {
    scale: 1,
    transition: { duration: DURATION.slow, ease: EXPO_OUT },
  },
};

/** Standard viewport trigger — fires once, a little before the element lands. */
export const VIEWPORT = { once: true, margin: "-12% 0px -12% 0px" } as const;
