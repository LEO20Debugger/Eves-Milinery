"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { categories, type Category, type Piece } from "@/content/pieces";
import HoverImage from "@/components/motion/HoverImage";
import PieceCard from "@/components/ui/PieceCard";
import { EXPO_OUT, VIEWPORT } from "@/lib/motion";
import { useHasFinePointer } from "@/lib/hooks";
import { cn, pad } from "@/lib/utils";

type Filter = Category | "all";

/**
 * The collections index.
 *
 * On pointer devices this is a text list — hovering a row summons a
 * cursor-following preview while every other row dims. A list of names in a
 * serif at this size says "archive"; a grid of thumbnails says "shop", and the
 * difference is most of the positioning.
 *
 * Touch devices get the visual grid instead, since hover cannot exist there.
 */
export default function CollectionsList({ pieces }: { pieces: Piece[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<string | null>(null);
  const fine = useHasFinePointer();
  const reduced = useReducedMotion();

  const visible = useMemo(
    () => (filter === "all" ? pieces : pieces.filter((p) => p.category === filter)),
    [filter, pieces],
  );

  const activePiece = visible.find((p) => p.slug === active) ?? null;

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    ...categories.map((c) => ({ id: c.id as Filter, label: c.label })),
  ];

  return (
    <>
      {/* Filters */}
      <div
        role="group"
        aria-label="Filter collections"
        className="flex flex-wrap gap-x-8 gap-y-4 border-y rule py-5 gutter"
      >
        {filters.map((item) => {
          const selected = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setFilter(item.id);
                setActive(null);
              }}
              className={cn(
                "eyebrow relative transition-colors duration-500",
                selected ? "text-accent" : "text-ink-dim hover:text-ink",
              )}
            >
              {item.label}
              {selected && (
                <motion.span
                  layoutId={reduced ? undefined : "filter-underline"}
                  className="absolute -bottom-2 left-0 h-px w-full bg-accent"
                />
              )}
            </button>
          );
        })}
      </div>

      {fine ? (
        <>
          <HoverImage image={activePiece?.images[0] ?? null} activeKey={activePiece?.slug ?? null} />

          <ul
            className="gutter"
            onMouseLeave={() => setActive(null)}
            // Dims the whole list while any row is hovered, so the hovered row
            // is the only thing at full strength.
            data-any-active={active ? "true" : "false"}
          >
            {visible.map((piece, index) => (
              <motion.li
                key={piece.slug}
                initial={reduced ? undefined : { opacity: 0, y: 24 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.8, ease: EXPO_OUT, delay: index * 0.04 }}
                className="border-b rule"
              >
                <Link
                  href={`/collections/${piece.slug}`}
                  onMouseEnter={() => setActive(piece.slug)}
                  onFocus={() => setActive(piece.slug)}
                  onBlur={() => setActive(null)}
                  className={cn(
                    "group flex items-baseline gap-6 py-7 transition-opacity duration-500",
                    active && active !== piece.slug ? "opacity-35" : "opacity-100",
                  )}
                >
                  <span className="eyebrow w-8 shrink-0 text-accent">{pad(index + 1)}</span>

                  <span className="font-display text-4xl font-light text-ink transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 md:text-6xl">
                    {piece.name}
                  </span>

                  <span className="ml-auto hidden max-w-xs text-right text-sm text-ink-dim lg:block">
                    {piece.tagline}
                  </span>

                  <span className="eyebrow w-24 shrink-0 text-right text-ink-faint">
                    {piece.year}
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 gutter pt-12 sm:grid-cols-2">
          {visible.map((piece) => (
            <PieceCard key={piece.slug} piece={piece} sizes="(max-width: 640px) 100vw, 50vw" />
          ))}
        </div>
      )}

      {visible.length === 0 && (
        <p className="py-20 text-center text-ink-dim gutter">Nothing in this category yet.</p>
      )}
    </>
  );
}
