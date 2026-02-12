import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";

const routes = ["", "/about", "/services", "/how-we-work", "/contact"];
const stableLastModified = new Date(siteConfig.lastModified);

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: stableLastModified,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
