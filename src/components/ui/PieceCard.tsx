"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { Piece } from "@/content/pieces";
import { categoryLabel } from "@/content/pieces";
import { DURATION, EXPO_OUT, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  piece: Piece;
  className?: string;
  /** Frame aspect. Cards deliberately vary so the grid stays asymmetric. */
  frameClassName?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * A piece in a grid.
 *
 * The cover image carries `layoutId`, which lets Framer run a shared-element
 * transition into the detail page hero — so opening a piece reads as a
 * continuous move rather than a page load.
 */
export default function PieceCard({
  piece,
  className,
  frameClassName = "aspect-[4/5]",
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: Props) {
  const reduced = useReducedMotion();
  const cover = piece.images[0];

  return (
    <Link
      href={`/collections/${piece.slug}`}
      data-cursor="View"
      className={cn("group block", className)}
    >
      <motion.div
        className={cn("frame relative", frameClassName)}
        initial={reduced ? undefined : { clipPath: "inset(100% 0% 0% 0%)" }}
        whileInView={reduced ? undefined : { clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={VIEWPORT}
        transition={{ duration: DURATION.slow, ease: EXPO_OUT }}
      >
        <motion.div
          layoutId={reduced ? undefined : `piece-${piece.slug}`}
          className="h-full w-full"
        >
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        </motion.div>

        {/* Tagline rises in on hover. Pointer-events-none so it never
            intercepts the click. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-black/70 to-transparent p-5 md:block">
          <span className="line-mask">
            <span className="block translate-y-full text-sm text-white transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
              {piece.tagline}
            </span>
          </span>
        </div>
      </motion.div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl font-light text-ink">{piece.name}</h3>
        <span className="eyebrow text-ink-faint">{categoryLabel(piece.category)}</span>
      </div>
    </Link>
  );
}
