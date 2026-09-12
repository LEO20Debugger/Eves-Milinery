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
};

/** Numbered editorial section header used across every page. */
export default function SectionHeading({
  index,
  eyebrow,
  lines,
  children,
  className,
}: Props) {
  return (
    <div className={cn(className)}>
      <Reveal className="mb-8 flex items-center gap-4 border-b rule pb-4">
        {index !== undefined && <span className="eyebrow text-gold">{pad(index)}</span>}
        <span className="eyebrow text-bone-dim">{eyebrow}</span>
      </Reveal>

      <SplitText
        lines={lines}
        className="font-display text-display font-light text-bone"
      />

      {children && <div className="mt-8 max-w-xl text-bone-dim">{children}</div>}
    </div>
  );
}
