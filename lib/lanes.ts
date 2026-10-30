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
  { title: "Brief me messy.", text: "A half-formed brief is fine. That is how real projects start." },
  { title: "I map the moving parts.", text: "People, timelines, dependencies, vendors, deliverables." },
  { title: "I run point.", text: "I coordinate and follow up, so you are not chasing me for updates." },
  { title: "You get updates, not surprises.", text: "Problems get flagged while they are still small." },
  { title: "I close the loop.", text: "The goal is a project that is actually done, not a list of completed tasks." },
]

export const LANES: Lane[] = [
  {
    id: "operations",
    label: "Operations",
    blurb: "Projects, vendors and deadlines, kept moving.",
    tint: "#C7D9F0",
    dot: "#8FB0DB",
    title: "Operations and project coordination",
    who: "For founders and small teams with too many threads open.",
    lede: "I take a project that is all over the place, work out who needs to do what by when, and keep it moving until it is actually done.",
    subject: "Project coordination enquiry",
    offer: [
      { title: "Run a project end to end", text: "Vendors, timelines, approvals. You stop tracking fifteen threads yourself." },
      { title: "Founder and team execution support", text: "Research, outreach, documents, presentations: the ambiguous asks that need judgment, not just hands." },
    ],
    roles: [
      { when: "Dec 2025 to Sep 2026", title: "Raahghar, Operations", text: "Property onboarding, vendor and tariff coordination, retreat proposals, itineraries, guest and booking coordination. I ran the operational backend and the client-facing side of the same business at once." },
      { when: "Dec 2024 to Mar 2025", title: "Oopar Club, Community Operations", text: "Community coordination and the backend work that keeps a member club running." },
      { when: "Jun to Jul 2023", title: "PlutoWebs, HR Assistant", text: "Recruited and trained four new employees from over 70 applicants, and resolved issues between the company and its staff." },
      { when: "Apr to Jul 2023", title: "PlutoWebs, Business Development Manager", text: "Built customer relationships and moved prospects forward." },
    ],
    projects: [
      { title: "Property onboarding system", where: "Raahghar", text: "A repeatable workflow that takes a new hospitality property from first contact to a bookable listing." },
      { title: "Retreat and itinerary proposal", where: "Raahghar", text: "A client-ready proposal document, from research to the final layout." },
    ],
  },
  {
    id: "hospitality",
    label: "Hospitality and travel",
    blurb: "Stays, tours and treks, from the desk to the trail.",
    tint: "#BDE4D6",
    dot: "#7FC4AC",
    title: "Hospitality and travel",
    who: "For stays, hostels, and tour and trek companies.",
    lede: "I have worked both sides of the desk: onboarding properties and pricing them in the backend, and running guests, tours and treks on the ground.",
    subject: "Hospitality and travel enquiry",
    offer: [
      { title: "Property onboarding and listings", text: "From first conversation to a live, bookable listing." },
      { title: "Itineraries and proposals", text: "Retreat and trip plans written by someone who has led the trip." },
      { title: "Hostel and guest operations", text: "Guest experience, community nights, daily operations, housekeeping coordination." },
    ],
    roles: [
      { when: "Dec 2025 to Sep 2026", title: "Raahghar, Operations", text: "Property onboarding, vendor and tariff coordination, retreat proposals, itineraries, guest and booking coordination." },
      { when: "Aug to Sep 2026", title: "goSTOPS, Community Manager (volunteering)", text: "Guest coordination and support, community activities and events, day-to-day hostel operations." },
      { when: "Aug 2026", title: "Rustic Hostels, Property Manager (volunteering)", text: "Property operations, guest management, community and activities, housekeeping coordination." },
      { when: "Jan to Apr 2024", title: "TripNaari, Tour Manager", text: "Ran group tours end to end: itinerary planning, transport, accommodation bookings, a team of guides, and vendor problems as they came up on the road." },
      { when: "Aug to Dec 2023", title: "Tripbae, Trek Leader", text: "Led trekking groups on the trail, handled route and safety decisions in real time, with a focus on sustainability." },
      { when: "Aug to Nov 2023", title: "Locul Hostels, Tours and Experience Intern", text: "Ran tours and curated events for an international guest mix, and researched how to strengthen the hostel's signature guided walks." },
    ],
    projects: [
      { title: "Retreat and itinerary proposal", where: "Raahghar", text: "A client-ready proposal document." },
      { title: "Property onboarding system", where: "Raahghar", text: "First contact to bookable listing, as a repeatable workflow." },
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
    lede: "I have supported brand events and live production, and coordinated influencer campaigns where the client, the creators and the internal team each need something different.",
    subject: "Events or creator campaign enquiry",
    offer: [
      { title: "Event coordination", text: "Planning through on-the-ground execution, including the parts that go wrong on the day." },
      { title: "Creator campaign support", text: "Client, creator and internal team coordination: contracts, approvals, reporting." },
    ],
    roles: [
      { when: "Apr to Sep 2025", title: "Sugar Media, Influencer Marketing", text: "Creator coordination, client coordination and campaign execution for an influencer marketing agency." },
      { when: "Jul to Aug 2024", title: "Soul Jams, Event Management Intern", text: "On-site logistics and event production in Bangalore, plus marketing graphics and Instagram engagement analysis." },
      { when: "May to Jun 2024", title: "Solitaire Events, Event Management Intern", text: "Planning and executing promotional events for brands including Mahindra and Audi: event graphics, Instagram engagement analysis, on-site logistics, and production and backend preparation." },
      { when: "Dec 2024 to Mar 2025", title: "Oopar Club, Community Operations", text: "The backend of a member club that only works if the invisible parts are handled well." },
    ],
    projects: [
      { title: "Influencer campaign coordination", where: "Sugar Media", text: "A campaign delivered on schedule across every stakeholder group." },
      { title: "Event execution, on the day", where: "Solitaire Events and Soul Jams", text: "Events run smoothly under real-time pressure." },
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
    lede: "I write about places, the people who run them, and what it takes to keep travel work going. I am working toward a book.",
    subject: "Writing enquiry",
    offer: [
      { title: "Reported features and essays", text: "Travel, hospitality and the people behind them." },
      { title: "Content writing for stays and travel brands", text: "Listings, itineraries, guest guides, site copy." },
    ],
    roles: [
    ],
    projects: [
      { title: "Island travel work", where: "Reporting", text: "What it takes to run stays, tours and treks in places where everything arrives by ferry." },
      { title: "The book", where: "In the making", text: "A book in the making. I am still deciding its shape: travel memoir, essays, or narrative nonfiction." },
    ],
  },
]

export function laneBySlug(slug: string) {
  return LANES.find((l) => l.id === slug);
}
