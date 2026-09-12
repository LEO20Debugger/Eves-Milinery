import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPiece, pieces } from "@/content/pieces";
import PieceDetail from "@/components/ui/PieceDetail";

/** Every piece is known at build time, so every detail page is prerendered. */
export function generateStaticParams() {
  return pieces.map((piece) => ({ slug: piece.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const piece = getPiece(slug);
  if (!piece) return {};

  return {
    title: piece.name,
    description: piece.description,
    alternates: { canonical: `/collections/${piece.slug}` },
    openGraph: {
      title: `${piece.name} — Eve's Millinery`,
      description: piece.description,
      images: [{ url: piece.images[0].src, alt: piece.images[0].alt }],
    },
  };
}

export default async function PiecePage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const piece = getPiece(slug);
  if (!piece) notFound();

  // Prefer pieces from the same category, then fill from the rest.
  const sameCategory = pieces.filter(
    (p) => p.slug !== piece.slug && p.category === piece.category,
  );
  const others = pieces.filter((p) => p.slug !== piece.slug && p.category !== piece.category);
  const related = [...sameCategory, ...others].slice(0, 3);

  return <PieceDetail piece={piece} related={related} />;
}
