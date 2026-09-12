import Link from "next/link";
import Magnetic from "@/components/motion/Magnetic";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: string;
  className?: string;
  /** Magnetic pull is reserved for primary calls to action only. */
  magnetic?: boolean;
};

/**
 * The site's one link style: a wide-tracked label over a rule that wipes in
 * from the left on hover.
 */
export default function CtaLink({ href, children, className, magnetic = false }: Props) {
  const link = (
    <Link href={href} className={cn("group inline-block", className)}>
      <span className="eyebrow text-bone transition-colors duration-500 group-hover:text-gold">
        {children}
      </span>
      <span className="relative mt-3 block h-px w-full bg-bone/20">
        <span className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-gold transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
      </span>
    </Link>
  );

  return magnetic ? <Magnetic className="inline-block">{link}</Magnetic> : link;
}
