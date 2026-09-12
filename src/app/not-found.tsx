import SplitText from "@/components/motion/SplitText";
import CtaLink from "@/components/ui/CtaLink";
import Reveal from "@/components/motion/Reveal";

export default function NotFound() {
  return (
    <div className="flex min-h-[70svh] flex-col justify-center gutter">
      <Reveal className="mb-8 flex items-center gap-4 border-b rule pb-4">
        <span className="eyebrow text-gold">404</span>
        <span className="eyebrow text-bone-dim">Nothing here</span>
      </Reveal>

      <SplitText
        as="h1"
        immediate
        lines={["This piece", "has been", "put away"]}
        className="font-display text-display font-light text-bone"
      />

      <Reveal delay={0.3} className="mt-10">
        <CtaLink href="/collections" magnetic>
          Back to the archive
        </CtaLink>
      </Reveal>
    </div>
  );
}
