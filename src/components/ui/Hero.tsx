"use client";

import { getImageProps } from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { heroLines, heroStandfirst, site } from "@/content/site";
import SplitText from "@/components/motion/SplitText";
import { useMediaQuery } from "@/lib/hooks";
import { blurFor } from "@/content/blur";
import GlassSheen from "@/components/ui/GlassSheen";

/**
 * The home hero.
 *
 * Two layouts, because the same one cannot work at both ends:
 *
 * DESKTOP — the photograph runs full-bleed and the headline sits on a frosted
 * panel over the empty left side of the frame. That panel guarantees legibility
 * over any photograph, and is the clearest statement of the design language.
 *
 * MOBILE — the panel moves BELOW the image instead of over it. A 16:9 photo
 * cropped into a portrait viewport keeps only ~30% of its width, so there is no
 * empty backdrop left to put glass on; overlaying it there covers the subject's
 * face, which is the one thing the glass must never do. The panel still laps
 * over the bottom edge of the image so the frosted effect is visible, but it
 * laps over her shoulder, not her face.
 */
const HERO_ALT =
  "A hand-blocked occasion headpiece photographed in bright, soft studio light";

/* Built once at module scope — these are pure and never change. */
const shared = { alt: HERO_ALT, sizes: "100vw", priority: true } as const;

const {
  props: { srcSet: desktopSrcSet },
} = getImageProps({ ...shared, src: "/images/hero.jpg", width: 2400, height: 1350 });

const {
  props: { srcSet: mobileSrcSet, ...imgProps },
} = getImageProps({
  ...shared,
  src: "/images/hero-portrait.jpg",
  width: 1200,
  height: 1500,
});

/** Tiny blurred preview, painted under the hero while the real file loads. */
const heroBlur = blurFor("/images/hero.jpg");

export default function Hero() {
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { scrollY } = useScroll();

  // ~10% of viewport travel across the first screen.
  const y = useTransform(scrollY, [0, 900], [0, 90]);
  const panelY = useTransform(scrollY, [0, 700], [0, -60]);
  const panelOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  // Parallax only where the image is absolutely positioned. On mobile the image
  // is in normal flow, so translating it would tear a gap off the top edge.
  const animateImage = isDesktop && !reduced;
  const animatePanel = isDesktop && !reduced;

  return (
    <section className="relative w-full overflow-hidden md:h-[100svh]">
      {/* The hero is a raw <img> inside <picture> for art direction, so it
          cannot use next/image's `placeholder="blur"`. The blurred preview is
          painted as a background on the wrapper instead — same effect, and it
          is covered the instant the real photograph decodes. */}
      <motion.div
        className="relative h-[58svh] w-full bg-cover bg-center md:absolute md:inset-0 md:h-full"
        style={{
          ...(animateImage ? { y } : {}),
          backgroundImage: heroBlur ? `url(${heroBlur})` : undefined,
        }}
      >
        {/* Art direction, not just a responsive crop. The phone gets a
            portrait photograph composed for portrait; the desktop gets the
            16:9 one. `getImageProps` is Next's supported way to do this: each
            <source> keeps a full optimized srcSet, and the browser downloads
            only the one that matches — unlike rendering two <Image>s and
            hiding one, which downloads both. */}
        <picture>
          <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes="100vw" />
          <source media="(max-width: 767px)" srcSet={mobileSrcSet} sizes="100vw" />
          <img
            {...imgProps}
            alt={HERO_ALT}
            /* The subject (hat and face) occupies 49%-79% of the landscape
               image's width, centred at 66% — measured from the file, not
               guessed. The portrait crop is composed centred, so it needs no
               horizontal nudge; `md:object-top` protects the hat on wide,
               short windows, where the crop takes from top and bottom. */
            className={`absolute inset-0 h-full w-full object-cover object-center md:object-top ${
              reduced ? "" : "hero-drift"
            }`}
          />
        </picture>
      </motion.div>

      <div className="relative z-10 -mt-12 gutter pb-4 md:absolute md:inset-0 md:mt-0 md:flex md:h-full md:items-end md:pb-12">
        {/* `min-w-0` is load-bearing: a flex item defaults to `min-width: auto`,
            which lets it grow past `max-w-*` to fit its longest word. Without
            it the display-size headline forces this panel to full width. */}
        <motion.div
          className="glass relative w-full max-w-lg min-w-0 overflow-hidden rounded-[var(--radius-glass)] p-7 md:p-9"
          style={animatePanel ? { y: panelY, opacity: panelOpacity } : undefined}
        >
          <GlassSheen />

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
