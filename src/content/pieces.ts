/* ─────────────────────────────────────────────────────────────────────────
   THE CONTENT SOURCE.

   To add a new piece: drop its photographs into /public/images, then add an
   entry below. Nothing else needs to change — the collections index, the
   detail page, the sitemap and the home page all read from this array.

   All copy below is placeholder written to be plausible, not factual.
   ───────────────────────────────────────────────────────────────────────── */

export type Category = "fascinator" | "headwear" | "gele";

export type PieceImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Piece = {
  slug: string;
  name: string;
  category: Category;
  year: number;
  featured: boolean;
  /** One line, shown on hover in the collections list. */
  tagline: string;
  /** Two or three sentences, shown on the detail page. */
  description: string;
  materials: string[];
  occasion: string[];
  /** First image is the cover, used in the grid and the shared transition. */
  images: PieceImage[];
};

export const categories: { id: Category; label: string; blurb: string }[] = [
  {
    id: "fascinator",
    label: "Fascinators",
    blurb: "Light, tilted and sculptural. Built on a base that disappears.",
  },
  {
    id: "headwear",
    label: "Headwear",
    blurb: "Blocked hats, halos and full-brim occasion pieces.",
  },
  {
    id: "gele",
    label: "Gele",
    blurb: "Hand-tied and pre-tied crowns in aso-oke, damask and sego.",
  },
];

/** 4:5 portrait — the default crop for a single piece. */
const portrait = (src: string, alt: string): PieceImage => ({
  src,
  alt,
  width: 1200,
  height: 1500,
});

/** 3:2 landscape — detail shots. */
const landscape = (src: string, alt: string): PieceImage => ({
  src,
  alt,
  width: 1800,
  height: 1200,
});

export const pieces: Piece[] = [
  {
    slug: "aurelia",
    name: "Aurelia",
    category: "fascinator",
    year: 2025,
    featured: true,
    tagline: "A gilded disc, tilted low over the brow",
    description:
      "A hand-blocked silk abaca disc finished in antique gold, set on a covered band so the structure reads as weightless. The tilt is cut low and forward, which shortens the forehead and lengthens the line of the neck.",
    materials: ["Silk abaca", "Antique gold leaf", "Hand-curled goose biot"],
    occasion: ["Race day", "Wedding guest"],
    images: [
      portrait("/images/aurelia-01.jpg", "Aurelia fascinator worn at a low forward tilt"),
      landscape("/images/aurelia-02.jpg", "Detail of the gilded edge and hand-curled biot on Aurelia"),
    ],
  },
  {
    slug: "iyanu",
    name: "Iyanu",
    category: "gele",
    year: 2025,
    featured: true,
    tagline: "Aso-oke, fanned high and pressed to hold",
    description:
      "A ceremonial gele in hand-woven aso-oke, tied to a high fan and pressed so the pleats hold their edge through a full day. Finished with a matching ipele shoulder wrap.",
    materials: ["Hand-woven aso-oke", "Metallic shot thread"],
    occasion: ["Traditional wedding", "Ceremony"],
    images: [
      portrait("/images/iyanu-01.jpg", "Iyanu gele tied to a high fan in hand-woven aso-oke"),
      landscape("/images/iyanu-02.jpg", "Detail of the pressed pleats and metallic weave of Iyanu"),
    ],
  },
  {
    slug: "verity",
    name: "Verity",
    category: "headwear",
    year: 2025,
    featured: true,
    tagline: "A wide brim that holds its own weather",
    description:
      "A full-brim parisisal hat blocked over a vintage wooden block, with a brim wired to a slow downward sweep at the back. Banded in petersham and left otherwise undecorated.",
    materials: ["Parisisal straw", "Petersham ribbon", "Milliner's wire"],
    occasion: ["Race day", "Garden party"],
    images: [
      portrait("/images/verity-01.jpg", "Verity wide-brim parisisal hat with a downward rear sweep"),
      landscape("/images/verity-02.jpg", "Detail of the wired brim edge and petersham band on Verity"),
    ],
  },
  {
    slug: "oyin",
    name: "Oyin",
    category: "gele",
    year: 2025,
    featured: true,
    tagline: "Pre-tied damask, fixed and ready to place",
    description:
      "A pre-tied gele in stiff damask, built to a head measurement and fixed permanently so it can be placed in seconds. The architecture is set; only the fit is personal.",
    materials: ["Damask", "Buckram foundation"],
    occasion: ["Ceremony", "Naming"],
    images: [portrait("/images/oyin-01.jpg", "Oyin pre-tied damask gele with fixed structure")],
  },
  {
    slug: "sable",
    name: "Sable",
    category: "fascinator",
    year: 2024,
    featured: false,
    tagline: "Hand-rolled veiling over a bare sinamay base",
    description:
      "A small sinamay base carrying a panel of hand-rolled French veiling, cut to fall just below the cheekbone. Intended to be worn with the veil down and forward.",
    materials: ["Sinamay", "French veiling", "Jet beading"],
    occasion: ["Wedding guest", "Evening"],
    images: [portrait("/images/sable-01.jpg", "Sable fascinator with hand-rolled French veiling")],
  },
  {
    slug: "lumen",
    name: "Lumen",
    category: "headwear",
    year: 2024,
    featured: false,
    tagline: "A halo crown, open at the centre",
    description:
      "A covered halo worn back from the hairline, open through the crown so the hair carries part of the silhouette. The lightest structured piece in the collection.",
    materials: ["Crin", "Silk satin", "Covered wire"],
    occasion: ["Bridal", "Evening"],
    images: [portrait("/images/lumen-01.jpg", "Lumen halo crown worn back from the hairline")],
  },
  {
    slug: "adunni",
    name: "Adunni",
    category: "gele",
    year: 2024,
    featured: false,
    tagline: "Sego organza, layered into a broad fan",
    description:
      "Two lengths of sego organza layered and tied into a broad, shallow fan that sits wide rather than tall — cut for photographs taken from the side.",
    materials: ["Sego organza", "Metallic edging"],
    occasion: ["Traditional wedding", "Reception"],
    images: [portrait("/images/adunni-01.jpg", "Adunni gele layered into a broad shallow fan")],
  },
  {
    slug: "wren",
    name: "Wren",
    category: "fascinator",
    year: 2024,
    featured: false,
    tagline: "A single sweep of stripped quill",
    description:
      "One stripped and re-curled quill, mounted on a near-invisible base and balanced so it holds its arc without support. The most restrained piece we make.",
    materials: ["Stripped goose quill", "Fine sinamay"],
    occasion: ["Race day", "Wedding guest"],
    images: [portrait("/images/wren-01.jpg", "Wren fascinator formed from a single curled quill")],
  },
  {
    slug: "consort",
    name: "Consort",
    category: "headwear",
    year: 2023,
    featured: false,
    tagline: "A blocked pillbox, worn forward",
    description:
      "A classic pillbox blocked in silk abaca and set forward on the crown, covered in matte silk and finished with a concealed comb for a long day's wear.",
    materials: ["Silk abaca", "Matte silk", "Concealed comb"],
    occasion: ["Formal", "Memorial"],
    images: [portrait("/images/consort-01.jpg", "Consort pillbox hat set forward on the crown")],
  },
  {
    slug: "temilade",
    name: "Temilade",
    category: "gele",
    year: 2023,
    featured: false,
    tagline: "A low, wrapped turban for the mother of the day",
    description:
      "A wrapped low-profile gele made for long wear, tied close to the head with a single sculpted fold at the temple. Designed to be worn for eight hours without adjustment.",
    materials: ["Soft aso-oke", "Silk lining"],
    occasion: ["Ceremony", "Mother of the bride"],
    images: [
      portrait("/images/temilade-01.jpg", "Temilade low wrapped gele with a sculpted temple fold"),
    ],
  },
  {
    slug: "marchpane",
    name: "Marchpane",
    category: "fascinator",
    year: 2023,
    featured: false,
    tagline: "Blush abaca loops, hand-wired into a knot",
    description:
      "Loops of blush silk abaca, each wired and shaped by hand, then assembled into a loose knot that reads differently from every angle.",
    materials: ["Silk abaca", "Milliner's wire"],
    occasion: ["Wedding guest", "Race day"],
    images: [
      portrait("/images/marchpane-01.jpg", "Marchpane fascinator formed of wired blush abaca loops"),
    ],
  },
  {
    slug: "ondine",
    name: "Ondine",
    category: "headwear",
    year: 2023,
    featured: false,
    tagline: "A bridal cap in silk tulle and seed pearl",
    description:
      "A close bridal cap in layered silk tulle, hand-seeded with freshwater pearl across the crown and finished with a detachable blusher.",
    materials: ["Silk tulle", "Freshwater pearl", "Silk thread"],
    occasion: ["Bridal"],
    images: [portrait("/images/ondine-01.jpg", "Ondine bridal cap in silk tulle with seeded pearl")],
  },
];

export const featuredPieces = pieces.filter((p) => p.featured);

export function getPiece(slug: string) {
  return pieces.find((p) => p.slug === slug);
}

export function piecesByCategory(category: Category) {
  return pieces.filter((p) => p.category === category);
}

export function categoryLabel(id: Category) {
  return categories.find((c) => c.id === id)?.label ?? id;
}
