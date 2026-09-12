"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CURTAIN } from "@/lib/motion";

const SESSION_KEY = "eves-preloader-shown";
/** Hard cap. A preloader that outstays this stops being an entrance. */
const DURATION_MS = 1800;

/* Module scope, not component state, on purpose.
   React Strict Mode runs effects twice in development: mount, clean up, mount
   again. If the sessionStorage check lived inside the effect, the second run
   would read the key the first run had just written, bail out early, and never
   restart the animation frame — leaving the preloader on screen at 0 forever.
   Deciding once per module keeps both runs in agreement. */
let decided = false;
let shouldShow = false;

/**
 * First-visit entrance.
 *
 * A counter runs 0→100 while the wordmark draws in, then the panel splits and
 * sweeps away to reveal a hero that is already mid-animation — so the site
 * feels like it was running before you arrived.
 *
 * Shown once per session (sessionStorage) and skipped entirely under reduced
 * motion. It never blocks content: the page beneath is fully rendered and
 * interactive the whole time, so this cannot delay LCP for a repeat visitor.
 */
export default function Preloader() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced) return;

    if (!decided) {
      decided = true;
      // Reading sessionStorage can throw in privacy modes — never fatal.
      try {
        shouldShow = !sessionStorage.getItem(SESSION_KEY);
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        shouldShow = false;
      }
    }
    if (!shouldShow) return;

    // The panel is painted by the first animation frame rather than by a
    // synchronous setState here, so there is no cascading render on mount.
    document.body.style.overflow = "hidden";

    const start = performance.now();
    let frame = 0;
    let opened = false;

    const tick = (now: number) => {
      if (!opened) {
        opened = true;
        setActive(true);
      }
      const progress = Math.min(1, (now - start) / DURATION_MS);
      // Ease-out so the number decelerates into 100 rather than snapping.
      setCount(Math.round((1 - Math.pow(1 - progress, 3)) * 100));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        // Never replay, even if the effect is run again.
        shouldShow = false;
        setActive(false);
      }
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
    };
  }, [reduced]);

  useEffect(() => {
    if (!active) document.body.style.overflow = "";
  }, [active]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col justify-between bg-ink gutter py-10"
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: CURTAIN }}
        >
          <motion.span
            className="eyebrow text-bone-dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Eve&rsquo;s Millinery
          </motion.span>

          <div className="flex items-end justify-between gap-6">
            <motion.span
              className="font-display text-display-sm leading-none font-light text-bone"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Bespoke headwear
            </motion.span>
            <span className="font-display text-display-sm leading-none font-light text-accent tabular-nums">
              {count}
            </span>
          </div>

          {/* Progress rule — the only element that reports actual progress. */}
          <motion.div
            className="h-px w-full origin-left bg-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: count / 100 }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
