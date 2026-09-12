import type { MetadataRoute } from "next";
import { pieces } from "@/content/pieces";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/collections", "/gele", "/atelier", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const detail = pieces.map((piece) => ({
    url: `${site.url}/collections/${piece.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...routes, ...detail];
}
