"use client";

import { useRef } from "react";
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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Travel just under one panel-width per item, leaving the last one resting
  // in view rather than sliding off the edge.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(pieces.length - 1) * 62}%`]);

  if (reduced) {
    return (
      <div className="grid grid-cols-1 gap-12 gutter sm:grid-cols-2">
        {pieces.map((piece) => (
          <Link key={piece.slug} href={`/collections/${piece.slug}`} className="block">
            <div className="relative aspect-[4/5] overflow-hidden bg-ink-raised">
              <Image
                src={piece.images[0].src}
                alt={piece.images[0].alt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <p className="mt-4 font-display text-2xl font-light text-bone">{piece.name}</p>
          </Link>
        ))}
      </div>
    );
  }

  return (
    // Tall enough to give the horizontal travel room to happen in.
    <div ref={ref} className="relative" style={{ height: `${pieces.length * 85}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div className="flex gap-6 pl-6 md:gap-10 md:pl-12 xl:pl-20" style={{ x }}>
          {pieces.map((piece, index) => (
            <Link
              key={piece.slug}
              href={`/collections/${piece.slug}`}
              data-cursor="View"
              className="group relative w-[72vw] shrink-0 sm:w-[46vw] lg:w-[32vw]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-ink-raised">
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
                <span className="font-display text-3xl font-light text-bone">{piece.name}</span>
              </div>
              <p className="mt-2 text-sm text-bone-dim">{piece.tagline}</p>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
