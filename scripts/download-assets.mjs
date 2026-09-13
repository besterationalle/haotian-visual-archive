import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const origin =
  "https://haotian-visual-archive.brawny-grass-1109.chatgpt.site";

const assets = [
  "favicon.svg",
  "og.png",
  "images/architecture-cover.png",
  "images/hero-dog-desktop.jpg",
  "images/hero-dog-mobile.jpg",
  "images/hero.jpg",
  "images/photography/everyday-drink-shop.jpg",
  "images/photography/everyday-fountain.jpg",
  "images/photography/everyday-temple.jpg",
  "images/photography/everyday-alley-dog.jpg",
  "images/photography/everyday-harbor.jpg",
  "images/photography/everyday-children.jpg",
  "images/photography/transition-coast.jpg",
  "images/photography/transition-net.jpg",
  "images/photography/distance-rest.jpg",
  "images/photography/distance-moon-walk.jpg",
  "images/photography/distance-light.jpg",
  "images/photography/distance-tents.jpg",
];

await Promise.all(
  assets.map(async (asset) => {
    const response = await fetch(`${origin}/${asset}`);
    if (!response.ok) {
      throw new Error(`Unable to download ${asset}: ${response.status}`);
    }

    const destination = join("public", ...asset.split("/"));
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, Buffer.from(await response.arrayBuffer()));
  }),
);

console.log(`Prepared ${assets.length} portfolio assets.`);

