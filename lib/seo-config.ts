import type { Metadata } from "next";

const siteName = "PDFsMint";
const siteTagline = "Free Online PDF & Image Tools";

export const siteConfig = {
  name: siteName,
  tagline: siteTagline,
  titleSuffix: `${siteName} – ${siteTagline}`,
  description:
    "Free, private PDF and image utilities that run entirely in your browser. Compress, merge, and convert files — no uploads required.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === "production"
      ? "https://www.pdfsmint.com"
      : "http://localhost:3000"),
  ogImage: "/og-images/default.svg",
  twitterHandle: "@pdfsmint",
  locale: "en_US",
  contactEmail: "pdfsmint@gmail.com",
} as const;

function resolveAbsoluteUrl(path: string): string {
  const base = siteConfig.url.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

function resolveOgImage(ogImage?: string): string {
  const image = ogImage ?? siteConfig.ogImage;
  return image.startsWith("http") ? image : resolveAbsoluteUrl(image);
}

/**
 * Page-level metadata helper — use in every page's `export const metadata` or `generateMetadata`.
 */
export function generateMetadata(
  title: string,
  description: string,
  path: string,
  ogImage?: string,
): Metadata {
  const url = resolveAbsoluteUrl(path);
  const imageUrl = resolveOgImage(ogImage);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} — ${siteConfig.name}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      images: [imageUrl],
    },
  };
}

/** Root layout defaults — title template, favicon, theme, and site-wide OG/Twitter fallbacks. */
export function generateRootMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.titleSuffix,
      template: `%s | ${siteConfig.titleSuffix}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [{ url: "/icons/favicon.svg", type: "image/svg+xml" }],
      shortcut: ["/icons/favicon.svg"],
      apple: [{ url: "/icons/favicon.svg" }],
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: siteConfig.titleSuffix,
      description: siteConfig.description,
      images: [
        {
          url: resolveOgImage(),
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${siteConfig.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: siteConfig.titleSuffix,
      description: siteConfig.description,
      images: [resolveOgImage()],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/** @deprecated Use generateMetadata(title, description, path, ogImage?) instead */
export function createPageMetadata(options: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}): Metadata {
  return generateMetadata(
    options.title,
    options.description,
    options.path,
    options.ogImage,
  );
}

export { resolveAbsoluteUrl, resolveOgImage };
