import type { Metadata } from "next";
import { piecesByCategory } from "@/content/pieces";
import { gelePage } from "@/content/site";

import SectionHeading from "@/components/ui/SectionHeading";
import HorizontalGallery from "@/components/ui/HorizontalGallery";
import MaskReveal from "@/components/motion/MaskReveal";
import Parallax from "@/components/motion/Parallax";
import Reveal from "@/components/motion/Reveal";
import CtaLink from "@/components/ui/CtaLink";

export const metadata: Metadata = {
  title: "The art of gele",
  description:
    "Hand-tied and pre-tied gele in aso-oke, damask and sego — shaped on the head, pressed to hold, and finished to carry a full day of ceremony.",
  alternates: { canonical: "/gele" },
};

export default function GelePage() {
  const gele = piecesByCategory("gele");

  return (
    <div className="pt-40 md:pt-52">
      <SectionHeading
        index={1}
        as="h1"
        immediate
        eyebrow={gelePage.eyebrow}
        lines={gelePage.lines}
        className="gutter"
      >
        <p className="text-balance text-xl">{gelePage.standfirst}</p>
      </SectionHeading>

      {/* Editorial body, set against a tall parallaxed image. */}
      <section className="mt-24 grid grid-cols-1 gap-16 gutter md:mt-32 md:grid-cols-12">
        <div className="space-y-6 md:col-span-5">
          {gelePage.body.map((paragraph, index) => (
            <Reveal key={paragraph} delay={index * 0.08}>
              <p className="text-bone-dim">{paragraph}</p>
            </Reveal>
          ))}

          <Reveal delay={0.3}>
            <p className="mt-10 border-l border-accent/40 pl-6 text-sm text-bone-faint italic">
              {gelePage.note}
            </p>
          </Reveal>
        </div>

        <Parallax distance={70} className="md:col-span-6 md:col-start-7">
          <MaskReveal
            src="/images/adunni-01.jpg"
            alt="A gele layered into a broad, shallow fan"
            width={1200}
            height={1500}
            frameClassName="aspect-[4/5]"
            sizes="(max-width: 768px) 100vw, 50vw"
            velocity
          />
        </Parallax>
      </section>

      {/* The horizontal run — the one place on the site that scrolls sideways. */}
      <section className="mt-32">
        <Reveal className="mb-12 flex items-center gap-4 border-b rule pb-4 gutter">
          <span className="eyebrow text-accent">02</span>
          <span className="eyebrow text-bone-dim">Crowns in the archive</span>
        </Reveal>

        <HorizontalGallery pieces={gele} />
      </section>

      <section className="border-t rule py-24 gutter">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-lg font-display text-display-sm font-light text-bone">
            Tied for your head, your cloth, your day
          </h2>
          <CtaLink href="/contact?piece=gele" magnetic>
            Enquire about gele
          </CtaLink>
        </div>
      </section>
    </div>
  );
}
