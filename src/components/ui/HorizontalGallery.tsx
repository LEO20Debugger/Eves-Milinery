"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Piece } from "@/content/pieces";
import { pad } from "@/lib/utils";

/**
 * A run of images that travels horizontally while the page scrolls vertically.
 *
 * Used once, on the gele page, where an editorial sequence of crowns earns it.
 * The section is pinned for the length of its own scroll distance and the
 * track is moved with a single `x` transform, so the whole effect is one
 * compositor property.
 *
 * Under reduced motion the pinning is dropped entirely and the same images
 * render as an ordinary vertical stack.
 */
export default function HorizontalGallery({ pieces }: { pieces: Piece[] }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  /* How far the track actually has to move, in pixels.
     This was once a hardcoded percentage per item, which bore no relation to
     the real card widths — so the track ran past its own end and parked the
     last card off to the left, leaving dead space on the right.

     Held as a MotionValue rather than React state: it is layout measurement
     feeding an animation, so it never needs to trigger a re-render, and this
     keeps the whole thing out of React's render cycle. */
  const travel = useMotionValue(0);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const section = ref.current;
    if (!track || !viewport || !section) return 0;

    const distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
    travel.set(distance);

    /* The height is written straight to the node rather than flowing through a
       MotionValue. It is layout, not animation — it must be correct even if the
       animation loop is throttled or suspended, which browsers do freely for
       backgrounded or embedded views. Only `x` below depends on Motion. */
    section.style.height = `calc(100vh + ${distance}px)`;
    return distance;
  }, [travel]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /* Self-healing: if nothing has managed to measure yet, the first scroll
     frame does it. The result is cached in the MotionValue, so this costs one
     layout read rather than one per frame. */
  const x = useTransform(scrollYProgress, (progress) => {
    const distance = travel.get() || measure();
    return -progress * distance;
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    /* Measured from several triggers on purpose. The track's width only
       settles once the images have laid out, and no single signal is
       dependable — ResizeObserver and requestAnimationFrame are both throttled
       or suppressed in some embedded browsers. Re-measuring is cheap, and the
       scroll handler above is the final backstop. */
    const frame = requestAnimationFrame(measure);
    const timer = window.setTimeout(measure, 250);
    window.addEventListener("resize", measure);

    const images = Array.from(track.querySelectorAll("img"));
    for (const image of images) {
      if (!image.complete) image.addEventListener("load", measure, { once: true });
    }

    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    observer?.observe(track);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener("resize", measure);
      for (const image of images) image.removeEventListener("load", measure);
      observer?.disconnect();
    };
  }, [measure]);

  if (reduced) {
    return (
      <div className="grid grid-cols-1 gap-12 gutter sm:grid-cols-2">
        {pieces.map((piece) => (
          <Link key={piece.slug} href={`/collections/${piece.slug}`} className="block">
            <div className="frame relative aspect-[4/5]">
              <Image
                src={piece.images[0].src}
                alt={piece.images[0].alt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <p className="mt-4 font-display text-2xl font-light text-ink">{piece.name}</p>
          </Link>
        ))}
      </div>
    );
  }

  return (
    /* The section is exactly as tall as one screen plus the horizontal distance
       to cover, so a pixel of vertical scroll moves the track a pixel sideways
       and the pin releases the moment the run ends. */
    <div ref={ref} className="relative" style={{ height: "100vh" }}>
      <div ref={viewportRef} className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* `w-max` sizes the track to its content. Without it the track's own
            box stays clamped to the viewport width while the content overflows,
            so ResizeObserver never sees the content grow as images settle. */}
        <motion.div
          ref={trackRef}
          className="flex w-max gap-6 pl-6 md:gap-10 md:pl-12 xl:pl-20"
          style={{ x }}
        >
          {pieces.map((piece, index) => (
            {/* Cards are sized from viewport HEIGHT, not width. Sizing them by
                width (32vw and friends) ignores how much vertical room there
                is, so on a short window the 4:5 image plus its caption grew
                taller than the pinned frame and `overflow-hidden` sliced the
                top off the images and the bottom off the captions.
                The width is therefore expressed in viewport-height units:
                41.6svh is 52svh of image height at a 4:5 ratio. Putting it on
                the card rather than the frame also keeps the caption wrapping
                to the image's width instead of stretching the card. */}
            <Link
              key={piece.slug}
              href={`/collections/${piece.slug}`}
              data-cursor="View"
              className="group relative w-[41.6svh] max-w-[448px] shrink-0"
            >
              <div className="frame relative aspect-[4/5] w-full">
                <Image
                  src={piece.images[0].src}
                  alt={piece.images[0].alt}
                  fill
                  sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 32vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              </div>

              <div className="mt-5 flex items-baseline gap-4">
                <span className="eyebrow text-accent">{pad(index + 1)}</span>
                <span className="font-display text-3xl font-light text-ink">{piece.name}</span>
              </div>
              <p className="mt-2 text-sm text-ink-dim">{piece.tagline}</p>
            </Link>
          ))}

          {/* Trailing gutter. A flex container's own padding-right is not
              reliably counted in `scrollWidth`, so the end margin is a real
              element — otherwise the last card finishes flush against the
              right edge of the screen. */}
          <div aria-hidden className="w-6 shrink-0 md:w-12 xl:w-20" />
        </motion.div>
      </div>
    </div>
  );
}
