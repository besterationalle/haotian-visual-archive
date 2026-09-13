import type { Metadata } from "next";
import PhotographyView from "./PhotographyView";

const repositoryName =
  process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "haotian-visual-archive";
const siteUrl =
  process.env.GITHUB_ACTIONS === "true"
    ? `https://besterationalle.github.io/${repositoryName}`
    : "https://haotian-visual-archive.brawny-grass-1109.chatgpt.site";
const photographySocialImage = `${siteUrl}/images/photography/everyday-drink-shop.jpg`;

export const metadata: Metadata = {
  title: "Photography — Haotian Zheng",
  description:
    "Photographic observations of everyday relations, people and distance by Haotian Zheng.",
  openGraph: {
    title: "Photography — Haotian Zheng",
    description:
      "Photographic observations of everyday relations, people and distance by Haotian Zheng.",
    images: [
      {
        url: photographySocialImage,
        width: 1367,
        height: 2048,
        alt: "A brightly lit drink shop framed by a dark street",
      },
    ],
  },
  twitter: {
    title: "Photography — Haotian Zheng",
    description:
      "Photographic observations of everyday relations, people and distance by Haotian Zheng.",
    images: [photographySocialImage],
  },
};

export default function PhotographyPage() {
  return <PhotographyView />;
}

