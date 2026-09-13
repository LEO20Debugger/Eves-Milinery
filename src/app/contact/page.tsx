import type { Metadata } from "next";
import { Suspense } from "react";
import { contactPage, site } from "@/content/site";

import SectionHeading from "@/components/ui/SectionHeading";
import EnquiryForm from "@/components/ui/EnquiryForm";
import Reveal from "@/components/motion/Reveal";
import SocialIcon from "@/components/ui/SocialIcon";

export const metadata: Metadata = {
  title: "Enquire",
  description:
    "Begin a bespoke commission with Eve's Millinery. Tell us about the occasion and we will reply within two working days.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const whatsapp = site.contact.whatsapp.replace(/\D/g, "");

  return (
    <div className="pt-40 pb-20 md:pt-52">
      <SectionHeading
        index={1}
        as="h1"
        immediate
        eyebrow="Commissions"
        lines={contactPage.lines}
        className="gutter"
      >
        <p className="text-balance text-xl">{contactPage.standfirst}</p>
      </SectionHeading>

      <div className="mt-24 grid grid-cols-1 gap-16 gutter md:grid-cols-12">
        <div className="md:col-span-7">
          {/* useSearchParams inside the form needs a Suspense boundary for
              static prerendering. */}
          <Suspense fallback={<div className="h-96" aria-hidden />}>
            <EnquiryForm />
          </Suspense>
        </div>

        <aside className="space-y-10 md:col-span-4 md:col-start-9">
          <Reveal>
            <p className="eyebrow mb-4 text-accent">Direct</p>
            <a
              href={`mailto:${site.contact.email}`}
              className="block text-ink transition-colors duration-500 hover:text-accent"
            >
              {site.contact.email}
            </a>
            <a
              href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
              className="block text-ink-dim transition-colors duration-500 hover:text-accent"
            >
              {site.contact.phone}
            </a>
            {/* WhatsApp is given real weight rather than being a third grey
                line. For a Lagos atelier it is likely the highest-intent
                contact route on the page, and as plain text between a phone
                number and an email it read as a caption, not an action. */}
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              <SocialIcon name="whatsapp" />
              Message on WhatsApp
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow mb-4 text-accent">Studio</p>
            <p className="text-ink-dim">{site.contact.studio}</p>
            <p className="text-ink-dim">{site.location}</p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="eyebrow mb-4 text-accent">Lead times</p>
            <p className="text-sm text-ink-dim">{contactPage.leadTime}</p>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="eyebrow mb-4 text-accent">Elsewhere</p>
            <ul className="space-y-2">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 text-ink-dim transition-colors duration-500 hover:text-accent"
                  >
                    <SocialIcon name={social.icon} />
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </aside>
      </div>
    </div>
  );
}
