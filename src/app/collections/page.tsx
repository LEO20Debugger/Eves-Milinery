import type { Metadata } from "next";
import { pieces } from "@/content/pieces";
import SectionHeading from "@/components/ui/SectionHeading";
import CollectionsList from "@/components/ui/CollectionsList";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "The full archive of fascinators, occasion headwear and gele from Eve's Millinery — every piece made by hand, to order.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsPage() {
  return (
    <div className="pt-40 pb-20 md:pt-52">
      <SectionHeading
        index={1}
        as="h1"
        immediate
        eyebrow="The archive"
        lines={["Every", "piece"]}
        className="gutter"
      >
        <p className="text-balance">
          Nothing here is repeated. Each piece was made for one wearer and one occasion — shown so
          you can point at a shape and say: something like this, but mine.
        </p>
      </SectionHeading>

      <div className="mt-20">
        <CollectionsList pieces={pieces} />
      </div>
    </div>
  );
}
