import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";

const routes = ["", "/about", "/services", "/how-we-work", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
    return routes.map((path) => ({
        url: `${siteConfig.url}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.8,
    }));
}
