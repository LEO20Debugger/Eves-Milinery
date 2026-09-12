import { featuredPieces } from "@/content/pieces";
import { atelier, gelePage, marqueeWords } from "@/content/site";

import Hero from "@/components/ui/Hero";
import SectionHeading from "@/components/ui/SectionHeading";
import PieceCard from "@/components/ui/PieceCard";
import CtaLink from "@/components/ui/CtaLink";
import Marquee from "@/components/motion/Marquee";
import MaskReveal from "@/components/motion/MaskReveal";
import SplitText from "@/components/motion/SplitText";
import Parallax from "@/components/motion/Parallax";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

export default function Home() {
  const [first, second, third, fourth] = featuredPieces;

  return (
    <>
      <Hero />

      <Marquee
        items={marqueeWords}
        className="eyebrow border-y rule text-bone-dim"
      />

      {/* ── Featured work ──────────────────────────────────────────────────
          Deliberately asymmetric: a tall lead piece, two offset companions
          and a wide fourth. A uniform three-column grid would read as a
          shop, not an atelier. */}
      <section className="py-28 md:py-40">
        <SectionHeading
          index={1}
          eyebrow="Selected work"
          lines={["Recent", "commissions"]}
          className="gutter"
        />

        <Stagger className="mt-20 grid grid-cols-1 gap-x-6 gap-y-16 gutter md:grid-cols-12">
          {first && (
            <StaggerItem className="md:col-span-7">
              <PieceCard
                piece={first}
                frameClassName="aspect-[4/5]"
                sizes="(max-width: 768px) 100vw, 58vw"
                priority
              />
            </StaggerItem>
          )}

          {second && (
            <StaggerItem className="md:col-span-4 md:col-start-9 md:mt-40">
              <PieceCard
                piece={second}
                frameClassName="aspect-[3/4]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </StaggerItem>
          )}

          {third && (
            <StaggerItem className="md:col-span-4 md:col-start-2">
              <PieceCard
                piece={third}
                frameClassName="aspect-[3/4]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </StaggerItem>
          )}

          {fourth && (
            <StaggerItem className="md:col-span-5 md:col-start-7 md:mt-24">
              <PieceCard
                piece={fourth}
                frameClassName="aspect-[4/5]"
                sizes="(max-width: 768px) 100vw, 42vw"
              />
            </StaggerItem>
          )}
        </Stagger>

        <Reveal className="mt-20 gutter">
          <CtaLink href="/collections" magnetic>
            View all collections
          </CtaLink>
        </Reveal>
      </section>

      {/* ── Gele feature ───────────────────────────────────────────────────
          Gele gets its own full-width moment rather than being a filter tab
          beside the hats. */}
      <section className="relative overflow-hidden border-y rule bg-ink-soft py-28 md:py-40">
        <div className="grid grid-cols-1 items-center gap-16 gutter md:grid-cols-2">
          <Parallax distance={50}>
            <MaskReveal
              src="/images/iyanu-01.jpg"
              alt="A ceremonial gele tied to a high fan in hand-woven aso-oke"
              width={1200}
              height={1500}
              frameClassName="aspect-[4/5]"
              sizes="(max-width: 768px) 100vw, 45vw"
              velocity
            />
          </Parallax>

          <div>
            <Reveal className="mb-8 flex items-center gap-4 border-b rule pb-4">
              <span className="eyebrow text-gold">02</span>
              <span className="eyebrow text-bone-dim">{gelePage.eyebrow}</span>
            </Reveal>

            <SplitText
              lines={gelePage.lines}
              className="font-display text-display font-light text-bone"
            />

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-md text-balance text-bone-dim">{gelePage.standfirst}</p>
              <div className="mt-10">
                <CtaLink href="/gele">The art of gele</CtaLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Atelier teaser ─────────────────────────────────────────────── */}
      <section className="py-28 md:py-40">
        <SectionHeading
          index={3}
          eyebrow="The atelier"
          lines={["Made by", "one pair", "of hands"]}
          className="gutter"
        >
          <p className="text-balance">{atelier.standfirst}</p>
        </SectionHeading>

        <Stagger className="mt-20 grid grid-cols-1 gap-12 gutter sm:grid-cols-3" stagger={0.12}>
          {atelier.stats.map((stat) => (
            <StaggerItem key={stat.label} className="border-t rule pt-6">
              <p className="font-display text-display-sm leading-none font-light text-bone">
                {stat.value}
                {stat.suffix}
              </p>
              <p className="eyebrow mt-4 text-bone-faint">{stat.label}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-20 gutter">
          <CtaLink href="/atelier" magnetic>
            Inside the atelier
          </CtaLink>
        </Reveal>
      </section>

      {/* ── Closing call to action ─────────────────────────────────────── */}
      <section className="border-t rule py-28 gutter md:py-40">
        <SectionHeading
          index={4}
          eyebrow="Commissions"
          lines={["Begin a", "commission"]}
        >
          <p className="text-balance">
            We take a limited number of commissions each season. Tell us about the occasion and we
            will reply within two working days.
          </p>
        </SectionHeading>

        <Reveal className="mt-12">
          <CtaLink href="/contact" magnetic>
            Enquire
          </CtaLink>
        </Reveal>
      </section>
    </>
  );
}
