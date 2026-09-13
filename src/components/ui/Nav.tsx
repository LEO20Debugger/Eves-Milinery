"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { nav, site } from "@/content/site";
import { CURTAIN, EXPO_OUT } from "@/lib/motion";
import { cn, pad } from "@/lib/utils";
import GlassSheen from "@/components/ui/GlassSheen";
import SocialIcon from "@/components/ui/SocialIcon";

/** A label that swaps vertically on hover — one duplicate translating through. */
function SwapLabel({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn("relative block overflow-hidden", className)}>
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full text-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  /* The bar tightens once you leave the hero and relaxes again at the top.
     Deliberately a threshold, not a continuous animation: padding and shadow
     are layout and paint, so animating them every frame would thrash. Crossing
     the threshold flips one class and CSS transitions the rest — two reflows
     per page rather than sixty per second.

     A passive scroll listener rather than Motion's scroll tracking, because
     this is chrome state, not animation: it has to stay correct even when the
     animation loop is throttled, as browsers do for embedded or backgrounded
     views. The handler is a single numeric comparison. */
  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 80;
      setCondensed((current) => (current === next ? current : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The panel closes from the link handlers below rather than by reacting to
  // the pathname, so there is no render-then-correct pass on every navigation.

  // Escape to close, and trap focus inside the panel while it is open.
  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement as HTMLElement | null;
    // Captured now — by cleanup time the ref may point elsewhere.
    const toggle = toggleRef.current;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      // The Close toggle lives in the header, OUTSIDE the panel, so that it
      // renders above it. It still has to be part of the focus cycle, or a
      // keyboard user can reach every link but never the way out.
      const inPanel = panelRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!inPanel?.length) return;
      const focusable = [...inPanel, toggleRef.current].filter(
        (node): node is HTMLElement => Boolean(node),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Move focus into the panel so keyboard users land where the eye does.
    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    }, 120);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
      document.body.style.overflow = "";
      (previous ?? toggle)?.focus?.();
    };
  }, [open]);

  return (
    <>
      {/* A floating glass bar rather than a transparent one.
          The old dark site used mix-blend-difference so the labels inverted
          against whatever was behind them; on a light ground that reads as a
          glitch. Frosting the bar instead means the nav sits legibly over the
          full-bleed hero photograph AND over the near-white canvas of every
          other page, with no per-route special-casing. */}
      {/* z-[56] sits ABOVE the menu panel's z-[55] on purpose. The panel is
          fixed inset-0, so at any lower z-index it covers the header and takes
          the Menu/Close toggle with it — leaving a phone with no way out of the
          menu at all, since there is no Escape key. */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[56] gutter transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          condensed ? "pt-2" : "pt-4",
        )}
      >
        <div
          className={cn(
            "glass relative flex items-center justify-between overflow-hidden rounded-[var(--radius-glass)] px-6 transition-[padding,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            condensed ? "py-2.5 shadow-lg" : "py-4",
          )}
        >
          <GlassSheen />
          <Link
            href="/"
            className="group font-display text-xl leading-none font-light tracking-tight text-ink"
          >
            <SwapLabel>{site.name}</SwapLabel>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group eyebrow text-ink",
                  pathname.startsWith(item.href) && "text-accent",
                )}
              >
                <SwapLabel>{item.label}</SwapLabel>
              </Link>
            ))}
          </nav>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-panel"
            /* The label itself is only ~47x11px. Negative margin cancelling
               equal padding grows the tap target to ~44px without moving
               anything in the layout. */
            className="eyebrow group -m-4 p-4 text-ink md:hidden"
          >
            <SwapLabel>{open ? "Close" : "Menu"}</SwapLabel>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="glass-strong fixed inset-0 z-[55] flex flex-col justify-between gutter pt-32 pb-10"
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
            exit={reduced ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.8, ease: CURTAIN }}
          >
            <nav aria-label="Menu" className="flex flex-col gap-2">
              {nav.map((item, index) => (
                <span key={item.href} className="line-mask">
                  <motion.span
                    className="block"
                    initial={reduced ? undefined : { y: "110%" }}
                    animate={reduced ? undefined : { y: "0%" }}
                    exit={reduced ? undefined : { y: "110%" }}
                    transition={{
                      duration: 0.8,
                      ease: EXPO_OUT,
                      delay: reduced ? 0 : 0.25 + index * 0.07,
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 font-display text-display-sm font-light text-ink"
                    >
                      <span className="eyebrow text-accent">{pad(index + 1)}</span>
                      <SwapLabel>{item.label}</SwapLabel>
                    </Link>
                  </motion.span>
                </span>
              ))}
            </nav>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <a href={`mailto:${site.contact.email}`} className="eyebrow group text-ink-dim">
                <SwapLabel>{site.contact.email}</SwapLabel>
              </a>
              <div className="flex gap-6">
                {site.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="eyebrow group flex items-center gap-2 text-ink-dim"
                  >
                    {/* Icon sits outside SwapLabel so it stays put while the
                        label does its vertical swap on hover. */}
                    <SocialIcon name={social.icon} />
                    <SwapLabel>{social.label}</SwapLabel>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
