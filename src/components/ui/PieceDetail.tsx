"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { categoryLabel, type Piece } from "@/content/pieces";
import MaskReveal from "@/components/motion/MaskReveal";
import Reveal from "@/components/motion/Reveal";
import SplitText from "@/components/motion/SplitText";
import CtaLink from "@/components/ui/CtaLink";
import PieceCard from "@/components/ui/PieceCard";
import { DURATION, EXPO_OUT } from "@/lib/motion";

type Props = {
  piece: Piece;
  related: Piece[];
};

export default function PieceDetail({ piece, related }: Props) {
  const reduced = useReducedMotion();
  const [cover, ...rest] = piece.images;

  return (
    <article className="pt-32 md:pt-40">
      <div className="gutter">
        <Reveal className="mb-8 flex items-center gap-4 border-b rule pb-4">
          <Link href="/collections" className="eyebrow text-accent transition-colors duration-500 hover:text-ink">
            Collections
          </Link>
          <span className="eyebrow text-ink-faint">/ {categoryLabel(piece.category)}</span>
          <span className="eyebrow ml-auto text-ink-faint">{piece.year}</span>
        </Reveal>

        <SplitText
          as="h1"
          immediate
          lines={[piece.name]}
          className="font-display text-display font-light text-ink"
        />

        <p className="mt-6 max-w-xl text-balance text-xl text-ink-dim">{piece.tagline}</p>
      </div>

      {/* Cover. `layoutId` matches the card on the index, so arriving here from
          the grid animates the image into place instead of cutting. */}
      <div className="mt-16 gutter">
        <motion.div
          layoutId={reduced ? undefined : `piece-${piece.slug}`}
          className="frame relative aspect-[16/10] w-full"
          transition={{ duration: DURATION.slow, ease: EXPO_OUT }}
        >
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* Specification */}
      <div className="mt-20 grid grid-cols-1 gap-12 gutter md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <p className="eyebrow mb-6 text-accent">About this piece</p>
          <p className="text-balance text-ink-dim">{piece.description}</p>
        </Reveal>

        <Reveal delay={0.1} className="md:col-span-3 md:col-start-8">
          <p className="eyebrow mb-6 text-accent">Materials</p>
          <ul className="space-y-2">
            {piece.materials.map((material) => (
              <li key={material} className="text-sm text-ink-dim">
                {material}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.2} className="md:col-span-2">
          <p className="eyebrow mb-6 text-accent">Worn for</p>
          <ul className="space-y-2">
            {piece.occasion.map((occasion) => (
              <li key={occasion} className="text-sm text-ink-dim">
                {occasion}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* Supporting imagery */}
      {rest.length > 0 && (
        <div className="mt-24 space-y-8 gutter">
          {rest.map((image) => (
            <MaskReveal
              key={image.src}
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              frameClassName="aspect-[3/2]"
              sizes="100vw"
              velocity
            />
          ))}
        </div>
      )}

      {/* Commission this shape. The enquiry form reads `?piece=` to prefill. */}
      <section className="mt-28 border-y rule py-20 gutter md:mt-40">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-lg font-display text-display-sm font-light text-ink">
            Commission something like {piece.name}
          </h2>
          <CtaLink href={`/contact?piece=${piece.slug}`} magnetic>
            Enquire about this piece
          </CtaLink>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-24 gutter">
          <Reveal className="mb-12 flex items-center gap-4 border-b rule pb-4">
            <span className="eyebrow text-ink-dim">More from the archive</span>
          </Reveal>

          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-3">
            {related.map((item) => (
              <PieceCard
                key={item.slug}
                piece={item}
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
