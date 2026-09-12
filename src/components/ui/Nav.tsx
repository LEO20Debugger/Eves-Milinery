"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { nav, site } from "@/content/site";
import { CURTAIN, EXPO_OUT } from "@/lib/motion";
import { cn, pad } from "@/lib/utils";

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
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

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

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!focusable?.length) return;
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
      <header className="fixed inset-x-0 top-0 z-50 gutter">
        <div className="flex items-center justify-between py-6 mix-blend-difference">
          <Link
            href="/"
            className="group font-display text-xl leading-none font-light tracking-tight text-bone"
          >
            <SwapLabel>{site.name}</SwapLabel>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group eyebrow text-bone",
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
            className="eyebrow group text-bone md:hidden"
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
            className="fixed inset-0 z-[55] flex flex-col justify-between bg-ink-soft gutter pt-28 pb-10"
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
                      className="group flex items-baseline gap-4 font-display text-display-sm font-light text-bone"
                    >
                      <span className="eyebrow text-accent">{pad(index + 1)}</span>
                      <SwapLabel>{item.label}</SwapLabel>
                    </Link>
                  </motion.span>
                </span>
              ))}
            </nav>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <a href={`mailto:${site.contact.email}`} className="eyebrow group text-bone-dim">
                <SwapLabel>{site.contact.email}</SwapLabel>
              </a>
              <div className="flex gap-6">
                {site.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="eyebrow group text-bone-dim"
                  >
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
