"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
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
     This used to be a hardcoded percentage per item, which had no relationship
     to the real card widths — so the track ran past its own end and parked the
     last card off to the left, leaving dead space on the right. Measuring
     instead means the run always finishes exactly as the last card lands. */
  const [travel, setTravel] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    console.log("[gallery] effect ran", { track: !!track, viewport: !!viewport });
    if (!track || !viewport) return;

    const measure = () => {
      const v = Math.max(0, track.scrollWidth - viewport.clientWidth);
      console.log("[gallery] measure", { scrollWidth: track.scrollWidth, clientWidth: viewport.clientWidth, travel: v });
      setTravel(v);
    };

    /* Measured from several triggers on purpose. The track's width only
       settles once the images have laid out, and no single signal is
       dependable: ResizeObserver is the right tool but is throttled or
       suppressed in some embedded browsers, and a single post-mount frame can
       land before a slow image resolves. Together these always converge, and
       re-measuring is cheap. */
    const frame = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);

    const images = Array.from(track.querySelectorAll("img"));
    for (const image of images) {
      if (!image.complete) image.addEventListener("load", measure, { once: true });
    }

    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    observer?.observe(track);
    observer?.observe(viewport);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      for (const image of images) image.removeEventListener("load", measure);
      observer?.disconnect();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

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
    <div ref={ref} className="relative" style={{ height: `calc(100vh + ${travel}px)` }}>
      <div
        ref={viewportRef}
        className="sticky top-0 flex h-screen items-center overflow-hidden"
      >
        {/* `w-max` is load-bearing for the measurement. Without it the track's
            own box stays clamped to the viewport width while its content
            overflows, so ResizeObserver never sees the content grow as images
            settle and the measured travel stays stuck at 0. Sizing the box to
            its content makes the observer fire on every real change. */}
        <motion.div
          ref={trackRef}
          className="flex w-max gap-6 pl-6 md:gap-10 md:pl-12 xl:pl-20"
          style={{ x }}
        >
          {pieces.map((piece, index) => (
            <Link
              key={piece.slug}
              href={`/collections/${piece.slug}`}
              data-cursor="View"
              className="group relative w-[72vw] shrink-0 sm:w-[46vw] lg:w-[32vw]"
            >
              <div className="frame relative aspect-[4/5]">
                <Image
                  src={piece.images[0].src}
                  alt={piece.images[0].alt}
                  fill
                  sizes="(max-width: 640px) 72vw, (max-width: 1024px) 46vw, 32vw"
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
