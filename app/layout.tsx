import type { Metadata } from "next";
import "./globals.css";

const repositoryName =
  process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "haotian-visual-archive";
const siteUrl =
  process.env.GITHUB_ACTIONS === "true"
    ? `https://besterationalle.github.io/${repositoryName}`
    : "https://haotian-visual-archive.brawny-grass-1109.chatgpt.site";
const socialImageUrl = `${siteUrl}/og.png`;
const faviconUrl = `${siteUrl}/favicon.svg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Haotian Zheng — Visual Archive",
  description:
    "Architecture, photography and material experiments by Haotian Zheng.",
  openGraph: {
    title: "Haotian Zheng — Visual Archive",
    description:
      "Architecture, photography and material experiments by Haotian Zheng.",
    type: "website",
    images: [{ url: socialImageUrl, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Haotian Zheng — Visual Archive",
    description:
      "Architecture, photography and material experiments by Haotian Zheng.",
    images: [socialImageUrl],
  },
  icons: {
    icon: faviconUrl,
    shortcut: faviconUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

