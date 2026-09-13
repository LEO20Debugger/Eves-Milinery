/* ─────────────────────────────────────────────────────────────────────────
   Site-wide brand details and long-form copy.

   PLACEHOLDER VALUES: every field marked `TODO` below is invented and must
   be replaced before launch. They are kept in one file so the swap is quick.
   ───────────────────────────────────────────────────────────────────────── */

export const site = {
  name: "Eve's Millinery",
  shortName: "Eve's",
  // TODO: replace with the real production domain once the Vercel project exists.
  url: "https://evesmillinery.com",
  tagline: "Bespoke fascinators, headwear and gele",
  description:
    "An atelier for sculptural headwear — hand-blocked fascinators, occasion headpieces and hand-tied gele, made to order for the wearer and the day.",
  founded: 2016,
  location: "Lagos", // TODO: confirm

  contact: {
    email: "atelier@evesmillinery.com", // TODO
    // Real number: 0902 307 2646, written in international form so the tel:
    // and wa.me links work for anyone outside Nigeria.
    // TODO: confirm this is also the number to CALL — it was given as the
    // WhatsApp number, and the old placeholder here was a UK landline.
    phone: "+234 902 307 2646",
    whatsapp: "2349023072646", // digits only, no spaces or symbols
    studio: "By appointment only", // TODO
  },

  socials: [
    {
      label: "Instagram",
      href: "https://instagram.com/eves_millinery_and_accessories",
      // Key into the glyph map in components/ui/SocialIcon.tsx. Available:
      // instagram, whatsapp, pinterest, tiktok, facebook.
      icon: "instagram",
    },
    // Pinterest removed: no profile has been supplied, and the placeholder was
    // pointing at pinterest.com's homepage on a live site. To add it back, put
    // an entry here — the nav overlay, footer and contact page all read this
    // array, so nothing else needs changing.
  ],
} as const;

export const nav = [
  { label: "Collections", href: "/collections" },
  { label: "Gele", href: "/gele" },
  { label: "Atelier", href: "/atelier" },
  { label: "Enquire", href: "/contact" },
] as const;

/** Home hero. Each string is one masked line — line breaks are deliberate. */
export const heroLines = ["Headwear", "made for", "the moment"] as const;

export const heroStandfirst =
  "Hand-blocked fascinators, occasion headpieces and hand-tied gele — shaped one at a time, for one wearer, for one day.";

/** Slow ticker under the hero. */
export const marqueeWords = [
  "Bespoke",
  "Hand-blocked",
  "Silk abaca",
  "Aso-oke",
  "Made to order",
  "Sinamay",
  "One of one",
] as const;

export const atelier = {
  standfirst:
    "A headpiece is not an accessory that is chosen. It is one that is built — around a face, a fabric, a ceremony and a light.",
  body: [
    "Eve's Millinery began with a single blocked hat and a conviction that occasion headwear had grown careless. Every piece that leaves the studio is made by hand, in the studio, by the same pair of hands that drew it.",
    "We work in sinamay, silk abaca, parisisal and crin, and in aso-oke and damask for gele. Material is chosen for the wearer's colouring and the day's light before it is chosen for the sketch.",
    "Nothing is repeated. A commission is yours entirely — the block, the trim, the tilt, the fit.",
  ],
  stats: [
    { value: 2016, label: "Atelier founded", suffix: "" },
    { value: 400, label: "Commissions completed", suffix: "+" },
    { value: 100, label: "Hand-finished", suffix: "%" },
  ],
  process: [
    {
      title: "Consultation",
      body: "We begin with the occasion, the outfit and the face. Colour, scale and tilt are decided together — in the studio, or by video if you are not nearby.",
      image: "/images/process-01.jpg",
    },
    {
      title: "Design",
      body: "A drawing, a material sample and a silhouette. You see the piece before a single stitch is made, and nothing proceeds until it is right.",
      image: "/images/process-02.jpg",
    },
    {
      title: "Blocking",
      body: "Straw is steamed and pulled over a wooden block by hand, then left to dry into shape. This is the slow part, and it cannot be rushed.",
      image: "/images/process-03.jpg",
    },
    {
      title: "Trimming",
      body: "Feathers are hand-curled, veiling is hand-rolled, edges are wired and bound. Every element is placed, removed, and placed again.",
      image: "/images/process-04.jpg",
    },
    {
      title: "Fitting",
      body: "The finished piece is fitted and balanced to your head, so it sits where it should and stays there through a long day.",
      image: "/images/process-05.jpg",
    },
  ],
} as const;

export const gelePage = {
  eyebrow: "The art of gele",
  lines: ["The gele", "is a crown"] as const,
  standfirst:
    "Tied, never sewn. A gele is architecture made from a single length of cloth — and it carries more than its shape.",
  body: [
    "In Yoruba dress the gele is the final word. Its height, its fan, its lean — all of it is read. A gele says which family is celebrating, how far the wearer has travelled to be there, and how much the day is worth to her.",
    "We work in aso-oke, damask, sego and organza, and we tie to the head rather than to a template. A gele made here is shaped on you, pressed, and finished so that it holds its architecture from the first photograph to the last dance.",
    "For clients who cannot come to the studio, pieces are pre-tied and fixed, arriving ready to place — the structure permanent, the fit still yours.",
  ],
  note: "Pre-tied gele are made to a head measurement. Hand-tied service is available in studio and on location for weddings.",
} as const;

export const contactPage = {
  lines: ["Begin a", "commission"] as const,
  standfirst:
    "Tell us about the occasion. We take a limited number of commissions each season and reply to every enquiry within two working days.",
  leadTime:
    "Bespoke commissions require 6–8 weeks. Pre-tied gele require 2–3 weeks. Rush work is occasionally possible — ask.",
} as const;
