import type { ReactNode } from "react";
import Reveal from "@/components/motion/Reveal";
import SplitText from "@/components/motion/SplitText";
import { cn, pad } from "@/lib/utils";

type Props = {
  /** Section number, rendered as `01 —`. */
  index?: number;
  eyebrow: string;
  lines: readonly string[];
  children?: ReactNode;
  className?: string;
  /**
   * Heading level. Pass `"h1"` when this is the page's title — every page
   * needs exactly one, and on the home page the hero already owns it.
   */
  as?: "h1" | "h2";
  /** Animate on mount rather than on scroll — for headings above the fold. */
  immediate?: boolean;
};

/** Numbered editorial section header used across every page. */
export default function SectionHeading({
  index,
  eyebrow,
  lines,
  children,
  className,
  as = "h2",
  immediate = false,
}: Props) {
  return (
    <div className={cn(className)}>
      <Reveal className="mb-8 flex items-center gap-4 border-b rule pb-4">
        {index !== undefined && <span className="eyebrow text-accent">{pad(index)}</span>}
        <span className="eyebrow text-bone-dim">{eyebrow}</span>
      </Reveal>

      <SplitText
        as={as}
        immediate={immediate}
        lines={lines}
        className="font-display text-display font-light text-bone"
      />

      {children && <div className="mt-8 max-w-xl text-bone-dim">{children}</div>}
    </div>
  );
}
