import type { ShowcaseItem } from "@/lib/types";
import ShowcaseMedia from "./ShowcaseMedia";

/** Your own picture when one is set; otherwise a small photo or drawing that fits the project. Never just a letter. */
const PHOTOS: [RegExp, string][] = [
  [/tripnaari/i, "/pics/temple.webp"],
  [/tripbae|trek/i, "/pics/trek.webp"],
  [/locul/i, "/pics/travellers.webp"],
  [/solitaire|soul jams|brand event|event execution/i, "/pics/expo.webp"],
];

type Draw = "house" | "route" | "mega" | "pin";
const DRAW: [RegExp, Draw, string][] = [
  [/onboarding|propert|booking|guest/i, "house", "listing live"],
  [/retreat|itinerar/i, "route", "day by day"],
  [/influenc|campaign|creator/i, "mega", "creators"],
  [/research|speaker|founder/i, "pin", "asked first"],
];

const ART: Record<Draw, JSX.Element> = {
  house: (
    <>
      <path d="M30 98 100 40l70 58v62H30z" />
      <path d="M84 160v-40h32v40" />
      <path d="M150 62V44h14v30" />
      <circle cx="100" cy="86" r="9" />
    </>
  ),
  route: (
    <>
      <path d="M36 150c40-10 10-56 50-60s40 40 80 6" strokeDasharray="7 7" />
      <circle cx="36" cy="150" r="9" />
      <path d="M166 96c-14-22-14-30 0-40 14 10 14 18 0 40z" />
      <circle cx="166" cy="70" r="4" />
    </>
  ),
  mega: (
    <>
      <path d="M44 84h34l60-34v100L78 116H44z" />
      <path d="M78 116l8 36h20l-10-36" />
      <path d="M154 78c10 8 10 24 0 32M166 66c18 16 18 38 0 54" />
    </>
  ),
  pin: (
    <>
      <path d="M100 160c-34-40-44-60-44-80a44 44 0 0 1 88 0c0 20-10 40-44 80z" />
      <circle cx="100" cy="80" r="14" />
    </>
  ),
};

/** For a card with no picture of its own. */
export function Tile({ title, client }: { title?: string | null; client?: string | null }) {
  const hay = `${client ?? ""} ${title ?? ""}`;
  const photo = PHOTOS.find(([re]) => re.test(hay));
  if (photo)
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photo[1]} alt="" loading="lazy" decoding="async" width={900} height={560} />
    );
  const d = DRAW.find(([re]) => re.test(hay)) ?? [/./, "pin" as Draw, ""];
  return (
    <>
      <svg viewBox="0 0 200 200" className="cs-art" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {ART[d[1]]}
      </svg>
      {d[2] && <span className="cs-sticker">{d[2]}</span>}
    </>
  );
}

export default function CaseVisual({ item }: { item: ShowcaseItem }) {
  if (item.media_url) return <ShowcaseMedia item={item} />;
  return <Tile title={item.title} client={item.client} />;
}
