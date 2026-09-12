"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { heroLines, heroStandfirst, site } from "@/content/site";
import SplitText from "@/components/motion/SplitText";

/**
 * The home hero.
 *
 * Three effects, layered and all deliberately small: a slow continuous scale
 * drift so the frame is never dead, a ~10% scroll-linked parallax, and the
 * headline rising line by line out of its masks. Restraint is the point —
 * a 50% parallax here would read as a template, not as an atelier.
 */
export default function Hero() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();

  // ~10% of viewport travel across the first screen.
  const y = useTransform(scrollY, [0, 900], [0, 90]);
  const overlay = useTransform(scrollY, [0, 700], [0.35, 0.7]);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y }}>
        <Image
          src="/images/hero.jpg"
          alt="A hand-blocked occasion headpiece photographed in low, warm light"
          fill
          priority
          sizes="100vw"
          className={`object-cover ${reduced ? "" : "hero-drift"}`}
        />
      </motion.div>

      {/* Scrim deepens as you scroll so the nav and headline stay legible. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-ink"
        style={{ opacity: reduced ? 0.45 : overlay }}
      />

      <div className="relative flex h-full flex-col justify-end gutter pb-16">
        <SplitText
          as="h1"
          immediate
          delay={0.35}
          lines={heroLines}
          className="font-display text-display-lg font-light text-bone"
        />

        <div className="mt-10 flex flex-col gap-8 border-t rule pt-8 md:flex-row md:items-start md:justify-between">
          <motion.p
            className="max-w-md text-balance text-bone-dim"
            initial={reduced ? undefined : { opacity: 0, y: 20 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
          >
            {heroStandfirst}
          </motion.p>

          <motion.p
            className="eyebrow text-bone-faint"
            initial={reduced ? undefined : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            Est. {site.founded} · {site.location}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
