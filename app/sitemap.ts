import type { MetadataRoute } from "next";
import { articles, SITE_URL } from "./blog/articles";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/blog/${a.slug}`,
    lastModified: a.date,
    changeFrequency: "monthly",
    priority: a.category === "commercial" ? 0.9 : 0.7,
  }));

  return [...staticPages, ...articlePages];
}
