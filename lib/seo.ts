import { Metadata } from "next";
import { siteConfig } from "./siteConfig";

export function defaultMetadata(
  title?: string,
  description?: string,
  path = "/"
): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = new URL(normalizedPath, siteConfig.url).toString();
  const resolvedDescription = description ?? siteConfig.description;
  const resolvedTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;

  return {
    metadataBase: new URL(siteConfig.url),
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
