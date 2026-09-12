import Link from "next/link";
import { nav, site } from "@/content/site";
import SplitText from "@/components/motion/SplitText";
import Reveal from "@/components/motion/Reveal";

/**
 * The last beat of every page: an oversized wordmark that rises out of a mask
 * as the footer enters view.
 */
export default function Footer() {
  return (
    <footer className="relative mt-32 border-t rule pt-16 gutter pb-8">
      <div className="flex flex-col gap-16 md:flex-row md:justify-between">
        <Reveal className="max-w-sm">
          <p className="eyebrow mb-6 text-accent">Enquiries</p>
          <a
            href={`mailto:${site.contact.email}`}
            className="font-display text-3xl font-light text-bone transition-colors duration-500 hover:text-accent"
          >
            {site.contact.email}
          </a>
          <p className="mt-6 text-sm text-bone-dim">{site.contact.studio}</p>
          <p className="text-sm text-bone-dim">{site.location}</p>
        </Reveal>

        <Reveal delay={0.1} className="flex gap-16">
          <div>
            <p className="eyebrow mb-6 text-accent">Pages</p>
            <ul className="space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-bone-dim transition-colors duration-500 hover:text-bone"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-6 text-accent">Elsewhere</p>
            <ul className="space-y-3">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-bone-dim transition-colors duration-500 hover:text-bone"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* Oversized wordmark. Clipped at the baseline so it reads as a mark
          rather than as a heading. */}
      <SplitText
        as="p"
        lines={[site.name]}
        className="mt-24 font-display text-display-lg leading-[0.8] font-light text-bone/90"
      />

      <div className="mt-10 flex flex-col gap-2 border-t rule pt-6 text-xs text-bone-faint sm:flex-row sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <p>Every piece made by hand, to order.</p>
      </div>
    </footer>
  );
}
