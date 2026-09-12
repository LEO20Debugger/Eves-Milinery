"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { heroLines, heroStandfirst, site } from "@/content/site";
import SplitText from "@/components/motion/SplitText";

/**
 * The home hero.
 *
 * Liquid Glass version: the photograph runs full-bleed and the headline sits on
 * a frosted panel over it. That panel is doing real work — it guarantees the
 * type stays legible no matter how light or busy the photograph behind it is,
 * which plain white-on-image never can. It is also the clearest statement of
 * the design language, so it happens once, here, at full strength.
 *
 * Three motion layers, all deliberately small: a slow continuous scale drift so
 * the frame is never dead, ~10% scroll parallax, and the headline rising line by
 * line out of its masks.
 */
export default function Hero() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();

  // ~10% of viewport travel across the first screen.
  const y = useTransform(scrollY, [0, 900], [0, 90]);
  // The glass panel drifts up and fades as you leave the hero.
  const panelY = useTransform(scrollY, [0, 700], [0, -60]);
  const panelOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  return (
    /* Shorter on phones on purpose. A 16:9 photograph forced into a full-height
       portrait viewport shows only ~25% of its width; at 85svh that rises to
       ~30%, which is the difference between seeing the whole headpiece and
       seeing a slice of it. Desktop keeps the full-height frame. */
    <section className="relative h-[85svh] w-full overflow-hidden md:h-[100svh]">
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y }}>
        <Image
          src="/images/hero.jpg"
          alt="A hand-blocked occasion headpiece photographed in bright, soft studio light"
          fill
          priority
          sizes="100vw"
          /* The hero art is composed with the subject in the right half and her
             headpiece near the top edge, so the default centre crop fails at
             both ends:
             - Wide, short windows crop top and bottom, cutting off the hat.
               `md:object-top` anchors the crop to the top so the hat survives;
               the bottom of the frame is garment and can be lost safely.
             - Narrow windows crop the sides hard. The subject (hat and face)
               occupies 49%-79% of the image width, centred at 66%, so the crop
               is anchored at 70% — biased slightly right of the subject's
               centre to favour her face over the far edge of the brim.
               Measured from the file, not guessed: at 78% the window centred on
               the right edge of her face and cut it off. */
          className={`object-cover object-[70%_50%] md:object-top ${reduced ? "" : "hero-drift"}`}
        />
      </motion.div>

      <div className="relative flex h-full items-end gutter pb-12">
        {/* `min-w-0` is load-bearing: a flex item defaults to `min-width: auto`,
            which lets it grow past `max-w-*` to fit its longest word. Without
            it the display-size headline forces this panel to full width and the
            whole slab overflows up behind the fixed nav. */}
        <motion.div
          className="glass w-full max-w-lg min-w-0 rounded-[var(--radius-glass)] p-7 md:p-9"
          style={reduced ? undefined : { y: panelY, opacity: panelOpacity }}
        >
          <SplitText
            as="h1"
            immediate
            delay={0.35}
            lines={heroLines}
            className="font-display text-[clamp(2rem,4vw,3.75rem)] leading-[1.02] font-light text-ink"
          />

          <div className="mt-6 flex flex-col gap-4 border-t rule pt-5">
            <motion.p
              className="max-w-sm text-balance text-sm text-ink-dim"
              initial={reduced ? undefined : { opacity: 0, y: 20 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
            >
              {heroStandfirst}
            </motion.p>

            <motion.p
              className="eyebrow text-ink-faint"
              initial={reduced ? undefined : { opacity: 0 }}
              animate={reduced ? undefined : { opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              Est. {site.founded} · {site.location}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
