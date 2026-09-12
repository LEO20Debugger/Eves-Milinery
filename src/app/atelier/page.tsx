import type { Metadata } from "next";
import { atelier, site } from "@/content/site";

import SectionHeading from "@/components/ui/SectionHeading";
import ProcessScroll from "@/components/ui/ProcessScroll";
import MaskReveal from "@/components/motion/MaskReveal";
import Parallax from "@/components/motion/Parallax";
import Reveal from "@/components/motion/Reveal";
import Counter from "@/components/motion/Counter";
import CtaLink from "@/components/ui/CtaLink";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

export const metadata: Metadata = {
  title: "The atelier",
  description:
    "Inside Eve's Millinery — how a bespoke headpiece is consulted on, drawn, blocked, trimmed and fitted, by one pair of hands.",
  alternates: { canonical: "/atelier" },
};

export default function AtelierPage() {
  return (
    <div className="pt-40 md:pt-52">
      <SectionHeading
        index={1}
        as="h1"
        immediate
        eyebrow="The atelier"
        lines={["Made by", "one pair", "of hands"]}
        className="gutter"
      >
        <p className="text-balance text-xl">{atelier.standfirst}</p>
      </SectionHeading>

      <section className="mt-24 grid grid-cols-1 gap-16 gutter md:mt-32 md:grid-cols-12">
        <Parallax distance={60} className="md:col-span-6">
          <MaskReveal
            src="/images/process-03.jpg"
            alt="Straw being steamed and pulled over a wooden hat block by hand"
            width={1800}
            height={1200}
            frameClassName="aspect-[4/5]"
            sizes="(max-width: 768px) 100vw, 50vw"
            velocity
          />
        </Parallax>

        <div className="space-y-6 md:col-span-5 md:col-start-8 md:pt-24">
          {atelier.body.map((paragraph, index) => (
            <Reveal key={paragraph} delay={index * 0.08}>
              <p className="text-bone-dim">{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stats */}
      <Stagger className="mt-28 grid grid-cols-1 gap-12 gutter sm:grid-cols-3" stagger={0.12}>
        {atelier.stats.map((stat) => (
          <StaggerItem key={stat.label} className="border-t rule pt-6">
            <p className="font-display text-display-sm leading-none font-light text-bone">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="eyebrow mt-4 text-bone-faint">{stat.label}</p>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Process */}
      <section className="mt-32">
        <Reveal className="mb-12 flex items-center gap-4 border-b rule pb-4 gutter">
          <span className="eyebrow text-gold">02</span>
          <span className="eyebrow text-bone-dim">How a commission is made</span>
        </Reveal>

        <ProcessScroll steps={atelier.process} />
      </section>

      <section className="border-t rule py-24 gutter">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-lg font-display text-display-sm font-light text-bone">
            Commissions open by appointment
          </h2>
          <div>
            <p className="mb-6 max-w-xs text-sm text-bone-dim">{site.contact.studio}</p>
            <CtaLink href="/contact" magnetic>
              Begin a commission
            </CtaLink>
          </div>
        </div>
      </section>
    </div>
  );
}
