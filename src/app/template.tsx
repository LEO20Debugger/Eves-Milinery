import PageTransition from "@/components/motion/PageTransition";

/**
 * `template.tsx` remounts on every navigation (unlike `layout.tsx`, which
 * persists). That remount is what drives the route-change curtain.
 */
export default function Template({ children }: LayoutProps<"/">) {
  return <PageTransition>{children}</PageTransition>;
}
