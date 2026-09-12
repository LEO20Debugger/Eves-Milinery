import type { Metadata } from "next";
import { Suspense } from "react";
import { contactPage, site } from "@/content/site";

import SectionHeading from "@/components/ui/SectionHeading";
import EnquiryForm from "@/components/ui/EnquiryForm";
import Reveal from "@/components/motion/Reveal";

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
            <p className="eyebrow mb-4 text-gold">Direct</p>
            <a
              href={`mailto:${site.contact.email}`}
              className="block text-bone transition-colors duration-500 hover:text-gold"
            >
              {site.contact.email}
            </a>
            <a
              href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
              className="block text-bone-dim transition-colors duration-500 hover:text-gold"
            >
              {site.contact.phone}
            </a>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-bone-dim transition-colors duration-500 hover:text-gold"
            >
              WhatsApp
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow mb-4 text-gold">Studio</p>
            <p className="text-bone-dim">{site.contact.studio}</p>
            <p className="text-bone-dim">{site.location}</p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="eyebrow mb-4 text-gold">Lead times</p>
            <p className="text-sm text-bone-dim">{contactPage.leadTime}</p>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="eyebrow mb-4 text-gold">Elsewhere</p>
            <ul className="space-y-2">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-bone-dim transition-colors duration-500 hover:text-gold"
                  >
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
