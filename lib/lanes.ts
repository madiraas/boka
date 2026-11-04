// Copy for the four lane pages and the landing-page tunnels.
// Edit the words here; pictures, videos, case studies and testimonials are added from the admin "Showcase" tab.
import type { ShowcaseLane } from "./types";

export const CONTACT = {
  email: "madhuraaaa16@gmail.com",
  phone: "+91 8424045366",
  whatsapp: "https://wa.me/918424045366",
  linkedin: "https://www.linkedin.com/in/madhura-padman-08831724b",
};

export interface Lane {
  id: ShowcaseLane;
  label: string;
  blurb: string;
  tint: string;
  dot: string;
  title: string;
  who: string;
  lede: string;
  subject: string;
  offer: { title: string; text: string }[];
  roles: { when: string; title: string; text: string }[];
  projects: { title: string; where: string; text: string }[];
}

export const PROCESS: { title: string; text: string }[] = [
  { title: "Brief", text: "Send what you have: a message, a voice note, a doc. I ask for what is missing." },
  { title: "Plan", text: "I send back what I would do, in what order, and what I need from you." },
  { title: "Run", text: "I deal with vendors, creators or guests directly and keep one list of what is done, waiting and late." },
  { title: "Update", text: "You get regular updates. Anything slipping is flagged the same day." },
  { title: "Hand over", text: "You get the final files, contacts and a short note on how it ran." },
]

export const LANES: Lane[] = [
  {
    id: "operations",
    label: "Operations",
    blurb: "Vendors, timelines, follow-ups. Run end to end.",
    tint: "#C7D9F0",
    dot: "#8FB0DB",
    title: "Operations and project coordination",
    who: "For founders and small teams with too many threads open.",
    lede: "I coordinate vendors, timelines and approvals until a project is delivered. At Raahghar I ran the operations backend and the client side of the same business.",
    subject: "Project coordination enquiry",
    offer: [
      { title: "Run a project end to end", text: "Vendors, timelines, approvals and follow-ups, tracked and chased by me." },
      { title: "Research, outreach and documents", text: "Vendor research, outreach lists, proposals and decks, delivered to a deadline." },
    ],
    roles: [
      { when: "Dec 2025 to Sep 2026", title: "Raahghar, Operations", text: "Onboarded properties, coordinated vendors and tariffs, built retreat proposals and itineraries, handled guest and booking coordination. Ran the operations backend and the client side of one business." },
      { when: "Dec 2024 to Mar 2025", title: "Oopar Club, Community Operations", text: "Community coordination and backend operations for a member club." },
      { when: "Jun to Jul 2023", title: "PlutoWebs, HR Assistant", text: "Recruited and trained four hires out of more than 70 applicants. Handled issues between staff and the company." },
      { when: "Apr to Jul 2023", title: "PlutoWebs, Business Development Manager", text: "Built customer relationships and moved prospects forward." },
    ],
    projects: [
      { title: "Property onboarding system", where: "Raahghar", text: "A repeatable process that takes a new property from first call to a live, bookable listing." },
      { title: "Retreat and itinerary proposal", where: "Raahghar", text: "A client-ready proposal, from research to final layout." },
    ],
  },
  {
    id: "hospitality",
    label: "Hospitality and travel",
    blurb: "Stays, tours, treks. From listing to trail.",
    tint: "#BDE4D6",
    dot: "#7FC4AC",
    title: "Hospitality and travel",
    who: "For stays, hostels, and tour and trek companies.",
    lede: "In the backend I onboarded and priced properties. On the ground I led treks and tours and hosted guests. I know what a listing promises and what it takes to deliver it.",
    subject: "Hospitality and travel enquiry",
    offer: [
      { title: "Property onboarding and listings", text: "From the first conversation to a live listing guests can book." },
      { title: "Itineraries and proposals", text: "Written by someone who has led the trip, not just researched it." },
      { title: "Hostel and guest operations", text: "Guest experience, community nights, daily running of the place, housekeeping coordination." },
    ],
    roles: [
      { when: "Dec 2025 to Sep 2026", title: "Raahghar, Operations", text: "Property onboarding, vendor and tariff coordination, retreat proposals, itineraries, guest and booking coordination." },
      { when: "Aug to Sep 2026", title: "goSTOPS, Community Manager (volunteering)", text: "Guest coordination and support, community activities and events, day-to-day running of the hostel." },
      { when: "Aug 2026", title: "Rustic Hostels, Property Manager (volunteering)", text: "Property operations, guest management, community and activities, housekeeping coordination." },
      { when: "Jan to Apr 2024", title: "TripNaari, Tour Manager", text: "Ran group tours end to end: itineraries, transport, accommodation bookings, a team of guides, and vendor problems on the road." },
      { when: "Aug to Dec 2023", title: "Tripbae, Trek Leader", text: "Led trekking groups and made route and safety calls in real time, with a focus on sustainability." },
      { when: "Aug to Nov 2023", title: "Locul Hostels, Tours and Experience Intern", text: "Ran tours and curated events for an international guest mix, and researched how to strengthen the hostel's signature guided walks." },
    ],
    projects: [
      { title: "Retreat and itinerary proposal", where: "Raahghar", text: "A client-ready proposal, built from research to layout." },
      { title: "Property onboarding system", where: "Raahghar", text: "First call to bookable listing, as a repeatable process." },
    ],
  },
  {
    id: "events",
    label: "Events and creators",
    blurb: "Brand events and creator campaigns, run on the day.",
    tint: "#F9D3B4",
    dot: "#EBA874",
    title: "Events and creator campaigns",
    who: "For agencies, brands and creators who need the plan and the day handled.",
    lede: "I have worked brand events and live production, and coordinated influencer campaigns across clients, creators and internal teams. At Sugar Media: 10+ campaigns, 500+ influencers, one international.",
    subject: "Events or creator campaign enquiry",
    offer: [
      { title: "Event coordination", text: "From planning to the floor on the day, including the parts that go wrong." },
      { title: "Creator campaign support", text: "Client, creators and internal team kept in step: contracts, approvals, reporting." },
    ],
    roles: [
      { when: "Apr to Sep 2025", title: "Sugar Media, Influencer Marketing", text: "Creator and client coordination and campaign execution for an influencer marketing agency. Closed 10+ campaigns across 500+ influencers pan-India, plus one international campaign." },
      { when: "Jul to Aug 2024", title: "Soul Jams, Event Management Intern", text: "On-site logistics and event production in Bangalore, plus marketing graphics and Instagram engagement analysis." },
      { when: "May to Jun 2024", title: "Solitaire Events, Event Management Intern", text: "Planned and ran promotional events for brands including Mahindra and Audi: event graphics, Instagram engagement analysis, on-site logistics, production and backend preparation." },
      { when: "Dec 2024 to Mar 2025", title: "Oopar Club, Community Operations", text: "The backend of a member club." },
    ],
    projects: [
      { title: "Influencer campaigns", where: "Sugar Media", text: "10+ campaigns closed across 500+ influencers pan-India, and one international campaign." },
      { title: "Brand events", where: "Solitaire Events and Soul Jams", text: "On-site logistics and production for brand events." },
    ],
  },
  {
    id: "writing",
    label: "Writing",
    blurb: "Stories about places and the people who run them.",
    tint: "#DCD0F0",
    dot: "#AE9AD8",
    title: "Writing",
    who: "For editors, publishers and readers.",
    lede: "I write about places, the people who keep them running, and what travel work looks like where everything arrives by ferry. A book is slowly taking shape.",
    subject: "Writing enquiry",
    offer: [
      { title: "Reported features and essays", text: "Travel, hospitality and the people behind them." },
      { title: "Writing for stays and travel brands", text: "Listings, itineraries, guest guides, site copy." },
    ],
    roles: [
    ],
    projects: [
      { title: "Island travel work", where: "Reporting", text: "What it takes to run stays, tours and treks in places where everything arrives by ferry." },
      { title: "The book", where: "In the making", text: "Still deciding its shape: travel memoir, essays, or narrative nonfiction." },
    ],
  },
]

export type LaneOverride = Partial<Pick<Lane, "label" | "blurb" | "title" | "who" | "lede" | "subject" | "offer" | "roles" | "projects">>;

const str = (v: unknown) => (typeof v === "string" ? v : "");
const rows = <T extends Record<string, string>>(v: unknown, keys: (keyof T & string)[]): T[] | null => {
  if (!Array.isArray(v)) return null;
  return v
    .filter((r) => r && typeof r === "object")
    .map((r) => Object.fromEntries(keys.map((k) => [k, str((r as Record<string, unknown>)[k])])) as T)
    .filter((r) => keys.some((k) => r[k].trim()));
};

/** The built-in tunnels with anything saved in the admin ("Tunnels" tab) laid on top. */
export function mergeLanes(raw: unknown): Lane[] {
  const saved = (raw && typeof raw === "object" ? raw : {}) as Record<string, Record<string, unknown>>;
  return LANES.map((base) => {
    const o = saved[base.id];
    if (!o || typeof o !== "object") return base;
    const out: Lane = { ...base };
    (["label", "blurb", "title", "who", "lede", "subject"] as const).forEach((k) => {
      const v = str(o[k]);
      if (v.trim()) out[k] = v;
    });
    const offer = rows<{ title: string; text: string }>(o.offer, ["title", "text"]);
    if (offer) out.offer = offer;
    const roles = rows<{ when: string; title: string; text: string }>(o.roles, ["when", "title", "text"]);
    if (roles) out.roles = roles;
    const projects = rows<{ title: string; where: string; text: string }>(o.projects, ["title", "where", "text"]);
    if (projects) out.projects = projects;
    return out;
  });
}

/** Contact details come from the Settings tab first, then the built-in ones. The WhatsApp link follows the phone number. */
export function contactFrom(s: { email?: string; phone?: string; linkedin?: string } | null | undefined) {
  const phone = s?.phone?.trim() || CONTACT.phone;
  const digits = phone.replace(/\D/g, "");
  return {
    email: s?.email?.trim() || CONTACT.email,
    phone,
    whatsapp: digits.length >= 8 ? `https://wa.me/${digits}` : CONTACT.whatsapp,
    linkedin: s?.linkedin?.trim() || CONTACT.linkedin,
  };
}

export function laneBySlug(slug: string) {
  return LANES.find((l) => l.id === slug);
}
