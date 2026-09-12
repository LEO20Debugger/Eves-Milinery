"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { pad } from "@/lib/utils";
import { EXPO_OUT } from "@/lib/motion";

type Step = { title: string; body: string; image: string };

/**
 * The bespoke process.
 *
 * The imagery pins while the numbered steps scroll through it, and the pinned
 * image crossfades as each step takes over. Under reduced motion the whole
 * mechanism is dropped and the steps render as ordinary stacked sections —
 * the content is identical either way.
 */
export default function ProcessScroll({ steps }: { steps: readonly Step[] }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(steps.length - 1, Math.floor(value * steps.length));
    setIndex((current) => (current === next ? current : next));
  });

  if (reduced) {
    return (
      <div className="space-y-20 gutter">
        {steps.map((step, i) => (
          <section key={step.title} className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="frame relative aspect-[3/2]">
              <Image
                src={step.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <span className="eyebrow text-accent">{pad(i + 1)}</span>
              <h3 className="mt-4 font-display text-4xl font-light text-ink">{step.title}</h3>
              <p className="mt-4 text-ink-dim">{step.body}</p>
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative" style={{ height: `${steps.length * 90}vh` }}>
      <div className="sticky top-0 flex h-screen items-center">
        <div className="grid w-full grid-cols-1 items-center gap-12 gutter md:grid-cols-2">
          {/* Pinned image stack — one layer per step, crossfading. */}
          <div className="frame relative aspect-[3/2] w-full">
            {steps.map((step, i) => (
              <motion.div
                key={step.image}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: i === index ? 1 : 0, scale: i === index ? 1 : 1.06 }}
                transition={{ duration: 0.9, ease: EXPO_OUT }}
              >
                <Image
                  src={step.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
            ))}

            {/* Progress rule across the foot of the image. */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-ink/10">
              <motion.div
                className="h-full origin-left bg-accent"
                animate={{ scaleX: (index + 1) / steps.length }}
                transition={{ duration: 0.6, ease: EXPO_OUT }}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* Copy. Only the active step is shown, crossfading in place — the
              column is a fixed height so nothing below it ever shifts. */}
          <div className="relative">
            <span className="eyebrow text-accent">
              {pad(index + 1)} / {pad(steps.length)}
            </span>

            <div className="relative mt-6 min-h-[16rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={steps[index].title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: EXPO_OUT }}
                >
                  <h3 className="font-display text-4xl font-light text-ink md:text-6xl">
                    {steps[index].title}
                  </h3>
                  <p className="mt-5 max-w-md text-ink-dim">{steps[index].body}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Step ticks — shows how far through the process you are. */}
            <ul className="mt-8 flex gap-3">
              {steps.map((step, i) => (
                <li key={step.title}>
                  <span className="sr-only">{step.title}</span>
                  <motion.span
                    aria-hidden
                    className="block h-px w-10 bg-ink"
                    animate={{ opacity: i === index ? 1 : 0.2 }}
                    transition={{ duration: 0.4 }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
